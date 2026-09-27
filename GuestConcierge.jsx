import { useState } from "react"

function GuestConcierge() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Namaste! 👋 Welcome to Smart Resort 360. I'm your AI Concierge powered by Nugen Intelligence. How can I make your stay special today?",
    },
  ])
  const [loading, setLoading] = useState(false)

  const suggestions = [
    "What activities do you recommend?",
    "Suggest something for dinner",
    "What can I do this evening?",
    "Tell me about resort facilities",
  ]

  async function sendMessage(text = message) {
    if (!text.trim() || loading) return

    const userMessage = {
      type: "user",
      text: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setLoading(true)

    try {
      // Direct integration with Nugen Aligned Model
      const response = await fetch("https://api.nugen.in/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_NUGEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: "nugen-d9646068170ab81b", // Your hackathon model ID
          messages: [
            {
              role: "system",
              content:
                "You are the Smart Resort 360 AI concierge for guest Rahul Sharma (Room 204). Provide helpful, welcoming, domain-accurate resort information.",
            },
            ...messages.map((m) => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.text,
            })),
            {
              role: "user",
              content: text,
            },
          ],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Nugen AI request failed")
      }

      const replyText =
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process that request."

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: replyText,
        },
      ])
    } catch (error) {
      console.error("Nugen API Error:", error)

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, I'm having trouble connecting to Nugen AI service right now. Please verify your VITE_NUGEN_API_KEY in .env.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
            ✨
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">Guest AI Concierge</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                Nugen Aligned
              </span>
            </div>

            <p className="text-slate-500">
              Personalized assistance powered by custom model: nugen-d9646068170ab81b
            </p>
          </div>
        </div>
      </div>

      {/* Guest Profile */}
      <div className="bg-slate-900 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">CURRENT GUEST</p>

            <h3 className="text-2xl font-bold mt-1">Rahul Sharma 👋</h3>

            <p className="text-slate-400 mt-1">
              Room 204 • 2 Guests • 2 Nights
            </p>
          </div>

          <div className="text-right">
            <p className="text-slate-400 text-sm">Stay Status</p>

            <p className="text-green-400 font-semibold mt-1">● Checked In</p>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="border-b p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
              🤖
            </div>

            <div>
              <h3 className="font-bold">Resort AI Assistant</h3>

              <p className="text-sm text-green-600">● Online (Nugen Engine)</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 min-h-[350px] max-h-[450px] overflow-y-auto bg-slate-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-white border text-slate-700 rounded-bl-md shadow-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border text-slate-400 rounded-2xl px-5 py-3 text-sm italic shadow-sm">
                Nugen AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="p-5 border-t">
          <p className="text-sm text-slate-500 mb-3">Quick suggestions</p>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                disabled={loading}
                onClick={() => sendMessage(item)}
                className="border rounded-full px-4 py-2 text-sm hover:bg-slate-50 transition disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-5 border-t flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage()
              }
            }}
            placeholder="Ask your resort concierge..."
            className="flex-1 border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="bg-blue-600 text-white px-7 py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send ✈️"}
          </button>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div>
        <h3 className="text-xl font-bold mb-4">Personalized Recommendations</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">🌅</div>

            <h4 className="font-bold text-lg">Sunset Experience</h4>

            <p className="text-slate-500 mt-2">
              Enjoy the best sunset view from our lakeside deck.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Explore →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">🍽️</div>

            <h4 className="font-bold text-lg">Dinner Recommendation</h4>

            <p className="text-slate-500 mt-2">
              Discover today's chef specials at our restaurant.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              View Menu →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-3xl mb-4">🏄</div>

            <h4 className="font-bold text-lg">Resort Activities</h4>

            <p className="text-slate-500 mt-2">
              Find activities based on your interests and schedule.
            </p>

            <button className="mt-4 text-blue-600 font-semibold">
              Explore →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestConcierge