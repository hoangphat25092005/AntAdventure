const ProvinceDetails = require('../models/province.model');
const path = require('path');
const fs = require('fs');

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
        // Support both id and provinceId for compatibility
        const { id, provinceId, name, introduction, famousFor, attractions } = req.body;
        
        // Use provinceId if provided, otherwise fall back to id
        const effectiveProvinceId = provinceId || id;
        
        // Handle file upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/images/provinces/${req.file.filename}`;
        }
        
        // Parse JSON strings if they come from form data
        const parsedFamousFor = typeof famousFor === 'string' ? JSON.parse(famousFor) : famousFor;
        const parsedAttractions = typeof attractions === 'string' ? JSON.parse(attractions) : attractions;
        
        // Validate required fields
        if (!effectiveProvinceId || !name || !introduction || !parsedFamousFor || !parsedAttractions) {
            return res.status(400).json({ message: "All fields except image are required" });
        }        // Validate arrays
        if (!Array.isArray(parsedFamousFor) || parsedFamousFor.length === 0) {
            return res.status(400).json({ message: "Famous features are required" });
        }
        if (!Array.isArray(parsedAttractions) || parsedAttractions.length === 0) {
            return res.status(400).json({ message: "Attractions are required" });
        }

        // Try to find an existing province by provinceId first, then by id
        let province = await ProvinceDetails.findOne({ provinceId: effectiveProvinceId }) || 
                        await ProvinceDetails.findOne({ id: effectiveProvinceId });

        if (province) {
            // Update existing province
            province.provinceId = effectiveProvinceId;
            province.id = effectiveProvinceId; // For backward compatibility
            province.name = name;
            province.introduction = introduction;
            if (imageUrl) {
                province.imageUrl = imageUrl;
            }
            province.famousFor = parsedFamousFor;
            province.attractions = parsedAttractions;
            await province.save();
            
            return res.status(200).json({ 
                message: "Province updated successfully",
                success: true,
                updated: true,
                province
            });
        } else {
            // Create new province
            const newProvince = new ProvinceDetails({
                provinceId: effectiveProvinceId,
                id: effectiveProvinceId, // For backward compatibility
                name,
                introduction,
                imageUrl,
                famousFor: parsedFamousFor,
                attractions: parsedAttractions
            });
            await newProvince.save();
            
            return res.status(201).json({ 
                message: "Province added successfully",
                success: true,
                updated: false,
                province: newProvince
            });
        }
    } catch (error) {
        console.error('Error adding/updating province:', error);
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