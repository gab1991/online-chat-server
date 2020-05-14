const express = require('express');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const router = express.Router();
const verifyToken = require('../jwtVerification/verification.js');
const multer = require('multer');
const { query } = require('../db/index');
const queries = require('../db/queries/queries');
const publicDir = process.env.PUBLIC_FOLDER;

const storage = multer.diskStorage({
  destination: `./${publicDir}/upload/avatars`,
  filename: (req, file, cb) => {
    const { username } = req.body;

    cb(null, `${username}_avatar${path.extname(file.originalname)}`);
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
      await query(queries.users.addAvatar(username, filename));
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

async function getBoxArt(req, res, next) {
  const readdir = promisify(fs.readdir);
  // parametr difens the match of a search in minisearch library. The bigger the number the better the match
  const scoreThreshHold = 11;
  const host = req.get('host');
  const genericBox = `http://${host}/images/box_artworks/${req.params.platform}/generic_box.png`;
  let filePath;

  const regionsDir = path.resolve(
    __dirname,
    `../assets_minified_for_prod/images/box_artworks/${req.params.platform}/`
  );
  const platformDir = await readdir(regionsDir);
  const regions = platformDir
    .filter((item) => {
      const itemPath = path.resolve(regionsDir, item);
      return fs.lstatSync(itemPath).isDirectory();
    })
    .sort()
    .reverse();

  try {
    for (let i = 0; i < regions.length; i++) {
      const currentRegion = regions[i];
      const directory = path.resolve(
        __dirname,
        `../assets_minified_for_prod/images/box_artworks/${req.params.platform}/${currentRegion}`
      );
      const files = await readdir(directory);
      if (!files && i === regions.length - 1) {
        return res
          .status(404)
          .json({ message: `Cannot read files in catalogue ${directory}` });
      }

      const regexTrim = /.+?(?=\s\()/g;

      let filesObj = [];
      files.forEach((file, index) => {
        filesObj.push({
          id: index,
          name: file.toLowerCase().match(regexTrim)[0],
          link: file,
        });
      });

      miniSearch = new minisearh({
        fields: ['name'],
        storeFields: ['name', 'link'],
      });
      miniSearch.addAll(filesObj);

      let searchQuery = req.params.gameName.toLowerCase();
      let boxArts = miniSearch.search(searchQuery);
      if (boxArts[0] && boxArts[0].score > scoreThreshHold) {
        let bestMatchedhBox = boxArts[0];
        filePath = `http://${host}/images/box_artworks/${req.params.platform}/${currentRegion}/${bestMatchedhBox.link}`;
        break;
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.filePath = filePath ? filePath : genericBox;
  next();
}

module.exports = router;
