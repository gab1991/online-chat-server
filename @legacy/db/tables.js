const queries = require('./queries/queries');

function initializeTables(db) {
  // Create a table if it dosen't exist
  const queriesToRun = [
    queries.profile.createTable(),
    queries.user.createTable(),
    queries.conversation.createTable(),
    queries.participant.createTable(),
    queries.message.createTable(),
    queries.message.changeEncoding(),
    queries.lastSeenMsgList.createTable(),
  ];

  for (let query of queriesToRun) {
    db.query(query, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = initializeTables;
