import requests

BASE_URL = 'http://localhost:8080'

def upload_pdf(file_path):
    url = f"{BASE_URL}/upload"
    with open(file_path, 'rb') as pdf_file:
        files = {'file': (file_path, pdf_file, 'application/pdf')}
        response = requests.post(url, files=files)
        data = response.json()
        print("Upload Response:", data)
        return data.get("uuid")

def get_text(uuid):
    url = f"{BASE_URL}/getText/{uuid}"
    response = requests.get(url)
    data = response.json()
    print("Get Text Response:", data)
    return data

def text_to_speech(uuid):
    url = f"{BASE_URL}/textToSpeech/{uuid}"
    response = requests.post(url)
    data = response.json()
    print("Text-to-Speech Response:", data)
    return data

def download_audio(uuid, output_file):
    url = f"{BASE_URL}/download/{uuid}"
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(output_file, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        print(f"Audio file saved as {output_file}")
    else:
        print(f"Error downloading audio: Status Code {response.status_code}")
    return response.status_code

if __name__ == "__main__":
    pdf_file_path = "book.pdf"

    # Step 1: Upload the PDF file and get its uuid.
    uuid = upload_pdf(pdf_file_path)
    if not uuid:
        print("Failed to get a UUID after upload. Exiting.")
        exit(1)

    # Step 2: Retrieve text from the uploaded PDF.
    get_text(uuid)

    # Step 3: Convert the text to speech.
    text_to_speech(uuid)

    # Step 4: Download the converted audio file.
    download_audio(uuid, f"{uuid}_audio.wav")
