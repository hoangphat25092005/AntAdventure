const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        // i want the username from the user model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
    }, 

    feedback: {
        type: String,
        required: true,
        trim: true,
    }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;