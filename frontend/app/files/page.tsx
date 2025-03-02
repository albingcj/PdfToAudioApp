"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import AudioPlayer from "@/components/audio-player"
import { getFilesFromStorage, removeFileFromStorage } from "@/utils/storage"
import type { FileInfo } from "@/types"

export default function FilesPage() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const storedFiles = getFilesFromStorage()
    setFiles(storedFiles)
  }, [])

  const handleDelete = (uuid: string) => {
    removeFileFromStorage(uuid)
    setFiles(files.filter((file) => file.uuid !== uuid))
  }

  const filteredFiles = files.filter((file) => file.originalFileName.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Audio Files</h1>
            <p className="text-gray-600 mt-2">Listen to your converted PDF files</p>
          </div>
          <Link href="/" className="mt-4 md:mt-0 text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to converter
          </Link>
        </header>

        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {filteredFiles.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No files match your search</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <li key={file.uuid} className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-3 md:mb-0">
                        <h3 className="text-lg font-medium text-gray-900">{file.originalFileName}</h3>
                        <p className="text-sm text-gray-500">
                          Created on {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(file.uuid)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center self-start"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                    <div className="mt-3">
                      <AudioPlayer uuid={file.uuid} fileName={file.originalFileName} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {files.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audio files yet</h3>
            <p className="text-gray-500 mb-4">Upload a PDF file to convert it to audio</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to converter
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

