/**
 * Utility to generate sample province details for testing
 */
const fs = require('fs');
const path = require('path');

// Sample data - replace with real data for production
const sampleProvinceDetails = {
  "01": {
    "name": "Hà Nội",
    "introduction": "Hanoi, the capital of Vietnam, is known for its centuries-old architecture and a rich culture with Southeast Asian, Chinese and French influences. At its heart is the chaotic Old Quarter, where the narrow streets are roughly arranged by trade.",
    "imageUrl": "/images/provinces/01.jpg",
    "famousFor": [
      "Old Quarter",
      "Hoan Kiem Lake",
      "Temple of Literature",
      "Vietnamese cuisine"
    ],
    "attractions": [
      "Hoan Kiem Lake",
      "Temple of Literature",
      "Thang Long Imperial Citadel",
      "Ho Chi Minh Mausoleum",
      "Hanoi Old Quarter"
    ]
  },
  "02": {
    "name": "Hồ Chí Minh",
    "introduction": "Ho Chi Minh City (commonly known as Saigon) is a city in southern Vietnam famous for the pivotal role it played in the Vietnam War. It's also known for its French colonial landmarks, including Notre-Dame Cathedral, made entirely of materials imported from France.",
    "imageUrl": "/images/provinces/02.jpg",
    "famousFor": [
      "Cu Chi Tunnels",
      "War Remnants Museum",
      "Bustling city life",
      "Modern skyscrapers"
    ],
    "attractions": [
      "Ben Thanh Market",
      "War Remnants Museum",
      "Cu Chi Tunnels",
      "Notre-Dame Cathedral Basilica of Saigon",
      "Independence Palace"
    ]
  },
  "04": {
    "name": "Đà Nẵng",
    "introduction": "Da Nang is a coastal city in central Vietnam known for its sandy beaches and history as a French colonial port. It's a popular base for visiting the inland Bà Nà hills, the Marble Mountains, and the atmospheric UNESCO heritage town of Hoi An.",
    "imageUrl": "/images/provinces/04.jpg",
    "famousFor": [
      "Golden Bridge",
      "Dragon Bridge",
      "Beautiful beaches",
      "Marble Mountains"
    ],
    "attractions": [
      "My Khe Beach",
      "Dragon Bridge",
      "Marble Mountains",
      "Ba Na Hills",
      "Son Tra Peninsula"
    ]
  },
  "58": {
    "name": "An Giang",
    "introduction": "An Giang is a province in the Mekong Delta region of Vietnam. It shares a border with Cambodia and is known for its natural beauty, with mountains, rivers, and diverse cultural heritage influenced by Khmer, Cham, and Vietnamese traditions.",
    "imageUrl": "/images/provinces/58.jpg",
    "famousFor": [
      "Cam Mountain",
      "Tra Su Melaleuca Forest",
      "Floating markets",
      "Cham culture"
    ],
    "attractions": [
      "Cam Mountain",
      "Tra Su Melaleuca Forest",
      "Sam Mountain",
      "Cham Villages",
      "Chau Doc Floating Market"
    ]
  }
};

// Path to save the data
const dataDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(dataDir, 'provinceDetails.json');

// Create directory if it doesn't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read existing file if it exists
let existingData = {};
try {
  if (fs.existsSync(outputFile)) {
    existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    console.log(`Read ${Object.keys(existingData).length} existing province details.`);
  }
} catch (error) {
  console.error('Error reading existing data:', error);
}

// Merge existing data with sample data, prioritizing existing data
const mergedData = { ...sampleProvinceDetails, ...existingData };

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2));
console.log(`Saved ${Object.keys(mergedData).length} province details to ${outputFile}`);

// Create placeholder images for any provinces that don't have images
const provincesDir = path.join(__dirname, '..', 'public', 'images', 'provinces');
if (!fs.existsSync(provincesDir)) {
  fs.mkdirSync(provincesDir, { recursive: true });
}

// Copy placeholder image for provinces without images
const placeholderImage = path.join(__dirname, '..', 'public', 'images', 'placeholder.jpg');
if (!fs.existsSync(placeholderImage)) {
  console.log('Placeholder image not found. Please create one at:', placeholderImage);
} else {
  // For each province in the merged data, check if image exists
  Object.keys(mergedData).forEach(provinceId => {
    const expectedImagePath = path.join(provincesDir, `${provinceId}.jpg`);
    if (!fs.existsSync(expectedImagePath)) {
      try {
        fs.copyFileSync(placeholderImage, expectedImagePath);
        console.log(`Created placeholder image for province ${provinceId}`);
      } catch (error) {
        console.error(`Error creating placeholder for province ${provinceId}:`, error);
      }
    }
  });
}

console.log('Province details generation complete!');
