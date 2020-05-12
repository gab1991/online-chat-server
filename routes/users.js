const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { query } = require('../db/index');
const queries = require('../db/queries/queries');

router.post('/sign_up', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    //Hash pass
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    //Saving user to DB
    const createUserSql = queries.users.createUser(
      username,
      hashPassword,
      email
    );
    await query(createUserSql);

    // Creating validation token
    const token = jwt.sign({ _id: username }, process.env.TOKEN_SECRET);

    res.header({
      'Access-Control-Expose-Headers': 'Auth-token',
      'Auth-token': token,
    });
    res.send({ success: `User ${username} has been created`, username });
  } catch (err) {
    let errMessage;
    if (err.code === 'ER_DUP_ENTRY') {
      const sqlErrMessage = err.sqlMessage;
      if (sqlErrMessage.includes('username_UNIQUE')) {
        errMessage = `This username : ${username} already exists`;
      } else if (sqlErrMessage.includes('email_UNIQUE')) {
        errMessage = `User with email ${email} already exists`;
      }
    }
    return res.status(400).send({ error: errMessage } || err);
  }
});

router.post('/login', async (req, res) => {
  const { username_email, password } = req.body;

  try {
    const sql = queries.users.findUser(username_email);
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

module.exports = router;
