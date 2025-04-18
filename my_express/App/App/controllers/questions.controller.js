const Question = require('../model/questions.model');

//create questions from admin
const createQuestion = async (req, res) => {
    try {
        const { provinceName, questionText, options, correctAnswer, explanation, image } = req.body;
        
        // Parse options string into an array of 4 options
        let optionsArray;
        
        if (typeof options === 'string') {
            // Split by option identifiers (A., B., C., D.)
            const optionsString = options.trim();
            optionsArray = [];
            
            // Use regex to match options with their labels
            const optionRegex = /([A-D]\.)\s*(.*?)(?=(?:[A-D]\.)|$)/gs;
            let match;
            
            while ((match = optionRegex.exec(optionsString)) !== null) {
                optionsArray.push(match[2].trim());
            }
            
            // Ensure we have exactly 4 options
            if (optionsArray.length !== 4) {
                return res.status(400).json({ 
                    message: "Options must contain exactly 4 items (A, B, C, D)", 
                    parsedOptions: optionsArray 
                });
            }
        } else if (Array.isArray(options) && options.length === 4) {
            // If options is already an array of 4 items, use it directly
            optionsArray = options;
        } else {
            return res.status(400).json({ 
                message: "Options must be a string with format: 'A. Option1 B. Option2 C. Option3 D. Option4' or an array of 4 strings" 
            });
        }
        
        const question = new Question({ 
            provinceName, 
            questionText, 
            options: optionsArray, 
            correctAnswer, 
            explanation, 
            image 
        });
        
        await question.save();

        res.status(201).json({ 
            message: "Question added successfully", 
            question,
            parsedOptions: optionsArray 
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
};

//get all questions for client
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find(); //fetch all questions in DB
        res.status(200).json({ questions });
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
};


module.exports = { createQuestion, getAllQuestions };