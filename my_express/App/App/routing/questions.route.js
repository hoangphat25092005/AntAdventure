const router = require('express').Router();
const questionController = require('../controllers/questions.controller');
const get_questionController = require('../controllers/get-questions.controller');

router.post('/create-question', questionController.createQuestion)
router.post('/check-question', get_questionController.getQuestionByIndex)
module.exports = router
