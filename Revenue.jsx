import { useState } from "react"

function Revenue() {
  const [selectedRate, setSelectedRate] = useState(8500)
  const [pricingApplied, setPricingApplied] = useState(false)

  const forecast = [
    { day: "Mon", occupancy: "72%", revenue: "₹3.8L" },
    { day: "Tue", occupancy: "76%", revenue: "₹4.1L" },
    { day: "Wed", occupancy: "79%", revenue: "₹4.3L" },
    { day: "Thu", occupancy: "84%", revenue: "₹4.7L" },
    { day: "Fri", occupancy: "91%", revenue: "₹5.6L" },
    { day: "Sat", occupancy: "96%", revenue: "₹6.4L" },
    { day: "Sun", occupancy: "93%", revenue: "₹5.9L" },
  ]

  return (
    <div className="space-y-8">

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Today's Revenue</p>
          <h3 className="text-3xl font-bold mt-2">₹4.82L</h3>
          <p className="text-green-600 mt-2">
            ↑ 12.4% vs yesterday
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Occupancy</p>
          <h3 className="text-3xl font-bold mt-2">87%</h3>
          <p className="text-green-600 mt-2">
            ↑ 8.2% this week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Average Room Rate</p>
          <h3 className="text-3xl font-bold mt-2">₹8,450</h3>
          <p className="text-green-600 mt-2">
            ↑ 6.8%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Forecast Revenue</p>
          <h3 className="text-3xl font-bold mt-2">₹34.8L</h3>
          <p className="text-blue-600 mt-2">
            Next 7 days
          </p>
        </div>

      </div>

      {/* AI Pricing */}
      <div className="bg-slate-900 text-white rounded-2xl p-8">

        <div className="flex justify-between items-start">

          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>

              <h2 className="text-2xl font-bold">
                AI Dynamic Pricing
              </h2>
            </div>

            <p className="text-slate-300 mt-2">
              AI analyzed occupancy, demand and upcoming bookings.
            </p>
          </div>

          <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
            AI Recommendation Ready
          </span>

        </div>

        <div className="grid grid-cols-3 gap-6 mt-8">

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-slate-400">
              Current Weekend Rate
            </p>

            <h3 className="text-2xl font-bold mt-2">
  {pricingApplied ? "₹9,520" : "₹8,500"}
</h3>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-slate-400">
              AI Recommended Rate
            </p>

            <h3 className="text-2xl font-bold mt-2 text-green-400">
              ₹9,520
            </h3>

            <p className="text-green-400 text-sm mt-1">
              +12% increase
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5">
            <p className="text-slate-400">
              Expected Revenue Gain
            </p>

            <h3 className="text-2xl font-bold mt-2">
              +₹2.4L
            </h3>

            <p className="text-green-400 text-sm mt-1">
              This weekend
            </p>
          </div>

        </div>

        <button
  onClick={() => setPricingApplied(true)}
  className={`mt-7 px-6 py-3 rounded-xl font-semibold ${
    pricingApplied
      ? "bg-green-600"
      : "bg-blue-600 hover:bg-blue-700"
  }`}
>
  {pricingApplied
    ? "✓ AI Pricing Applied"
    : "Apply AI Pricing →"}
</button>

      </div>

      {/* Forecast */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-xl font-bold">
              7-Day Demand Forecast
            </h2>

            <p className="text-slate-500 mt-1">
              AI predicted occupancy and revenue
            </p>
          </div>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
            AI Forecast
          </span>

        </div>

        <div className="grid grid-cols-7 gap-4">

          {forecast.map((item) => (
            <div
              key={item.day}
              className="border rounded-xl p-4 text-center"
            >

              <p className="font-bold">
                {item.day}
              </p>

              <div className="h-32 flex items-end justify-center mt-4">

                <div
                  className="w-10 bg-blue-500 rounded-t-lg"
                  style={{
                    height: item.occupancy,
                  }}
                ></div>

              </div>

              <p className="font-bold mt-4">
                {item.occupancy}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                {item.revenue}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <span className="text-2xl">📈</span>

          <h3 className="font-bold text-lg mt-3">
            High Demand
          </h3>

          <p className="text-slate-500 mt-2">
            Friday and Saturday are expected to cross 90% occupancy.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <span className="text-2xl">💰</span>

          <h3 className="font-bold text-lg mt-3">
            Pricing Opportunity
          </h3>

          <p className="text-slate-500 mt-2">
            Increasing weekend rates by 12% may improve revenue.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <span className="text-2xl">🎯</span>

          <h3 className="font-bold text-lg mt-3">
            Revenue Target
          </h3>

          <p className="text-slate-500 mt-2">
            Resort is on track to exceed this week's revenue target.
          </p>
        </div>

      </div>

    </div>
  )
}

export default Revenue