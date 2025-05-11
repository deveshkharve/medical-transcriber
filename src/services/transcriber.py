
from src.config.constants import SOAP_NOTE_DIR
from src.services.ai_services.gemini import generate_soap_note
from src.services.ai_services.assembly import generate_transcript
from src.utils.file import check_file_exists, get_file_name, load_file, store_file
from src.utils.logger import logger


def generate_soap_note_from_audio(audio_file):
    try:
        logger.info(f"Generating SOAP note from audio file: {audio_file}")
        transcript_data = generate_transcript(audio_file)

        notes_res = {}

        filename = f'{get_file_name(audio_file)}.json'
        if check_file_exists(filename, SOAP_NOTE_DIR):
            logger.info(f"Loading SOAP note from file: {filename}")
            notes_res = load_file(filename, SOAP_NOTE_DIR)
        else:
            logger.info(
                f"Generating SOAP note from transcript: {transcript_data['transcript']}")
            notes_res = generate_soap_note(transcript_data['transcript'])
            store_file(notes_res, filename, SOAP_NOTE_DIR)

        # speaker_labels = notes_res['speaker_label']
        notes_res['transcript'] = transcript_data['transcript_json']
        return notes_res
    except Exception as e:
        logger.error(f"Error generating SOAP note from audio file: {e}")
        return {"error": str(e)}, 500
