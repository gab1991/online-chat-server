const socket = require('socket.io');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');
const { getConversations } = require('../routes/conversation');

const onlineUsers = {};
const socketIdtoUserIdMap = {};

function initialization(server) {
  const io = socket(server);

  io.on('connection', (socket) => {
    socket.on('setIsOnline', async (username) => {
      const socketID = socket.id;

      try {
        const [profile] = await query(queries.profile.getProfile(username));

        const currentConversations = (await getConversations(profile.id)) || [];

        const conversationObj = {};

        for (let conversation of currentConversations) {
          const { id } = conversation;
          //should change in the future. But for now its enough for sending a new conversation object if user dosen't have a chat
          conversationObj[id] = id;
        }

        onlineUsers[profile.id] = { socketID, conversations: conversationObj };

        socketIdtoUserIdMap[socketID] = profile.id;
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('subscribeToConversations', (conversations = {}) => {
      Object.keys(conversations).forEach((key) => {
        socket.join(conversations[key].id);
      });
    });

    socket.on('sendMessage', async (data) => {
      try {
        const { user_id, chatID, message } = data;
        //starting transaction
        await query(queries.transaction.start());
        // execute createMsg
        await query(queries.message.createMessage(chatID, user_id, message));
        // adding lastSeenMsgId
        const lastIdResp = await query(queries.message.lastInsert());
        const lastInsertedMsgId = lastIdResp[0]['last_insert_id()'];
        await query(
          queries.lastSeenMsgList.setLastSeenMsg(
            chatID,
            user_id,
            lastInsertedMsgId
          )
        );
        // commit transaction
        await query(queries.transaction.commit());

        // emit msg to everyone in this chat
        io.to(chatID).emit('passMsgToConversation', {
          conversation_id: chatID,
          created_at: new Date(),
          id: lastInsertedMsgId,
          message: message,
          sender_id: user_id,
          user_id: user_id,
        });

        //if this is a new conversation for smb we need to upd their conversations obj
        const noChatUsers = await getUsersWithoutChat(chatID);
        for (let user of noChatUsers) {
          io.to(user.socketID).emit('needToUpdChatObj', {
            chatID,
            sender_id: user_id,
          });
        }

        socket.emit('updateLastSeenMsg', {
          user_id: user_id,
          conversation_id: chatID,
          last_seen_msg_id: lastInsertedMsgId,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('markMsgAsRead', async (data) => {
      try {
        const { userId, chatID } = data;
        const response = await query(
          queries.message.getLastMsgIdInConversation(chatID)
        );
        const lastMsgInConversation = response[0].id || 0;

        // get last msg in this chat
        const [lastMsgInChatSqlRes] = await query(
          queries.message.getLastMsgIdInConversation(chatID)
        );
        // if there is no a single message
        if (!lastMsgInChatSqlRes || !lastMsgInChatSqlRes.id) return;

        // checking for existing lastSeen
        const [currentLastSeen] = await query(
          queries.lastSeenMsgList.getLastSeenMsg(
            chatID,
            userId,
            lastMsgInConversation
          )
        );

        if (currentLastSeen) {
          await query(
            queries.lastSeenMsgList.setLastSeenMsg(
              chatID,
              userId,
              lastMsgInConversation
            )
          );
        } else {
          await query(
            queries.lastSeenMsgList.insertLastSeenMsg(
              chatID,
              userId,
              lastMsgInConversation
            )
          );
        }
        // sending response to listener

        socket.emit('updateLastSeenMsg', {
          user_id: userId,
          conversation_id: chatID,
          last_seen_msg_id: lastMsgInConversation,
        });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('disconnecting', (reason) => {
      const disconectUser = socketIdtoUserIdMap[socket.id];
      // set userOffline
      onlineUsers[disconectUser] = null;
    });
  });
}

async function getUsersWithoutChat(chatID) {
  try {
    const chatParticipantsArr = await query(
      queries.participant.getParticipantsByChatID(chatID)
    );

    // check if all the users have this chat now;
    const usersWithoNoChat = [];
    for (let user of chatParticipantsArr) {
      if (
        onlineUsers[user.profile_id] &&
        !onlineUsers[user.profile_id].conversations[chatID]
      ) {
        usersWithoNoChat.push({
          user_id: user.profile_id,
          socketID: onlineUsers[user.profile_id].socketID,
        });
      }
    }
    return usersWithoNoChat;
  } catch (err) {
    console.log(err);
    return [];
  }
}

module.exports = initialization;
