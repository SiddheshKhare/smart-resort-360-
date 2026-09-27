import { useState } from "react"

function Guests() {
  const [feedback, setFeedback] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  // AI Guest Feedback Analysis
  const analyzeFeedback = async () => {
    if (!feedback.trim()) {
      alert("Please enter guest feedback first.")
      return
    }

    setLoading(true)
    setAnalysis(null)

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedback: feedback.trim(),
          }),
        }
      )

      const text = await response.text()

      console.log("AI Backend Response:", text)

      let data

      try {
        data = JSON.parse(text)
      } catch (error) {
        throw new Error(
          "Backend returned invalid response: " +
            text.substring(0, 100)
        )
      }

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed")
      }

      setAnalysis(data)
    } catch (error) {
      console.error("Feedback Analysis Error:", error)
      alert(`AI analysis failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Guest Data
  const guests = [
    {
      name: "Rahul Sharma",
      room: "204",
      stay: "10 - 12 Sept 2026",
      status: "Checked-in",
      rating: 5,
    },
    {
      name: "Priya Patel",
      room: "312",
      stay: "09 - 13 Sept 2026",
      status: "Checked-in",
      rating: 4,
    },
    {
      name: "Amit Deshmukh",
      room: "108",
      stay: "08 - 11 Sept 2026",
      status: "Checked-in",
      rating: 5,
    },
    {
      name: "Sneha Joshi",
      room: "405",
      stay: "11 - 14 Sept 2026",
      status: "Upcoming",
      rating: 5,
    },
    {
      name: "Rohan Kulkarni",
      room: "221",
      stay: "07 - 10 Sept 2026",
      status: "Checked-out",
      rating: 4,
    },
    {
      name: "Neha Patil",
      room: "305",
      stay: "10 - 15 Sept 2026",
      status: "Checked-in",
      rating: 5,
    },
  ]

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Guests
        </h1>

        <p className="text-slate-500 mt-1">
          Manage guests and analyze guest experience
        </p>
      </div>

      {/* Guest Stats */}
      <div className="grid grid-cols-4 gap-5">

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Guests
          </p>

          <p className="text-3xl font-bold mt-2">
            128
          </p>

          <p className="text-green-600 text-sm mt-2">
            ↑ 12% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Checked-in
          </p>

          <p className="text-3xl font-bold mt-2">
            44
          </p>

          <p className="text-blue-600 text-sm mt-2">
            Currently staying
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Upcoming
          </p>

          <p className="text-3xl font-bold mt-2">
            26
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Future bookings
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Avg. Rating
          </p>

          <p className="text-3xl font-bold mt-2">
            4.7 ⭐
          </p>

          <p className="text-green-600 text-sm mt-2">
            Excellent
          </p>
        </div>

      </div>

      {/* Guest Directory */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">
            Guest Directory
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Current and recent resort guests
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                  Guest
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                  Room
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                  Stay
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                  Status
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-500">
                  Rating
                </th>
              </tr>

            </thead>

            <tbody>

              {guests.map((guest, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {guest.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold">
                          {guest.name}
                        </p>

                        <p className="text-xs text-slate-400">
                          Guest #{index + 1001}
                        </p>
                      </div>

                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    {guest.room}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {guest.stay}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        guest.status === "Checked-in"
                          ? "bg-green-100 text-green-700"
                          : guest.status === "Upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {guest.status}
                    </span>

                  </td>

                  <td className="px-6 py-4">
                    {"⭐".repeat(guest.rating)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* AI Guest Sentiment */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
            🤖
          </div>

          <div>
            <h2 className="text-xl font-bold">
              AI Guest Sentiment
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Analyze guest feedback using Smart Resort AI
            </p>
          </div>

        </div>

        {/* Feedback Input */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter guest feedback..."
          className="w-full mt-5 border border-slate-200 rounded-xl p-4 min-h-28 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />

        {/* Analyze Button */}
        <button
          type="button"
          onClick={analyzeFeedback}
          disabled={loading}
          className="mt-4 bg-slate-900 text-white px-5 py-3 rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "⏳ Analyzing..."
            : "🤖 Analyze Feedback"}
        </button>

        {/* Analysis Result */}
        {analysis && (
          <div className="mt-6">

            <div className="flex items-center justify-between mb-4">

              <h4 className="font-bold text-lg">
                Analysis Result
              </h4>

              <span className="text-sm text-green-600 font-semibold">
                ✓ AI Analysis Complete
              </span>

            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {/* Sentiment */}
              <div className="bg-slate-50 rounded-xl p-4">

                <p className="text-sm text-slate-500">
                  Sentiment
                </p>

                <p className="text-xl font-bold mt-1">
                  {analysis.sentiment === "Positive" && "😊 "}
                  {analysis.sentiment === "Negative" && "😞 "}
                  {analysis.sentiment === "Neutral" && "😐 "}

                  {analysis.sentiment}
                </p>

              </div>

              {/* Score */}
              <div className="bg-slate-50 rounded-xl p-4">

                <p className="text-sm text-slate-500">
                  Score
                </p>

                <p className="text-xl font-bold mt-1">
                  {analysis.score}/10
                </p>

              </div>

              {/* Category */}
              <div className="bg-slate-50 rounded-xl p-4">

                <p className="text-sm text-slate-500">
                  Category
                </p>

                <p className="text-lg font-bold mt-1">
                  {analysis.category}
                </p>

              </div>

              {/* Priority */}
              <div className="bg-slate-50 rounded-xl p-4">

                <p className="text-sm text-slate-500">
                  Priority
                </p>

                <p
                  className={`text-xl font-bold mt-1 ${
                    analysis.priority === "High"
                      ? "text-red-600"
                      : analysis.priority === "Medium"
                      ? "text-orange-600"
                      : "text-green-600"
                  }`}
                >
                  {analysis.priority}
                </p>

              </div>

            </div>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-5 mt-4">

              <p className="text-sm text-slate-500">
                AI Summary
              </p>

              <p className="font-semibold mt-2 text-slate-800">
                {analysis.summary}
              </p>

            </div>

            {/* Recommendation */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mt-4">

              <p className="text-sm text-blue-600 font-semibold">
                💡 AI Recommendation
              </p>

              <p className="font-semibold mt-2 text-slate-800">
                {analysis.recommendation}
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  )
}

export default Guests