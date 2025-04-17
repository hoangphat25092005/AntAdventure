const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },

    image: {
        type: String,
    },

    options: [{
        type: String,
        required: true
    }],

    correctAnswer: {
        type: String,
        required: true
    },

    explanation: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model('Question', QuestionSchema);

