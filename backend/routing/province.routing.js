const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/province.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Set up error handling for upload
const handleUpload = upload.single('image');

// Ensure the provinces directory exists
const fs = require('fs');
const path = require('path');
const provincesDir = path.join(__dirname, '..', 'public', 'images', 'provinces');
if (!fs.existsSync(provincesDir)) {
    fs.mkdirSync(provincesDir, { recursive: true });
}

// Public routes
router.get('/', provinceController.getAllProvinces);
router.get('/:id', provinceController.getProvinceById);

// Admin routes (protected)
router.post('/', authenticateToken, (req, res, next) => {
    handleUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, provinceController.addProvince);

router.put('/:id', authenticateToken, (req, res, next) => {
    handleUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, provinceController.addProvince);  // reuse addProvince as it handles both create and update

router.delete('/:id', authenticateToken, provinceController.deleteProvince);

module.exports = router;