const { db, query } = require('./index');
const queries = require('./queries/queries');

function initializeTables(db) {
  // Create a table if it dosen't exist
  //Profiles table]
  db.query(queries.profile.createTable(), (err) => {
    if (err) throw err;
  });
  // Users table
  db.query(queries.user.createTable(), (err) => {
    if (err) throw err;
  });
  //Conversations table
  db.query(queries.conversation.createTable(), (err) => {
    if (err) throw err;
  });
  //Participants table
  db.query(queries.participant.createTable(), (err) => {
    if (err) throw err;
  });
  //Messages table
  db.query(queries.message.createTable(), (err) => {
    if (err) throw err;
  });
}

module.exports = initializeTables;
