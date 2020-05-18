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
        id INT AUTO_INCREMENT PRIMARY KEY,
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
    findProfiles: (nameSearch) => {
      return `SELECT * FROM profiles
        where username like '${nameSearch}%'
        or displayed_name like '${nameSearch}%'`;
    },
  },
  conversations: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        title VARCHAR(40),
        profiles_id INT NOT NULL,
        channel_id VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (profiles_id) REFERENCES profiles (id)
        ) ENGINE=INNODB;`;
    },
  },
  participants: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        conversation_id INT NOT NULL,
        profiles_id INT NOT NULL,
        type VARCHAR(255),
        FOREIGN KEY (conversation_id) REFERENCES conversations (id),
        FOREIGN KEY (profiles_id)  REFERENCES profiles (id)
        ) ENGINE=INNODB;`;
    },
  },
  messages: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        participants_id INT not null,
        message VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES profiles (id),
        FOREIGN KEY (participants_id)  REFERENCES participants (id)
        ) ENGINE=INNODB;`;
    },
  },
};

module.exports = queries;
