export async function uploadPdf(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("http://localhost:8080/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload PDF")
  }

  const data = await response.json()
  return data.uuid
}

export async function extractText(uuid: string): Promise<void> {
  const response = await fetch(`http://localhost:8080/getText/${uuid}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to extract text")
  }
}

export async function convertToSpeech(uuid: string): Promise<void> {
  const response = await fetch(`http://localhost:8080/textToSpeech/${uuid}`, {
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to convert text to speech")
  }
}

