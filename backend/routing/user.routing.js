//routing for authentication
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/user.controller');
const googleController = require('../controllers/google.controller');
const { isAdmin } = require('../middleware/auth.middleware');

// Configure multer for avatar uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/avatars'));
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

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
            failureRedirect: process.env.NODE_ENV === 'production' 
                ? 'https://antadventure.onrender.com/login?error=auth_failed'
                : 'http://localhost:3000/login?error=auth_failed',
            session: true 
        }),
        googleController.googleCallback
    );
} else {
    console.warn('Google OAuth routes not configured - missing credentials');
}
// REMOVE THE FALLBACK ROUTE - this might be causing the path-to-regexp error

//check admin status - using the new middleware
router.get('/checkAdmin', isAdmin, (req, res) => {
    res.status(200).json({ 
        success: true, 
        isAdmin: true,
        username: req.user ? req.user.username : 'Unknown'
    });
});


// Get user info
router.get('/me', (req, res) => {
    // Check if user is authenticated via session
    if (!req.session.userId) {
        return res.status(401).json({ 
            authenticated: false,
            message: 'Not authenticated' 
        });
    }
    
    // Fetch user from database
    const User = require('../models/user.model');
    User.findById(req.session.userId)
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            res.json({
                username: user.username,
                email: user.email,
                isAdmin: user.role === 'admin',
                avatar: user.avatar
            });
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ message: 'Server error' });
        });
});
router.get('/check-auth', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ 
            authenticated: false, 
            message: 'Not authenticated' 
        });
    }
    
    res.status(200).json({ 
        authenticated: true,
        userId: req.session.userId 
    });
});

// Avatar update route
router.post('/update-avatar', upload.single('avatar'), authController.updateAvatar);

module.exports = router;