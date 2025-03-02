"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import FileUpload from "@/components/file-upload"
import ConversionStatus from "@/components/conversion-status"
import AudioPlayer from "@/components/audio-player"
import { uploadPdf, extractText, convertToSpeech } from "@/utils/api"
import { saveFileToStorage } from "@/utils/storage"

export default function Home() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fileUuid, setFileUuid] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    setFileUuid(null)
    setIsComplete(false)
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      setError(null)

      const uuid = await uploadPdf(file)
      setFileUuid(uuid)

      setIsUploading(false)
    } catch (err) {
      setIsUploading(false)
      setError("Failed to upload PDF. Please try again.")
      console.error(err)
    }
  }

  const handleExtractAndConvert = async () => {
    if (!fileUuid) return

    try {
      // Extract text
      setIsExtracting(true)
      await extractText(fileUuid)
      setIsExtracting(false)

      // Convert to speech
      setIsConverting(true)
      await convertToSpeech(fileUuid)

      // Save file info to storage
      saveFileToStorage({
        uuid: fileUuid,
        originalFileName: file?.name || "Unknown",
        status: "done",
        createdAt: new Date().toISOString(),
      })

      setIsConverting(false)
      setIsComplete(true)
    } catch (err) {
      setIsExtracting(false)
      setIsConverting(false)
      setError("Failed to convert PDF to audio. Please try again.")
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PDF to Audio Converter</h1>
          <p className="text-gray-600 mt-2">Upload a PDF file and convert it to audio</p>
          <div className="mt-4">
            <Link href="/files" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View your converted files
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 1: Upload PDF</h2>
          <FileUpload
            onFileChange={handleFileChange}
            onUpload={handleUpload}
            isUploading={isUploading}
            selectedFile={file}
            disabled={isUploading || isExtracting || isConverting}
          />
        </div>

        {fileUuid && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Step 2: Convert to Audio</h2>
            <button
              onClick={handleExtractAndConvert}
              disabled={isExtracting || isConverting || isComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Extract Text & Convert to Audio
            </button>

            <ConversionStatus isExtracting={isExtracting} isConverting={isConverting} isComplete={isComplete} />
          </div>
        )}

        {isComplete && fileUuid && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Step 3: Listen & Download</h2>
            <AudioPlayer uuid={fileUuid} fileName={file?.name || "audio-file"} />
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">{error}</div>}
      </div>
    </main>
  )
}

