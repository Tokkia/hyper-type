const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  time: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

// IMPORTANT: use correct collection name
module.exports = mongoose.model('Result', resultSchema, 'typingsessions');