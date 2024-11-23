const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ providerId: profile.id, provider: 'google' })
        .then(existingUser => {
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User({
                    provider: 'google',
                    providerId: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    avatar: profile._json.picture,
                    accessToken: accessToken,  
                    refreshToken: refreshToken
                }).save()
                    .then(user => done(null, user));
            }
        });
}));

const axios = require('axios');

async function fetchGitHubEmail(accessToken) {
    try {
        const response = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const primaryEmail = response.data.find(email => email.primary && email.verified);
        return primaryEmail ? primaryEmail.email : null;
    } catch (error) {
        console.error('Error fetching GitHub email:', error);
        return null;
    }
}

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ providerId: profile.id, provider: 'github' });
        if (existingUser) {
            return done(null, existingUser);
        }

        // Get email (handle cases where emails array is empty)
        const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : await fetchGitHubEmail(accessToken);

        // Create a new user
        const newUser = new User({
            provider: 'github',
            providerId: profile.id,
            email: email || 'no-email-provided@example.com', // Placeholder if no email is available
            username: profile.displayName || profile.username,
            avatar: profile._json.avatar_url,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

        const savedUser = await newUser.save();
        done(null, savedUser);
    } catch (err) {
        done(err, null);
    }
}));
