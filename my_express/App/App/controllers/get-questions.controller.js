const Question = require('../model/questions.model');
const User = require('../model/user'); // optional: in case you want to store/check user info

const getQuestionByIndex = async (req, res) => {
    const { index, selected, username } = req.body;

    if (username != User.findOne()) {
        return res.status(400).json({ message: "Can't find username in DB!" });
    } 

    if (index === undefined || !selected) {
        return res.status(400).json({ message: "Missing required fields: index, selected, or username." });
    }

    try {
        const questions = await Question.find().sort({ createdAt: 1 });

        if (index >= questions.length) {
            return res.status(404).json({ message: "Invalid question index" });
        }

        const currentQuestion = questions[index];
        const isCorrect = selected === currentQuestion.correctAnswer;

        const response = {
            username,
            selected,
            correctAnswer: currentQuestion.correctAnswer,
            explanation: currentQuestion.explanation,
            correct: isCorrect,
            message: isCorrect ? "Correct!" : "Incorrect."
        };

        //check logic

        if (isCorrect) {
            const nextIndex = index + 1;
            if (nextIndex < questions.length) {
                response.nextIndex = nextIndex;
                response.nextQuestion = questions[nextIndex];
            } else {
                response.message = "Correct! Quiz completed.";
                response.nextQuestion = null;
            }
        }

        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({ message: "Error checking answer", error: err.message });
    }
};

module.exports = { getQuestionByIndex }

