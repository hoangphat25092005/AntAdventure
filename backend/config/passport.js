const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
require('dotenv').config();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Temporarily disable Google OAuth to fix deployment
console.warn('Google OAuth temporarily disabled for deployment');

// Only set up Google Strategy if credentials are provided
// if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
//     console.log('Configuring Google OAuth Strategy');
//     passport.use(
//         new GoogleStrategy(
//             {
//                 clientID: process.env.GOOGLE_CLIENT_ID,
//                 clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//                 callbackURL: "/api/users/auth/google/callback",
//                 scope: ["profile", "email"]
//             },
//             async (accessToken, refreshToken, profile, done) => {
//                 // ... Google strategy logic
//             }
//         )
//     );
// } else {
//     console.warn('Google OAuth credentials not found in environment variables.');
//     console.warn('Google authentication will not be available.');
//     console.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
// }

module.exports = passport;