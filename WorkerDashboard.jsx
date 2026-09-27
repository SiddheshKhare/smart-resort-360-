import { useState } from "react"
function WorkerDashboard() {
    const [completedTasks, setCompletedTasks] = useState([])
  const tasks = [
    {
      room: "Room 204",
      task: "Room Cleaning",
      priority: "High",
      status: "Pending",
    },
    {
      room: "Room 118",
      task: "Replace Towels",
      priority: "Medium",
      status: "In Progress",
    },
    {
      room: "Room 305",
      task: "Check AC",
      priority: "Medium",
      status: "Pending",
    },
    {
      room: "Room 210",
      task: "Guest Request",
      priority: "High",
      status: "Pending",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-slate-900 text-white px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Smart Resort 360
          </h1>
          <p className="text-slate-400 mt-1">
            Worker Dashboard
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold">
            👷 Staff Member
          </p>
          <p className="text-sm text-slate-400">
            Operations Team
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">

        {/* Welcome */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Good Morning! 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Here are your assigned tasks for today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500">
              My Tasks
            </p>
            <h3 className="text-3xl font-bold mt-2">
              8
            </h3>
            <p className="text-blue-600 mt-2">
              Assigned today
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500">
              Completed
            </p>
            <h3 className="text-3xl font-bold mt-2">
              5
            </h3>
            <p className="text-green-600 mt-2">
              ✓ Good progress
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-slate-500">
              Pending
            </p>
            <h3 className="text-3xl font-bold mt-2">
              3
            </h3>
            <p className="text-orange-600 mt-2">
              Need attention
            </p>
          </div>

        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">
              Today's Tasks
            </h3>
            <p className="text-slate-500 mt-1">
              Complete your assigned resort operations tasks.
            </p>
          </div>

          <div className="divide-y">

            {tasks.map((task, index) => (
              <div
                key={index}
                className="p-6 flex items-center gap-5"
              >

                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                  {task.task === "Room Cleaning"
                    ? "🧹"
                    : task.task === "Replace Towels"
                    ? "🛏️"
                    : task.task === "Check AC"
                    ? "🔧"
                    : "🔔"}
                </div>

                <div className="flex-1">
                  <h4 className="font-bold">
                    {task.task}
                  </h4>

                  <p className="text-slate-500 text-sm mt-1">
                    {task.room}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.priority}
                </span>

                <span className="text-sm text-slate-500">
                  {task.status}
                </span>

                <button
  onClick={() => {
    setCompletedTasks((prev) =>
      prev.includes(index)
        ? prev
        : [...prev, index]
    )
  }}
  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
    completedTasks.includes(index)
      ? "bg-green-100 text-green-700"
      : "bg-blue-600 text-white hover:bg-blue-700"
  }`}
>
  {completedTasks.includes(index)
    ? "✓ Completed"
    : "Complete"}
</button>
              </div>
            ))}

          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-3 gap-6">

            <button className="bg-white rounded-2xl p-6 shadow-sm text-left hover:shadow-md">
              <div className="text-3xl mb-3">🧹</div>
              <h4 className="font-bold">
                Housekeeping
              </h4>
              <p className="text-slate-500 text-sm mt-1">
                View cleaning tasks
              </p>
            </button>

            <button className="bg-white rounded-2xl p-6 shadow-sm text-left hover:shadow-md">
              <div className="text-3xl mb-3">🔧</div>
              <h4 className="font-bold">
                Maintenance
              </h4>
              <p className="text-slate-500 text-sm mt-1">
                Report an issue
              </p>
            </button>

            <button className="bg-white rounded-2xl p-6 shadow-sm text-left hover:shadow-md">
              <div className="text-3xl mb-3">🔔</div>
              <h4 className="font-bold">
                Notifications
              </h4>
              <p className="text-slate-500 text-sm mt-1">
                Check new requests
              </p>
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}

export default WorkerDashboard