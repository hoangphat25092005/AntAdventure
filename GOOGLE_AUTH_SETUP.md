# Google OAuth Setup for AntVenture

This document explains how to set up Google OAuth for the AntVenture application.

## Prerequisites

1. Google Cloud Platform account with OAuth 2.0 credentials
2. Node.js and npm installed

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add these authorized redirect URIs:
   - `http://localhost:3001/api/users/auth/google/callback` (development)
   - Your production callback URL when deployed
7. Copy the Client ID and Client Secret

### 2. Configure Environment Variables

Backend (.env file):
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
FRONTEND_URL=http://localhost:3000
```

Frontend (.env file):
```
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
```

### 3. Start the Application

1. Start the backend server: `cd backend && npm run dev`
2. Start the frontend server: `npm start`

## How it Works

1. User clicks "Sign in with Google" on the login page
2. They're redirected to Google's authentication page
3. After successful authentication, Google redirects back to your backend
4. Backend creates or updates the user record and establishes a session
5. User is redirected to the frontend with authentication complete

## Troubleshooting

- Make sure the redirect URIs exactly match what you've configured in Google Cloud Console
- Check that environment variables are correctly set in both frontend and backend
- Ensure the Google OAuth API is enabled for your project in Google Cloud Console
