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

function initialization(server) {
  const io = socket(server);
  io.on('connection', (socket) => {
    console.log('new ws connection');
    socket.on('enterChat', (data) => {
      console.log(data);
      socket.join(data.chatID);
      socket.emit('entered', `${data.user_id} joined room ${data.chatID}`);
    });

    socket.on('sendMessage', (data) => {
      console.log(data);
      io.to(data.chatID).emit('message', `${data.message}`);
    });

    // socket.on('got into room', () => console.log('asda'));
  });
}

module.exports = initialization;
