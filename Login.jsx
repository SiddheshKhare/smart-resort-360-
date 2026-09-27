import { useState } from "react"

const roles = {
  admin: {
    title: "Admin",
    subtitle: "Manage your entire resort",
    icon: "👨‍💼",
    gradient: "from-blue-600 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },

  worker: {
    title: "Worker",
    subtitle: "Access your department",
    icon: "👷",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },

  guest: {
    title: "Guest",
    subtitle: "Explore your resort experience",
    icon: "🧳",
    gradient: "from-orange-500 to-pink-600",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
}

const workerRoles = {
  receptionist: {
    title: "Receptionist",
    subtitle: "Reservations & guest services",
    icon: "🛎️",
    gradient: "from-blue-500 to-cyan-500",
  },

  kitchen: {
    title: "Kitchen",
    subtitle: "Food orders & kitchen operations",
    icon: "👨‍🍳",
    gradient: "from-orange-500 to-red-500",
  },

  technician: {
    title: "Technician",
    subtitle: "Maintenance & technical support",
    icon: "🔧",
    gradient: "from-purple-500 to-violet-600",
  },
}

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null)
  const [workerOpen, setWorkerOpen] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const [selectedWorker, setSelectedWorker] = useState(null)

  const selectMainRole = (role) => {
    setError("")

    if (role === "worker") {
      setWorkerOpen(true)
      setSelectedRole("worker")
      setSelectedWorker(null)
      return
    }

    setWorkerOpen(false)
    setSelectedWorker(null)
    setSelectedRole(role)
  }

  const selectWorkerRole = (role) => {
    setError("")
    setSelectedWorker(role)
    setSelectedRole(role)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.")
      return
    }

    onLogin(selectedRole)
  }

  const quickLogin = () => {
    if (!selectedRole) {
      setError("Please select a role first.")
      return
    }

    onLogin(selectedRole)
  }

  const getSelectedInfo = () => {
    if (selectedWorker) {
      return workerRoles[selectedWorker]
    }

    if (selectedRole && roles[selectedRole]) {
      return roles[selectedRole]
    }

    return null
  }

  const selectedInfo = getSelectedInfo()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">

      <div className="w-full max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">

        <div className="grid lg:grid-cols-2 min-h-[680px]">

          {/* ================= LEFT SIDE ================= */}

          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-8 md:p-12 text-white flex flex-col justify-between">

            {/* Decorative circles */}

            <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">

              {/* Logo */}

              <div className="flex items-center gap-3 mb-12">

                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl border border-white/10">
                  🏨
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    Smart Resort 360
                  </h1>

                  <p className="text-xs text-blue-200">
                    Intelligent Resort Management
                  </p>
                </div>

              </div>

              {/* Hero */}

              <div className="max-w-md">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-blue-100 mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AI Powered Resort Platform
                </div>

                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Welcome to the
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                    Future of Hospitality
                  </span>
                </h2>

                <p className="mt-6 text-blue-100/80 leading-relaxed">
                  One smart platform for resort operations,
                  guest experience, food service, maintenance
                  and intelligent decision making.
                </p>

              </div>

            </div>

            {/* Features */}

            <div className="relative z-10 grid grid-cols-3 gap-3 mt-10">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-xl mb-2">🤖</div>
                <p className="text-xs text-blue-100">
                  AI Powered
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-xl mb-2">📊</div>
                <p className="text-xs text-blue-100">
                  Smart Analytics
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-xl mb-2">⚡</div>
                <p className="text-xs text-blue-100">
                  Real Time
                </p>
              </div>

            </div>

          </div>


          {/* ================= RIGHT SIDE ================= */}

          <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">

            <div className="max-w-md w-full mx-auto">

              {/* Header */}

              <div className="mb-8">

                <p className="text-sm font-semibold text-blue-600 mb-2">
                  RESORT PORTAL
                </p>

                <h2 className="text-3xl font-bold text-slate-900">
                  Choose how you want to enter
                </h2>

                <p className="text-slate-500 mt-2">
                  Select your role to continue
                </p>

              </div>


              {/* ================= MAIN ROLE CARDS ================= */}

              <div className="grid grid-cols-3 gap-3">

                {Object.entries(roles).map(([key, role]) => {

                  const active =
                    selectedRole === key ||
                    (key === "worker" && workerOpen)

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectMainRole(key)}
                      className={`
                        relative p-4 rounded-2xl border-2 text-left
                        transition-all duration-300
                        hover:-translate-y-1 hover:shadow-lg
                        ${
                          active
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }
                      `}
                    >

                      {active && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
                      )}

                      <div
                        className={`
                          w-11 h-11 rounded-xl
                          bg-gradient-to-br ${role.gradient}
                          flex items-center justify-center
                          text-xl shadow-sm mb-3
                        `}
                      >
                        {role.icon}
                      </div>

                      <p className="font-bold text-slate-800 text-sm">
                        {role.title}
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                        {role.subtitle}
                      </p>

                    </button>
                  )
                })}

              </div>


              {/* ================= WORKER OPTIONS ================= */}

              {workerOpen && (

                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                  <div className="flex items-center justify-between mb-3">

                    <div>
                      <p className="font-bold text-slate-800">
                        Worker Department
                      </p>

                      <p className="text-xs text-slate-500">
                        Choose your department
                      </p>
                    </div>

                    <span className="text-xl">
                      👷
                    </span>

                  </div>


                  <div className="grid grid-cols-3 gap-2">

                    {Object.entries(workerRoles).map(([key, role]) => {

                      const active = selectedWorker === key

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => selectWorkerRole(key)}
                          className={`
                            p-3 rounded-xl border-2 text-center
                            transition-all duration-200
                            hover:-translate-y-0.5
                            ${
                              active
                                ? "border-emerald-500 bg-white shadow-md"
                                : "border-transparent bg-white hover:border-slate-200"
                            }
                          `}
                        >

                          <div
                            className={`
                              mx-auto w-10 h-10 rounded-xl
                              bg-gradient-to-br ${role.gradient}
                              flex items-center justify-center
                              text-lg mb-2
                            `}
                          >
                            {role.icon}
                          </div>

                          <p className="text-xs font-bold text-slate-700">
                            {role.title}
                          </p>

                        </button>
                      )
                    })}

                  </div>

                </div>
              )}


              {/* ================= SELECTED ROLE ================= */}

              {selectedInfo && (

                <div className="mt-5 flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">

                  <div
                    className={`
                      w-12 h-12 rounded-xl
                      bg-gradient-to-br ${selectedInfo.gradient}
                      flex items-center justify-center
                      text-xl
                    `}
                  >
                    {selectedInfo.icon}
                  </div>

                  <div className="flex-1">

                    <p className="text-xs text-slate-500">
                      Signing in as
                    </p>

                    <p className="font-bold text-slate-800">
                      {selectedInfo.title}
                    </p>

                    <p className="text-xs text-slate-500">
                      {selectedInfo.subtitle}
                    </p>

                  </div>

                  <span className="text-emerald-500 text-lg">
                    ✓
                  </span>

                </div>

              )}


              {/* ================= LOGIN FORM ================= */}

              {selectedRole && (

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-4"
                >

                  {/* Username */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Username
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        👤
                      </span>

                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      />

                    </div>

                  </div>


                  {/* Password */}

                  <div>

                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔒
                      </span>

                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>

                    </div>

                  </div>


                  {/* Error */}

                  {error && (

                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                      ⚠️ {error}
                    </div>

                  )}


                  {/* Login button */}

                  <button
                    type="submit"
                    className={`
                      w-full py-4 rounded-xl
                      text-white font-bold
                      bg-gradient-to-r
                      ${
                        selectedInfo
                          ? selectedInfo.gradient
                          : "from-blue-600 to-indigo-600"
                      }
                      shadow-lg
                      hover:shadow-xl
                      hover:-translate-y-0.5
                      transition-all duration-300
                    `}
                  >
                    Continue to {selectedInfo?.title || "Portal"} →
                  </button>


                  {/* Demo login */}

                  <button
                    type="button"
                    onClick={quickLogin}
                    className="w-full py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition"
                  >
                    ⚡ Quick Demo Login
                  </button>

                </form>
              )}


              {/* Initial state */}

              {!selectedRole && (

                <div className="mt-8 text-center py-6">

                  <div className="text-4xl mb-3">
                    👋
                  </div>

                  <p className="font-semibold text-slate-700">
                    Welcome to Smart Resort 360
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Select a portal above to get started
                  </p>

                </div>

              )}


              {/* Footer */}

              <div className="mt-8 text-center">

                <p className="text-xs text-slate-400">
                  © 2026 Smart Resort 360
                </p>

                <p className="text-[11px] text-slate-400 mt-1">
                  AI-Powered Resort Operations Platform
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}