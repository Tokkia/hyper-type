const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const rawHeader = req.header('Authorization');

  if (!rawHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = rawHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
