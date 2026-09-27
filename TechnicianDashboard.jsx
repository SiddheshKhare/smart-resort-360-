import { useMemo, useState } from "react"

const initialRequests = [
  {
    id: 1,
    room: "108",
    issue: "AC Not Cooling",
    category: "AC",
    technician: "Vijay",
    priority: "High",
    status: "Pending",
    time: "09:15 AM",
  },
  {
    id: 2,
    room: "302",
    issue: "TV Not Working",
    category: "TV / Appliance",
    technician: "Amit",
    priority: "Medium",
    status: "In Progress",
    time: "10:00 AM",
  },
  {
    id: 3,
    room: "204",
    issue: "Bathroom Tap Leakage",
    category: "Plumbing",
    technician: "Rahul",
    priority: "High",
    status: "Pending",
    time: "10:30 AM",
  },
  {
    id: 4,
    room: "205",
    issue: "Light Replacement",
    category: "Electrical",
    technician: "Suresh",
    priority: "Low",
    status: "Fixed",
    time: "08:45 AM",
  },
  {
    id: 5,
    room: "301",
    issue: "Door Lock Problem",
    category: "Electrical",
    technician: "Vijay",
    priority: "Medium",
    status: "In Progress",
    time: "11:00 AM",
  },
]

function TechnicianDashboard({ onLogout }) {
  const [requests, setRequests] = useState(initialRequests)
  const [activeSection, setActiveSection] = useState("overview")
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] =
    useState("All")

  const pendingRequests = requests.filter(
    (item) => item.status === "Pending"
  )

  const inProgressRequests = requests.filter(
    (item) => item.status === "In Progress"
  )

  const fixedRequests = requests.filter(
    (item) => item.status === "Fixed"
  )

  const emergencyRequests = requests.filter(
    (item) => item.priority === "Emergency"
  )

  const highPriorityRequests = requests.filter(
    (item) => item.priority === "High"
  )

  const filteredRequests = useMemo(() => {
    const value = search.toLowerCase()

    return requests.filter((item) => {
      const matchesSearch =
        item.room.toLowerCase().includes(value) ||
        item.issue.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value) ||
        item.technician.toLowerCase().includes(value) ||
        item.priority.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value)

      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [requests, search, selectedCategory])

  function updateStatus(id, status) {
    setRequests((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      )
    )
  }

  function assignTechnician(id) {
    const technician = prompt(
      "Enter technician name:"
    )

    if (!technician) return

    setRequests((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              technician,
              status: "In Progress",
            }
          : item
      )
    )
  }

  function createRequest() {
    const room = prompt("Enter room number:")

    if (!room) return

    const issue =
      prompt("Enter maintenance issue:") ||
      "General Maintenance"

    const category =
      prompt(
        "Enter category: AC / Plumbing / Electrical / TV / Appliance"
      ) || "General"

    setRequests((current) => [
      ...current,
      {
        id: Date.now(),
        room,
        issue,
        category,
        technician: "Unassigned",
        priority: "Medium",
        status: "Pending",
        time: "New Request",
      },
    ])
  }

  function getPriorityClass(priority) {
    if (priority === "Emergency") {
      return "bg-red-600 text-white"
    }

    if (priority === "High") {
      return "bg-red-100 text-red-700"
    }

    if (priority === "Medium") {
      return "bg-amber-100 text-amber-700"
    }

    return "bg-emerald-100 text-emerald-700"
  }

  function getStatusClass(status) {
    if (status === "Fixed") {
      return "bg-emerald-100 text-emerald-700"
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700"
    }

    return "bg-amber-100 text-amber-700"
  }

  function getCategoryIcon(category) {
    if (category === "AC") return "❄️"
    if (category === "Plumbing") return "🚰"
    if (category === "Electrical") return "⚡"
    if (category === "TV / Appliance") return "📺"

    return "🔧"
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">

        <div className="px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center text-2xl shadow">
              🔧
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Technician Dashboard
              </h1>

              <p className="text-sm text-slate-500">
                Maintenance & Technical Operations
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden md:block text-right">

              <p className="text-sm font-semibold text-slate-800">
                Technician Team
              </p>

              <p className="text-xs text-slate-400">
                Maintenance Department
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
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              📊 Overview
            </button>

            <button
              onClick={() => setActiveSection("requests")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "requests"
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              🔧 Maintenance Requests
            </button>

            <button
              onClick={() => setActiveSection("emergency")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "emergency"
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              🚨 Emergency
            </button>

            <button
              onClick={() => setActiveSection("team")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "team"
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              👨‍🔧 Technician Team
            </button>

            <button
              onClick={() => setActiveSection("equipment")}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold ${
                activeSection === "equipment"
                  ? "bg-orange-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              🛠️ Equipment
            </button>

          </div>

          {/* STATUS */}
          <div className="mt-8 bg-orange-50 rounded-2xl p-4 border border-orange-100">

            <p className="text-xs font-bold text-orange-600 uppercase">
              Maintenance Status
            </p>

            <h3 className="font-bold text-slate-800 mt-1">
              Team Active
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Technical support available
            </p>

            <div className="mt-3 flex items-center gap-2">

              <span className="w-2 h-2 bg-emerald-500 rounded-full" />

              <span className="text-xs text-emerald-600 font-semibold">
                Online
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
              ["requests", "🔧 Requests"],
              ["emergency", "🚨 Emergency"],
              ["team", "👨‍🔧 Team"],
              ["equipment", "🛠️ Equipment"],
            ].map(([id, label]) => (

              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  activeSection === id
                    ? "bg-orange-600 text-white"
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
                  Maintenance Overview 🔧
                </h2>

                <p className="text-slate-500 mt-1">
                  Keep every resort facility safe and operational.
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
                    {pendingRequests.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    Pending Requests
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
                    {inProgressRequests.length}
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
                      Fixed
                    </span>

                  </div>

                  <p className="text-3xl font-bold text-slate-900 mt-4">
                    {fixedRequests.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    Completed Repairs
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
                    {highPriorityRequests.length}
                  </p>

                  <p className="text-sm text-slate-500">
                    High Priority
                  </p>

                </div>

              </div>

              {/* CATEGORY CARDS */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                {[
                  ["❄️", "AC Issues", "4 Active", "AC"],
                  ["🚰", "Plumbing", "2 Active", "Plumbing"],
                  ["⚡", "Electrical", "3 Active", "Electrical"],
                  ["📺", "TV / Appliances", "2 Active", "TV / Appliance"],
                ].map(([icon, title, count, category]) => (

                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setActiveSection("requests")
                    }}
                    className="bg-white rounded-2xl border border-slate-200 p-5 text-left hover:shadow-md transition"
                  >

                    <div className="text-3xl">
                      {icon}
                    </div>

                    <h3 className="font-bold text-slate-800 mt-3">
                      {title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {count}
                    </p>

                  </button>

                ))}

              </div>

              {/* ACTIVE REQUESTS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5">

                <div className="flex items-center justify-between mb-5">

                  <div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Active Maintenance
                    </h3>

                    <p className="text-sm text-slate-500">
                      Current technical requests
                    </p>

                  </div>

                  <button
                    onClick={() => setActiveSection("requests")}
                    className="text-sm font-semibold text-orange-600"
                  >
                    View All →
                  </button>

                </div>

                <div className="space-y-3">

                  {requests
                    .filter(
                      (item) => item.status !== "Fixed"
                    )
                    .slice(0, 4)
                    .map((item) => (

                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl"
                      >

                        <div className="flex items-center gap-3">

                          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-xl">
                            {getCategoryIcon(item.category)}
                          </div>

                          <div>

                            <p className="font-bold text-slate-800">
                              Room {item.room} — {item.issue}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {item.category} • {item.technician}
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-2">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityClass(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>

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

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Maintenance Requests
                  </h2>

                  <p className="text-slate-500">
                    Track room repairs and technical issues.
                  </p>

                </div>

                <button
                  onClick={createRequest}
                  className="px-5 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700"
                >
                  + New Request
                </button>

              </div>

              {/* SEARCH */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5">

                <div className="flex flex-col md:flex-row gap-3">

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search room, issue, technician or status..."
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value)
                    }
                    className="px-4 py-3 rounded-xl border border-slate-200 outline-none"
                  >

                    <option value="All">
                      All Categories
                    </option>

                    <option value="AC">
                      AC
                    </option>

                    <option value="Plumbing">
                      Plumbing
                    </option>

                    <option value="Electrical">
                      Electrical
                    </option>

                    <option value="TV / Appliance">
                      TV / Appliance
                    </option>

                  </select>

                </div>

              </div>

              {/* TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

                <div className="overflow-x-auto">

                  <table className="w-full">

                    <thead className="bg-slate-50 border-b border-slate-200">

                      <tr>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Room
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Issue
                        </th>

                        <th className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase">
                          Technician
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

                      {filteredRequests.map((item) => (

                        <tr
                          key={item.id}
                          className="border-b border-slate-100"
                        >

                          <td className="px-5 py-4">

                            <span className="font-bold text-slate-800">
                              Room {item.room}
                            </span>

                            <p className="text-xs text-slate-400 mt-1">
                              {item.time}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <span className="text-xl">
                                {getCategoryIcon(
                                  item.category
                                )}
                              </span>

                              <div>

                                <p className="font-semibold text-slate-800">
                                  {item.issue}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {item.category}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-sm text-slate-700">
                              {item.technician}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityClass(
                                item.priority
                              )}`}
                            >
                              {item.priority}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateStatus(
                                  item.id,
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

                              <option value="Fixed">
                                Fixed
                              </option>

                            </select>

                          </td>

                          <td className="px-5 py-4">

                            <button
                              onClick={() =>
                                assignTechnician(item.id)
                              }
                              className="px-3 py-2 rounded-lg bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100"
                            >
                              👨‍🔧 Assign
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

          {/* ================= EMERGENCY ================= */}
          {activeSection === "emergency" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                  🚨 Emergency Maintenance
                </h2>

                <p className="text-slate-500">
                  Critical issues requiring immediate attention.
                </p>

              </div>

              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-6">

                <div className="flex items-start gap-4">

                  <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center text-3xl">
                    🚨
                  </div>

                  <div>

                    <p className="text-sm font-bold text-red-600 uppercase">
                      Emergency Support
                    </p>

                    <h3 className="text-2xl font-bold text-red-900 mt-1">
                      Immediate Technical Response
                    </h3>

                    <p className="text-red-700 mt-2">
                      Critical electrical, plumbing, AC or safety
                      issues should be handled immediately.
                    </p>

                  </div>

                </div>

              </div>

              {emergencyRequests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">

                  <div className="text-5xl">
                    ✅
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mt-4">
                    No Emergency Requests
                  </h3>

                  <p className="text-slate-500 mt-1">
                    All critical maintenance issues are under control.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {emergencyRequests.map((item) => (

                    <div
                      key={item.id}
                      className="bg-white border-2 border-red-200 rounded-2xl p-5"
                    >

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div className="flex items-center gap-4">

                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                            🚨
                          </div>

                          <div>

                            <h3 className="font-bold text-slate-900">
                              Room {item.room} — {item.issue}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.category} • Assigned to{" "}
                              {item.technician}
                            </p>

                          </div>

                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              updateStatus(
                                item.id,
                                "In Progress"
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
                          >
                            Start Repair
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                item.id,
                                "Fixed"
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold"
                          >
                            Mark Fixed
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>
              )}

              {/* Emergency contact */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">

                <h3 className="font-bold text-lg text-slate-900">
                  Emergency Contacts
                </h3>

                <div className="grid md:grid-cols-3 gap-4 mt-4">

                  <div className="bg-slate-50 rounded-xl p-4">

                    <p className="text-sm text-slate-500">
                      Chief Technician
                    </p>

                    <p className="font-bold text-slate-800 mt-1">
                      +91 98765 43210
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">

                    <p className="text-sm text-slate-500">
                      Security Desk
                    </p>

                    <p className="font-bold text-slate-800 mt-1">
                      Extension 100
                    </p>

                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">

                    <p className="text-sm text-slate-500">
                      Front Desk
                    </p>

                    <p className="font-bold text-slate-800 mt-1">
                      Extension 101
                    </p>

                  </div>

                </div>

              </div>

            </>
          )}

          {/* ================= TEAM ================= */}
          {activeSection === "team" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                  Technician Team
                </h2>

                <p className="text-slate-500">
                  Monitor technician assignments and workload.
                </p>

              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {[
                  {
                    name: "Vijay",
                    role: "Senior Technician",
                    specialty: "AC & Electrical",
                    tasks: 5,
                    status: "Working",
                    icon: "👨‍🔧",
                  },
                  {
                    name: "Amit",
                    role: "Technician",
                    specialty: "TV & Appliances",
                    tasks: 3,
                    status: "Working",
                    icon: "🧑‍🔧",
                  },
                  {
                    name: "Rahul",
                    role: "Plumbing Technician",
                    specialty: "Plumbing",
                    tasks: 4,
                    status: "Available",
                    icon: "👨‍🔧",
                  },
                  {
                    name: "Suresh",
                    role: "Electrical Technician",
                    specialty: "Electrical",
                    tasks: 2,
                    status: "Available",
                    icon: "🧑‍🔧",
                  },
                ].map((tech) => (

                  <div
                    key={tech.name}
                    className="bg-white rounded-2xl border border-slate-200 p-5"
                  >

                    <div className="flex justify-between">

                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                        {tech.icon}
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold h-fit ${
                          tech.status === "Working"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {tech.status}
                      </span>

                    </div>

                    <h3 className="font-bold text-slate-900 mt-4">
                      {tech.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {tech.role}
                    </p>

                    <div className="mt-3 px-3 py-2 bg-slate-50 rounded-lg">

                      <p className="text-xs text-slate-400">
                        Specialty
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {tech.specialty}
                      </p>

                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">

                      <p className="text-2xl font-bold text-slate-800">
                        {tech.tasks}
                      </p>

                      <p className="text-xs text-slate-400">
                        Assigned Tasks
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </>
          )}

          {/* ================= EQUIPMENT ================= */}
          {activeSection === "equipment" && (
            <>

              <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-900">
                  🛠️ Equipment & Assets
                </h2>

                <p className="text-slate-500">
                  Monitor important resort technical equipment.
                </p>

              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

                {[
                  {
                    name: "Central AC System",
                    location: "Main Building",
                    status: "Operational",
                    icon: "❄️",
                  },
                  {
                    name: "Water Pump",
                    location: "Utility Room",
                    status: "Operational",
                    icon: "🚰",
                  },
                  {
                    name: "Generator",
                    location: "Power Room",
                    status: "Standby",
                    icon: "⚡",
                  },
                  {
                    name: "Kitchen Equipment",
                    location: "Main Kitchen",
                    status: "Operational",
                    icon: "👨‍🍳",
                  },
                  {
                    name: "Elevator",
                    location: "Main Lobby",
                    status: "Operational",
                    icon: "🛗",
                  },
                  {
                    name: "Fire Safety System",
                    location: "Entire Resort",
                    status: "Operational",
                    icon: "🚒",
                  },
                ].map((equipment) => (

                  <div
                    key={equipment.name}
                    className="bg-white rounded-2xl border border-slate-200 p-5"
                  >

                    <div className="flex items-center justify-between">

                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
                        {equipment.icon}
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        {equipment.status}
                      </span>

                    </div>

                    <h3 className="font-bold text-slate-900 mt-4">
                      {equipment.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      📍 {equipment.location}
                    </p>

                    <button
                      onClick={() =>
                        alert(
                          `${equipment.name} maintenance details`
                        )
                      }
                      className="w-full mt-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100"
                    >
                      View Details
                    </button>

                  </div>

                ))}

              </div>

            </>
          )}

        </main>

      </div>

    </div>
  )
}

export default TechnicianDashboard