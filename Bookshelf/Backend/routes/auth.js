const express = require('express');
const passport = require('passport');
const { register, login, me, refreshToken } = require('../controllers/authController');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);  // Add this line for the me route
router.post('/refreshToken', refreshToken);


const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get('/google', passport.authenticate('github', { scope: ['user:email'] }));
// Google Callback Route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), (req, res) => {
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


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
// GitHub Callback Route
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login', session: false }), (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: req.user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Redirect with tokens as query parameters (alternative to localStorage approach)
    res.redirect(`http://localhost:5173/bookshelf?token=${token}&refreshToken=${refreshToken}`);
});

module.exports = router;
