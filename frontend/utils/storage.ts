import type { FileInfo } from "@/types"

const STORAGE_KEY = "pdf-to-audio-files"

export function saveFileToStorage(fileInfo: FileInfo): void {
  const existingFiles = getFilesFromStorage()
  const updatedFiles = [fileInfo, ...existingFiles.filter((file) => file.uuid !== fileInfo.uuid)]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles))
}

export function getFilesFromStorage(): FileInfo[] {
  if (typeof window === "undefined") {
    return []
  }

  const filesJson = localStorage.getItem(STORAGE_KEY)
  return filesJson ? JSON.parse(filesJson) : []
}

export function removeFileFromStorage(uuid: string): void {
  const existingFiles = getFilesFromStorage()
  const updatedFiles = existingFiles.filter((file) => file.uuid !== uuid)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFiles))
}

