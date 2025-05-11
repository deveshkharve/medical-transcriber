import os
import ffmpeg


def convert_to_wav(input_path, output_file_name, dir):
    try:
        file_path = os.path.join(dir, output_file_name)
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.output(stream, file_path, ac=1, ar=16000)
        ffmpeg.run(stream, overwrite_output=True, quiet=True)
        return file_path
    except ffmpeg.Error as e:
        print("FFmpeg error:", e.stderr.decode())
        raise


def convert_to_mp3(input_path, output_file_name, dir):
    try:
        file_path = os.path.join(dir, output_file_name)
        stream = ffmpeg.input(input_path)
        stream = ffmpeg.output(stream, file_path, acodec="libmp3lame")
        ffmpeg.run(stream, overwrite_output=True, quiet=True)
        return file_path
    except ffmpeg.Error as e:
        print("FFmpeg error:", e.stderr.decode())
        raise
