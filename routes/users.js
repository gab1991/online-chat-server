const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db/index');
const queries = require('../db/queries/queries');
const { promisify } = require('util');

const query = promisify(db.query).bind(db);

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

    res.header({ 'Auth-token': token });
    res.send({ success: `User ${username} has been created` });
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

router.post('/sign_in', async (req, res) => {
  const { username_email, password } = req.body;
  console.log({ username_email, password });

  //Password is correct
  // const validPass = await bcrypt.compare(req.body.password, user.password);
  // if (!validPass)
  //   return res.status(400).send({
  //     err_message: 'Username or password is not correct',
  //     field: 'password',
  //   });
  // // Creating validation token
  // const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  // //res.header('access-control-allow-headers', 'auth-token');
  // res.send({ success: 'Log In', username: req.body.username, token: token });
});

module.exports = router;
