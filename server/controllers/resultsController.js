const Result = require('../models/Result');

// Save a new typing result
exports.saveResult = async (req, res) => {
  try {
    const { username, wpm, accuracy } = req.body;

    if (!username || wpm == null || accuracy == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = new Result({ username, wpm, accuracy });
    await result.save();

    res.status(201).json({ message: 'Result saved successfully' });
  } catch (err) {
    console.error('Error saving result:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Handles the logic of saving WPM and accuracy