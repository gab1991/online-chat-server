require('dotenv').config();

const queries = {
  users: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        hashed_pass VARCHAR(255) NOT NULL,
        status TINYINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )  ENGINE=INNODB;`;
    },
    findUser: (username) => {
      return;
    },
    createUser: (username, password, email) => {
      return `insert into users (username, hashed_pass, email) 
      VALUES ('${username}', '${password}', '${email}')`;
    },
  },
};

module.exports = queries;
