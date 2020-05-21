const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../jwtVerification/verification.js');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');
const { generateAvatarPath } = require('../utils/utils.js');

router.get('/', verifyToken, async (req, res) => {
  try {
    const username = req.verifiedUserData._id;

    const sql = queries.profile.getProfile(username);

    const resp = await query(sql);
    const profile = resp[0];

    profile.avatar_path = generateAvatarPath(req, profile.avatar_url);
    const conversationList = (await getConversations(profile.id)) || [];
    const conversationObj = {};
    for (let conversation of conversationList) {
      conversation.participants = await query(
        queries.crossTable.getProfilesExeptUserByConversationID(
          profile.id,
          conversation.id
        )
      );
      //adding avatart path
      conversation.participants.forEach((participant) => {
        participant.avatar_path = generateAvatarPath(
          req,
          participant.avatar_url
        );
      });
      //adding messages
      conversation.messages = await query(
        queries.message.getNumberOfMessagesByConversationId(
          null,
          conversation.id
        )
      );
      //adding conv to obj
      conversationObj[conversation.id] = conversation;
    }
    profile.conversations = conversationObj;
    res.send(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get('/findProfiles', verifyToken, async (req, res) => {
  try {
    const searchStr = req.query.search;

    if (!searchStr.length) return res.send([]);
    const sql = queries.profile.findProfiles(searchStr);

    const profiles = await query(sql);

    // If nothing found
    if (!profiles.length) {
      return res.send(profiles);
    }
    // change actual avatar url in each entry
    for (let profile of profiles) {
      profile['avatar_path'] = generateAvatarPath(req, profile['avatar_url']);
    }
    res.send(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

async function getConversations(profile_id) {
  try {
    console.log(profile_id);
    const participantRows = await query(
      queries.participant.getPaticipants(profile_id)
    );
    const conversationIDs = [];
    participantRows.forEach((row) => {
      conversationIDs.push(row.conversation_id);
    });
    const conversations = await query(
      queries.conversation.getConversations(conversationIDs)
    );
    return conversations;
  } catch (err) {
    return null;
  }
}

module.exports = router;
