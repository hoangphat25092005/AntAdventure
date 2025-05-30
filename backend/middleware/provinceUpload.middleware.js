const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the provinces images directory exists
const provincesDir = path.join(__dirname, '../public/images/provinces');
fs.mkdirSync(provincesDir, { recursive: true });

// Configure storage for province images
// Configure storage for province images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Saving file to:', provincesDir);
        cb(null, provincesDir);
    },
    filename: function (req, file, cb) {
        // Use the province ID from the request params only for PUT requests, 
        // or from the body for POST requests
        let provinceId;
        if (req.method === 'PUT') {
            provinceId = req.params.id;
        } else {
            provinceId = req.body.id || req.body.provinceId;
        }

        // Validate province ID format (should be 1-2 digits)
        if (!provinceId || !/^\d{1,2}$/.test(provinceId)) {
            return cb(new Error('Valid province ID is required (1-2 digits)'));
        }
        
        // Ensure province ID is padded to 2 digits for consistency
        provinceId = provinceId.padStart(2, '0');
        
        // Get file extension while preserving the original extension case
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error('Only .jpg, .jpeg, .png, and .gif files are allowed'));
        }
        
        // Create filename using province ID with timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8); // 6 character random string
        const filename = `province_${provinceId}_${timestamp}_${randomString}${ext}`;
        console.log('📝 Generated filename:', filename);
        
        // Clean up old images for this province using exact 2-digit ID matching
        const filePattern = new RegExp(`^province_${provinceId}(?:_\\d+_[a-z0-9]+|\\.\\w+)$`);
        console.log('🔍 Looking for files matching pattern:', filePattern);
        
        const existingFiles = fs.readdirSync(provincesDir);
        console.log('📂 Found files in directory:', existingFiles);
        let existingFilesRemoved = 0;
        
        for (const existingFile of existingFiles) {
            if (filePattern.test(existingFile)) {
                try {
                    const filePath = path.join(provincesDir, existingFile);
                    fs.unlinkSync(filePath);
                    existingFilesRemoved++;
                    console.log('🗑️ Removed old image:', existingFile);
                } catch (err) {
                    console.error('❌ Error removing old file:', err);
                }
            }
        }
        
        if (existingFilesRemoved > 0) {
            console.log(`♻️ Cleaned up ${existingFilesRemoved} old image(s) for province ${provinceId}`);
        }

        cb(null, filename);
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create multer instance for province images
const provinceUpload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
}).single('image'); // Configure to expect a single file with field name 'image'

// Wrapper function to handle multer errors
const handleProvinceUpload = (req, res, next) => {
    provinceUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    message: 'File too large. Maximum size is 5MB.' 
                });
            }
            return res.status(400).json({ 
                message: `Upload error: ${err.message}` 
            });
        } else if (err) {
            return res.status(400).json({ 
                message: err.message || 'Error uploading file' 
            });
        }
        
        // If no file was uploaded
        if (!req.file) {
            // Only return error if this is a file upload request
            if (req.headers['content-type']?.includes('multipart/form-data')) {
                return res.status(400).json({ 
                    message: 'Please select a file to upload' 
                });
            }
        }
        
        next();
    });
};

module.exports = handleProvinceUpload;
