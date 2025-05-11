
from utils.logger import dump_to_file
import services.ai_services.whisper as whisper
from pydub import AudioSegment
from resemblyzer import VoiceEncoder, preprocess_wav
import numpy as np
import tempfile

# ========== CONFIG ==========
SEGMENT_DURATION = 5  # in seconds
NUM_SPEAKERS = 2      # or leave dynamic
# ============================


def segment_audio(audio_path, segment_length=SEGMENT_DURATION):
    audio = AudioSegment.from_file(audio_path)
    duration_ms = len(audio)
    segments = []

    for i in range(0, duration_ms, segment_length * 1000):
        segment = audio[i:i + segment_length * 1000]
        temp_path = tempfile.mktemp(suffix=".wav")
        segment.export(temp_path, format="wav")
        segments.append((i / 1000, temp_path))  # (start_time in sec, path)

    return segments


def extract_speaker_embeddings(segments, encoder):
    embeddings = []
    for start_sec, path in segments:
        wav = preprocess_wav(path)
        embed = encoder.embed_utterance(wav)
        embeddings.append((start_sec, embed))
    return embeddings


def cluster_embeddings(embeddings, num_speakers=NUM_SPEAKERS):
    from sklearn.cluster import KMeans
    X = np.array([e[1] for e in embeddings])
    kmeans = KMeans(n_clusters=num_speakers).fit(X)
    return [(embeddings[i][0], kmeans.labels_[i]) for i in range(len(embeddings))]


def transcribe_audio(audio_path, model_size="base"):
    model = whisper.load_model(model_size)
    result = model.transcribe(audio_path, fp16=False)
    return result["segments"]


def label_transcript_with_speakers(transcript, speaker_labels):
    labeled_output = []
    for segment in transcript:
        start_time = segment["start"]
        closest = min(speaker_labels, key=lambda x: abs(x[0] - start_time))
        speaker = closest[1]
        text = segment["text"]
        labeled_output.append(f"Speaker {speaker + 1}: {text.strip()}")
    return labeled_output


def whisper_transcribe(audio_path):
    print("📁 Segmenting audio...")
    segments = segment_audio(audio_path)

    print("🧠 Extracting speaker embeddings...")
    encoder = VoiceEncoder()
    embeddings = extract_speaker_embeddings(segments, encoder)

    print("🔀 Clustering speakers...")
    speaker_labels = cluster_embeddings(embeddings)

    print("📝 Transcribing with Whisper...")
    transcript = transcribe_audio(audio_path)

    print("🎙 Labeling speakers...")
    labeled_transcript = label_transcript_with_speakers(
        transcript, speaker_labels)

    dump_to_file({'transcript': transcript,
                 'labeled_transcript': labeled_transcript})
    for line in labeled_transcript:
        print(line)

    return labeled_transcript
