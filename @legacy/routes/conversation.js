const express = require('express');
const router = express.Router();
const { generateAvatarPath } = require('../utils/utils');
const { verifyToken } = require('../jwtVerification/verification.js');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

router.get('/conversationEnter/:user_id/:contact_id', verifyToken, async (req, res) => {
  try {
    const { user_id, contact_id } = req.params;
    let isNewConversation = false;
    let conversation_id;

    conversation_id = await findConversation([user_id, contact_id]);
    if (!conversation_id) {
      conversation_id = await createConversation([user_id, contact_id]);
      isNewConversation = true;
    }

    res.send({ conversation_id, isNewConversation });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/uploadNewConv/:user_id/:chatID', verifyToken, async (req, res) => {
  try {
    const { user_id, chatID } = req.params;
    const conversationObj = await getConvObj(user_id, req, [chatID]);
    res.send(conversationObj);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

async function findConversation(participants = []) {
  try {
    const sql = queries.participant.searchMatchingConversation(...participants);
    const res = await query(sql);
    if (res.length) {
      return res[0].conversation_id;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function createConversation(participant_ids = []) {
  try {
    //Start transaction
    await query(queries.transaction.start());
    //CreateConversation;
    let sql;
    if (participant_ids.length === 2) {
      sql = queries.conversation.createPrivateConversation(participant_ids[0], participant_ids[1]);
    }
    const res = await query(sql);
    const conversationId = res.insertId;

    // Create participants
    participant_ids.forEach(async (participant_id) => {
      await query(queries.participant.createParticipant(conversationId, participant_id));
    });
    // Commit
    await query(queries.transaction.commit());
    return conversationId;
  } catch (err) {
    console.log(err);
    await query(queries.transaction.rollback());
  }
}

async function getConversations(profile_id) {
  try {
    const participantRows = await query(queries.participant.getPaticipants(profile_id));
    const conversationIDs = [];
    participantRows.forEach((row) => {
      conversationIDs.push(row.conversation_id);
    });
    const conversations = await query(queries.conversation.getConversations(conversationIDs));
    return conversations;
  } catch (err) {
    return [];
  }
}

//need to rewrite this
async function getConvObj(profile_id, req, chatIds = []) {
  const conversationObj = {};
  let conversationList;

  if (!chatIds.length) {
    conversationList = await getConversations(profile_id);
  } else {
    conversationList = await query(queries.conversation.getConversations(chatIds));
  }

  if (!conversationList.length) return conversationObj;

  for (let conversation of conversationList) {
    conversation.participants = await query(
      queries.crossTable.getProfilesExeptUserByConversationID(profile_id, conversation.id)
    );
    //adding avatart path
    conversation.participants.forEach((participant) => {
      participant.avatar_path = generateAvatarPath(req, participant.avatar_url);
    });
    //adding messages
    conversation.messages = await query(queries.message.getNumberOfMessagesByConversationId(null, conversation.id));
    //adding last seen msg
    const lastMsgQueryResult = await query(queries.lastSeenMsgList.getLastSeenMsg(conversation.id, profile_id));

    if (lastMsgQueryResult[0]) {
      conversation.last_seen_msg_id = lastMsgQueryResult[0].message_id;
    } else {
      conversation.last_seen_msg_id = 0;
    }
    //adding conv to obj
    conversationObj[conversation.id] = conversation;
  }
  return conversationObj;
}
module.exports = { conversationRouter: router, getConversations, getConvObj };
