const socket = require('socket.io');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

// async function enterChat(data, socket) {
//   console.log(data, socket);
//   try {
//     socket.emit(`entered`, `entered chat ${chatID}`);
//     console.log(data);
//     socket.join(chatID);
//     socket.emit(`entered`, `entered chat ${chatID}`);
//   } catch (err) {}
// }

async function getAllChats() {}

function initialization(server) {
  const io = socket(server);
  io.on('connection', (socket) => {
    console.log('new ws connection');

    socket.on('connection', (data) => {
      console.log('asdasd');
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
