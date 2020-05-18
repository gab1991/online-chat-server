const { db, query } = require('./index');
const queries = require('./queries/queries');

function initializeTables(db) {
  // Create a table if it dosen't exist
  //Profiles table]
  db.query(queries.profiles.createTable(), (err) => {
    if (err) throw err;
  });
  // Users table
  db.query(queries.users.createTable(), (err) => {
    if (err) throw err;
  });
  //Conversations table
  db.query(queries.conversations.createTable(), (err) => {
    if (err) throw err;
  });
  //Participants table
  db.query(queries.participants.createTable(), (err) => {
    if (err) throw err;
  });
  //Messages table
  db.query(queries.messages.createTable(), (err) => {
    if (err) throw err;
  });
}

module.exports = initializeTables;
