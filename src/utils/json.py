import json
import re
from venv import logger


def extract_json_from_string(input_string):
    if input_string is None:
        return None
    try:
        json_ob = json.loads(input_string)
        return json_ob
    except Exception as e:
        logger.warning(
            f"Failed to parse JSON directly: {e}. Trying regex extraction.")
        my_json_regex = r".*?```json\n?([\s\S]*?)\n?```.*"

        # Perform the regex match
        match = re.match(my_json_regex, input_string, re.DOTALL)

        if match:
            # If there's a match, return the content of the capturing group
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError as json_error:
                logger.error(
                    f"Unable to parse JSON string after regex extraction: {json_error}")
                # Raise the exception so it can be caught by the calling function
                raise json.JSONDecodeError(f"Failed to parse JSON after regex extraction: {json_error.msg}",
                                           json_error.doc, json_error.pos)
        else:
            # No JSON found in the string, raise an exception
            raise ValueError("No valid JSON found in the input string")
