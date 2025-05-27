const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

//create feedback
router.post('/addFeedback', authenticateToken, feedbackController.addFeedback);

//get feedback
router.get('/getFeedback', authenticateToken, feedbackController.getFeedback);

//delete feedback
router.delete('/deleteFeedback/:id', authenticateToken, feedbackController.deleteFeedback);

module.exports = router;