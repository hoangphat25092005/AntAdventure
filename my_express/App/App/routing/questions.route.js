const express = require('express');
const router = express.Router();
const { createQuestion, getAllQuestions } = require('../controllers/questions.controller');

//admin creates questions
router.post('/createQuestions', createQuestion);

//client gets all questions
router.get("/getallQuestions", getAllQuestions);

module.exports = router;

