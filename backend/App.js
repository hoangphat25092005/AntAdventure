const express = require('express');
const cors = require("cors");
const connectDB = require("./config/database");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require("path");
const fs = require('fs');
const passport = require('./config/passport');
const userRoutes = require("./routing/user.routing");
const feedbackRoutes = require("./routing/feedback.routing");
const questionRoutes = require("./routing/questions.routing");
const provinceRoutes = require("./routing/province.routing");
const passwordRoutes = require("./routing/password.routing");

require("dotenv").config();

const app = express();
connectDB();

// Body parser middleware (set up first)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update CORS settings to accept requests from your frontend domain
app.use(cors({
    origin: function (origin, callback) {
        // Allow same-origin requests (when origin is undefined)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = process.env.NODE_ENV === 'production' 
            ? [
                'https://antadventure.onrender.com',
                'https://antadventure.onrender.com', // Add your actual frontend URL
                /^https:\/\/.*\.onrender\.com$/ // Allow all onrender.com subdomains
              ]
            : [
                'http://localhost:3000',
                'http://127.0.0.1:3000'
              ];
        
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}));


// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60, // Session TTL (1 day)
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Cross-site cookies in production
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined // Allow subdomain cookies
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Ensure upload directories exist
const ensureDir = (dirPath) => {
    const fullPath = path.join(__dirname, 'public', dirPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
};

ensureDir('images/provinces');
ensureDir('uploads/provinces');

// Set up static file serving with proper headers
app.use('/images', express.static(path.join(__dirname, 'public/images'), {
    setHeaders: (res, path, stat) => {
        // req is not available in this function
        // We can't access req.headers.origin here
        
        res.set({
            'Cache-Control': 'public, max-age=31536000',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Accept',
            'Access-Control-Allow-Credentials': 'true'
        });
        
        // Log image requests for debugging
        console.log(`Image requested: ${path}`);
    }
}));

// Serve province images with fallback
// Improve province images serving with better fallback logic
app.get('/images/provinces/:filename', (req, res) => {
  const filename = req.params.filename;
  const provincesDir = path.join(__dirname, 'public/images/provinces');
  
  // The exact file path requested
  const exactPath = path.join(provincesDir, filename);
  
  // Try to find the file directly
  if (fs.existsSync(exactPath)) {
    return res.sendFile(exactPath);
  }
  
  // If not found directly, try to extract province ID from filename
  let provinceId;
  
  // Case 1: filename is "province_XX_timestamp_random.ext"
  const patternWithTimestamp = /^province_(\d{1,2})_\d+_[a-z0-9]+\.[a-z]+$/i;
  const matchWithTimestamp = filename.match(patternWithTimestamp);
  
  // Case 2: filename is "province_XX.ext"
  const patternSimple = /^province_(\d{1,2})\.[a-z]+$/i;
  const matchSimple = filename.match(patternSimple);
  
  // Case 3: filename is just "XX.ext"
  const patternId = /^(\d{1,2})\.[a-z]+$/i;
  const matchId = filename.match(patternId);
  
  if (matchWithTimestamp) {
    provinceId = matchWithTimestamp[1].padStart(2, '0');
  } else if (matchSimple) {
    provinceId = matchSimple[1].padStart(2, '0');
  } else if (matchId) {
    provinceId = matchId[1].padStart(2, '0');
  }
  
  if (provinceId) {
    console.log(`🔍 Looking for any image file for province ID: ${provinceId}`);
    
    // Read the directory
    const files = fs.readdirSync(provincesDir);
    
    // Find any file that matches this province ID with any format
    const provincePattern = new RegExp(`^(province_)?${provinceId}(_\\d+_[a-z0-9]+)?\\.[a-z]+$`, 'i');
    const matchingFile = files.find(file => provincePattern.test(file));
    
    if (matchingFile) {
      console.log(`✅ Found matching file: ${matchingFile}`);
      return res.sendFile(path.join(provincesDir, matchingFile));
    }
  }
  
  // If all else fails, use placeholder
  console.log(`❌ No image found for: ${filename}, using fallback`);
  return res.status(404).json({ message: 'Image not found' });
});

// Debug route to check if server is running
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'Server is running',
        session: req.session,
        sessionID: req.sessionID,
        userId: req.session.userId || null,
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Special route to check province images
app.get('/api/check-province-images', async (req, res) => {
    try {
        const provincesDir = path.join(__dirname, 'public', 'images', 'provinces');
        
        if (!fs.existsSync(provincesDir)) {
            return res.status(404).json({ 
                status: 'warning', 
                message: 'Province images directory does not exist' 
            });
        }
        
        const files = fs.readdirSync(provincesDir);
        
        // Get all provinces from DB
        const ProvinceDetails = require('./models/province.model');
        const provinces = await ProvinceDetails.find({}, { provinceId: 1, name: 1, imageUrl: 1 });
        
        // Check which provinces have image files
        const provinceImages = {};
        provinces.forEach(province => {
            const id = province.provinceId || province.id;
            const expectedFiles = [
                `${id}.jpg`, 
                `${id}.png`, 
                `${id}.jpeg`
            ];
            
            provinceImages[id] = {
                name: province.name,
                hasImage: expectedFiles.some(file => files.includes(file)),
                dbImageUrl: province.imageUrl || null
            };
        });
        
        res.status(200).json({
            status: 'success',
            imageDirectory: provincesDir,
            fileCount: files.length,
            files: files,
            provinces: provinceImages
        });
    } catch (error) {
        console.error('Error checking province images:', error);
        res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/reset', passwordRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/provinces', provinceRoutes);

// 404 handler for API routes - FIXED VERSION (Option 4)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.log(`404 API: ${req.method} ${req.url}`);
        return res.status(404).json({ message: 'API route not found' });
    }
    next();
});

// Serve static files from the React frontend app if in production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../build')));

  // Handle React routing, return all requests to React app
  // This MUST be the last route
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
} else {
  // Development 404 handler
  app.use((req, res) => {
      console.log(`404: ${req.method} ${req.url}`);
      res.status(404).json({ message: 'Route not found' });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    console.error('Stack:', err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Add this after your other routes
const { GridFSBucket } = require('mongodb');