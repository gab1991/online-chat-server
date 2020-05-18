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
    profile['avatar_path'] = generateAvatarPath(req, profile['avatar_url']);
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

module.exports = router;
