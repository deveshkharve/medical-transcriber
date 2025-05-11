from flask_cors import CORS
from src.config.constants import AUDIO_DIR
from flask import Flask, request
from flask import request
import os
# from werkzeug.utils import secure_filename
from src.services.transcriber import generate_soap_note_from_audio

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes

# Initialize CORS with default parameters to allow all origins, methods, and headers
CORS(app, resources={r"/*": {"origins": "*", "methods": [
     "GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": "*"}})


@app.route('/health', methods=['GET'])
def health_check():
    return {"status": "healthy"}


@app.route('/generate-note', methods=['POST'])
def generate_soap_note():
    if 'file' not in request.files:
        return {"error": "No file part"}, 400

    file = request.files['file']
    if file.filename == '':
        return {"error": "No selected file"}, 400

    # Create audio directory if it doesn't exist
    audio_dir = os.path.join(os.getcwd(), AUDIO_DIR)
    os.makedirs(audio_dir, exist_ok=True)

    # Save the file
    filename = file.filename
    file_path = os.path.join(audio_dir, filename)
    file.save(file_path)

    # file_path = "./audio/aws-bp-30.mp3"
    return generate_soap_note_from_audio(file_path)
