// Handle Google login callback
const googleCallback = (req, res) => {
    try {
        if (!req.user) {
            console.error('No user data from Google authentication');
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
        }
        
        // User information is available in req.user
        req.session.userId = req.user._id;
        console.log('✅ Google auth successful for user:', req.user.username);
        
        // Redirect to frontend with success
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}?loginSuccess=true`);
    } catch (error) {
        console.error("Error in Google auth callback:", error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
};

// Export the controller functions
module.exports = {
    googleCallback
};
