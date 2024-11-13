// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.header('Authorization');

//   // Check if token exists and starts with 'Bearer '
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     console.log('No token or authorization header is missing');
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   // Extract token from header
//   const token = authHeader.split(' ')[1]; // Remove 'Bearer' prefix
//   console.log('Token received:', token);
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id);
//     if (!req.user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     next();
//   } catch (error) {
//     console.error('Token verification failed:', error);
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };


// module.exports = authMiddleware;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  // Check if token exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token or authorization header is missing');
    return res.status(401).json({ message: 'Authorization denied, token missing' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];
  console.log('Token received:', token);

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user only if needed, or proceed with decoded ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Attach the user or user ID to the request object
    req.user = { id: user._id, username: user.username, email: user.email }; // You can adjust based on needed data
    next();
  } catch (error) {
    console.error('Token verification failed:', error);

    // Token expiration error handling
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Other JWT errors
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

