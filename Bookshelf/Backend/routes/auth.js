const express = require('express');
const passport = require('passport');
const { register, login, me, refreshToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);  // Add this line for the me route
router.post('/refreshToken', refreshToken);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


// Google Callback Route
router.get('/api/auth/google', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: req.user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
  // Send an HTML response with embedded JavaScript to set tokens in localStorage
  res.send(`
    <script>
      localStorage.setItem('token', '${token}');
      localStorage.setItem('refreshToken', '${refreshToken}');
      window.location.href = '/bookshelf';
    </script>
  `);
});

// GitHub Callback Route
router.get('/api/auth/github', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: req.user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
  res.send(`
    <script>
      localStorage.setItem('token', '${token}');
      localStorage.setItem('refreshToken', '${refreshToken}');
      window.location.href = '/bookshelf';
    </script>
  `);
});

module.exports = router;
