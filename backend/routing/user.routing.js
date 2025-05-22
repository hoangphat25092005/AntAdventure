//routing for authentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');
const { isAdmin } = require('../middleware/auth.middleware');

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


