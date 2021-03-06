const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(400).json({ access_denied: 'token is not provieded' });
  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(400).json({ access_denied: 'No token provided' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.verifiedUserData = verified;
    next();
  } catch (err) {
    res.status(401).json({ access_denied: 'Access Denied' });
  }
};

const getVerifiedUser = (token) => {
  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET)._id;
    return user;
  } catch (err) {
    return null;
  }
};

module.exports = { verifyToken, getVerifiedUser };
