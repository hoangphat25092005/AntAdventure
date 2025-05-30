const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword, verifyResetToken } = require('../controllers/user.controller');

// Route for requesting password reset
router.post('/forgot-password', forgotPassword);

// Route for resetting password with token
router.post('/reset-password/:token', resetPassword);

// Route for verifying reset token
router.get('/verify-reset-token/:token', verifyResetToken);

module.exports = router;
