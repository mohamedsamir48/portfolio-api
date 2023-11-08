const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
// const mongoose = require('mongoose');
// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/mydb';

// MongoClient.connect(url, function (err, db) {
//   if (err) throw err;
//   console.log('Database created!');
//   db.close();
// });

let connectedUser = 0;
const cors = require('cors');

let online = false;
app.use(cors());

const server = http.createServer(app);
// mongoose.connect('mongodb://localhost:27017', () => {
//   console.log('db is connected');
// });
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  connectedUser += 1;
  // console.log(`User ${connectedUser}`);

  socket.on('client', (data) => {
    socket.broadcast.emit(data.to, { ...data, state: 'received' });
    // console.log(data);
  });
  socket.on('online', (data) => {
    // cosnole.log(data);
    if (data.text == 'are you on') {
      socket.broadcast.emit('server', {
        text: 'are you on',
        from: 'online',
        to: 'server',
        state: 'sent',
      });
    } else if ((data.text == 'online') & (data.from === 'server')) {
      socket.broadcast.emit('Cclient', {
        text: 'online',
        from: 'Mmohamed101',
        to: 'Cclients',
        state: 'received',
      });
    } else if ((data.text == 'offline') & (data.from === 'server')) {
      socket.broadcast.emit('Cclient', {
        text: 'offline',
        from: 'Mmohamed101',
        to: 'Cclients',
        state: 'received',
      });
    }
  });
  socket.on('server', (data) => {
    if (
      (data.from == 'server', data.to == 'onlineState', data.text == 'letmeon')
    )
      socket.broadcast.emit('Cclient', {
        text: 'online',
        from: 'Mmohamed101',
        to: 'Cclients',
        state: 'received',
      });

    online = true;
    if (
      (data.from == 'server', data.to == 'onlineState', data.text == 'letmeoff')
    )
      socket.broadcast.emit('Cclient', {
        text: 'offline',
        from: 'Mmohamed101',
        to: 'Cclients',
        state: 'received',
      });

    online = false;
  });
});
app.use(
  '/online',
  async (req, res) => await res.status(200).json(online ? online : false)
);

server.listen(5001, () => {
  console.log('server is running');
});
