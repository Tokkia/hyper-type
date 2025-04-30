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

//Handles the logic of saving WPM and accuracy