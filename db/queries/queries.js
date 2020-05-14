require('dotenv').config();

const queries = {
  users: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        hashed_pass VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        status TINYINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )  ENGINE=INNODB;`;
    },
    findUser: (username) => {
      return `select * from users
      where username = '${username}'
      or email = '${username}';`;
    },
    createUser: (username, password, email) => {
      return `insert into users (username, hashed_pass, email) 
      VALUES ('${username}', '${password}', '${email}')`;
    },
    addAvatar: (username, relativeAvatarPath) => {
      return `UPDATE users 
      SET  avatar_url = '${relativeAvatarPath}'
      WHERE username = '${username}'`;
    },
  },
};

module.exports = queries;
