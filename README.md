# PDF-to-Audio Converter

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)

A robust application that converts PDF documents into audio files using text-to-speech technology. Built with Spring Boot and Python's Kokoro TTS engine.

## Features

- PDF text extraction and processing
- Text-to-speech conversion using Kokoro
- Audio chunk combination
- Downloadable WAV file output
- Containerized deployment

## Technology Stack

- Backend: Spring Boot (Java)
- Text-to-Speech: Kokoro (Python)
- Containerization: Docker
- Communication: HTTP REST API

## Project Structure

```
.
├── backend/ # Spring Boot application
│ ├── src/ # Source code
│ ├── Dockerfile # Backend container configuration
│ └── pom.xml # Maven dependencies
├── python-script/ # Python TTS service
│ ├── Dockerfile # Python container configuration
│ ├── KokoroScript.py # TTS implementation
│ └── requirements.txt # Python dependencies
└── test.py # API testing script
└── docker-compose.yml
```

## Prerequisites

- Docker and Docker Compose
- Java 11 or higher
- Maven (optional, wrapper included)

## Installation & Running

1. Clone the repository:
```bash
git clone https://github.com/albingcj/PdfToAudioApp.git
cd pdf-to-audio
```

2. Build the Maven project:
```bash
cd .\backend
.\mvnw clean package
```

3. Start the application:
```bash
docker-compose up --build
```

## Testing

Use the included `test.py` script to test the endpoint:
```bash
python test.py
```
This will send a sample PDF to the service and receive the audio response.