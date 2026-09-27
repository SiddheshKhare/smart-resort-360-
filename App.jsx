import AIDynamicPricingWidget from "./AIDynamicPricing"
import { useEffect, useState } from "react"

import Revenue from "./Revenue"
import Login from "./Login"
import GuestDashboard from "./GuestDashboard"
import ReceptionDashboard from "./ReceptionDashboard"
import HousekeepingDashboard from "./HousekeepingDashboard"
import TechnicianDashboard from "./TechnicianDashboard"
import KitchenDashboard from "./KitchenDashboard"
import AICommandCenter from "./AICommandCenter"
import WeatherDigitalTwin from "./WeatherDigitalTwin"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://smart-resort-360-r3gq.onrender.com")

const fetchJSON = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  const text = await response.text()

  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error(
      "Backend server response is invalid. Please check that the backend server is running."
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    )
  }

  return data
}

/* ---------------- HELPERS ---------------- */

const normalizeRoom = (room, index) => {
  const roomNumber =
    room.roomNumber ||
    room.room_no ||
    room.room ||
    room.number ||
    room.name ||
    `${101 + index}`

  const status =
    room.status ||
    room.roomStatus ||
    room.room_status ||
    "Available"

  return {
    ...room,
    id: room.id || roomNumber,
    roomNumber: String(roomNumber),
    roomType:
      room.roomType ||
      room.room_type ||
      room.type ||
      "Deluxe",
    status,
    guestName:
      room.guestName ||
      room.guest_name ||
      room.guest ||
      "",
    price:
      Number(
        room.price ||
          room.basePrice ||
          room.base_price ||
          8000
      ) || 8000,
  }
}

const normalizeOrder = (order, index) => {
  return {
    ...order,
    id: order.id || index + 1,
    guestName:
      order.guestName ||
      order.guest_name ||
      order.guest ||
      "Guest",
    roomNumber:
      order.roomNumber ||
      order.room_number ||
      order.room ||
      "N/A",
    item:
      order.item ||
      order.items ||
      order.foodItem ||
      order.food_item ||
      "Food Order",
    quantity:
      Number(order.quantity) ||
      1,
    total:
      Number(
        order.total ||
          order.amount ||
          order.price ||
          0
      ) || 0,
    status:
      order.status ||
      order.order_status ||
      "New",
  }
}

const normalizeBooking = (booking, index) => {
  return {
    ...booking,
    id: booking.id || index + 1,
    guestName:
      booking.guestName ||
      booking.guest_name ||
      "Guest",
    roomNumber:
      booking.roomNumber ||
      booking.room_number ||
      "N/A",
    activity:
      booking.activity ||
      booking.activity_name ||
      "Activity",
    status:
      booking.status ||
      "Pending",
  }
}

