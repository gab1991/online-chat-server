const socket = require('socket.io');
const { getVerifiedUser } = require('../jwtVerification/verification');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

function initialization(server) {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('new ws connection');

    socket.on('updProfile', (token) => {
      console.log('updProfile', token);
      const user = getVerifiedUser(token);
      console.log(user);
    });

    socket.on('subscribeToConversations', (conversations = {}) => {
      Object.keys(conversations).forEach((key) => {
        console.log('suscribed to chats', conversations[key].id);
        socket.join(conversations[key].id);
      });
    });
    socket.on('sendMessage', async (data) => {
      try {
        const { user_id, chatID, message } = data;
        const response = await query(
          queries.message.createMessage(chatID, user_id, message)
        );
        console.log(new Date());

        io.to(chatID).emit('passMsgToConversation', {
          conversation_id: chatID,
          created_at: new Date(),
          id: Date.now(),
          message: message,
          participant_id: 2,
          sender_id: user_id,
          user_id: user_id,
        });
      } catch (err) {
        console.log(err);
      }
    });
  });
}

module.exports = initialization;
