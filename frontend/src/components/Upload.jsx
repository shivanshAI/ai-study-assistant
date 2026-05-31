import { useState } from "react"
import axios from "axios"

export default function Upload({ onUpload }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a PDF file")
      return
    }
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/upload", formData)
      onUpload(res.data.pdf_id, res.data.filename)
    } catch (e) {
      setError("Upload failed. Make sure the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-20">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
        className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
          ${dragging ? "border-purple-400 bg-purple-900/20" : "border-gray-600 hover:border-purple-500 hover:bg-gray-900"}`}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <div className="text-5xl mb-4">📄</div>
        <p className="text-gray-300 text-lg">Drag & drop your PDF here</p>
        <p className="text-gray-500 text-sm mt-2">or click to browse</p>
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {loading && (
        <div className="text-purple-400 animate-pulse text-lg">
          Processing your PDF...
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  )
}