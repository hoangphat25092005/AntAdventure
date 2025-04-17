//feedback controller
const Feedback = require('../model/feedback.model');
const User = require('../model/user');

//add feedback
const addFeedback = async (req, res) => {
    try {
        const {name, email, message} = req.body;

        const existingEmail = await User.findOne({ email });

        if (!existingEmail) {
            return res.status(400).json({message: "You have to login before sending any feedback!"});
        }

        const feedback = new Feedback({name, email, message});
        await feedback.save();

        res.status(201).json({message: 'Feedback added successfully'});
    } catch (error) {
        res.status(500).json({message: "Failed to add feedback", error: error.message});
    }
};

//get all feedbacks
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({message: "Failed to get feedbacks", error: error.message});
    }
};

module.exports = {addFeedback, getAllFeedbacks};
