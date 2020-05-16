const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../jwtVerification/verification.js');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

router.get('/', verifyToken, async (req, res) => {
  try {
    const username = req.verifiedUserData._id;
    const sql = queries.profiles.getProfile(username);
    const resp = await query(sql);
    res.send(resp[0]);
  } catch (err) {}
  console.log('bam');
});

module.exports = router;
