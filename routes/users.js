const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { query } = require('../db/index');
const queries = require('../db/queries/queries');
const { verifyToken } = require('../jwtVerification/verification.js');
const e = require('express');

router.post('/sign_up', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    //Hash pass
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Saving user to DB
    const createUserSql = queries.user.createUser(
      username,
      hashPassword,
      email
    );
    await query(createUserSql);

    //Create profile entry
    const createProfileSql = queries.profile.createProfile(username);
    await query(createProfileSql);

    // Creating validation token
    const token = jwt.sign({ _id: username }, process.env.TOKEN_SECRET);

    res.header({
      'Access-Control-Expose-Headers': 'Auth-token',
      'Auth-token': token,
    });
    res.send({ success: `User ${username} has been created`, username });
  } catch (err) {
    const errObj = {};
    if (err.code === 'ER_DUP_ENTRY') {
      const sqlErrMessage = err.sqlMessage;
      if (sqlErrMessage.includes('username_UNIQUE')) {
        errObj.err_message = `This username : ${username} already exists`;
        errObj.field = 'username';
      } else if (sqlErrMessage.includes('email_UNIQUE')) {
        errObj.err_message = `User with email ${email} already exists`;
        errObj.field = 'email';
      }
    }
    return res.status(400).send(errObj.field ? errObj : err);
  }
});

router.post('/login', async (req, res) => {
  const { username_email, password } = req.body;

  try {
    const sql = queries.user.findUser(username_email);
    const user = await query(sql);
    if (!user.length) {
      return res.status(400).send({
        err_message: `User with username/email : ${username_email} is not found`,
        field: `username_email`,
      });
    }
    const username = user[0].username;
    const hashedPass = user[0].hashed_pass;
    //check password is correct
    const validPass = await bcrypt.compare(password, hashedPass);
    if (!validPass) {
      return res.status(400).send({
        err_message: 'Username or password is not correct',
        field: 'password',
      });
    }
    const token = jwt.sign({ _id: username }, process.env.TOKEN_SECRET);
    res.header({
      'Access-Control-Expose-Headers': 'Auth-token',
      'Auth-token': token,
    });
    res.send({ success: 'Log In', username: username });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/checkTokenValidity', verifyToken, async (req, res) => {
  try {
    const username_token = req.verifiedUserData._id;
    const username_req = req.body.username;

    //check if user exists in bd
    const user_bd = await query(queries.user.findUser(username_req));
    //check if profile exists in bd
    const user_profile = await query(queries.profile.getProfile(username_req));

    if (
      username_token === username_req &&
      user_bd.length &&
      user_profile.length
    ) {
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false, msg: 'validity problems' });
    }
  } catch (err) {
    res.status(400).send({ err });
  }
});

module.exports = router;
