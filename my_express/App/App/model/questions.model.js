const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    provinceName: {
        type: String,
        required: [true, 'Province name is required for each question'],
        index: true
    },

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
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
