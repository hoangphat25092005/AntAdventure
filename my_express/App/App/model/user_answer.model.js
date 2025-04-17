const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    selectedAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    points: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

// Pre-save middleware to update points when answer is correct
userAnswerSchema.pre('save', function(next) {
    if (this.isCorrect) {
        this.points = 1;
    }
    next();
});

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

module.exports = UserAnswer;
