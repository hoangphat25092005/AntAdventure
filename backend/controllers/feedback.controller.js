const Feedback = require('../models/feedback.model.js');
const User = require('../models/user.model.js');

// Utility function to verify session
const verifySession = async (userId) => {
    if (!userId) {
        throw new Error('No session found');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Invalid session');
    }
    return user;
};

//add feedback
const addFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const userId = req.session.userId;

        // Verify session and get user
        const user = await verifySession(userId);
        
        // Validate feedback content
        if (!feedback) {
            return res.status(400).json({message: "Feedback is required"});
        }
        if (feedback.trim().length < 10) {
            return res.status(400).json({message: "Feedback must be at least 10 characters long"});
        }
        if (feedback.trim().length > 1000) {
            return res.status(400).json({message: "Feedback cannot exceed 1000 characters"});
        }

        const newFeedback = new Feedback({
            user: user._id, // Using verified user
            feedback: feedback.trim()
        });
        await newFeedback.save();
        
        return res.status(201).json({
            message: "Feedback added successfully",
            success: true,
            feedback: {
                id: newFeedback._id,
                username: user.username,
                feedback: newFeedback.feedback,
                createdAt: newFeedback._id.getTimestamp()
            }
        });
    } catch (error) {
        console.error("Error adding feedback:", error);
        if (error.message === 'No session found') {
            return res.status(401).json({message: "Please login to submit feedback"});
        }
        if (error.message === 'Invalid session') {
            return res.status(401).json({message: "Session expired, please login again"});
        }
        return res.status(500).json({message: "Internal server error", error: error.message});
    } 
};

//get feedback
const getFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .populate('user', 'username')
            .sort({ _id: -1 }); // Get newest feedback first

        if (!feedback || feedback.length === 0) {
            return res.status(404).json({message: "No feedback found"});
        }

        return res.status(200).json({
            feedback: feedback.map(f => ({
                id: f._id,
                username: f.user.username,
                feedback: f.feedback,
                createdAt: f._id.getTimestamp()
            })),
            success: true
        });
    } catch (error) {
        console.error("Error getting feedback:", error);
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
};

//delete feedback
const deleteFeedback = async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const userId = req.session.userId;

        // Verify session and get user
        const user = await verifySession(userId);

        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({message: "Feedback not found"});
        }

        // Check if the user is the owner of the feedback
        if (feedback.user.toString() !== user._id.toString()) {
            return res.status(403).json({message: "You can only delete your own feedback"});
        }

        await Feedback.findByIdAndDelete(feedbackId);
        return res.status(200).json({message: "Feedback deleted successfully", success: true});
    } catch (error) {
        console.error("Error deleting feedback:", error);
        if (error.message === 'No session found') {
            return res.status(401).json({message: "Please login to delete feedback"});
        }
        if (error.message === 'Invalid session') {
            return res.status(401).json({message: "Session expired, please login again"});
        }
        return res.status(500).json({message: "Internal server error", error: error.message});
    }
};

module.exports = {
    addFeedback,
    getFeedback,
    deleteFeedback
};