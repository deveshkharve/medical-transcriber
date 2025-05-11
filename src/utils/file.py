import json
import os
from src.utils.logger import dump_to_file
from src.config.constants import STORAGE_DIR

# ensure base directory exists
BASE_DIR = os.path.join(os.getcwd(), 'storage')
os.makedirs(BASE_DIR, exist_ok=True)


def get_file_name(file_path):
    return os.path.basename(file_path)


def check_file_exists(filename, dir):
    file_path = os.path.join(dir, filename)
    return os.path.exists(file_path)


def store_file(transcript, filename, dir):
    dump_to_file(transcript, filename, dir)
    file_path = os.path.join(dir, filename)
    return file_path


def load_file(filename, dir):
    file_path = os.path.join(dir, filename)

    with open(file_path, 'r') as file:
        transcript = json.load(file)
    return transcript


def store_soap_note(soap_note, filename, dir):
    dump_to_file(soap_note, filename, dir)
    file_path = os.path.join(dir, filename)
    return file_path


def load_soap_note(filename, dir):
    file_path = os.path.join(dir, filename)
    with open(file_path, 'r') as file:
        soap_note = json.load(file)
    return soap_note
