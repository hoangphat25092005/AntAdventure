const User = require('../models/user.model');
const bcrypt = require('bcrypt');

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
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        }
        req.session.userId = user._id; // Store user ID in session
        return res.status(200).json({ 
            message: "Login successful", 
            success: true,
            username: user.username 
        });
    } catch (error) {
        console.error("Error logging in user:", error);
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
            res.clearCookie('connect.sid'); // Clear the session cookie
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
        if (!req.session.userId) {
            return res.status(401).json({ 
                success: false,
                message: "Not authenticated" 
            });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: "User not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        console.error("Error checking login status:", error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    checkAdmin,
    logoutUser,
    verifyAdmin,
    checkLogin
};
