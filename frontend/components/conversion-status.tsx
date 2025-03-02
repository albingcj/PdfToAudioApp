interface ConversionStatusProps {
  isExtracting: boolean
  isConverting: boolean
  isComplete: boolean
}

export default function ConversionStatus({ isExtracting, isConverting, isComplete }: ConversionStatusProps) {
  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
            ${isExtracting || isConverting || isComplete ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
          >
            {isExtracting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            ) : isConverting || isComplete ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span>1</span>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium">Extracting Text</h3>
            <p className="text-sm text-gray-500">
              {isExtracting ? "In progress..." : isConverting || isComplete ? "Completed" : "Waiting to start"}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
            ${
              isConverting
                ? "bg-blue-100 text-blue-600"
                : isComplete
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            {isConverting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : isComplete ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span>2</span>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium">Converting to Speech</h3>
            <p className="text-sm text-gray-500">
              {isConverting ? "In progress..." : isComplete ? "Completed" : "Waiting to start"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

