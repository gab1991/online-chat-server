require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// const db = mongoose.connection;
// db.on('error', (err) => console.error(err));
// db.once('open', () =>
//   console.log(`db connected || ${process.env.NODE_ENV.toUpperCase()}`)
// );

//allows server accepts jason
app.use(express.json());

//allows cors requests
// app.use(cors());
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4000'],
    optionsSuccessStatus: 200,
  })
);

//CREATING ROUTES
const usersRouter = require('./routes/users.js');
app.use('/api/profile', usersRouter);
//static files
app.use(express.static('build'));

// Basic html sending
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`serv started on port ${PORT}`));
