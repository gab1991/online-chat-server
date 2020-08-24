const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { verifyToken } = require('../jwtVerification/verification.js');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');
const { generateAvatarPath } = require('../utils/utils.js');

router.get(
  '/conversationEnter/:user_id/:contact_id',
  verifyToken,
  async (req, res) => {
    try {
      const { user_id, contact_id } = req.params;
      let conversation_id;
      conversation_id = await findConversation([user_id, contact_id]);
      console.log({ user_id, contact_id });
      if (!conversation_id) {
        conversation_id = await createConversation([user_id, contact_id]);
      }
      res.send({ conversation_id });
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

router.get(
  '/getConversationData/:conversationID',
  verifyToken,
  async (req, res) => {
    try {
    } catch (err) {}
  }
);

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
    console.log('here');
    //Start transaction
    await query(queries.transaction.start());
    //CreateConversation;
    let sql;
    if (participant_ids.length === 2) {
      sql = queries.conversation.createPrivateConversation(
        participant_ids[0],
        participant_ids[1]
      );
    }
    const res = await query(sql);
    const conversationId = res.insertId;
    console.log(res);
    // Create participants
    participant_ids.forEach(async (participant_id) => {
      await query(
        queries.participant.createParticipant(conversationId, participant_id)
      );
    });
    // Commit
    await query(queries.transaction.commit());
    return conversationId;
  } catch (err) {
    console.log(err);
    await query(queries.transaction.rollback());
  }
}
module.exports = router;
