# PDF-to-Audio Converter

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue.svg)](https://www.docker.com/)

A robust application that converts PDF documents into audio files using text-to-speech technology. Built with Spring Boot, Next.js, and Python's Kokoro TTS engine.

## Features

- PDF text extraction and processing
- Text-to-speech conversion using Kokoro (Python)
- Chunked audio merging into a final WAV file
- Downloadable audio output
- Containerized deployment with Docker

## Technology Stack

- Backend: Spring Boot (Java)
- Frontend: Next.js (TypeScript)
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
├── frontend/ # Next.js application
│ ├── app/ # Pages and components
│ ├── components/ # Shared UI components
│ ├── Dockerfile # Frontend container configuration
│ └── package.json # NPM dependencies
├── python-script/ # Python TTS service
│ ├── Dockerfile # Python container configuration
│ ├── KokoroScript.py # TTS implementation
│ └── requirements.txt # Python dependencies
├── outputs/ # Generated audio files
├── docker-compose.yml # Orchestrates multi-container setup
├── test.py # API testing script
└── README.md # Project documentation
```

(Optional) You can visualize the architecture with Mermaid:
```mermaid
flowchart LR
A[User] --> B[Frontend Next.js]
B --> C[Spring Boot Backend]
C --> D[Python TTS Kokoro]
D --> C
C --> B
```

## Prerequisites

- Docker and Docker Compose installed
- Java 11 or higher installed
- Maven (optional, Maven wrapper included)
- Python 3.8+ (optional, if you plan to run KokoroScript.py directly)

## Installation & Running

1. Clone the repository:
```bash
git clone https://github.com/albingcj/PdfToAudioApp.git
cd PdfToAudioApp
```

2. (Optional) Build the backend Maven project locally:
```bash
cd backend
./mvnw clean package
cd ..
```

3. Start services with Docker Compose:
```bash
docker-compose up --build
```

This command will build and spin up the containers for the Spring Boot backend, Python TTS service, and (optionally) the front-end, all orchestrated by Docker Compose.

## Testing

Use the provided test script to verify the endpoint:
```bash
python test.py
```
This script sends a sample PDF file to the service and retrieves the generated audio response. Make sure you have Python installed or run the script within a Python container if needed.
