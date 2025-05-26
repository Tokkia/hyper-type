const express = require('express');
const router = express.Router();
const RaceSession = require('../models/RaceSession');
const verifyToken = require('../utils/verifyToken');

// Save a race result
router.post('/save', verifyToken, async (req, res) => {
  const { wpm, accuracy, difficulty, wordCount } = req.body;

  if (
    typeof wpm !== 'number' ||
    typeof accuracy !== 'number' ||
    typeof wordCount !== 'number' ||
    typeof difficulty !== 'string'
  ) {
    return res.status(400).json({ message: 'Invalid or missing data' });
  }

  try {
    const session = new RaceSession({
      userId: req.user.id,
      wpm,
      accuracy,
      difficulty,
      wordCount,
    });

    await session.save();
    res.status(201).json({ message: 'Race session saved' });
  } catch (err) {
    console.error('[RACE SAVE ERROR]', err);
    res.status(500).json({ message: 'Error saving race session' });
  }
});

module.exports = router;
