const db = require('./index');
const queries = require('./queries/queries');

// Create a table if it dosen't exist
const sql = queries.profiles.createTable();
db.query(sql, (err) => {
  if (err) throw err;
});
