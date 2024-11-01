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
    callbackURL: "/auth/google/callback"
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
                    avatar: profile._json.picture
                }).save()
                    .then(user => done(null, user));
            }
        });
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({ providerId: profile.id, provider: 'github' })
        .then(existingUser => {
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User({
                    provider: 'github',
                    providerId: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    avatar: profile._json.avatar_url
                }).save()
                    .then(user => done(null, user));
            }
        });
}));