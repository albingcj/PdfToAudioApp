# PDF-to-Audio Application

This application converts PDF files into audio using text-to-speech technology.

## Features
- Converts PDF text to speech.
- Combines audio chunks into a single file.
- Provides a downloadable `.wav` file.

## Technologies Used
- Backend: Spring Boot (Java)
- Text-to-Speech: Kokoro (Python)
- Containerization: Docker
- API Communication: HTTP Requests


## Project Structure

- **`backend/`**: Contains backend-related files including configuration and source code.
  - **`.idea/`**: Project-specific settings (e.g., IDE configurations).
  - **`.mvn/`**: Maven-related configuration files (if applicable).
  - **`src/`**: Source code for the backend.
  - **`target/`**: Build output directory (for compiled artifacts).
  - **`Dockerfile`**: Docker configuration for backend service.

- **`frontend/`**: Contains frontend files (Vue.js, etc.). If empty, you can add more details on what this folder is intended for.
  
- **`outputs/`**: Directory for output files (e.g., processed audio, logs, etc.).

- **`python-script/`**: Contains Python-related files.
  - **`Dockerfile`**: Docker configuration for the Python script.
  - **`KokoroScript.py`**: Python script file.
  - **`requirements.txt`**: Dependencies for the Python environment.

---
          
## How to Run
1. Clone the repository:

2. Run the application:  
    - docker-compose up --build
