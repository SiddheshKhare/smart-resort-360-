import { useEffect, useMemo, useState } from "react"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://smart-resort-360-r3gq.onrender.com")

const initialTasks = [
  {
    id: 1,
    room: "205",
    type: "Deep Cleaning",
    assignedTo: "Ramesh",
    priority: "High",
    status: "In Progress",
    time: "09:30 AM",
  },
  {
    id: 2,
    room: "108",
    type: "Room Refresh",
    assignedTo: "Sunita",
    priority: "Medium",
    status: "Pending",
    time: "10:00 AM",
  },
  {
    id: 3,
    room: "204",
    type: "Bathroom Cleaning",
    assignedTo: "Meena",
    priority: "Low",
    status: "Completed",
    time: "08:30 AM",
  },
  {
    id: 4,
    room: "302",
    type: "Room Cleaning",
    assignedTo: "Vijay",
    priority: "High",
    status: "Pending",
    time: "11:00 AM",
  },
  {
    id: 5,
    room: "301",
    type: "Room Refresh",
    assignedTo: "Priya",
    priority: "Medium",
    status: "Pending",
    time: "11:30 AM",
  },
]

function HousekeepingDashboard({ onLogout }) {
  const [rooms, setRooms] = useState([])
  const [tasks, setTasks] = useState(initialTasks)
  const [activeSection, setActiveSection] = useState("overview")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadRooms() {
    try {
      setLoading(true)

      const response = await fetch(`${API_BASE_URL}/api/rooms`)

      if (!response.ok) {
        throw new Error("Unable to load rooms")
      }

      const data = await response.json()

      const roomList = Array.isArray(data)
        ? data
        : data.rooms || []

      setRooms(roomList)
    } catch (error) {
      console.error("Housekeeping room loading error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const availableRooms = rooms.filter(
    (room) =>
      String(room.status || "").toLowerCase() === "available"
  )

  const occupiedRooms = rooms.filter(
    (room) =>
      String(room.status || "").toLowerCase() === "occupied"
  )

  const cleaningRooms = rooms.filter((room) => {
    const status = String(room.status || "").toLowerCase()

    return (
      status.includes("clean") ||
      status.includes("dirty")
    )
  })

  const maintenanceRooms = rooms.filter((room) => {
    const status = String(room.status || "").toLowerCase()

    return status.includes("maintenance")
  })

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  )

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  )

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  )

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  )

  const filteredTasks = useMemo(() => {
    const value = search.toLowerCase()

    return tasks.filter((task) => {
      return (
        task.room.toLowerCase().includes(value) ||
        task.type.toLowerCase().includes(value) ||
        task.assignedTo.toLowerCase().includes(value) ||
        task.priority.toLowerCase().includes(value) ||
        task.status.toLowerCase().includes(value)
      )
    })
  }, [tasks, search])

  function updateTaskStatus(id, newStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    )
  }

  function assignTask(id) {
    const worker = prompt(
      "Enter housekeeping staff name:"
    )

    if (!worker) return

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              assignedTo: worker,
              status: "In Progress",
            }
          : task
      )
    )
  }

  function getPriorityClass(priority) {
    if (priority === "High") {
      return "bg-red-100 text-red-700"
    }

    if (priority === "Medium") {
      return "bg-amber-100 text-amber-700"
    }

    return "bg-emerald-100 text-emerald-700"
  }

  function getStatusClass(status) {
    if (status === "Completed") {
      return "bg-emerald-100 text-emerald-700"
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700"
    }

    return "bg-amber-100 text-amber-700"
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">

        <div className="px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow">
              🧹
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Housekeeping Dashboard
              </h1>

              <p className="text-sm text-slate-500">
                Room Cleaning & Housekeeping Operations
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-slate-800">
                Housekeeping Staff
              </p>

              <p className="text-xs text-slate-400">
                Operations Department
              </p>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* SIDEBAR */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-81px)] p-4">

          <div className="space-y-2">

            <button
              onClick={() => setActiveSection("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "overview"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              📊 Overview
            </button>

            <button
              onClick={() => setActiveSection("tasks")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "tasks"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              🧹 Cleaning Tasks
            </button>

            <button
              onClick={() => setActiveSection("rooms")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "rooms"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              🏨 Room Status
            </button>

            <button
              onClick={() => setActiveSection("staff")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "staff"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              👥 Staff
            </button>

            <button
              onClick={() => setActiveSection("requests")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "requests"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              🔔 Special Requests
            </button>

          </div>

          {/* SHIFT */}
          <div className="mt-8 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">

            <p className="text-xs font-bold text-emerald-600 uppercase">
              Current Shift
            </p>

            <h3 className="font-bold text-slate-800 mt-1">
              Morning Shift
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              8:00 AM – 4:00 PM
            </p>

            <div className="mt-3 flex items-center gap-2">

              <span className="w-2 h-2 bg-emerald-500 rounded-full" />

              <span className="text-xs text-emerald-600 font-semibold">
                Team Active
              </span>

            </div>

          </div>

        </aside>

        {/* MAIN */}
        <main className="flex-1 p-4 md:p-6">

          {/* MOBILE NAV */}
          <div className="lg:hidden flex gap-2 overflow-x-auto mb-5">

            {[
              ["overview", "📊 Overview"],
              ["tasks", "🧹 Tasks"],
              ["rooms", "🏨 Rooms"],
              ["staff", "👥 Staff"],
              ["requests", "🔔 Requests"],
            ].map(([id, label]) => (

              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeSection === id
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {label}
              </button>

            ))}

          </div>

          {/* ================= OVERVIEW ================= */}
          {activeSection === "overview" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                  Housekeeping Overview 🧹
                </h2>

                <p className="text-slate-500 mt-1">
                  Keep every room clean, ready and guest-ready.
                </p>

              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">

                  <div className="flex justify-between">
                    <span className="text-2xl">
                      📋
                    </span>

                    <span className="text-xs text-amber-500">
                      Pending
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {pendingTasks.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    Pending Tasks
                  </p>

                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">

                  <div className="flex justify-between">
                    <span className="text-2xl">
                      🔄
                    </span>

                    <span className="text-xs text-blue-500">
                      Active
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {inProgressTasks.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    In Progress
                  </p>

                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">

                  <div className="flex justify-between">
                    <span className="text-2xl">
                      ✅
                    </span>

                    <span className="text-xs text-emerald-500">
                      Done
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {completedTasks.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    Completed
                  </p>

                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">

                  <div className="flex justify-between">
                    <span className="text-2xl">
                      🚨
                    </span>

                    <span className="text-xs text-red-500">
                      Priority
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {highPriorityTasks.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    High Priority
                  </p>

                </div>

              </div>

              {/* ROOM STATUS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Live Room Status
                    </h3>

                    <p className="text-sm text-slate-500">
                      Current room condition
                    </p>
                  </div>

                  <button
                    onClick={loadRooms}
                    className="px-3 py-2 bg-slate-100 rounded-lg text-sm font-semibold hover:bg-slate-200"
                  >
                    🔄 Refresh
                  </button>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-emerald-700">
                      {availableRooms.length}
                    </p>
                    <p className="text-sm text-emerald-600">
                      Available
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-blue-700">
                      {occupiedRooms.length}
                    </p>
                    <p className="text-sm text-blue-600">
                      Occupied
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-amber-700">
                      {cleaningRooms.length}
                    </p>
                    <p className="text-sm text-amber-600">
                      Cleaning / Dirty
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-red-700">
                      {maintenanceRooms.length}
                    </p>
                    <p className="text-sm text-red-600">
                      Maintenance
                    </p>
                  </div>

                </div>

              </div>

              {/* TODAY TASKS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">

                <div className="flex items-center justify-between mb-5">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Today's Cleaning Tasks
                    </h3>

                    <p className="text-sm text-slate-500">
                      Priority housekeeping work
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSection("tasks")}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View All →
                  </button>

                </div>

                <div className="space-y-3">

                  {tasks.slice(0, 4).map((task) => (

                    <div
                      key={task.id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl"
                    >

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                          🧹
                        </div>

                        <div>

                          <p className="font-bold text-slate-800">
                            Room {task.room} — {task.type}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            Assigned to {task.assignedTo} • {task.time}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </>
          )}

          {/* ================= TASKS ================= */}
          {activeSection === "tasks" && (
            <>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Cleaning Tasks
                  </h2>

                  <p className="text-slate-500">
                    Assign and track housekeeping work.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const room = prompt("Enter room number:")
                    if (!room) return

                    const type =
                      prompt("Enter cleaning task:") ||
                      "Room Cleaning"

                    setTasks((current) => [
                      ...current,
                      {
                        id: Date.now(),
                        room,
                        type,
                        assignedTo: "Unassigned",
                        priority: "Medium",
                        status: "Pending",
                        time: "New Task",
                      },
                    ])
                  }}
                  className="px-5 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
                >
                  + New Cleaning Task
                </button>

              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room, task, worker, priority or status..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                />

              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-slate-50 border-b border-slate-200">

                      <tr>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Room
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Task
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Assigned To
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Priority
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Status
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredTasks.map((task) => (

                        <tr
                          key={task.id}
                          className="border-b border-slate-100"
                        >

                          <td className="px-5 py-4">

                            <span className="font-bold text-slate-800">
                              Room {task.room}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <p className="font-semibold text-slate-800">
                              {task.type}
                            </p>

                            <p className="text-xs text-slate-400">
                              {task.time}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-sm text-slate-600">
                              {task.assignedTo}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityClass(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(
                                  task.id,
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold outline-none"
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Completed">
                                Completed
                              </option>

                            </select>

                          </td>

                          <td className="px-5 py-4">

                            <button
                              onClick={() => assignTask(task.id)}
                              className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100"
                            >
                              👤 Assign
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </>
          )}

          {/* ================= ROOMS ================= */}
          {activeSection === "rooms" && (
            <>

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Room Status
                  </h2>

                  <p className="text-slate-500">
                    Monitor room readiness for incoming guests.
                  </p>
                </div>

                <button
                  onClick={loadRooms}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold"
                >
                  🔄 Refresh
                </button>

              </div>

              {loading ? (
                <div className="bg-white rounded-2xl p-10 text-center">
                  <div className="text-4xl animate-pulse">
                    🏨
                  </div>

                  <p className="text-slate-500 mt-3">
                    Loading rooms...
                  </p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center">

                  <div className="text-5xl">
                    🏨
                  </div>

                  <p className="text-slate-500 mt-3">
                    No room data available.
                  </p>

                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                  {rooms.map((room, index) => {

                    const roomNumber =
                      room.room_number ||
                      room.roomNumber ||
                      room.number ||
                      `Room ${index + 1}`

                    const roomType =
                      room.room_type ||
                      room.roomType ||
                      room.type ||
                      "Standard"

                    const status =
                      room.status ||
                      "Unknown"

                    const normalizedStatus =
                      String(status).toLowerCase()

                    let statusClass =
                      "bg-slate-100 text-slate-700"

                    let icon = "🏨"

                    if (normalizedStatus === "available") {
                      statusClass =
                        "bg-emerald-100 text-emerald-700"
                      icon = "✅"
                    } else if (
                      normalizedStatus === "occupied"
                    ) {
                      statusClass =
                        "bg-blue-100 text-blue-700"
                      icon = "🧑"
                    } else if (
                      normalizedStatus.includes("clean")
                    ) {
                      statusClass =
                        "bg-amber-100 text-amber-700"
                      icon = "🧹"
                    } else if (
                      normalizedStatus.includes(
                        "maintenance"
                      )
                    ) {
                      statusClass =
                        "bg-red-100 text-red-700"
                      icon = "🔧"
                    }

                    return (
                      <div
                        key={room.id || index}
                        className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition"
                      >

                        <div className="flex items-start justify-between">

                          <div className="flex items-center gap-3">

                            <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-xl">
                              {icon}
                            </div>

                            <div>

                              <p className="text-xs text-slate-400">
                                ROOM
                              </p>

                              <h3 className="text-xl font-bold text-slate-900">
                                {roomNumber}
                              </h3>

                            </div>

                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}
                          >
                            {status}
                          </span>

                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100">

                          <p className="text-xs text-slate-400 uppercase font-semibold">
                            Room Type
                          </p>

                          <p className="font-semibold text-slate-800 mt-1">
                            {roomType}
                          </p>

                        </div>

                        <button
                          onClick={() => {
                            const taskType =
                              prompt(
                                `Cleaning task for Room ${roomNumber}:`
                              )

                            if (!taskType) return

                            setTasks((current) => [
                              ...current,
                              {
                                id: Date.now(),
                                room: String(roomNumber),
                                type: taskType,
                                assignedTo: "Unassigned",
                                priority: "Medium",
                                status: "Pending",
                                time: "New Task",
                              },
                            ])

                            setActiveSection("tasks")
                          }}
                          className="w-full mt-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100"
                        >
                          + Add Cleaning Task
                        </button>

                      </div>
                    )
                  })}

                </div>
              )}

            </>
          )}

          {/* ================= STAFF ================= */}
          {activeSection === "staff" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                  Housekeeping Staff
                </h2>

                <p className="text-slate-500">
                  Monitor team workload and task assignments.
                </p>

              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {[
                  {
                    name: "Ramesh",
                    role: "Senior Housekeeper",
                    tasks: 6,
                    status: "Working",
                    icon: "👨‍🔧",
                  },
                  {
                    name: "Sunita",
                    role: "Housekeeper",
                    tasks: 4,
                    status: "Working",
                    icon: "👩‍💼",
                  },
                  {
                    name: "Meena",
                    role: "Housekeeper",
                    tasks: 3,
                    status: "Available",
                    icon: "👩‍🔧",
                  },
                  {
                    name: "Vijay",
                    role: "Housekeeper",
                    tasks: 5,
                    status: "Working",
                    icon: "👨‍💼",
                  },
                ].map((staff) => (

                  <div
                    key={staff.name}
                    className="bg-white rounded-2xl border border-slate-200 p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
                        {staff.icon}
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          staff.status === "Working"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {staff.status}
                      </span>

                    </div>

                    <h3 className="font-bold text-slate-900 mt-4">
                      {staff.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {staff.role}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100">

                      <p className="text-2xl font-bold text-slate-800">
                        {staff.tasks}
                      </p>

                      <p className="text-xs text-slate-400">
                        Assigned Tasks
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">

                <h3 className="text-lg font-bold text-slate-900">
                  Team Workload
                </h3>

                <div className="mt-5 space-y-5">

                  {[
                    ["Ramesh", 75],
                    ["Sunita", 55],
                    ["Meena", 35],
                    ["Vijay", 65],
                  ].map(([name, percentage]) => (

                    <div key={name}>

                      <div className="flex justify-between mb-2">

                        <span className="text-sm font-semibold text-slate-700">
                          {name}
                        </span>

                        <span className="text-xs text-slate-400">
                          {percentage}% workload
                        </span>

                      </div>

                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </>
          )}

          {/* ================= REQUESTS ================= */}
          {activeSection === "requests" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                  Special Guest Requests
                </h2>

                <p className="text-slate-500">
                  Guest-specific housekeeping requirements.
                </p>

              </div>

              <div className="space-y-4">

                <div className="bg-white rounded-2xl border border-slate-200 p-5">

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                        🛏️
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-800">
                          Extra Pillows & Blankets
                        </h3>

                        <p className="text-sm text-slate-500">
                          Room 204 • Rahul Sharma
                        </p>

                      </div>

                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      Pending
                    </span>

                  </div>

                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl">
                        🌸
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-800">
                          Flower Decoration
                        </h3>

                        <p className="text-sm text-slate-500">
                          Room 301 • Anniversary Setup
                        </p>

                      </div>

                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      Assigned
                    </span>

                  </div>

                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl">
                        👶
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-800">
                          Baby Cot Required
                        </h3>

                        <p className="text-sm text-slate-500">
                          Room 108 • Family Guest
                        </p>

                      </div>

                    </div>

                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      Completed
                    </span>

                  </div>

                </div>

              </div>

            </>
          )}

        </main>

      </div>

    </div>
  )
}

export default HousekeepingDashboard