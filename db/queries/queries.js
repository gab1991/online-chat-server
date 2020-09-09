require('dotenv').config();

const queries = {
  transaction: {
    start: () => {
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
    updateDisplayedName: (username, newDispName) => {
      return `update profile
      set displayed_name = '${newDispName}'
      where username='${username}';`;
    },
  },
  conversation: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS conversation (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        title VARCHAR(40),
        type ENUM('private','group'),
        creator_id INT NOT NULL,
        channel_id VARCHAR(45),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (creator_id) REFERENCES profile (id)
        ) ENGINE=INNODB;`;
    },
    createPrivateConversation: (user_id, contact_id) => {
      return `Insert into conversation(title,type,creator_id,updated_at)
      values ('Private_${user_id}+${contact_id}', 'private', '${user_id}', NOW() );
      `;
    },
    getConversations: (conversationIDs = []) => {
      const inStr = conversationIDs.join(',');
      return `
      SELECT * FROM online_chat.conversation
      where id in (${inStr});`;
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
    getPaticipantsByConversationsExeptUser: (conversationID, user_id) => {
      return `SELECT * FROM participant
      where conversation_id = ${conversationID}
      and profile_id != ${user_id}`;
    },
    createParticipant: (conversation_id, profile_id) => {
      return `insert into participant (conversation_id, profile_id)
      values ('${conversation_id}', '${profile_id}');`;
    },
    searchMatchingConversation: (profile_id1, profile_id2) => {
      return `
      select * from participant
      where profile_id = '${profile_id1}'
      and conversation_id in (select conversation_id from participant
      where profile_id = '${profile_id2}');
      `;
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
    createMessage: (conversation_id, sender_id, message) => {
      return `
      INSERT INTO message (conversation_id, sender_id, participant_id, message, created_at)
      VALUES(${conversation_id},${sender_id},${sender_id},'${message}',NOW());
      `;
    },
    lastInsert: () => {
      return `
      Select last_insert_id();
      `;
    },
    getNumberOfMessagesByConversationId: (number, conversationID) => {
      return `
      SELECT ${number || '*'} FROM message
      WHERE conversation_id = ${conversationID};
      `;
    },
    getLastMsgIdInConversation: (conversationID) => {
      return `
      SELECT max(id) as id FROM message
      WHERE conversation_id = ${conversationID};
      `;
    },
  },
  lastSeenMsgList: {
    createTable: () => {
      return `CREATE TABLE IF NOT EXISTS last_seen_msg_list (
        id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
        conversation_id INT NOT NULL,
        profile_id INT NOT NULL,
        message_id INT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversation (id),
        FOREIGN KEY (profile_id)  REFERENCES profile (id),
        FOREIGN KEY (message_id)  REFERENCES message (id))
         ENGINE=INNODB;`;
    },
    populateFullTableByLast: () => {
      return `insert into last_seen_msg_list (conversation_id, profile_id, message_id)
      SELECT p.conversation_id, p.profile_id,m.id as last_message_id FROM participant as p
      join message as m on m.conversation_id = p.conversation_id
      where m.id in (
      select MAX(id) from message as m
      group by m.conversation_id)
      `;
    },

    getLastSeenMsg: (conversation_id, profile_id) => {
      return `SELECT message_id FROM last_seen_msg_list
      where conversation_id = ${conversation_id}
      and profile_id = ${profile_id}`;
    },
    setLastSeenMsg: (conversation_id, profile_id, msg_id) => {
      return `UPDATE last_seen_msg_list
      set message_id = ${msg_id}
      where conversation_id = ${conversation_id}
      and profile_id = ${profile_id}`;
    },
  },
  crossTable: {
    getProfilesExeptUserByConversationID: (user_id, conversation_id) => {
      return `
      SELECT p.* FROM participant as par
      JOIN profile as p ON par.profile_id = p.id
      where par.conversation_id = ${conversation_id}
      and par.profile_id != ${user_id}
      `;
    },
  },
};

module.exports = queries;
