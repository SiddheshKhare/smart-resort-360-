import { useState } from "react"
import GuestConcierge from "./GuestConcierge"

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://smart-resort-360-r3gq.onrender.com")

async function postJSON(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const text = await response.text()
  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    // Backend may not implement this route yet — the caller falls
    // back to an optimistic local update either way.
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${response.status})`)
  }

  return data
}

// Demo guest identity — kept consistent with the profile already used
// by the AI Guest Concierge elsewhere in the app.
const CURRENT_GUEST = {
  name: "Rahul Sharma",
  room: "204",
  checkIn: "10 Sept 2026",
  checkOut: "12 Sept 2026",
  guests: 2,
  status: "Checked In",
}

const FOOD_ITEMS = [
  "Butter Garlic Paneer",
  "Tandoori Platter",
  "Chef's Special Pasta",
  "Masala Dosa",
  "Club Sandwich",
]

const ACTIVITIES = [
  "Sunset Kayaking",
  "Nature Trail Walk",
  "Spa Session",
  "Pool-side Yoga",
  "Live Music Evening",
]

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function GuestDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState(null) // 'food' | 'housekeeping' | 'maintenance' | 'activity' | null

  const [foodItem, setFoodItem] = useState(FOOD_ITEMS[0])
  const [foodQty, setFoodQty] = useState(1)
  const [housekeepingNote, setHousekeepingNote] = useState("")
  const [maintenanceNote, setMaintenanceNote] = useState("")
  const [activityChoice, setActivityChoice] = useState(ACTIVITIES[0])

  const [orders, setOrders] = useState([])
  const [requests, setRequests] = useState([])
  const [activityBookings, setActivityBookings] = useState([])

  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  function showToast(text) {
    setToast(text)
    setTimeout(() => setToast(null), 3000)
  }

  async function submitFoodOrder(e) {
    e.preventDefault()
    setSubmitting(true)

    const order = {
      id: `local-${Date.now()}`,
      guestName: CURRENT_GUEST.name,
      roomNumber: CURRENT_GUEST.room,
      item: foodItem,
      quantity: foodQty,
      status: "New",
      time: timeNow(),
    }

    try {
      await postJSON(`${API_BASE_URL}/api/orders`, {
        guestName: order.guestName,
        roomNumber: order.roomNumber,
        item: order.item,
        quantity: order.quantity,
      })
    } catch (error) {
      console.error("Order sync error:", error)
    } finally {
      setOrders((prev) => [order, ...prev])
      setSubmitting(false)
      setActiveSection(null)
      showToast("🍽️ Food order sent to the kitchen")
    }
  }

  async function submitHousekeeping(e) {
    e.preventDefault()
    if (!housekeepingNote.trim()) return
    setSubmitting(true)

    const request = {
      id: `local-${Date.now()}`,
      roomNumber: CURRENT_GUEST.room,
      note: housekeepingNote.trim(),
      type: "Housekeeping",
      status: "Pending",
      time: timeNow(),
    }

    try {
      await postJSON(`${API_BASE_URL}/api/housekeeping/requests`, {
        roomNumber: request.roomNumber,
        note: request.note,
      })
    } catch (error) {
      console.error("Housekeeping sync error:", error)
    } finally {
      setRequests((prev) => [request, ...prev])
      setHousekeepingNote("")
      setSubmitting(false)
      setActiveSection(null)
      showToast("🧹 Housekeeping notified")
    }
  }

  async function submitMaintenance(e) {
    e.preventDefault()
    if (!maintenanceNote.trim()) return
    setSubmitting(true)

    const request = {
      id: `local-${Date.now()}`,
      roomNumber: CURRENT_GUEST.room,
      note: maintenanceNote.trim(),
      type: "Maintenance",
      status: "Pending",
      time: timeNow(),
    }

    try {
      await postJSON(`${API_BASE_URL}/api/maintenance/requests`, {
        roomNumber: request.roomNumber,
        note: request.note,
      })
    } catch (error) {
      console.error("Maintenance sync error:", error)
    } finally {
      setRequests((prev) => [request, ...prev])
      setMaintenanceNote("")
      setSubmitting(false)
      setActiveSection(null)
      showToast("🔧 Maintenance team notified")
    }
  }

  async function submitActivity(e) {
    e.preventDefault()
    setSubmitting(true)

    const booking = {
      id: `local-${Date.now()}`,
      guestName: CURRENT_GUEST.name,
      roomNumber: CURRENT_GUEST.room,
      activity: activityChoice,
      status: "Pending",
      time: timeNow(),
    }

    try {
      await postJSON(`${API_BASE_URL}/api/bookings`, {
        guestName: booking.guestName,
        roomNumber: booking.roomNumber,
        activity: booking.activity,
      })
    } catch (error) {
      console.error("Activity booking sync error:", error)
    } finally {
      setActivityBookings((prev) => [booking, ...prev])
      setSubmitting(false)
      setActiveSection(null)
      showToast("🎯 Activity booked")
    }
  }

  const quickActions = [
    { key: "food", icon: "🍽️", label: "Order Food", subtitle: "Room service, made fresh" },
    { key: "housekeeping", icon: "🧹", label: "Request Housekeeping", subtitle: "Cleaning, towels, amenities" },
    { key: "maintenance", icon: "🔧", label: "Report an Issue", subtitle: "AC, plumbing, electrical" },
    { key: "activity", icon: "🎯", label: "Book an Activity", subtitle: "Kayaking, spa, and more" },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-6 sm:px-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Smart Resort 360</h1>
          <p className="text-slate-400 mt-1">Guest Portal</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-semibold">🧳 {CURRENT_GUEST.name}</p>
            <p className="text-sm text-slate-400">Room {CURRENT_GUEST.room}</p>
          </div>

          <button
            onClick={onLogout}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg">
            {toast}
          </div>
        )}

        {/* Welcome + stay card */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome back, {CURRENT_GUEST.name.split(" ")[0]}! 👋
          </h2>
          <p className="text-slate-500 mt-1">Here's everything for your stay.</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-slate-400 text-sm">YOUR STAY</p>
              <h3 className="text-2xl font-bold mt-1">Room {CURRENT_GUEST.room}</h3>
              <p className="text-slate-400 mt-1">
                {CURRENT_GUEST.checkIn} → {CURRENT_GUEST.checkOut} · {CURRENT_GUEST.guests} guests
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-400 text-sm">Status</p>
              <p className="text-green-400 font-semibold mt-1">● {CURRENT_GUEST.status}</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((action) => (
              <button
                key={action.key}
                onClick={() =>
                  setActiveSection((current) => (current === action.key ? null : action.key))
                }
                className={`text-left bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition ${
                  activeSection === action.key ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h4 className="font-bold">{action.label}</h4>
                <p className="text-slate-500 text-sm mt-1">{action.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Food order form */}
        {activeSection === "food" && (
          <form
            onSubmit={submitFoodOrder}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h4 className="font-bold text-lg">🍽️ Order Food to Room {CURRENT_GUEST.room}</h4>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Item</label>
                <select
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {FOOD_ITEMS.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={foodQty}
                  onChange={(e) => setFoodQty(Number(e.target.value) || 1)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Order to Kitchen →"}
            </button>
          </form>
        )}

        {/* Housekeeping form */}
        {activeSection === "housekeeping" && (
          <form
            onSubmit={submitHousekeeping}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h4 className="font-bold text-lg">🧹 Request Housekeeping</h4>

            <textarea
              value={housekeepingNote}
              onChange={(e) => setHousekeepingNote(e.target.value)}
              placeholder="e.g. Extra towels and pillows, please clean around 3 PM"
              className="w-full border border-slate-200 rounded-xl p-4 min-h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Request →"}
            </button>
          </form>
        )}

        {/* Maintenance form */}
        {activeSection === "maintenance" && (
          <form
            onSubmit={submitMaintenance}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h4 className="font-bold text-lg">🔧 Report a Maintenance Issue</h4>

            <textarea
              value={maintenanceNote}
              onChange={(e) => setMaintenanceNote(e.target.value)}
              placeholder="e.g. AC is not cooling properly"
              className="w-full border border-slate-200 rounded-xl p-4 min-h-24 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Notify Technician →"}
            </button>
          </form>
        )}

        {/* Activity booking form */}
        {activeSection === "activity" && (
          <form
            onSubmit={submitActivity}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <h4 className="font-bold text-lg">🎯 Book an Activity</h4>

            <select
              value={activityChoice}
              onChange={(e) => setActivityChoice(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ACTIVITIES.map((activity) => (
                <option key={activity}>{activity}</option>
              ))}
            </select>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Booking →"}
            </button>
          </form>
        )}

        {/* Activity + order history */}
        {(orders.length > 0 || requests.length > 0 || activityBookings.length > 0) && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Your Requests Today</h3>
            </div>

            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="p-5 flex items-center gap-4">
                  <span className="text-2xl">🍽️</span>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {order.quantity}× {order.item}
                    </p>
                    <p className="text-sm text-slate-500">Sent {order.time}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {order.status}
                  </span>
                </div>
              ))}

              {requests.map((request) => (
                <div key={request.id} className="p-5 flex items-center gap-4">
                  <span className="text-2xl">{request.type === "Housekeeping" ? "🧹" : "🔧"}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{request.type}</p>
                    <p className="text-sm text-slate-500">{request.note}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {request.status}
                  </span>
                </div>
              ))}

              {activityBookings.map((booking) => (
                <div key={booking.id} className="p-5 flex items-center gap-4">
                  <span className="text-2xl">🎯</span>
                  <div className="flex-1">
                    <p className="font-semibold">{booking.activity}</p>
                    <p className="text-sm text-slate-500">Booked {booking.time}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Concierge */}
        <div>
          <h3 className="text-xl font-bold mb-4">Your AI Concierge</h3>
          <GuestConcierge />
        </div>
      </div>
    </div>
  )
}

export default GuestDashboard

import { socket } from "./socket";

// Inside submitFoodOrder:
async function submitFoodOrder(e) {
  e.preventDefault();
  setSubmitting(true);

  const order = {
    id: `ord-${Date.now()}`,
    guestName: CURRENT_GUEST.name,
    roomNumber: CURRENT_GUEST.room,
    item: foodItem,
    quantity: foodQty,
    status: "New",
    time: timeNow(),
  };

  try {
    await postJSON(`${API_BASE_URL}/api/orders`, order);
    
    // Broadcast live event to Kitchen and Admin Dashboards
    socket.emit("new_order", order);
  } catch (error) {
    console.error("Order sync error:", error);
  } finally {
    setOrders((prev) => [order, ...prev]);
    setSubmitting(false);
    setActiveSection(null);
    showToast("🍽️ Food order sent to the kitchen");
  }
}