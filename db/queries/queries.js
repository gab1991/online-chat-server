require('dotenv').config();

const queries = {
  users: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        hashed_pass VARCHAR(255) NOT NULL,
        status TINYINT,
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
  },
  profiles: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS profiles (
        username VARCHAR(255) NOT NULL UNIQUE,
        displayed_name VARCHAR(255),
        avatar_url VARCHAR(255)
      )  ENGINE=INNODB;`;
    },
    createProfile: (username) => {
      return `insert into profiles (username) 
      VALUES ('${username}')`;
    },
    getProfile: (username) => {
      return `select * from  profiles 
      WHERE username = '${username}'`;
    },
    addAvatar: (username, relativeAvatarPath) => {
      return `UPDATE profiles 
      SET  avatar_url = '${relativeAvatarPath}'
      WHERE username = '${username}'`;
    },
  },
};

module.exports = queries;
