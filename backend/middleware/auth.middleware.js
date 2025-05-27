const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ 
                message: "Please log in to perform this action",
                code: "NOT_AUTHENTICATED"
            });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ 
                message: "User not found. Please log in again",
                code: "USER_NOT_FOUND"
            });
        }

        // Add user info to request object
        req.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ 
            message: "An error occurred while checking authentication",
            code: "SERVER_ERROR"
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ 
                message: "Please log in as an admin to perform this action",
                code: "NOT_AUTHENTICATED"
            });
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({ 
                message: "User not found. Please log in again",
                code: "USER_NOT_FOUND"
            });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                message: "You do not have permission to perform this action. Only admins can manage questions.",
                code: "NOT_AUTHORIZED"
            });
        }

        // Add user info to request object for easy access in route handlers
        req.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ 
            message: "An error occurred while checking permissions",
            code: "SERVER_ERROR"
        });
    }
};

module.exports = {
    isAdmin,
    authenticateToken
};