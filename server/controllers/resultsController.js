const Result = require('../models/Result');

// GET results for a user
exports.getResultsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await Result.find({ userId }).sort({ timestamp: 1 }); // sort by time
    res.json(results);
  } catch (err) {
    console.error('Error fetching user results:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST a new result for a user
exports.saveResult = async (req, res) => {
  try {
    const { userId, wpm, accuracy, time, timestamp } = req.body;

    if (!userId || wpm == null || accuracy == null || time == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = new Result({
      userId,
      wpm,
      accuracy,
      time,
      timestamp: timestamp || new Date()
    });

    await result.save();
    res.status(201).json({ message: 'Result saved successfully' });
  } catch (err) {
    console.error('Error saving result:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};