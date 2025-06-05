const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

// Only set up Google Strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Configuring Google OAuth Strategy');
    
    // Fix the callback URL - ensure it's properly formatted
    const callbackURL = process.env.NODE_ENV === 'production' 
        ? `${process.env.BACKEND_URL || 'https://antadventure.onrender.com'}/api/users/auth/google/callback`
        : 'http://localhost:3001/api/users/auth/google/callback';
    
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: callbackURL,
                scope: ["profile", "email"]
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Check if user already exists in our database
                    let user = await User.findOne({ googleId: profile.id });
                    
                    if (user) {
                        // User already exists
                        return done(null, user);
                    }
                    
                    // Check if user exists with the same email
                    user = await User.findOne({ email: profile.emails[0].value });
                    
                    if (user) {
                        // Update existing user with Google ID
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }
                    
                    // Create new user
                    const newUser = new User({
                        username: profile.displayName.replace(/\s/g, '') + profile.id.substring(0, 5),
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        role: 'user' // Default role
                    });
                    
                    await newUser.save();
                    return done(null, newUser);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
} else {
    console.warn('Google OAuth credentials not found in environment variables.');
    console.warn('Google authentication will not be available.');
    console.warn('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.');
}

module.exports = passport;