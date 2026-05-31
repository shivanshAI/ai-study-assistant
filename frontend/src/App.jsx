import { useState } from "react"
import Upload from "./components/Upload"
import Chat from "./components/Chat"

export default function App() {
  const [pdfId, setPdfId] = useState(null)
  const [filename, setFilename] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-2 text-purple-400">
          AI Study Assistant
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Upload your notes and ask anything
        </p>

        {!pdfId ? (
          <Upload onUpload={(id, name) => { setPdfId(id); setFilename(name) }} />
        ) : (
          <Chat pdfId={pdfId} filename={filename} onReset={() => { setPdfId(null); setFilename(null) }} />
        )}
      </div>
    </div>
  )
}