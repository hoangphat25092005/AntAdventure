const express = require('express');
const cors = require("cors");
const connectDB = require("./config/database");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require("path");
const passport = require('./config/passport');
const userRoutes = require("./routing/user.routing");
const feedbackRoutes = require("./routing/feedback.routing");
const questionRoutes = require("./routing/questions.routing");
const provinceRoutes = require("./routing/province.routing");

require("dotenv").config();

const app = express();
connectDB();

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

//Session middleware
app.use(session({
    // should be in .env file 
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
        secure: false, // Disabled for development
        sameSite: 'lax',
        path: '/' // Ensure cookie is available across all paths
    }
})); 

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],  // Allow both localhost and 127.0.0.1
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie"]
}));

// Serve static files from the public directory with CORS headers
app.use('/images', (req, res, next) => {
  // Determine the origin
  const origin = req.headers.origin;
  if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
    res.set('Access-Control-Allow-Origin', origin);
  }
  
  res.set({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Credentials': 'true',
    'Cache-Control': 'public, max-age=31536000' // Cache images for 1 year
  });
  
  // Log image requests for debugging
  console.log(`Image requested: ${req.path}`);
  next();
}, express.static(path.join(__dirname, 'public/images'), {
  maxAge: '1y', // Cache for 1 year
  etag: true,
  fallthrough: true  // Continue to next middleware if file not found
}));

// Fallback route for images
app.use('/images/:type/:filename', (req, res, next) => {
  const { type, filename } = req.params;
  const requestedPath = path.join(__dirname, 'public', 'images', type, filename);
  const fallbackPath = path.join(__dirname, 'public', 'images', 'placeholder.jpg');
  
  fs.access(requestedPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Image not found: ${requestedPath}, using fallback`);
      return res.sendFile(fallbackPath);
    }
    next();
  });
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
app.use('/api/feedback', feedbackRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/provinces', provinceRoutes); // Mount province routes at /api/provinces

// 404 handler
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

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
