/**
 * Script to sync province details between AntAdventure and main backend
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/antadventure');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Import the province model
const ProvinceDetails = require('../models/province.model');

// Function to sync province details
const syncProvinceDetails = async () => {
  try {
    // Define paths to both JSON files
    const mainBackendPath = path.join(__dirname, '..', 'data', 'provinceDetails.json');
    const antAdventureBackendPath = path.join(__dirname, '..', '..', 'AntAdventure', 'backend', 'data', 'provinceDetails.json');
    
    // Read JSON files
    let mainData = {};
    let antAdventureData = {};
    
    try {
      if (fs.existsSync(mainBackendPath)) {
        mainData = JSON.parse(fs.readFileSync(mainBackendPath, 'utf8'));
        console.log(`Read ${Object.keys(mainData).length} provinces from main backend`);
      }
    } catch (err) {
      console.error('Error reading main backend province data:', err);
    }
    
    try {
      if (fs.existsSync(antAdventureBackendPath)) {
        antAdventureData = JSON.parse(fs.readFileSync(antAdventureBackendPath, 'utf8'));
        console.log(`Read ${Object.keys(antAdventureData).length} provinces from AntAdventure backend`);
      }
    } catch (err) {
      console.error('Error reading AntAdventure backend province data:', err);
    }
    
    // Merge data, preferring AntAdventure data if duplicates
    const mergedData = { ...mainData, ...antAdventureData };
    
    // Save to main backend
    fs.writeFileSync(mainBackendPath, JSON.stringify(mergedData, null, 2));
    console.log(`Saved ${Object.keys(mergedData).length} province details to main backend`);
    
    // Now update MongoDB with the merged data
    const existingProvinces = await ProvinceDetails.find();
    const existingIds = new Set(existingProvinces.map(p => p.provinceId || p.id));
    
    console.log(`Found ${existingIds.size} existing provinces in database`);
    
    // Array to track operations
    const operations = [];
    
    // Process each province in merged data
    for (const [id, provinceData] of Object.entries(mergedData)) {
      if (!existingIds.has(id)) {
        // Create new province
        const newProvince = new ProvinceDetails({
          provinceId: id,
          id: id, // For backward compatibility
          name: provinceData.name,
          introduction: provinceData.introduction,
          imageUrl: provinceData.imageUrl,
          famousFor: provinceData.famousFor,
          attractions: provinceData.attractions
        });
        
        await newProvince.save();
        operations.push(`Created province ${id} - ${provinceData.name}`);
      } else {
        // Update existing province
        const province = await ProvinceDetails.findOne({ 
          $or: [{ provinceId: id }, { id: id }]
        });
        
        if (province) {
          province.provinceId = id;
          province.id = id;
          province.name = provinceData.name;
          province.introduction = provinceData.introduction;
          
          // Only update imageUrl if it exists in the JSON
          if (provinceData.imageUrl) {
            province.imageUrl = provinceData.imageUrl;
          }
          
          province.famousFor = provinceData.famousFor;
          province.attractions = provinceData.attractions;
          
          await province.save();
          operations.push(`Updated province ${id} - ${provinceData.name}`);
        }
      }
    }
    
    // Copy images from AntAdventure to main backend
    const sourceImagesDir = path.join(__dirname, '..', '..', 'AntAdventure', 'backend', 'public', 'images', 'provinces');
    const targetImagesDir = path.join(__dirname, '..', 'public', 'images', 'provinces');
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetImagesDir)) {
      fs.mkdirSync(targetImagesDir, { recursive: true });
    }
    
    if (fs.existsSync(sourceImagesDir)) {
      const images = fs.readdirSync(sourceImagesDir);
      for (const image of images) {
        const sourcePath = path.join(sourceImagesDir, image);
        const targetPath = path.join(targetImagesDir, image);
        
        if (!fs.existsSync(targetPath)) {
          fs.copyFileSync(sourcePath, targetPath);
          operations.push(`Copied image ${image}`);
        }
      }
    }
    
    console.log('\nSync operations summary:');
    operations.forEach(op => console.log(`- ${op}`));
  } catch (error) {
    console.error('Error in syncProvinceDetails:', error);
  } finally {
    mongoose.disconnect();
    console.log('Database connection closed');
  }
};

// Run the process
console.log('Starting province details sync...');
connectDB()
  .then(syncProvinceDetails)
  .catch(err => {
    console.error('Error in sync process:', err);
    mongoose.disconnect();
  });
