require('dotenv').config();
const mysql = require('mysql');
const initializeTables = require('./tables');
const { promisify } = require('util');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log(`DB CONNECTED`);
  initializeTables(db);
});

const query = promisify(db.query).bind(db);
module.exports = { db, query };