const getStatusColor = (status) => {
  const value = String(status || "").toLowerCase()

  if (
    value.includes("available") ||
    value.includes("completed") ||
    value.includes("delivered") ||
    value.includes("ready")
  ) {
    return "bg-green-100 text-green-700"
  }

  if (
    value.includes("occupied") ||
    value.includes("preparing") ||
    value.includes("progress")
  ) {
    return "bg-blue-100 text-blue-700"
  }

  if (
    value.includes("cleaning") ||
    value.includes("pending")
  ) {
    return "bg-yellow-100 text-yellow-700"
  }

  if (
    value.includes("maintenance") ||
    value.includes("cancel")
  ) {
    return "bg-red-100 text-red-700"
  }

  return "bg-slate-100 text-slate-600"
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)

  const [activeTab, setActiveTab] = useState("dashboard")

  const [rooms, setRooms] = useState([])
  const [orders, setOrders] = useState([])
  const [activityBookings, setActivityBookings] = useState([])

  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingBookings, setLoadingBookings] =
    useState(false)

  /* Light mode by default */
  const [darkMode, setDarkMode] = useState(false)

  /* ---------------- LOAD ADMIN DATA ---------------- */

  const loadRooms = async () => {
    try {
      setLoadingRooms(true)

      const data = await fetchJSON(
        `${API_BASE_URL}/api/rooms`
      )

      const roomArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.rooms)
        ? data.rooms
        : []

      setRooms(roomArray.map(normalizeRoom))
    } catch (error) {
      console.error("Rooms error:", error)

      setRooms([
        {
          id: 101,
          roomNumber: "101",
          roomType: "Deluxe",
          status: "Available",
          guestName: "",
          price: 8000,
        },
        {
          id: 102,
          roomNumber: "102",
          roomType: "Deluxe",
          status: "Occupied",
          guestName: "Sneha Joshi",
          price: 8000,
        },
        {
          id: 108,
          roomNumber: "108",
          roomType: "Premium",
          status: "Occupied",
          guestName: "Priya Patil",
          price: 10000,
        },
        {
          id: 204,
          roomNumber: "204",
          roomType: "Suite",
          status: "Occupied",
          guestName: "Rahul Sharma",
          price: 12000,
        },
        {
          id: 205,
          roomNumber: "205",
          roomType: "Suite",
          status: "Cleaning",
          guestName: "",
          price: 12000,
        },
        {
          id: 301,
          roomNumber: "301",
          roomType: "Deluxe",
          status: "Available",
          guestName: "",
          price: 8000,
        },
        {
          id: 302,
          roomNumber: "302",
          roomType: "Premium",
          status: "Maintenance",
          guestName: "",
          price: 10000,
        },
        {
          id: 303,
          roomNumber: "303",
          roomType: "Villa",
          status: "Occupied",
          guestName: "Amit Deshmukh",
          price: 15000,
        },
      ])
    } finally {
      setLoadingRooms(false)
    }
  }

  const loadOrders = async () => {
    try {
      setLoadingOrders(true)

      const data = await fetchJSON(
        `${API_BASE_URL}/api/orders`
      )

      const orderArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
        ? data.orders
        : []

      setOrders(orderArray.map(normalizeOrder))
    } catch (error) {
      console.error("Orders error:", error)
      setOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  const loadBookings = async () => {
    try {
      setLoadingBookings(true)

      const data = await fetchJSON(
        `${API_BASE_URL}/api/bookings`
      )

      const bookingArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : []

      setActivityBookings(
        bookingArray.map(normalizeBooking)
      )
    } catch (error) {
      console.error("Bookings error:", error)
      setActivityBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  useEffect(() => {
    if (!loggedIn) return

    if (userRole === "admin") {
      loadRooms()
      loadOrders()
      loadBookings()
    }
  }, [loggedIn, userRole])

  /* ---------------- UPDATE ORDER ---------------- */

  const updateOrderStatus = async (id, status) => {
    try {
      await fetchJSON(
        `${API_BASE_URL}/api/orders/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
          }),
        }
      )

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order
        )
      )
    } catch (error) {
      console.error("Order update error:", error)

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order
        )
      )
    }
  }

  /* ---------------- UPDATE ACTIVITY BOOKING ---------------- */

  const updateActivityStatus = async (
    id,
    status
  ) => {
    try {
      await fetchJSON(
        `${API_BASE_URL}/api/bookings/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
          }),
        }
      )

      setActivityBookings((current) =>
        current.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
              }
            : booking
        )
      )
    } catch (error) {
      console.error(
        "Activity booking update error:",
        error
      )

      setActivityBookings((current) =>
        current.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status,
              }
            : booking
        )
      )
    }
  }

  /* ---------------- LOGIN ---------------- */

  const handleLogin = (role) => {
    setUserRole(role)
    setLoggedIn(true)

    if (role === "admin") {
      setActiveTab("dashboard")
    }
  }

  /* ---------------- LOGOUT ---------------- */

  const handleLogout = () => {
    setLoggedIn(false)
    setUserRole(null)
    setActiveTab("dashboard")

    setRooms([])
    setOrders([])
    setActivityBookings([])
  }

  /* =========================================================
     LOGIN SCREEN
  ========================================================= */

  if (!loggedIn) {
    return (
      <Login
        onLogin={handleLogin}
      />
    )
  }

  /* =========================================================
     RECEPTIONIST
  ========================================================= */

  if (userRole === "receptionist") {
    return (
      <ReceptionDashboard
        onLogout={handleLogout}
      />
    )
  }

  /* =========================================================
     HOUSEKEEPING
  ========================================================= */

  if (userRole === "housekeeping") {
    return (
      <HousekeepingDashboard
        onLogout={handleLogout}
      />
    )
  }

  /* =========================================================
     TECHNICIAN
  ========================================================= */

  if (userRole === "technician") {
    return (
      <TechnicianDashboard
        onLogout={handleLogout}
      />
    )
  }

  /* =========================================================
     KITCHEN
  ========================================================= */

  if (userRole === "kitchen") {
    return (
      <KitchenDashboard
        onLogout={handleLogout}
      />
    )
  }

  /* =========================================================
     GUEST DASHBOARD
  ========================================================= */

  if (userRole === "guest") {
    return (
      <GuestDashboard
        onLogout={handleLogout}
      />
    )
  }

  /* =========================================================
     ADMIN DASHBOARD
  ========================================================= */

  const totalRooms = rooms.length

  const availableRooms = rooms.filter(
    (room) =>
      String(room.status).toLowerCase() ===
      "available"
  ).length

  const occupiedRooms = rooms.filter(
    (room) =>
      String(room.status).toLowerCase() ===
      "occupied"
  ).length

  const cleaningRooms = rooms.filter((room) =>
    String(room.status)
      .toLowerCase()
      .includes("clean")
  ).length

  const maintenanceRooms = rooms.filter((room) =>
    String(room.status)
      .toLowerCase()
      .includes("maintenance")
  ).length

  const activeOrders = orders.filter(
    (order) => {
      const status = String(
        order.status || ""
      ).toLowerCase()

      return (
        !status.includes("delivered") &&
        !status.includes("cancel")
      )
    }
  ).length

  const completedOrders = orders.filter(
    (order) =>
      String(order.status || "")
        .toLowerCase()
        .includes("delivered")
  ).length

  const activeActivities =
    activityBookings.filter(
      (booking) =>
        !String(booking.status || "")
          .toLowerCase()
          .includes("completed")
    ).length

  const revenue = orders
    .filter(
      (order) =>
        !String(order.status || "")
          .toLowerCase()
          .includes("cancel")
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    )

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-slate-950 text-white"
          : "min-h-screen bg-slate-50 text-slate-800"
      }
    >
      <header
        className={
          darkMode
            ? "sticky top-0 z-30 border-b border-slate-800 bg-slate-900/95 backdrop-blur"
            : "sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"
        }
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl text-white shadow-lg">
              🏨
            </div>

            <div>
              <h1
                className={
                  darkMode
                    ? "text-xl font-bold text-white"
                    : "text-xl font-bold text-slate-900"
                }
              >
                Smart Resort 360
              </h1>

              <p
                className={
                  darkMode
                    ? "text-xs text-slate-400"
                    : "text-xs text-slate-500"
                }
              >
                AI-Powered Resort Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p
                className={
                  darkMode
                    ? "text-sm font-bold text-white"
                    : "text-sm font-bold text-slate-800"
                }
              >
                Resort Admin
              </p>

              <p
                className={
                  darkMode
                    ? "text-xs text-slate-400"
                    : "text-xs text-slate-500"
                }
              >
                Operations Control Center
              </p>
            </div>

            <button
              onClick={() =>
                setDarkMode((current) => !current)
              }
              className={
                darkMode
                  ? "rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700"
                  : "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              }
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        <aside
          className={
            darkMode
              ? "hidden w-64 border-r border-slate-800 bg-slate-900 p-4 lg:block"
              : "hidden w-64 border-r border-slate-200 bg-white p-4 lg:block"
          }
        >
          <div className="mb-5 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-5 text-white shadow-lg">
            <div className="text-3xl">🤖</div>

            <h2 className="mt-3 text-lg font-bold">
              AI Operations
            </h2>

            <p className="mt-1 text-xs text-indigo-100">
              Smart Resort 360 Command Center
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              AI Systems Online
            </div>
          </div>

          <nav className="space-y-1">
            <SidebarButton
              active={activeTab === "dashboard"}
              onClick={() =>
                setActiveTab("dashboard")
              }
              icon="📊"
              label="Dashboard"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "rooms"}
              onClick={() =>
                setActiveTab("rooms")
              }
              icon="🏨"
              label="Rooms"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "housekeeping"}
              onClick={() =>
                setActiveTab("housekeeping")
              }
              icon="🧹"
              label="Housekeeping"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "orders"}
              onClick={() =>
                setActiveTab("orders")
              }
              icon="🍽️"
              label="Food Orders"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "activities"}
              onClick={() =>
                setActiveTab("activities")
              }
              icon="🎯"
              label="Activity Bookings"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "revenue"}
              onClick={() =>
                setActiveTab("revenue")
              }
              icon="💰"
              label="Revenue"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "ai"}
              onClick={() =>
                setActiveTab("ai")
              }
              icon="🤖"
              label="AI Command Center"
              darkMode={darkMode}
            />

            <SidebarButton
              active={activeTab === "weathertwin"}
              onClick={() =>
                setActiveTab("weathertwin")
              }
              icon="🌦️"
              label="Weather Digital Twin"
              darkMode={darkMode}
            />
          </nav>

          <div
            className={
              darkMode
                ? "mt-6 rounded-2xl bg-slate-800 p-4"
                : "mt-6 rounded-2xl bg-slate-50 p-4"
            }
          >
            <p
              className={
                darkMode
                  ? "text-xs font-semibold uppercase tracking-wide text-slate-400"
                  : "text-xs font-semibold uppercase tracking-wide text-slate-400"
              }
            >
              System Status
            </p>

            <div className="mt-3 space-y-2 text-xs">
              <SystemStatus
                label="AI Engine"
                value="Online"
              />

              <SystemStatus
                label="Database"
                value="Connected"
              />

              <SystemStatus
                label="Booking API"
                value="Online"
              />
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {[
              ["dashboard", "📊", "Dashboard"],
              ["rooms", "🏨", "Rooms"],
              ["housekeeping", "🧹", "Housekeeping"],
              ["orders", "🍽️", "Orders"],
              ["activities", "🎯", "Activities"],
              ["revenue", "💰", "Revenue"],
              ["ai", "🤖", "AI"],
              ["weathertwin", "🌦️", "Weather Twin"],
            ].map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() =>
                  setActiveTab(key)
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ${
                  activeTab === key
                    ? "bg-indigo-600 text-white"
                    : darkMode
                    ? "bg-slate-800 text-slate-300"
                    : "bg-white text-slate-600"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {(activeTab === "dashboard" ||
            activeTab === "rooms") && (
            <>
              <div
                className={
                  darkMode
                    ? "mb-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 text-white shadow-lg"
                    : "mb-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white shadow-lg"
                }
              >
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-indigo-100">
                      <span>✨</span>
                      Smart Resort 360
                    </div>

                    <h2 className="mt-2 text-3xl font-bold">
                      Resort Operations Center
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                      Monitor rooms, guests, food orders,
                      housekeeping, revenue and AI-powered
                      resort intelligence from one place.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <MiniHeroStat
                      label="Occupancy"
                      value={
                        totalRooms
                          ? `${Math.round(
                              (occupiedRooms /
                                totalRooms) *
                                100
                            )}%`
                          : "0%"
                      }
                    />

                    <MiniHeroStat
                      label="AI Status"
                      value="Online"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <AdminStat
                  title="Total Rooms"
                  value={totalRooms || 50}
                  icon="🏨"
                  description="Resort inventory"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Available"
                  value={
                    totalRooms
                      ? availableRooms
                      : 18
                  }
                  icon="🟢"
                  description="Ready for booking"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Occupied"
                  value={occupiedRooms}
                  icon="👤"
                  description="Currently occupied"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Active Orders"
                  value={activeOrders}
                  icon="🍽️"
                  description="Food operations"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Activities"
                  value={activeActivities}
                  icon="🎯"
                  description="Active bookings"
                  darkMode={darkMode}
                />
              </div>

              <div className="mt-6">
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2
                      className={
                        darkMode
                          ? "text-xl font-bold text-white"
                          : "text-xl font-bold text-slate-900"
                      }
                    >
                      Room Management
                    </h2>

                    <p
                      className={
                        darkMode
                          ? "text-sm text-slate-400"
                          : "text-sm text-slate-500"
                      }
                    >
                      Live room status and guest information
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <StatusLegend
                      color="bg-green-500"
                      label={`Available ${availableRooms}`}
                    />

                    <StatusLegend
                      color="bg-blue-500"
                      label={`Occupied ${occupiedRooms}`}
                    />

                    <StatusLegend
                      color="bg-yellow-500"
                      label={`Cleaning ${cleaningRooms}`}
                    />

                    <StatusLegend
                      color="bg-red-500"
                      label={`Maintenance ${maintenanceRooms}`}
                    />
                  </div>
                </div>

                {loadingRooms ? (
                  <LoadingBox
                    text="Loading room data..."
                    darkMode={darkMode}
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {rooms.map((room) => (
                      <RoomCard
                        key={room.id}
                        room={room}
                        darkMode={darkMode}
                      />
                    ))}
                  </div>
                )}
              </div>

              {!loadingRooms &&
                rooms.length === 0 && (
                  <div
                    className={
                      darkMode
                        ? "mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400"
                        : "mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500"
                    }
                  >
                    No room data available.
                  </div>
                )}

              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                <QuickFeature
                  icon="🧹"
                  title="Housekeeping"
                  description="Monitor cleaning tasks and room readiness."
                  button="Open Housekeeping"
                  onClick={() =>
                    setActiveTab("housekeeping")
                  }
                  darkMode={darkMode}
                />

                <QuickFeature
                  icon="🍽️"
                  title="Food Operations"
                  description="Track guest orders and kitchen activity."
                  button="View Orders"
                  onClick={() =>
                    setActiveTab("orders")
                  }
                  darkMode={darkMode}
                />

                <QuickFeature
                  icon="🤖"
                  title="AI Command Center"
                  description="Use AI for pricing and operational decisions."
                  button="Open AI Center"
                  onClick={() =>
                    setActiveTab("ai")
                  }
                  darkMode={darkMode}
                />
              </div>
            </>
          )}

          {activeTab === "housekeeping" && (
            <section>
              <SectionHeader
                title="Housekeeping Operations 🧹"
                subtitle="Room cleaning and operational status overview"
                darkMode={darkMode}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStat
                  title="Cleaning Rooms"
                  value={cleaningRooms}
                  icon="🧹"
                  description="Currently cleaning"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Available Rooms"
                  value={availableRooms}
                  icon="🟢"
                  description="Ready"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Maintenance"
                  value={maintenanceRooms}
                  icon="🔧"
                  description="Need attention"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Occupied"
                  value={occupiedRooms}
                  icon="👤"
                  description="Guest rooms"
                  darkMode={darkMode}
                />
              </div>

              <div className="mt-6">
                <button
                  onClick={() =>
                    setActiveTab("dashboard")
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </section>
          )}

          {activeTab === "orders" && (
            <section>
              <SectionHeader
                title="Food Orders 🍽️"
                subtitle="Live guest dining and room-service orders"
                darkMode={darkMode}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStat
                  title="Active Orders"
                  value={activeOrders}
                  icon="🔥"
                  description="In progress"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Completed"
                  value={completedOrders}
                  icon="✅"
                  description="Delivered orders"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Revenue"
                  value={`₹${revenue.toLocaleString()}`}
                  icon="💰"
                  description="Food revenue"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Total Orders"
                  value={orders.length}
                  icon="🍴"
                  description="All orders"
                  darkMode={darkMode}
                />
              </div>

              <div
                className={
                  darkMode
                    ? "mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900"
                    : "mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white"
                }
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px]">
                    <thead
                      className={
                        darkMode
                          ? "bg-slate-800"
                          : "bg-slate-50"
                      }
                    >
                      <tr>
                        <TableHead text="Order" darkMode={darkMode} />
                        <TableHead text="Guest" darkMode={darkMode} />
                        <TableHead text="Room" darkMode={darkMode} />
                        <TableHead text="Item" darkMode={darkMode} />
                        <TableHead text="Amount" darkMode={darkMode} />
                        <TableHead text="Status" darkMode={darkMode} />
                        <TableHead text="Action" darkMode={darkMode} />
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={order.id || index}
                          className={
                            darkMode
                              ? "border-t border-slate-800"
                              : "border-t border-slate-100"
                          }
                        >
                          <TableCell
                            value={order.orderNo || `ORD-${index + 1}`}
                            darkMode={darkMode}
                          />
                          <TableCell value={order.guestName} darkMode={darkMode} />
                          <TableCell value={order.roomNumber} darkMode={darkMode} />
                          <TableCell
                            value={
                              Array.isArray(order.item)
                                ? order.item.join(", ")
                                : order.item
                            }
                            darkMode={darkMode}
                          />
                          <TableCell
                            value={`₹${Number(order.total || 0).toLocaleString()}`}
                            darkMode={darkMode}
                          />
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={order.status || "New"}
                              onChange={(e) =>
                                updateOrderStatus(order.id, e.target.value)
                              }
                              className={
                                darkMode
                                  ? "rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
                                  : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                              }
                            >
                              <option value="New">New</option>
                              <option value="Preparing">Preparing</option>
                              <option value="Ready">Ready</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {loadingOrders && (
                  <LoadingBox text="Loading orders..." darkMode={darkMode} />
                )}

                {!loadingOrders && orders.length === 0 && (
                  <div
                    className={
                      darkMode
                        ? "p-10 text-center text-slate-400"
                        : "p-10 text-center text-slate-500"
                    }
                  >
                    No food orders found.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "activities" && (
            <section>
              <SectionHeader
                title="Activity Bookings 🎯"
                subtitle="Manage resort activities booked by guests"
                darkMode={darkMode}
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <AdminStat
                  title="Active Activities"
                  value={activeActivities}
                  icon="🎯"
                  description="Current bookings"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Total Bookings"
                  value={activityBookings.length}
                  icon="📅"
                  description="All activity bookings"
                  darkMode={darkMode}
                />

                <AdminStat
                  title="Completed"
                  value={
                    activityBookings.filter((booking) =>
                      String(booking.status || "")
                        .toLowerCase()
                        .includes("completed")
                    ).length
                  }
                  icon="✅"
                  description="Completed activities"
                  darkMode={darkMode}
                />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {activityBookings.map((booking, index) => (
                  <div
                    key={booking.id || index}
                    className={
                      darkMode
                        ? "rounded-2xl border border-slate-800 bg-slate-900 p-5"
                        : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={
                            darkMode
                              ? "font-bold text-white"
                              : "font-bold text-slate-900"
                          }
                        >
                          {booking.activity}
                        </p>

                        <p
                          className={
                            darkMode
                              ? "mt-1 text-sm text-slate-400"
                              : "mt-1 text-sm text-slate-500"
                          }
                        >
                          {booking.guestName}
                          {" · "}
                          Room {booking.roomNumber}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <select
                        value={booking.status || "Pending"}
                        onChange={(e) =>
                          updateActivityStatus(booking.id, e.target.value)
                        }
                        className={
                          darkMode
                            ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 text-sm text-white"
                            : "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm"
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {loadingBookings && (
                <LoadingBox
                  text="Loading activity bookings..."
                  darkMode={darkMode}
                />
              )}

              {!loadingBookings && activityBookings.length === 0 && (
                <div
                  className={
                    darkMode
                      ? "mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400"
                      : "mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500"
                  }
                >
                  No activity bookings found.
                </div>
              )}
            </section>
          )}

          {activeTab === "revenue" && (
            <section>
              <SectionHeader
                title="Revenue Intelligence 💰"
                subtitle="Resort revenue and pricing analytics"
                darkMode={darkMode}
              />
              <Revenue />
            </section>
          )}

          {activeTab === "ai" && (
            <section>
              <SectionHeader
                title="AI Command Center 🤖"
                subtitle="AI-powered resort management and revenue intelligence"
                darkMode={darkMode}
              />
              <AICommandCenter />
            </section>
          )}

          {activeTab === "weathertwin" && (
            <section>
              <SectionHeader
                title="Weather Digital Twin 🌦️"
                subtitle="Live weather, cascading impact simulation and what-if scenarios"
                darkMode={darkMode}
              />
              <WeatherDigitalTwin
                rooms={rooms}
                orders={orders}
                activityBookings={activityBookings}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

/* =========================================================
   COMPONENTS
========================================================= */

const SidebarButton = ({ active, onClick, icon, label, darkMode }) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
        active
          ? "bg-indigo-600 text-white shadow-md"
          : darkMode
          ? "text-slate-300 hover:bg-slate-800"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  )
}

const AdminStat = ({ title, value, icon, description, darkMode }) => {
  return (
    <div
      className={
        darkMode
          ? "rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm"
          : "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={
              darkMode
                ? "text-xs font-semibold text-slate-400"
                : "text-xs font-semibold text-slate-500"
            }
          >
            {title}
          </p>
          <p
            className={
              darkMode
                ? "mt-2 text-3xl font-bold text-white"
                : "mt-2 text-3xl font-bold text-slate-900"
            }
          >
            {value}
          </p>

          <p
            className={
              darkMode
                ? "mt-1 text-xs text-slate-500"
                : "mt-1 text-xs text-slate-400"
            }
          >
            {description}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
          {icon}
        </div>
      </div>
    </div>
  )
}

const RoomCard = ({ room, darkMode }) => {
  return (
    <div
      className={
        darkMode
          ? "group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-indigo-500"
          : "group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      }
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={
              darkMode
                ? "text-xs font-semibold text-slate-500"
                : "text-xs font-semibold text-slate-400"
            }
          >
            ROOM
          </p>

          <h3
            className={
              darkMode
                ? "mt-1 text-2xl font-bold text-white"
                : "mt-1 text-2xl font-bold text-slate-900"
            }
          >
            {room.roomNumber}
          </h3>

          <p
            className={
              darkMode
                ? "mt-1 text-sm text-slate-400"
                : "mt-1 text-sm text-slate-500"
            }
          >
            {room.roomType}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          🛏️
        </div>
      </div>

      <div className="mt-5">
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusColor(
            room.status
          )}`}
        >
          {room.status}
        </span>
      </div>

      {room.guestName ? (
        <div
          className={
            darkMode
              ? "mt-4 rounded-xl bg-slate-800 p-3"
              : "mt-4 rounded-xl bg-slate-50 p-3"
          }
        >
          <p
            className={
              darkMode
                ? "text-xs text-slate-500"
                : "text-xs text-slate-400"
            }
          >
            Current Guest
          </p>

          <p
            className={
              darkMode
                ? "mt-1 text-sm font-semibold text-white"
                : "mt-1 text-sm font-semibold text-slate-800"
            }
          >
            👤 {room.guestName}
          </p>
        </div>
      ) : (
        <div
          className={
            darkMode
              ? "mt-4 rounded-xl bg-slate-800 p-3 text-xs text-slate-500"
              : "mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-400"
          }
        >
          No guest currently assigned
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span
          className={
            darkMode
              ? "text-xs text-slate-500"
              : "text-xs text-slate-400"
          }
        >
          Room Price
        </span>

        <span
          className={
            darkMode
              ? "font-bold text-white"
              : "font-bold text-slate-900"
          }
        >
          ₹{Number(room.price || 0).toLocaleString()}
        </span>
      </div>
    </div>
  )
}

const QuickFeature = ({
  icon,
  title,
  description,
  button,
  onClick,
  darkMode,
}) => {
  return (
    <div
      className={
        darkMode
          ? "rounded-3xl border border-slate-800 bg-slate-900 p-6"
          : "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
        {icon}
      </div>

      <h3
        className={
          darkMode
            ? "mt-4 text-lg font-bold text-white"
            : "mt-4 text-lg font-bold text-slate-900"
        }
      >
        {title}
      </h3>

      <p
        className={
          darkMode
            ? "mt-2 text-sm text-slate-400"
            : "mt-2 text-sm text-slate-500"
        }
      >
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
      >
        {button}
      </button>
    </div>
  )
}

const SectionHeader = ({ title, subtitle, darkMode }) => {
  return (
    <div className="mb-6">
      <h2
        className={
          darkMode
            ? "text-2xl font-bold text-white"
            : "text-2xl font-bold text-slate-900"
        }
      >
        {title}
      </h2>

      <p
        className={
          darkMode
            ? "mt-1 text-sm text-slate-400"
            : "mt-1 text-sm text-slate-500"
        }
      >
        {subtitle}
      </p>
    </div>
  )
}

const SystemStatus = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="flex items-center gap-1 font-semibold text-green-500">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        {value}
      </span>
    </div>
  )
}

const MiniHeroStat = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
      <p className="text-xs text-indigo-100">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  )
}

const StatusLegend = ({ color, label }) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}

const TableHead = ({ text, darkMode }) => {
  return (
    <th
      className={
        darkMode
          ? "px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400"
          : "px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500"
      }
    >
      {text}
    </th>
  )
}

const TableCell = ({ value, darkMode }) => {
  return (
    <td
      className={
        darkMode
          ? "px-4 py-4 text-sm text-slate-300"
          : "px-4 py-4 text-sm text-slate-700"
      }
    >
      {value}
    </td>
  )
}

const LoadingBox = ({ text, darkMode }) => {
  return (
    <div
      className={
        darkMode
          ? "rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400"
          : "rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500"
      }
    >
      <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      {text}
    </div>
  )
}

export default App