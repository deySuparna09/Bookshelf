const express = require('express');
const passport = require('passport');
const { register, login, me, refreshToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', me);  // Add this line for the me route
router.post('/refreshToken', refreshToken);
// Google Authentication Routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/failure'
}), (req, res) => {
    res.redirect('/bookshelf'); // Redirect to your dashboard or home
});

// GitHub Authentication Routes
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

router.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/auth/failure'
}), (req, res) => {
    res.redirect('/bookshelf'); // Redirect to your dashboard or home
});

module.exports = router;
