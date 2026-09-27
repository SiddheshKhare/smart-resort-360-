import { useState } from "react"

// LOCAL DEVELOPMENT BACKEND
const API_URL = "http://localhost:5000/api/manager-ai"

function AICommandCenter() {
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [history, setHistory] = useState([])

  const suggestions = [
    "How many rooms are available?",
    "What should I do for this weekend?",
    "How can I increase revenue?",
    "Which rooms need attention?",
    "Do we need more housekeeping staff?",
    "Give me today's resort summary",
  ]

  async function askAI(text = question) {
    const cleanQuestion = text.trim()

    if (!cleanQuestion || loading) return

    setQuestion(cleanQuestion)
    setLoading(true)
    setResponse(null)

    try {
      console.log("================================")
      console.log("SMART RESORT AI REQUEST")
      console.log("API:", API_URL)
      console.log("Question:", cleanQuestion)
      console.log("================================")

      const result = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanQuestion,
          history: [],
        }),
      })

      console.log("HTTP STATUS:", result.status)
      console.log("CONTENT TYPE:", result.headers.get("content-type"))

      const rawResponse = await result.text()

      console.log("RAW SERVER RESPONSE:")
      console.log(rawResponse)

      let data

      try {
        data = JSON.parse(rawResponse)
      } catch {
        throw new Error(
          `Backend returned invalid JSON. HTTP ${result.status}. Response: ${rawResponse.slice(
            0,
            500
          )}`
        )
      }

      console.log("PARSED SERVER RESPONSE:")
      console.log(data)

      if (!result.ok) {
        throw new Error(
          data.error ||
            data.details ||
            data.message ||
            `Backend returned HTTP ${result.status}`
        )
      }

      if (data.success === false) {
        throw new Error(
          data.error ||
            data.details ||
            "Backend returned success=false"
        )
      }

      const aiReply =
        data.reply ||
        data.recommendation ||
        data.analysis

      if (!aiReply) {
        throw new Error(
          `Backend responded successfully but no AI reply was found. Response: ${rawResponse}`
        )
      }

      setResponse({
        question: cleanQuestion,
        answer: aiReply,
        error: false,
      })

      setHistory((previous) => [
        ...previous,
        {
          role: "user",
          content: cleanQuestion,
        },
        {
          role: "assistant",
          content: aiReply,
        },
      ])
    } catch (error) {
      console.error("================================")
      console.error("SMART RESORT AI ERROR")
      console.error(error)
      console.error("================================")

      setResponse({
        question: cleanQuestion,
        answer: error.message || "Unknown AI service error",
        error: true,
      })
    } finally {
      setLoading(false)
    }
  }

  function clearChat() {
    setQuestion("")
    setResponse(null)
    setHistory([])
  }

  function formatAIText(text) {
    if (!text) return null

    return text.split("\n").map((line, index) => {
      const trimmed = line.trim()

      if (!trimmed) {
        return <div key={index} className="h-2" />
      }

      if (
        trimmed.startsWith("###") ||
        trimmed.startsWith("##") ||
        trimmed.startsWith("#")
      ) {
        return (
          <h3
            key={index}
            className="font-bold text-lg text-slate-900 mt-4 mb-2"
          >
            {trimmed.replace(/^#+\s*/, "")}
          </h3>
        )
      }

      if (
        trimmed.startsWith("- ") ||
        trimmed.startsWith("• ")
      ) {
        return (
          <div
            key={index}
            className="flex gap-2 mb-2"
          >
            <span>•</span>

            <span>
              {trimmed.replace(/^[-•]\s*/, "")}
            </span>
          </div>
        )
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <div
            key={index}
            className="flex gap-2 mb-2"
          >
            <span className="font-semibold">
              {trimmed.match(/^\d+\./)?.[0]}
            </span>

            <span>
              {trimmed.replace(/^\d+\.\s*/, "")}
            </span>
          </div>
        )
      }

      return (
        <p
          key={index}
          className="mb-2 leading-7"
        >
          {trimmed}
        </p>
      )
    })
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

            <div className="text-4xl">
              🤖
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                AI Command Center
              </h1>

              <p className="text-slate-500 mt-1">
                Your AI-powered resort management assistant
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={clearChat}
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
        >
          Clear Chat
        </button>

      </div>


      {/* AI BANNER */}

      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
            ✨
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Smart Resort AI Manager
            </h2>

            <p className="text-indigo-100 text-sm">
              Ask questions about rooms, revenue, guests, staff and operations.
            </p>
          </div>

        </div>

      </div>


      {/* METRICS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Rooms
          </p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            50
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Resort inventory
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Available Rooms
          </p>

          <h3 className="text-3xl font-bold text-emerald-600 mt-2">
            18
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Ready for booking
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">
            Weekend Forecast
          </p>

          <h3 className="text-3xl font-bold text-purple-600 mt-2">
            96%
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Expected occupancy
          </p>
        </div>

      </div>


      {/* ASK AI */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Ask your AI Manager
        </h2>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAI()
              }
            }}
            placeholder="Ask anything about your resort..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => askAI()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Ask AI 🤖"}
          </button>

        </div>


        {/* SUGGESTIONS */}

        <div className="mt-5">

          <p className="text-sm text-slate-500 mb-3">
            Try asking:
          </p>

          <div className="flex flex-wrap gap-2">

            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => askAI(item)}
                disabled={loading}
                className="px-3 py-2 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-sm text-slate-700 transition"
              >
                {item}
              </button>
            ))}

          </div>

        </div>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="bg-white rounded-2xl border border-indigo-100 p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
              🤖
            </div>

            <div>
              <p className="font-semibold text-slate-800">
                AI Manager is analyzing...
              </p>

              <p className="text-sm text-slate-500">
                Checking resort data and preparing a recommendation.
              </p>
            </div>

          </div>

        </div>
      )}


      {/* RESPONSE */}

      {response && !loading && (

        <div
          className={`rounded-2xl border shadow-sm overflow-hidden ${
            response.error
              ? "bg-red-50 border-red-200"
              : "bg-white border-slate-200"
          }`}
        >

          <div className="p-5 bg-slate-50 border-b border-slate-200">

            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
              Your Question
            </p>

            <p className="font-semibold text-slate-800">
              {response.question}
            </p>

          </div>


          <div className="p-6">

            <div className="flex gap-4">

              <div className="w-11 h-11 shrink-0 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">
                🤖
              </div>

              <div className="flex-1 text-slate-700">

                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wide text-indigo-600 font-bold">
                    AI Manager
                  </span>
                </div>

                {formatAIText(response.answer)}

              </div>

            </div>

          </div>

        </div>
      )}


      {/* SNAPSHOT */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Resort Operation Snapshot
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current areas the AI can analyze
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
            AI Ready
          </span>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="p-4 rounded-xl bg-blue-50">
            <div className="text-2xl mb-2">
              🏨
            </div>

            <h3 className="font-bold text-slate-800">
              Rooms
            </h3>

            <p className="text-sm text-slate-500">
              Availability and occupancy
            </p>
          </div>


          <div className="p-4 rounded-xl bg-emerald-50">
            <div className="text-2xl mb-2">
              💰
            </div>

            <h3 className="font-bold text-slate-800">
              Revenue
            </h3>

            <p className="text-sm text-slate-500">
              Pricing and revenue strategies
            </p>
          </div>


          <div className="p-4 rounded-xl bg-orange-50">
            <div className="text-2xl mb-2">
              🧹
            </div>

            <h3 className="font-bold text-slate-800">
              Operations
            </h3>

            <p className="text-sm text-slate-500">
              Housekeeping and maintenance
            </p>
          </div>


          <div className="p-4 rounded-xl bg-purple-50">
            <div className="text-2xl mb-2">
              📊
            </div>

            <h3 className="font-bold text-slate-800">
              Insights
            </h3>

            <p className="text-sm text-slate-500">
              AI-powered management insights
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default AICommandCenter