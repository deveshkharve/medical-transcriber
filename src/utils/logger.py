import json
import os
import logging
from logging.handlers import RotatingFileHandler
import sys
import uuid

# Configure the logger


class Logger:
    def __init__(self, name="audio-transcription", log_level=logging.INFO):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(log_level)
        self.logger.propagate = False

        # Clear any existing handlers
        if self.logger.handlers:
            self.logger.handlers.clear()

        # Create formatters
        console_formatter = logging.Formatter('%(levelname)s: %(message)s')
        file_formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s')

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(console_formatter)
        self.logger.addHandler(console_handler)

        # File handler
        log_dir = os.path.join(os.path.dirname(
            os.path.dirname(__file__)), 'logs')
        os.makedirs(log_dir, exist_ok=True)
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, 'app.log'),
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(file_formatter)
        self.logger.addHandler(file_handler)

    def debug(self, message):
        self.logger.debug(message)

    def info(self, message):
        self.logger.info(message)

    def warning(self, message):
        self.logger.warning(message)

    def error(self, message):
        self.logger.error(message)

    def critical(self, message):
        self.logger.critical(message)


# Create a default logger instance
logger = Logger().logger


def dump_to_file(text, filename=uuid.uuid4().hex, dir='logs'):
    """
    Dumps text content to a file in the logs directory.

    Args:
        text (str): The text content to write to the file
        filename (str): Name of the file to create (default: output.txt)

    Returns:
        str: Path to the created file
    """

    if isinstance(text, dict):
        text = json.dumps(text, indent=4)
    # Get the logs directory path (same as used in Logger class)
    log_dir = dir or 'logs'
    os.makedirs(log_dir, exist_ok=True)

    # Create full file path
    file_path = os.path.join(log_dir, filename)

    # Write content to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(text)

    logger.info(f"Content dumped to {file_path}")
    return file_path
