import { useState } from "react"
import axios from "axios"

export default function Chat({ pdfId, filename, onReset }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState("chat")

  const sendMessage = async () => {
    if (!input.trim()) return
    const question = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: question }])
    setLoading(true)
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/chat", {
        question,
        pdf_id: pdfId
      })
      setMessages(prev => [...prev, { role: "ai", text: res.data.answer, sources: res.data.sources }])
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Something went wrong. Try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between bg-gray-900 rounded-xl p-4">
        <div>
          <p className="text-purple-400 font-semibold">📄 {filename}</p>
          <p className="text-gray-500 text-sm">ID: {pdfId}</p>
        </div>
        <button onClick={onReset} className="text-sm text-gray-400 hover:text-white border border-gray-600 rounded-lg px-3 py-1">
          Upload new
        </button>
      </div>

      <div className="flex gap-2">
        {["chat", "summary", "quiz", "flashcards"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all
              ${tab === t ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "chat" && (
        <>
          <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto flex flex-col gap-4">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center mt-20">Ask anything about your notes</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm
                  ${m.role === "user" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-200"}`}>
                  {m.text}
                  {m.sources && (
                    <details className="mt-2 text-xs text-gray-400">
                      <summary className="cursor-pointer">View sources</summary>
                      {m.sources.map((s, j) => (
                        <p key={j} className="mt-1 border-l-2 border-purple-500 pl-2">{s.slice(0, 100)}...</p>
                      ))}
                    </details>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 px-4 py-2 rounded-2xl text-purple-400 animate-pulse text-sm">Thinking...</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question about your notes..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={sendMessage}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Send
            </button>
          </div>
        </>
      )}

      {tab !== "chat" && (
        <FeatureTab tab={tab} pdfId={pdfId} />
      )}
    </div>
  )
}

function FeatureTab({ tab, pdfId }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/${tab}`, { pdf_id: pdfId, num_questions: 5, num_cards: 10 })
      setResult(res.data)
    } catch {
      setResult({ error: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 flex flex-col gap-4">
      <button
        onClick={generate}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all w-fit"
      >
        {loading ? "Generating..." : `Generate ${tab}`}
      </button>

      {result?.summary && <p className="text-gray-200 leading-relaxed">{result.summary}</p>}

      {result?.quiz && result.quiz.map((q, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4">
          <p className="font-semibold text-white mb-2">{i + 1}. {q.question}</p>
          {q.options.map((o, j) => (
            <p key={j} className={`text-sm py-1 px-2 rounded ${o === q.answer ? "text-green-400" : "text-gray-400"}`}>
              {o}
            </p>
          ))}
        </div>
      ))}

      {result?.flashcards && result.flashcards.map((f, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 border-l-4 border-purple-500">
          <p className="text-purple-300 font-semibold">Q: {f.front}</p>
          <p className="text-gray-300 mt-1">A: {f.back}</p>
        </div>
      ))}
    </div>
  )
}