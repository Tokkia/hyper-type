const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String, default: null },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
  // Optionally: avatarUrl, userId (implement for auth later
});

module.exports = mongoose.model('Result', resultSchema);

//defines data model for a typing result