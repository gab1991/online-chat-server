require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http').createServer(app);
const compression = require('compression');

//allows server accepts json
app.use(express.json());

//allows cors requests
app.use(cors());

//enable compression
app.use(compression());

//CREATING ROUTES
const usersRouter = require('./routes/users.js');
app.use('/api/users', usersRouter);

const { profilesRouter } = require('./routes/profiles.js');
app.use('/api/profiles', profilesRouter);

const uploadRouter = require('./routes/img_upoad');
app.use('/api/img_upload', uploadRouter);

const { conversationRouter } = require('./routes/conversation.js');
app.use('/api/conversation', conversationRouter);
//static files
app.use(express.static('build'));
app.use(express.static(process.env.PUBLIC_FOLDER));

// Basic html sending
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

// Run socket on client connection
require('./socket/socket')(http);

const PORT = process.env.PORT || 8000;
http.listen(PORT, () => console.log(`serv started on port ${PORT}`));
