const Question = require('../model/questions.model');

//create questions from admin
const createQuestion = async (req, res) => {
    try {
        const { provinceName, questionText, options, correctAnswer, explanation, image } = req.body;
        const question = new Question({ provinceName, questionText, options, correctAnswer, explanation, image });
        await question.save();

        res.status(201).json({ message: "Question added successfully", question });
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
};

//get all questions fro client
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find(); //fetch all questions in DB
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
};


module.exports = { createQuestion, getAllQuestions };
