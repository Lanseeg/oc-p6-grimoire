const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Get token from header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId; // Set user ID from token
    next();
  } catch (error) {
    res.status(403).json({ message: 'Unauthorized request' });
  }
};
