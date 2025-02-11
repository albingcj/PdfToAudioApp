# Base image with Python 3.9
FROM python:3.9-slim

# Install FFmpeg and Python dependencies
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY KokoroScript.py .

# Command to run the Flask app
CMD ["python", "KokoroScript.py"]