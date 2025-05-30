const ProvinceDetails = require('../models/province.model');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
//Get all province details
const getAllProvinces = async (req, res) => {
    try {
        const provinces = await ProvinceDetails.find();
        res.status(200).json(provinces);
    } catch (error) {
        console.error('Error fetching provinces:', error);
        res.status(500).json({ message: 'Error fetching provinces' });
    }
};

//Get province by ID
const getProvinceById = async (req, res) => {
    try {
        const provinceId = req.params.id;
        // First try with provinceId field for compatibility with frontend
        let province = await ProvinceDetails.findOne({ provinceId });
        
        // If not found, try with id field (older format)
        if (!province) {
            province = await ProvinceDetails.findOne({ id: provinceId });
        }
        
        if (!province) {
            // If no province is found, check provinceDetails.json
            try {
                const provinceDetailsPath = path.join(__dirname, '..', 'data', 'provinceDetails.json');
                const provinceDetails = JSON.parse(fs.readFileSync(provinceDetailsPath, 'utf8'));
                if (provinceDetails[provinceId]) {
                    // Create a new province document from the JSON data with provinceId field
                    const newProvince = new ProvinceDetails({
                        provinceId: provinceId,
                        id: provinceId, // Keep id for backward compatibility
                        ...provinceDetails[provinceId]
                    });
                    await newProvince.save();
                    return res.status(200).json(newProvince);
                }
            } catch (jsonError) {
                console.error('Error reading from provinceDetails.json:', jsonError);
            }
            return res.status(404).json({ message: 'Province not found' });
        }
        
        // If province has id but not provinceId, add provinceId for frontend compatibility
        if (province.id && !province.provinceId) {
            province.provinceId = province.id;
            await province.save();
        }
        
        res.status(200).json(province);
    } catch (error) {
        console.error('Error fetching province:', error);
        res.status(500).json({ message: 'Error fetching province' });
    }
};

//Add or update province with image
const addProvince = async (req, res) => {
    try {
        console.log('📝 Processing province update request:', {
            body: req.body,
            file: req.file ? {
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            } : 'No file uploaded'
        });

        // Support both id and provinceId for compatibility
        const { id, provinceId } = req.body;
        
        // Use provinceId if provided, otherwise fall back to id
        const effectiveProvinceId = provinceId || id;

        if (!effectiveProvinceId) {
            return res.status(400).json({ message: "Province ID is required" });
        }

        // Try to find an existing province first
        let province = await ProvinceDetails.findOne({ provinceId: effectiveProvinceId }) || 
                      await ProvinceDetails.findOne({ id: effectiveProvinceId });
        
        if (!province) {
            try {
                // If province not found in database, check provinceDetails.json
                const provinceDetailsPath = path.join(__dirname, '..', 'data', 'provinceDetails.json');
                let initialData = {};
                
                try {
                    const provinceDetails = JSON.parse(fs.readFileSync(provinceDetailsPath, 'utf8'));
                    if (provinceDetails[effectiveProvinceId]) {
                        initialData = provinceDetails[effectiveProvinceId];
                    }
                } catch (jsonError) {
                    console.warn('Could not read provinceDetails.json:', jsonError);
                }                // Create a new province document with default values
                province = new ProvinceDetails({
                    provinceId: effectiveProvinceId,
                    id: effectiveProvinceId,
                    name: req.body.name || initialData.name || `Province ${effectiveProvinceId}`,
                    introduction: req.body.introduction || initialData.introduction || '',
                    famousFor: req.body.famousFor ? JSON.parse(req.body.famousFor) : (initialData.famousFor || []),
                    attractions: req.body.attractions ? JSON.parse(req.body.attractions) : (initialData.attractions || [])
                });

                console.log('Creating new province with data:', province);
                await province.save();
                console.log('✨ Created new province record:', effectiveProvinceId);
            } catch (error) {
                console.error('Error creating new province:', error);
                return res.status(500).json({ message: "Error creating province record" });
            }
        }

        // Handle file upload
    // Handle file upload
    if (req.file) {
    console.log('🖼️ Processing uploaded file:', req.file);
    
    // Use the traditional filesystem path format
    const filesystemImageUrl = `/images/provinces/${req.file.filename}`;
    
    // If there's an existing image, try to remove it
    if (province.imageUrl) {
        try {
            // Extract filename from existing URL
            const existingFilename = province.imageUrl.split('/').pop();
            if (existingFilename) {
                // For compatibility with previous filesystem storage
                const oldImagePath = path.join(__dirname, '../public/images/provinces', existingFilename);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                    console.log('🗑️ Removed old image file from filesystem:', oldImagePath);
                }
                
                // Also try to remove from MongoDB GridFS if it exists there
                try {
                    const db = mongoose.connection.db;
                    const bucket = new GridFSBucket(db, { bucketName: 'images' });
                    
                    // Find the file ID first
                    const file = await db.collection('images.files').findOne({ filename: existingFilename });
                    if (file) {
                        await bucket.delete(file._id);
                        console.log('🗑️ Removed old image file from GridFS:', existingFilename);
                    }
                } catch (gridfsErr) {
                    console.error('❌ Error removing old image from GridFS:', gridfsErr);
                }
            }
        } catch (err) {
            console.error('❌ Error removing old image file:', err);
        }
    }
    
    // Store the filesystem URL (not MongoDB URL)
    province.imageUrl = filesystemImageUrl;
    console.log('🔄 Updated image URL to filesystem path:', province.imageUrl);
    }


        // Process other fields if they are provided
        if (req.body.name) province.name = req.body.name;
        if (req.body.introduction) province.introduction = req.body.introduction;
        if (req.body.famousFor) {
            try {
                const parsedFamousFor = typeof req.body.famousFor === 'string' ? 
                    JSON.parse(req.body.famousFor) : req.body.famousFor;
                if (Array.isArray(parsedFamousFor)) {
                    province.famousFor = parsedFamousFor;
                }
            } catch (error) {
                console.error('Error parsing famousFor:', error);
            }
        }
        if (req.body.attractions) {
            try {
                const parsedAttractions = typeof req.body.attractions === 'string' ? 
                    JSON.parse(req.body.attractions) : req.body.attractions;
                if (Array.isArray(parsedAttractions)) {
                    province.attractions = parsedAttractions;
                }
            } catch (error) {
                console.error('Error parsing attractions:', error);
            }
        }

        await province.save();
        
        return res.status(200).json({ 
            message: "Province updated successfully",
            success: true,
            updated: true,
            province
        });
    } catch (error) {
        console.error('Error updating province:', error);
        res.status(500).json({ message: 'Error saving province' });
    }
};

//Delete province
const deleteProvince = async (req, res) => {
    try {
        const id = req.params.id;
        // Try to delete by provinceId first, then by id if not found
        const province = await ProvinceDetails.findOneAndDelete({ provinceId: id }) || 
                          await ProvinceDetails.findOneAndDelete({ id });
        
        if (!province) {
            return res.status(404).json({ message: 'Province not found' });
        }
        
        // Clean up the image file if it exists
        if (province.imageUrl) {
            try {
                const imagePath = path.join(__dirname, '../public', province.imageUrl);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('🗑️ Removed image file during province deletion:', imagePath);
                }
            } catch (error) {
                console.error('Error removing image file during province deletion:', error);
            }
        }
        
        res.status(200).json({ message: 'Province deleted successfully' });
    } catch (error) {
        console.error('Error deleting province:', error);
        res.status(500).json({ message: 'Error deleting province' });
    }
};

module.exports = {
    getAllProvinces,
    getProvinceById,
    addProvince,
    deleteProvince
};