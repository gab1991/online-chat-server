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
    socket.on('subscribeToConversations', (conversations = []) => {
      console.log('subscribing to rooms', conversations);
      conversations.forEach((conversation) => {
        socket.join(conversation.id);
      });
    });
    socket.on('sendMessage', (data) => {
      const { user_id, chatID, message } = data;
      console.log({ user_id, chatID, message });
      io.to(chatID).emit('passMsgToConversation', { user_id, chatID, message });
    });
    // socket.on('enterChat', (data) => {
    //   console.log(data);
    //   socket.join(data.chatID);
    //   socket.emit('entered', `${data.user_id} joined room ${data.chatID}`);
    // });

    // socket.on('sendMessage', (data) => {
    //   console.log(data);
    //   io.to(data.chatID).emit('message', `${data.message}`);
    // });

    // socket.on('got into room', () => console.log('asda'));
  });
}

module.exports = initialization;

// io.use((socket, next) => {
//   // console.log('Query: ', socket.handshake.query);
//   // return the result of next() to accept the connection.
//   if (socket.handshake.query.foo == 'bar') {
//     return next();
//   }
//   //   // call next() with an Error if you need to reject the connection.
//   //   next(new Error('Authentication error'));
// });
