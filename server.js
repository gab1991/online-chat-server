require('dotenv').config();
const express = require('express');

const db = require('./db/index');
const users = require('./db/db_users');
const app = express();
const cors = require('cors');
const path = require('path');
const http = require('http').createServer(app);
const socketio = require('socket.io');
const io = socketio(http);
//allows server accepts jason
app.use(express.json());

//allows cors requests
// app.use(cors());
app.use(cors());

//CREATING ROUTES
const usersRouter = require('./routes/users.js');
app.use('/api/users', usersRouter);
//static files
app.use(express.static('build'));

// Basic html sending
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
// });

// Run socket on client connection
io.on('connection', (socket) => {
  console.log('new ws connection');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`serv started on port ${PORT}`));
