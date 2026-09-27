function Dashboard({ onNavigate }) {
  const stats = [
    {
      title: "Occupancy",
      value: "88%",
      subtitle: "44 of 50 rooms occupied",
      icon: "🏨",
    },
    {
      title: "Today's Revenue",
      value: "₹4.8L",
      subtitle: "↑ 12% from yesterday",
      icon: "💰",
    },
    {
      title: "Weekend Forecast",
      value: "96%",
      subtitle: "Very high demand",
      icon: "📈",
    },
    {
      title: "Pending Tasks",
      value: "12",
      subtitle: "8 housekeeping • 4 maintenance",
      icon: "🧹",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">
          Resort Dashboard
        </h2>
        <p className="text-slate-500 mt-1">
          Smart Resort 360 — Operations Overview
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-500">
                {stat.title}
              </p>

              <span className="text-2xl">
                {stat.icon}
              </span>
            </div>

            <h3 className="text-3xl font-bold mt-3">
              {stat.value}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold">
            AI Revenue Opportunity
          </h3>

          <p className="text-slate-500 mt-2">
            AI predicts strong weekend demand.
            Increasing premium room pricing could
            generate additional revenue.
          </p>

          <div className="bg-blue-50 rounded-xl p-5 mt-5">
            <p className="text-sm text-slate-500">
              Estimated opportunity
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-1">
              +₹2.4L
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Based on demand forecast
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>

            <div>
              <h3 className="text-xl font-bold">
                AI Command Center
              </h3>

              <p className="text-slate-400">
                Intelligent resort recommendations
              </p>
            </div>
          </div>

          <p className="text-slate-300 mt-6 leading-relaxed">
            Ask AI about pricing, occupancy,
            housekeeping, staffing and revenue.
          </p>

          <button
  onClick={() => onNavigate("ai")}
  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
>
  Open AI Command Center →
</button>

          <div className="mt-5 bg-white/10 rounded-xl p-4">
            <p className="text-sm text-slate-300">
              Weekend demand
            </p>

            <p className="text-2xl font-bold mt-1">
              🔥 Very High
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard