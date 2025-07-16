# SmokeCity Music Platform

A fullstack music streaming platform with audio recognition capabilities using ACRCloud.

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Get ACRCloud API credentials from [ACRCloud Console](https://console.acrcloud.com/)
5. Update `.env` file with your ACRCloud credentials
6. Start the backend server: `node server.js`
7. Open `index.html` in a web browser or serve the frontend files

## Features

- Music streaming interface
- Audio recognition using ACRCloud API
- User authentication (login/signup)
- Trending songs and albums display
- Music player with audio recognition

## API Endpoints

- `POST /recognize` - Audio recognition endpoint that accepts audio files and returns song information

## Requirements

- Node.js
- ACRCloud API credentials (free tier available)
- Modern web browser with microphone access
