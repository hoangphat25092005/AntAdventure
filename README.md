# AntAdventure

AntAdventure is a full-stack web application that provides an interactive adventure experience through Vietnam's provinces. The application features user authentication, admin management, feedback systems, and an engaging quiz-based exploration of Vietnamese geography and culture.

## Features

### User Features
- **User Authentication**: Secure login/logout with session management
- **Interactive Province Exploration**: Discover Vietnam's 63 provinces with detailed information
- **Quiz System**: Answer questions about provinces to unlock content
- **Progress Tracking**: Track your exploration progress across different provinces
- **Responsive Design**: Mobile-friendly interface with modern UI/UX

### Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **User Management**: View and manage user accounts
- **Content Management**: Add, edit, and delete province information and questions
- **Feedback Management**: Review and respond to user feedback
- **Analytics**: Track user engagement and progress

### Technical Features
- **Session-based Authentication**: Secure server-side session management
- **Image Upload**: Support for province image uploads with fallback handling
- **RESTful API**: Well-structured backend API endpoints
- **MongoDB Integration**: Robust data storage and management
- **Deployment Ready**: Configured for production deployment on Render

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Fetch API** for HTTP requests
- **XLSX** for Excel file processing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Express Session** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing
- **Nodemailer** for email functionality

## Project Structure

```
AntAdventure/
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── .npmrc                       # NPM configuration
├── GOOGLE_AUTH_SETUP.md         # Google OAuth setup guide
├── package.json                 # Frontend dependencies and scripts
├── README.md                    # Project documentation
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── AntAdventure/               # Legacy directory (contains .env)
│   └── .env                    # Environment file
├── backend/                    # Backend server
│   ├── .env                    # Backend environment variables
│   ├── .env.example           # Backend env template
│   ├── .gitignore             # Backend git ignore
│   ├── App.js                 # Main server configuration
│   ├── package.json           # Backend dependencies
│   ├── config/                # Database and authentication config
│   │   ├── database.js        # MongoDB connection
│   │   └── passport.js        # Authentication strategy
│   ├── controllers/           # Business logic controllers
│   │   ├── user.controller.js
│   │   ├── province.controller.js
│   │   ├── questions.controller.js
│   │   └── feedback.controller.js
│   ├── data/                  # Data files and JSON
│   │   └── provinceDetails.json
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   └── provinceUpload.middleware.js
│   ├── models/               # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── province.model.js
│   │   ├── questions.model.js
│   │   └── feedback.model.js
│   ├── public/               # Static files and uploads
│   │   └── images/
│   │       └── provinces/    # Province images
│   ├── routing/              # API route definitions
│   │   ├── user.routing.js
│   │   ├── province.routing.js
│   │   ├── questions.routing.js
│   │   ├── feedback.routing.js
│   │   └── password.routing.js
│   └── scripts/              # Utility scripts
│       ├── migrateProvinceDetails.js
│       ├── parseExcel.js
│       ├── syncProvinceDetails.js
│       └── generateSampleProvinceDetails.js
├── public/                   # Frontend public assets
│   ├── index.html           # HTML template
│   └── vietnam-provinces.geojson  # Vietnam map data
└── src/                     # Frontend React application
    ├── App.tsx              # Main React component
    ├── config.ts            # Frontend configuration
    ├── custom.d.ts          # TypeScript declarations
    ├── index.tsx            # React entry point
    ├── react-app-env.d.ts   # React TypeScript environment
    ├── testImports.ts       # Import testing utility
    ├── assets/              # Static assets
    │   └── images/          # Image assets
    ├── components/          # Reusable React components
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── LoginForm.tsx
    │   ├── AdminLoginForm.tsx
    │   ├── Navigation.tsx
    │   ├── Map.tsx
    │   ├── Question.tsx
    │   ├── QuestionManager.tsx
    │   ├── ProvinceManager.tsx
    │   ├── ProvinceQuestions.tsx
    │   ├── ProvincePopup.tsx
    │   ├── TalkingAnt.tsx
    │   ├── ImageUpload.tsx
    │   └── map.css
    ├── data/                # Static data files
    │   └── provinceData.ts  # Province static data
    ├── pages/               # Page components
    │   ├── Home.tsx
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── AdminLogin.tsx
    │   ├── AdminRegister.tsx
    │   ├── Performance.tsx
    │   ├── Review.tsx
    │   ├── AboutUs.tsx
    │   ├── MultiChoice.tsx
    │   ├── Feedback.tsx
    │   ├── QuestionManagement.tsx
    │   ├── ProvinceManagement.tsx
    │   ├── Import.tsx
    │   ├── ForgotPasswordPage.tsx
    │   └── ResetPasswordPage.tsx
    └── types/               # TypeScript type definitions
        └── types.ts
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or cloud)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secure_session_secret
   ADMIN_SECRET_KEY=your_admin_registration_key
   EMAIL_USER=your_email_for_password_reset
   EMAIL_PASS=your_email_password_or_app_password
   FRONTEND_URL=http://localhost:3000
   ```

### Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create environment file (if needed):
   ```bash
   cp .env.example .env
   ```

4. Configure Google OAuth (optional):
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

## Usage

### Development

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Production Deployment

The application is configured for deployment on Render or similar platforms:

1. Set up environment variables on your hosting platform
2. Configure build commands:
   - Build command: `npm install && npm run build`
   - Start command: `cd backend && npm start`

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login  
- `POST /api/users/logout` - User logout
- `GET /api/users/check-auth` - Check authentication status
- `GET /api/users/check-admin` - Check admin privileges

### Provinces
- `GET /api/provinces` - Get all provinces
- `GET /api/provinces/:id` - Get specific province
- `POST /api/provinces` - Create province (admin only)
- `PUT /api/provinces/:id` - Update province (admin only)
- `DELETE /api/provinces/:id` - Delete province (admin only)

### Questions
- `GET /api/questions/getAllQuestions` - Get all questions
- `GET /api/questions/getQuestionByProvince/:provinceName` - Get questions for specific province
- `POST /api/questions/addQuestion` - Create question (admin only)
- `PUT /api/questions/updateQuestion/:id` - Update question (admin only)
- `DELETE /api/questions/deleteQuestion/:id` - Delete question (admin only)
- `POST /api/questions/bulkImport` - Bulk import questions from Excel (admin only)
- `DELETE /api/questions/wipe` - Wipe all questions (admin only)
- `DELETE /api/questions/wipe/:provinceName` - Wipe questions for specific province (admin only)

### Feedback
- `GET /api/feedback/getFeedback` - Get all feedback (admin only)
- `POST /api/feedback/addFeedback` - Submit feedback
- `DELETE /api/feedback/deleteFeedback/:id` - Delete feedback (admin only)

### Password Reset
- `POST /api/reset/forgot-password` - Request password reset
- `POST /api/reset/reset-password/:token` - Reset password with token

## Key Features

### Excel Import System
- Import questions from Excel files with structured format
- Support for province-specific question management
- Bulk operations with progress tracking
- Data validation and error handling

### Interactive Map
- Vietnam provinces visualization using Leaflet
- Clickable provinces with detailed information
- Province-specific question navigation
- Responsive design for mobile and desktop

### Admin Management
- Question management with CRUD operations
- Province content management
- User feedback monitoring
- Image upload and management

### Authentication System
- Session-based authentication
- Admin role management
- Password reset functionality
- Google OAuth integration support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Session/Login Issues**: Check CORS configuration and session cookie settings
2. **Image Upload Problems**: Ensure upload directories exist and have proper permissions
3. **Database Connection**: Verify MongoDB connection string and network access
4. **Environment Variables**: Double-check all required environment variables are set
5. **Excel Import Issues**: Verify Excel file format matches expected structure

### Development Tips

- Use the debug endpoints (`/api/health`, `/api/debug-cookies`) to troubleshoot issues
- Check browser console and network tab for frontend errors
- Monitor backend logs for server-side issues
- Use the `/import` route for Excel question management
- Refer to [`GOOGLE_AUTH_SETUP.md`](GOOGLE_AUTH_SETUP.md) for OAuth configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository or contact the development team.