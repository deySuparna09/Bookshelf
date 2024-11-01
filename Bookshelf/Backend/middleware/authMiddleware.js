const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Check if token exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token or authorization header is missing');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1]; // Remove 'Bearer' prefix
  console.log('Token received:', token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};


module.exports = authMiddleware;
