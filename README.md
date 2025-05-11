# Medical Transcription Application

This application provides a platform for recording, transcribing, and analyzing medical conversations. It automatically generates SOAP notes from transcriptions and highlights relevant sections.

## Features

- Audio recording and file upload
- Automatic transcription with speaker diarization
- SOAP notes generation
- Interactive transcript viewer
- Timestamp-based navigation

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- FFmpeg
- uv (Python package manager)

## Setup Guide

### 1. Install FFmpeg

FFmpeg is required for audio processing.

#### macOS:

```bash
brew install ffmpeg
```

#### Windows:

```bash
winget install ffmpeg
```

#### Linux:

```bash
sudo apt update
sudo apt install ffmpeg
```

### 2. Install Python Dependencies

```bash
# Install uv if you haven't already
pip install uv

# Create and activate virtual environment
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
uv pip install -r requirements.txt
```

### 3. Install Node.js Dependencies

```bash
# Navigate to the frontend directory
cd app-frontend

# Install dependencies
npm install
```

## Running the Application

### Setup Environment Variables

Create a `.env` file in the root directory and add the following keys:

```bash
ASSEMBLY_AI_API_KEY=""
GEMINI_API_KEY=""
```

### Start the Backend Server

```bash
# Activate virtual environment if not already activated
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Start the server
uv run main.py
```

### Start the Frontend Development Server

```bash
# In a new terminal, navigate to the frontend directory
cd app-frontend

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Recording Audio**

   - Click the "Start Recording" button to begin recording
   - Speak clearly into your microphone
   - Click "Stop Recording" when finished

2. **Uploading Audio**

   - Click the "Upload Audio" button
   - Select an audio file from your device
   - Wait for the upload to complete

3. **Viewing Transcriptions**

   - After recording or uploading, the transcription will appear automatically
   - Use the interactive transcript viewer to navigate through the conversation
   - Click on timestamps to jump to specific parts of the audio

4. **SOAP Notes**
   - The system automatically generates SOAP notes from the transcription
   - Review and edit the generated notes as needed
   - Export the notes in your preferred format

## Troubleshooting

### Common Issues

1. **Audio Recording Not Working**

   - Ensure microphone permissions are granted in your browser
   - Check if another application is using the microphone
   - Try refreshing the page

2. **Transcription Issues**

   - Ensure the audio quality is good
   - Check if the language is supported
   - Verify the audio file format is supported

3. **Server Connection Issues**
   - Ensure the backend server is running
   - Check if the correct ports are being used
   - Verify your network connection

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
