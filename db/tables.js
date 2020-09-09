const queries = require('./queries/queries');

function initializeTables(db) {
  // Create a table if it dosen't exist
  db.query(queries.profile.createTable(), (err) => {
    if (err) throw err;
  });
  db.query(queries.user.createTable(), (err) => {
    if (err) throw err;
  });
  db.query(queries.conversation.createTable(), (err) => {
    if (err) throw err;
  });
  db.query(queries.participant.createTable(), (err) => {
    if (err) throw err;
  });
  db.query(queries.message.createTable(), (err) => {
    if (err) throw err;
  });
  db.query(queries.lastSeenMsgList.createTable(), (err) => {
    if (err) throw err;
  });
}

module.exports = initializeTables;
