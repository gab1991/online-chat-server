const os = require('os');

function generateRandomHash(length) {
  const characters = '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
  let string = '';
  for (let i = 0; i <= length; i++) {
    string += characters[Math.floor(Math.random() * characters.length)];
  }
  return string;
}

function generateAvatarPath(req, db_url) {
  if (!db_url) return null;
  const host = req.get('host');
  return `http://${host}/upload/avatars/${db_url}`;
}

module.exports = { generateRandomHash, generateAvatarPath };
