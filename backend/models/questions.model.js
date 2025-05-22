const mongoose = require ('mongoose');

const questionSchema = new mongoose.Schema({
    provinceName: {
        type: String,
        required: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    }, 
    image: {
        type: String,
        required: false, // Making it optional
        trim: true
    },
    options: {
        type: [String],
        required: true,
        validate: [arrayLimit, '{PATH} must have exactly 4 options']
    },
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    }
}, {
    timestamps: true
});

function arrayLimit(val) {
    return val.length === 4;
}

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;