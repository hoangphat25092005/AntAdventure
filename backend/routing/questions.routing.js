const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questions.controller');
const { isAdmin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes - anyone can view questions
router.get('/getAllQuestions', questionController.getAllQuestions);
router.get('/getQuestionByProvince/:provinceName', questionController.getQuestionByProvince);

// Admin routes - protected, only admin can manage questions
router.post('/addQuestion', isAdmin, upload.single('image'), questionController.addQuestion);
router.put('/updateQuestion/:id', isAdmin, upload.single('image'), questionController.updateQuestion);
router.delete('/deleteQuestion/:id', isAdmin, questionController.deleteQuestion);

router.post('/bulkImport', isAdmin, questionController.bulkImport);

// Wipe all questions
router.delete('/wipe', isAdmin, questionController.wipeAllQuestions);

// Wipe questions for specific province
router.delete('/wipe/:provinceName', isAdmin, questionController.wipeProvinceQuestions);
module.exports = router;