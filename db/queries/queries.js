require('dotenv').config();

const queries = {
  transaction: {
    strart: () => {
      return `
      START TRANSACTION;`;
    },
    commit: () => {
      return `COMMIT;`;
    },
    rollback: () => {
      return `ROLLBACK;`;
    },
  },
  user: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS user (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL,
        hashed_pass VARCHAR(255) NOT NULL,
        status TINYINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )  ENGINE=INNODB;`;
    },
    findUser: (username) => {
      return `select * from user
      where username = '${username}'
      or email = '${username}';`;
    },
    createUser: (username, password, email) => {
      return `insert into user (username, hashed_pass, email) 
      VALUES ('${username}', '${password}', '${email}')`;
    },
  },
  profile: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS profile (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        displayed_name VARCHAR(255),
        avatar_url VARCHAR(255)
      )  ENGINE=INNODB;`;
    },
    createProfile: (username) => {
      return `insert into profile (username) 
      VALUES ('${username}')`;
    },
    getProfile: (username) => {
      return `select * from  profile 
      WHERE username = '${username}'`;
    },
    addAvatar: (username, relativeAvatarPath) => {
      return `UPDATE profile 
      SET  avatar_url = '${relativeAvatarPath}'
      WHERE username = '${username}'`;
    },
    findProfiles: (nameSearch) => {
      return `SELECT * FROM profile
        where username like '${nameSearch}%'
        or displayed_name like '${nameSearch}%'`;
    },
  },
  conversation: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS conversation (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        title VARCHAR(40),
        creator_id INT NOT NULL,
        channel_id VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (creator_id) REFERENCES profile (id)
        ) ENGINE=INNODB;`;
    },
    createPrivateConversation: (user_id, contact_id) => {
      return `Insert into conversation(title,creator_id,updated_at)
      values ('Private_${user_id}+${contact_id}', '${user_id}', NOW() );
      `;
    },
    getConversations: () => {
      return `
      SELECT * FROM online_chat.conversation;`;
    },
  },
  participant: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS participant (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        conversation_id INT NOT NULL,
        profile_id INT NOT NULL,
        type VARCHAR(255),
        FOREIGN KEY (conversation_id) REFERENCES conversation (id),
        FOREIGN KEY (profile_id)  REFERENCES profile (id)
        ) ENGINE=INNODB;`;
    },
    getPaticipants: (profile_id) => {
      return `SELECT * FROM participant
      where profile_id = '${profile_id}'`;
    },
    createParticipant: (conversation_id, profile_id) => {
      return `insert into participant (conversation_id, profile_id)
      values ('${conversation_id}', '${profile_id}');`;
    },
  },
  message: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS message (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        participant_id INT not null,
        message VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES profile (id),
        FOREIGN KEY (participant_id)  REFERENCES participant (id)
        ) ENGINE=INNODB;`;
    },
  },
};

module.exports = queries;
