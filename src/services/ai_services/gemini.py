import google.generativeai as genai
from litellm import completion
import os

from src.utils.json import extract_json_from_string
from src.utils.logger import logger

GEMINI_API_KEY = os.environ['GEMINI_API_KEY']

SOAP_PROMPT = """You are a medical assistant. Convert the following transcript into a SOAP note format.

Instructions:
From the given transcript, identify the speakers as provider, patient, nurse, family member.
Then generate the SOAP note as a JSON for the given transcript, also mention the time of the conversation from the transcript for each section.


Return only the SOAP sections clearly labeled as:

Subjective:
Objective:
Assessment:
Plan:


Output Format:
{  
    "speaker_label": {
        "<speaker_id>": "<speaker_type>",
    },
    "notes": {
        "Subjective": [
            {
                "note": "Note section/line",
                "timestamps": ["start_time-end_time" {to reference timestamps as given in the transcript }]
            }
        ],
        "Objective": [
            {
                "note": "Note for the objective section/line",
                "timestamps": ["start_time-end_time" {to reference timestamps as given in the transcript }]
            }],
        "Assessment": [
            {
                "note": "Note for the assessment section/line",
                "timestamps": ["start_time-end_time" {to reference timestamps as given in the transcript }]
            }
        ],
        "Plan": [
            {
                "note": "Note for the plan section/line",
                "timestamps": ["start_time-end_time" {to reference timestamps as given in the transcript }]
            }
        ]    
    }
    
}

Ensure the JSON is valid and does not contain any errors. Do not manipulate the timestamps use it as it is, it is important, and will be used to reference the transcript.
"""


def generate_soap_note(transcript):
    logger.info(f"Generating SOAP note for transcript: {transcript}")
    response = completion(
        model="gemini/gemini-2.5-flash-preview-04-17",
        temperature=0.0,
        messages=[
            {"role": "system", "content": SOAP_PROMPT},
            {"role": "user", "content": f"""Transcript:
```{transcript}```"""}]
    )

    print('response', response)
    return extract_json_from_string(response.choices[0].message.content.strip()) or {}
