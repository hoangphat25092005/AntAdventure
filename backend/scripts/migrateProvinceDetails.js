// This script migrates province details from the frontend to the MongoDB database
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const ProvinceDetails = require('../models/province.model');

// Read the province details file
const provinceDetailsPath = path.join(__dirname, '..', 'data', 'provinceDetails.json');
const provinceDetails = JSON.parse(fs.readFileSync(provinceDetailsPath, 'utf8'));

const connectDB = require('../config/database');

async function migrateProvinceDetails() {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log('Connected to MongoDB');

        // Clear existing province details
        await ProvinceDetails.deleteMany({});
        console.log('Cleared existing province details');

        // Convert provinceDetails object to array of documents
        const provinceDocuments = Object.entries(provinceDetails).map(([id, details]) => ({
            provinceId: id,
            name: details.name,
            introduction: details.introduction,
            imageUrl: details.imageUrl,
            famousFor: details.famousFor,
            attractions: details.attractions
        }));

        // Insert all province details
        await ProvinceDetails.insertMany(provinceDocuments);
        console.log('Successfully migrated province details to MongoDB');

        // Verify the data
        const count = await ProvinceDetails.countDocuments();
        console.log(`Verified ${count} provinces in database`);

    } catch (error) {
        console.error('Error migrating province details:', error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        console.log('Closed MongoDB connection');
    }
}

migrateProvinceDetails();