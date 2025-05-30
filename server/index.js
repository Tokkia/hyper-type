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
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessions');
const raceSessionRoutes = require('./routes/raceSessions');
const topResults = require('./routes/results');
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/race', raceSessionRoutes);
app.use('/api/results', topResults);

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  // multiplayer logic here
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  server.listen(5001, () => console.log('Server running on port 5001'));
}).catch(err => console.log(err));