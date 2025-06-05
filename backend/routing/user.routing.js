//routing for authentication
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/user.controller');
//const googleController = require('../controllers/google.controller');
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

// And comment out the Google routes:
// Google authentication routes - only if credentials are configured
// if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
//     router.get('/auth/google', 
//         passport.authenticate('google', { scope: ['profile', 'email'] })
//     );

//     router.get('/auth/google/callback', 
//         passport.authenticate('google', { 
//             failureRedirect: process.env.FRONTEND_URL || 'http://localhost:3000',
//             session: true 
//         }),
//         googleController.googleCallback
//     );
// }
// REMOVE THE FALLBACK ROUTE - this might be causing the path-to-regexp error

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
        isAdmin: req.user.isAdmin,
        avatar: req.user.avatar
    });
});

// Avatar update route
router.post('/update-avatar', upload.single('avatar'), authController.updateAvatar);

module.exports = router;