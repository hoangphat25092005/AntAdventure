const fs = require('fs');
const path = require('path');

// Define the paths
const uploadsDir = path.join(__dirname, '../public/uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');

// Create directories if they don't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    console.log('Created avatars directory');
}

// Log success
console.log('Upload directories setup completed!');
