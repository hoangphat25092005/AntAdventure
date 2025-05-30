const Question = require('../models/questions.model');
const path = require('path');
const fs = require('fs');

// Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.json(questions);
    } catch (error) {
        console.error('Error fetching all questions:', error);
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
};

// Get questions by province name
const getQuestionByProvince = async (req, res) => {
    try {
        const { provinceName } = req.params;
        
        // Validate province name
        if (!provinceName || typeof provinceName !== 'string') {
            return res.status(400).json({ 
                message: "Invalid province name",
                provinceName 
            });
        }

        // Format province name to handle URL-encoded strings
        const formattedProvinceName = decodeURIComponent(provinceName.trim());
        
        // Use case-insensitive regex to find the province
        const questions = await Question.aggregate([
            { 
                $match: { 
                    provinceName: { 
                        $regex: new RegExp('^' + formattedProvinceName + '$', 'i') 
                    } 
                }
            },
            { $sample: { size: 10 } }
        ]);
        
        if (questions.length === 0) {
            return res.status(404).json({ 
                message: `No questions found for province "${formattedProvinceName}"`,
                provinceName: formattedProvinceName
            });
        }

        // Get total questions for this province using the same case-insensitive match
        const totalQuestions = await Question.countDocuments({ 
            provinceName: { 
                $regex: new RegExp('^' + formattedProvinceName + '$', 'i') 
            }
        });
        
        res.json({
            questions,
            total: totalQuestions,
            selected: questions.length
        });
    } catch (error) {
        console.error('Error fetching questions for province:', error);
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
};

// Add new question
const addQuestion = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);
        
        const { provinceName, question, options, correctAnswer } = req.body;
        
        // Validate required fields
        if (!provinceName || !question || !options) {
            console.log('Missing required fields:', { provinceName, question, options, correctAnswer });
            return res.status(400).json({ 
                message: "Missing required fields",
                received: { provinceName, question, options, correctAnswer }
            });
        }

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/images/${req.file.filename}`;  // Changed to relative URL
        }

        let parsedOptions;
        try {
            // Parse options if it's a string
            parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
            
            // Validate options array
            if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
                return res.status(400).json({ 
                    message: "Options must be an array with exactly 4 items",
                    received: parsedOptions 
                });
            }
        } catch (parseError) {
            console.error('Error parsing options:', parseError);
            return res.status(400).json({ 
                message: "Invalid options format",
                error: parseError.message
            });
        }

        const correctAnswerNum = parseInt(correctAnswer);
        if (isNaN(correctAnswerNum) || correctAnswerNum < 0 || correctAnswerNum > 3) {
            return res.status(400).json({ 
                message: "Correct answer must be a number between 0 and 3",
                received: correctAnswer 
            });
        }

        // Create new question
        const newQuestion = new Question({
            provinceName,
            question,
            options: parsedOptions,
            correctAnswer: correctAnswerNum,
            image: imageUrl || null
        });

        await newQuestion.save();
        console.log('Question saved successfully:', newQuestion);
        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: "Error adding question", error: error.message });
    }
};

// Update question
const updateQuestion = async (req, res) => {
    try {
        console.log('Update request body:', req.body);
        console.log('Update request file:', req.file);
        
        const { provinceName, question, options, correctAnswer } = req.body;
        const { id } = req.params;

        if (!provinceName || !question || !options) {
            return res.status(400).json({ 
                message: "Missing required fields",
                received: { provinceName, question, options, correctAnswer }
            });
        }

        let parsedOptions;
        try {
            parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
            if (!Array.isArray(parsedOptions) || parsedOptions.length !== 4) {
                return res.status(400).json({ 
                    message: "Options must be an array with exactly 4 items",
                    received: parsedOptions 
                });
            }
        } catch (parseError) {
            return res.status(400).json({ 
                message: "Invalid options format",
                error: parseError.message
            });
        }

        const correctAnswerNum = parseInt(correctAnswer);
        if (isNaN(correctAnswerNum) || correctAnswerNum < 0 || correctAnswerNum > 3) {
            return res.status(400).json({ 
                message: "Correct answer must be a number between 0 and 3",
                received: correctAnswer 
            });
        }

        const updateData = {
            provinceName,
            question,
            options: parsedOptions,
            correctAnswer: correctAnswerNum
        };

        if (req.file) {
            updateData.image = `/images/${req.file.filename}`;  // Changed to relative URL
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        console.log('Question updated successfully:', updatedQuestion);
        res.json({ message: "Question updated successfully", question: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: "Error updating question", error: error.message });
    }
};

// Delete question
const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question", error: error.message });
    }
};
const bulkImport = async (req, res) => {
    try {
        const { questions } = req.body;
        
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ 
                message: "Invalid input: questions must be a non-empty array"
            });
        }

        // Validate all questions before inserting
        const validQuestions = [];
        const invalidQuestions = [];
        
        for (const q of questions) {
            // Basic validation checks
            if (!q.provinceName || !q.question || 
                !Array.isArray(q.options) || q.options.length !== 4 ||
                typeof q.correctAnswer !== 'number' || 
                q.correctAnswer < 0 || q.correctAnswer > 3) {
                invalidQuestions.push(q);
                continue;
            }
            
            // All options must have text
            if (q.options.some(opt => {
                // Check if option exists and is a valid string
                if (!opt && opt !== 0 && opt !== '') return true;
                
                // Convert non-string values to strings
                const optStr = String(opt);
                return optStr.trim() === '';
            })) {
                invalidQuestions.push(q);
                continue;
            }
            
            validQuestions.push({
                provinceName: q.provinceName,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                ...(q.image ? { image: q.image } : {})
            });
        }

        if (validQuestions.length === 0) {
            return res.status(400).json({ 
                message: "No valid questions to import",
                invalidCount: invalidQuestions.length
            });
        }

        // Insert validated questions
        const result = await Question.insertMany(validQuestions);
        
        res.status(201).json({ 
            message: "Questions imported successfully", 
            inserted: result.length,
            total: questions.length,
            invalid: invalidQuestions.length
        });
    } catch (error) {
        console.error('Error bulk importing questions:', error);
        res.status(500).json({ 
            message: "Error importing questions", 
            error: error.message 
        });
    }
};

// Wipe all questions
const wipeAllQuestions = async (req, res) => {
    try {
        const result = await Question.deleteMany({});
        res.status(200).json({
            message: `${result.deletedCount} questions deleted successfully`
        });
    } catch (error) {
        console.error('Error wiping questions:', error);
        res.status(500).json({
            message: "Error wiping questions",
            error: error.message
        });
    }
};

// Wipe questions for specific province
const wipeProvinceQuestions = async (req, res) => {
    try {
        const { provinceName } = req.params;
        if (!provinceName) {
            return res.status(400).json({
                message: "Province name is required"
            });
        }
        
        const result = await Question.deleteMany({ provinceName });
        res.status(200).json({
            message: `${result.deletedCount} questions deleted for province "${provinceName}"`
        });
    } catch (error) {
        console.error('Error wiping province questions:', error);
        res.status(500).json({
            message: "Error wiping province questions",
            error: error.message
        });
    }
};

module.exports = {
    getAllQuestions,
    getQuestionByProvince,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    bulkImport,
    wipeAllQuestions,
    wipeProvinceQuestions
};