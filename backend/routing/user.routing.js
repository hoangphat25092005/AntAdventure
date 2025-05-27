//routing for authentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');
const googleController = require('../controllers/google.controller');
const { isAdmin } = require('../middleware/auth.middleware');
const passport = require('../config/passport');

//register user
router.post('/register', authController.registerUser);

//login user
router.post('/login', authController.loginUser);

//logout user
router.post('/logout', authController.logoutUser);

//verify if user is admin
router.post('/verifyAdmin', authController.verifyAdmin);

//check login status
router.get('/check-auth', authController.checkLogin);

// Google authentication routes - only if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/auth/google', 
        passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    router.get('/auth/google/callback', 
        passport.authenticate('google', { 
            failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3000',
            session: true 
        }),
        googleController.googleCallback
    );
} else {
    // Fallback route for when Google auth is not configured
    router.get('/auth/google', (req, res) => {
        console.warn('Google authentication requested but not configured');
        res.status(501).json({ 
            error: 'Google authentication not configured',
            message: 'Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in the server environment'
        });
    });
}

//check admin status - using the new middleware
router.get('/checkAdmin', isAdmin, (req, res) => {
    res.status(200).json({ 
        success: true, 
        isAdmin: true,
        username: req.user.username 
    });
});

// Get user info
router.get('/me', authController.checkLogin, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    
    res.json({
        username: req.user.username,
        email: req.user.email,
        isAdmin: req.user.isAdmin
    });
});

module.exports = router;


