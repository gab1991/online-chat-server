const socket = require('socket.io');
const { getVerifiedUser } = require('../jwtVerification/verification');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

function initialization(server) {
  const io = socket(server);

  io.on('connection', (socket) => {
    console.log('new ws connection');

    socket.on('subscribeToConversations', (conversations = {}) => {
      Object.keys(conversations).forEach((key) => {
        console.log('suscribed to chats', conversations[key].id);
        socket.join(conversations[key].id);
      });
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { user_id, chatID, message } = data;
        //starting transaction
        await query(queries.transaction.start());
        // execute createMsg
        await query(queries.message.createMessage(chatID, user_id, message));
        // adding lastSeenMsgId
        const lastIdResp = await query(queries.message.lastInsert());
        const lastInsertedMsgId = lastIdResp[0]['last_insert_id()'];
        await query(
          queries.lastSeenMsgList.setLastSeenMsg(
            chatID,
            user_id,
            lastInsertedMsgId
          )
        );
        // commit transaction
        await query(queries.transaction.commit());

        io.to(chatID).emit('passMsgToConversation', {
          conversation_id: chatID,
          created_at: new Date(),
          id: lastInsertedMsgId,
          message: message,
          sender_id: user_id,
          user_id: user_id,
        });

        socket.emit('updateLastSeenMsg', {
          user_id: user_id,
          conversation_id: chatID,
          last_seen_msg_id: lastInsertedMsgId,
        });
      } catch (err) {
        console.log(err);
      }
    });
  });
}

module.exports = initialization;
