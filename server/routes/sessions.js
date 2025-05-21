const express = require('express');
const router = express.Router();
const TypingSession = require('../models/TypingSession');
const verifyToken = require('../utils/verifyToken'); // ✅ import it

// Save session
router.post('/save', verifyToken, async (req, res) => {
    const { wpm, accuracy, timer } = req.body;
  
    if (
      typeof wpm !== 'number' ||
      typeof accuracy !== 'number' ||
      typeof timer !== 'number'
    ) {
        console.log('[ERROR] Invalid input types:', { wpm, accuracy, timer });
      return res.status(400).json({ message: 'Invalid or missing data' });
    }
  
    try {
      const session = new TypingSession({
        userId: req.user.id,
        wpm,
        accuracy,
        timer,
      });
      await session.save();
      res.status(201).json({ message: 'Session saved' });
    } catch (err) {
      console.error('[SAVE ERROR]', err);
      res.status(500).json({ message: 'Error saving session' });
    }
  });
  

// Fetch session history
router.get('/history', verifyToken, async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const sessions = await TypingSession.find({
      userId: req.user.id,
      date: { $gte: cutoffDate },
    }).sort({ date: 1 });

    const labels = [];
    const wpmData = [];
    const accuracyData = [];

    sessions.forEach((s) => {
      labels.push(
        s.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      );
      wpmData.push(s.wpm);
      accuracyData.push(s.accuracy);
    });

    res.json({
      labels,
      datasets: [
        {
          label: 'WPM',
          data: wpmData,
          borderColor: '#4f46e5',
          tension: 0.3,
        },
        {
          label: 'Accuracy',
          data: accuracyData,
          borderColor: '#10b981',
          tension: 0.3,
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch session history' });
  }
});

module.exports = router;

