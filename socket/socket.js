const socket = require('socket.io');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

async function createConversation(participant_ids = []) {
  try {
    console.log('here');
    //Start transaction
    await query(queries.transaction.strart());
    //CreateConversation;
    let sql;
    if (participant_ids.length === 2) {
      sql = queries.conversation.createPrivateConversation(
        participant_ids[0],
        participant_ids[1]
      );
    }
    const res = await query(sql);
    const conversationId = res.insertId;
    // Create participants
    participant_ids.forEach(async (participant_id) => {
      await query(
        queries.participant.createParticipant(conversationId, participant_id)
      );
    });
    // Commit
    await query(queries.transaction.commit());
    return conversationId;
  } catch (err) {
    console.log(err);
    await query(queries.transaction.rollback());
  }
}

async function enterChat(data, socket) {
  try {
    const { user_id, contact_id } = data;
    const sql = queries.participant.getPaticipants(user_id);
    const res = await query(sql);

    const chat_id = await createConversation([user_id, contact_id]);
    console.log(chat_id);
    // console.log(socket);
    socket.emit('got into room', 'asdasd');
    // if (!res.length) {
    //   createConversation([user_id, contact_id]);
    // }
  } catch (err) {}
}

function initialization(server) {
  const io = socket(server);
  io.on('connection', (socket) => {
    console.log('new ws connection');
    socket.on('enterChat', (data) => enterChat(data, socket));

    // socket.on('got into room', () => console.log('asda'));
  });
}

module.exports = initialization;
