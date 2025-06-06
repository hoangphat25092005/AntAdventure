const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');

// Register user
const registerUser = async (req, res) => {
    try {
        const { username, password, email, secretKey } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if secret key matches to make user an admin
        const isAdmin = secretKey === process.env.ADMIN_SECRET_KEY;
        
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            role: isAdmin ? 'admin' : 'user'
        });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Login with session
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('🔐 Login attempt for:', username);
        console.log('🌍 Request origin:', req.headers.origin);
        console.log('📧 Request headers:', {
            'user-agent': req.headers['user-agent'],
            'cookie': req.headers.cookie ? 'Present' : 'Not present'
        });
        
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        
        req.session.userId = user._id;
        console.log('✅ Session created for user:', user._id);
        console.log('🆔 Session ID:', req.sessionID);
        console.log('🍪 Session cookie will be set with options:', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });
        
        return res.status(200).json({ 
            message: "Login successful", 
            success: true,
            username: user.username 
        });
    } catch (error) {
        console.error("❌ Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Check if user is admin
const checkAdmin = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        return res.status(200).json({ 
            success: true, 
            isAdmin: true,
            username: user.username 
        });
    } catch (error) {
        console.error("Error checking admin status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out", error: err.message });
            }
            // Clear the session cookie with the same options as when it was set
            res.clearCookie('connect.sid', {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
            });
            return res.status(200).json({ message: "Logged out successfully", success: true });
        });
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Verify if a user has admin privileges
const verifyAdmin = async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(200).json({ isAdmin: false });
        }

        return res.status(200).json({ 
            isAdmin: user.role === 'admin'
        });
    } catch (error) {
        console.error("Error verifying admin status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Check login status
const checkLogin = async (req, res) => {
    try {
        console.log('🔍 Auth check - Session ID:', req.sessionID);
        console.log('👤 Auth check - User ID from session:', req.session.userId);
        console.log('🍪 Auth check - Cookie header:', req.headers.cookie ? 'Present' : 'Not present');
        
        if (!req.session.userId) {
            console.log('❌ No userId in session');
            return res.status(401).json({ 
                success: false,
                message: "Not authenticated" 
            });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({ 
                success: false,
                message: "User not found" 
            });
        }

        console.log('✅ User authenticated successfully:', user.username);
        return res.status(200).json({ 
            success: true,
            username: user.username,
            role: user.role,
            avatar: user.avatar
        });
    } catch (error) {
        console.error("❌ Error checking login status:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};
// Forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this email.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        // Save token to user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();

        // Create nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email reset link
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent to email.' });

    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Error processing request.' });
    }
};

// Verify reset token
const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        res.status(200).json({ message: 'Token is valid.' });
    } catch (error) {
        console.error('Error verifying reset token:', error);
        res.status(500).json({ message: 'Error verifying reset token.' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password.' });
    }
};

// Update user avatar
const updateAvatar = async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('File uploaded:', req.file);
        
        // Update the user's avatar URL
        user.avatar = `/uploads/avatars/${req.file.filename}`;
        await user.save();

        console.log('User updated with avatar:', user.avatar);

        res.status(200).json({ 
            message: 'Avatar updated successfully',
            avatar: user.avatar
        });
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).json({ message: 'Error updating avatar' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    checkAdmin,
    logoutUser,
    verifyAdmin,
    checkLogin,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    updateAvatar
};
