const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const router = express.Router();
const verifyToken = require('../jwtVerification/verification.js');
const multer = require('multer');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');
const { generateRandomHash } = require('../utils/utils');
const publicDir = process.env.PUBLIC_FOLDER;

const storage = multer.diskStorage({
  destination: `./${publicDir}/upload/avatars`,
  filename: (req, file, cb) => {
    const { username } = req.body;

    cb(
      null,
      `${username}_avatar_${generateRandomHash(4)}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

router.post(
  '/avatar',
  verifyToken,
  upload.single('avatar'),
  async (req, res) => {
    try {
      const { username } = req.body;
      const filename = req.file.filename;
      const host = req.get('host');
      const filePath = `http://${host}/upload/avatars/${filename}`;
      await query(queries.profiles.addAvatar(username, filename));
      res.send({ avatar_path: filePath });
    } catch (err) {
      res.status(500).send({ err: err.message });
    }
  }
);

async function getAvatar(req, res, next) {
  const { username } = req.body;
  const readdir = promisify(fs.readdir);
  const host = req.get('host');
  const avatarDir = path.resolve(__dirname, `../public/upload/avatars/`);
  const avatars = await readdir(avatarDir);
  let avatarImg = null;
  for (let avatar of avatars) {
    if (avatar.includes(`${username}`)) {
      avatarImg = avatar;
      break;
    }
  }

  if (avatarImg) {
    const filePath = `http://${host}/public/upload/avatars/${req.params.platform}`;
    res.filePath = filePath;
    next();
  } else {
  }
}

module.exports = router;
