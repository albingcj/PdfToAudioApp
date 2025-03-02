"use client"

import { useState, useEffect } from "react"

interface AudioPlayerProps {
  uuid: string
  fileName: string
}

export default function AudioPlayer({ uuid, fileName }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  useEffect(() => {
    // Create the audio URL
    const url = `http://localhost:8080/download/${uuid}`
    setAudioUrl(url)

    // Cleanup function
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [uuid, audioUrl]) // Added audioUrl to dependencies

  const handleDownload = () => {
    if (!audioUrl) return

    const link = document.createElement("a")
    link.href = audioUrl
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!audioUrl) {
    return <div className="animate-pulse h-12 bg-gray-200 rounded-md"></div>
  }

  return (
    <div className="space-y-3">
      <audio controls className="w-full" src={audioUrl}>
        Your browser does not support the audio element.
      </audio>

      <button
        onClick={handleDownload}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Download Audio
      </button>
    </div>
  )
}

