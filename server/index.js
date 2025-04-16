const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // React client
    methods: ['GET', 'POST'],
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  // Your multiplayer logic here
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  server.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.log(err));
