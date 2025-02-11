from flask import Flask, request, jsonify
import os
import logging
from kokoro import KPipeline
import soundfile as sf
import subprocess

app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

@app.route('/generate', methods=['POST'])
def generate_audio():
    """
    Generate audio from the given text chunk.
    """
    data = request.json
    text = data.get("text")
    chunk_index = data.get("chunk_index")

    logger.info("Input text received: %s", text)
    logger.info("Chunk index: %s", chunk_index)

    # Initialize the pipeline with American English (lang_code='a')
    pipeline = KPipeline(lang_code='a')
    output_dir = "/app/output"
    os.makedirs(output_dir, exist_ok=True)
    try:
        # Generate audio
        generator = pipeline(
            text,
            voice='af_heart',  # Default voice
            speed=1,           # Normal speed
            split_pattern=r'\n+'  # Split text by newlines
        )
        # Save each audio segment as a .wav file
        for i, (_, _, audio) in enumerate(generator):
            filename = f'output_{i}_chunk{chunk_index}.wav'
            output_file = os.path.join(output_dir, filename)
            sf.write(output_file, audio, 24000)  # Save at 24kHz sample rate
            logger.info("Saved: %s", output_file)
        return jsonify({"status": "success", "message": "Audio generated successfully"}), 200
    except Exception as e:
        logger.error("Error generating audio: %s", e, exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/combine', methods=['POST'])
def combine_audio_files():
    """
    Combine all .wav files in the output directory into a single file and delete the individual chunks.
    """
    data = request.json
    uuid = data.get("uuid")
    output_dir = "/app/output"

    # List all .wav files in the output directory
    files = [f for f in os.listdir(output_dir) if f.startswith("output_") and f.endswith(".wav")]
    files.sort()  # Sort files by name

    if not files:
        logger.error("No audio files found to combine.")
        return jsonify({"status": "error", "message": "No audio files found to combine"}), 400

    # Create the FFmpeg command
    inputs = []
    for file in files:
        inputs.extend(["-i", os.path.join(output_dir, file)])
    output_file = os.path.join(output_dir, f"{uuid}_combined_output.wav")
    command = ["ffmpeg", "-y"] + inputs + ["-filter_complex", f"concat=n={len(files)}:v=0:a=1", output_file]

    try:
        # Run the FFmpeg command
        subprocess.run(command, check=True)
        logger.info("Combined audio files into: %s", output_file)

        # Delete the individual chunk files
        for file in files:
            file_path = os.path.join(output_dir, file)
            try:
                os.remove(file_path)
                logger.info("Deleted chunk file: %s", file_path)
            except Exception as e:
                logger.error("Failed to delete chunk file: %s. Error: %s", file_path, e)

        return jsonify({"status": "success", "message": "Audio files combined successfully"}), 200
    except subprocess.CalledProcessError as e:
        logger.error("Error combining audio files: %s", e)
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
