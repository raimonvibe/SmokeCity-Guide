# Render Deployment Instructions for SmokeCity

## Overview
This project requires a full-stack deployment with both Node.js backend and static frontend.

## Deployment Steps

### 1. Backend Web Service
1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Use these settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free

### 2. Environment Variables
Add these environment variables in Render dashboard:
- `ACRCLOUD_HOST`: Your ACRCloud host (e.g., identify-eu-west-1.acrcloud.com)
- `ACRCLOUD_ACCESS_KEY`: Your ACRCloud access key
- `ACRCLOUD_ACCESS_SECRET`: Your ACRCloud access secret
- `NODE_ENV`: production

### 3. Frontend Integration
The frontend is served by the backend using `express.static('.')` middleware.
Access your app at the backend service URL.

### 4. File Upload Directory
Render will automatically create the `uploads/` directory for temporary audio files.

## Testing
1. Open your Render service URL
2. Navigate to `/play.html`
3. Click the microphone button and grant permissions
4. Test audio recognition functionality

## Notes
- Backend serves both API endpoints and static files
- CORS is configured for cross-origin requests
- Audio files are temporarily stored and cleaned up after processing
