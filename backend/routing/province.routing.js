const express = require('express');
const router = express.Router();
const provinceController = require('../controllers/province.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const handleProvinceUpload = require('../middleware/provinceUpload.middleware');

// Public routes
router.get('/', provinceController.getAllProvinces);
router.get('/:id', provinceController.getProvinceById);

// Admin routes (protected)
router.post('/', authenticateToken, (req, res, next) => {
    // FIX: handleUpload is not defined - should be handleProvinceUpload
    handleProvinceUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, provinceController.addProvince);

router.put('/:id', authenticateToken, handleProvinceUpload, provinceController.addProvince);

router.delete('/:id', authenticateToken, provinceController.deleteProvince);

module.exports = router;