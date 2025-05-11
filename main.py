import os
from src.app import app
from dotenv import load_dotenv

load_dotenv()

# === Run the pipeline ===


# from src.services.gcp import transcribe_with_diarization
# from services.whisper import whisper_transcribe

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
