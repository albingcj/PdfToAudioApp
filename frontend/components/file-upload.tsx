import type { ChangeEvent } from "react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  onUpload: () => void
  isUploading: boolean
  selectedFile: File | null
  disabled?: boolean
}

export default function FileUpload({
  onFileChange,
  onUpload,
  isUploading,
  selectedFile,
  disabled = false,
}: FileUploadProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFileChange(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer 
            ${selectedFile ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50"} 
            hover:bg-gray-100 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {selectedFile ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 mb-3 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">{selectedFile.name}</span>
                </p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
      </div>

      <button
        onClick={onUpload}
        disabled={!selectedFile || isUploading || disabled}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Uploading...
          </>
        ) : (
          "Upload PDF"
        )}
      </button>
    </div>
  )
}

