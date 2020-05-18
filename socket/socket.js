const socket = require('socket.io');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

async function enterChat(data) {
  try {
    const { user_id, contact_id } = data;
    const sql = queries.participant.getPaticipants(user_id);
    const res = await query(sql);
    if (!res.length) {
      const sql = queries.conversation.createPrivateConversation(
        user_id,
        contact_id
      );
      console.log(sql);

      const res = await query(sql);
      const insertId = res.insertId;
      await query(queries.participant.createParticipant(insertId, user_id));
      await query(queries.participant.createParticipant(insertId, contact_id));
    }
  } catch (err) {}
  // get participants
  // const sql = queries.participant();
}

function initialization(server) {
  const io = socket(server);
  io.on('connection', (socket) => {
    console.log('new ws connection');
    socket.on('enterChat', enterChat);
  });
}

module.exports = initialization;
