const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);

//defines data model for a typing result