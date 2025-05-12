

import os
import time
import requests

from src.config.constants import AUDIO_DIR, TRANSCRIPT_DIR
from src.utils.file import check_file_exists, get_file_name, load_file, store_file
from src.utils.logger import dump_to_file, logger
from src.utils.audio import clear_audio_files, convert_to_mp3, convert_to_wav


def upload_audio(file_path, api_key):
    headers = {'authorization': api_key}
    with open(file_path, 'rb') as f:
        response = requests.post('https://api.assemblyai.com/v2/upload',
                                 headers=headers,
                                 files={'file': f})
    return response.json()['upload_url']


def request_transcription(audio_url, api_key):
    endpoint = "https://api.assemblyai.com/v2/transcript"
    json_data = {
        "audio_url": audio_url,
        "speaker_labels": True,
        "language_code": "en_us",
        "punctuate": True,
        "format_text": True
    }

    headers = {
        "authorization": api_key,
        "content-type": "application/json"
    }

    response = requests.post(endpoint, json=json_data, headers=headers)
    return response.json()["id"]


def wait_for_completion(transcript_id, api_key):
    polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
    headers = {'authorization': api_key}

    while True:
        response = requests.get(polling_endpoint, headers=headers)
        status = response.json()["status"]
        if status == "completed":
            return response.json()
        elif status == "error":
            raise Exception("Transcription failed:", response.json())
        time.sleep(5)


def print_speaker_transcript(transcript_json):
    transcript = ''
    for utterance in transcript_json.get("utterances", []):
        speaker = utterance["speaker"]
        text = utterance["text"]
        # print(f"{speaker}: {text}")
        transcript += f"speaker_{speaker}: {text} [{utterance['start']} - {utterance['end']}]\n"

    return transcript


def assembly_transcribe(audio_path):
    api_key = os.getenv("ASSEMBLY_AI_API_KEY")
    url = upload_audio(audio_path, api_key)
    tid = request_transcription(url, api_key)
    result = wait_for_completion(tid, api_key)
    transcript = print_speaker_transcript(result)
    dump_to_file({'transcript': transcript,  'transcript_json': result})

    return {'transcript': transcript,  'transcript_json': result}


def generate_transcript_data(audio_file):

    if not audio_file.endswith(".mp3"):
        audio_file_name = f"{get_file_name(audio_file)}.mp3"
        audio_file = convert_to_mp3(
            audio_file, audio_file_name, AUDIO_DIR)

    logger.info(f"Transcribing audio file: {audio_file}")

    # audio_file = clear_audio_files(audio_file)
    transcript_data = assembly_transcribe(audio_file)

    filename = get_file_name(audio_file)
    store_file(transcript_data, f"{filename}.json", TRANSCRIPT_DIR)

    return transcript_data


def load_transcript_data(audio_file):
    filename = get_file_name(audio_file)
    transcript_data = load_file(f"{filename}.json", TRANSCRIPT_DIR)

    return transcript_data


def generate_transcript(audio_file):
    filename = f'{get_file_name(audio_file)}.json'
    if check_file_exists(filename, TRANSCRIPT_DIR):
        data = load_file(filename, TRANSCRIPT_DIR)
        transcript_data = print_speaker_transcript(data['transcript_json'])
        res_data = {'transcript': transcript_data,
                    'transcript_json': data['transcript_json']}
        store_file({'transcript': transcript_data,
                    'transcript_json': data['transcript_json']}, filename, TRANSCRIPT_DIR)
        return res_data
    else:
        return generate_transcript_data(audio_file)
