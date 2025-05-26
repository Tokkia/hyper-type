const mongoose = require('mongoose');

const RaceSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wpm: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('RaceSession', RaceSessionSchema);
