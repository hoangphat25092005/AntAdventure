// Handle Google login callback
const googleCallback = (req, res) => {
    try {
        // User information is available in req.user
        req.session.userId = req.user._id;
        
        // Redirect to frontend with success
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?loginSuccess=true`);
    } catch (error) {
        console.error("Error in Google auth callback:", error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?loginError=true`);
    }
};

// Export the controller functions
module.exports = {
    googleCallback
};
