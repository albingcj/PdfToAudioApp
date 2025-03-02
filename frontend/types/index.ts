export interface FileInfo {
  uuid: string
  originalFileName: string
  status: "pending" | "in-progress" | "done"
  createdAt: string
}

