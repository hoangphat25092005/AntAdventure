//routing for authentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

//register user
router.post('/register', authController.registerUser);

//login user
router.post('/login', authController.loginUser);

module.exports = router;


