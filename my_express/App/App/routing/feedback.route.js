//feedback route

const express = require('express');
const router = express.Router();
const {addFeedback, getAllFeedbacks} = require('../controllers/feedback.controller');

//add feedback
router.post('/feedback', addFeedback);

//get all feedbacks
router.get('/feedbacks', getAllFeedbacks);

module.exports = router;
