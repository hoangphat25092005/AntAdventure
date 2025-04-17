const Question = require('../model/questions.model');

const createQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswer, explanation, image } = req.body;
        const question = new Question({ questionText, options, correctAnswer, explanation, image });
        await question.save();

        res.status(201).json({ message: "Question added successfully", question });
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
};




module.exports = {createQuestion}
