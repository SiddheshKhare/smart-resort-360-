import { useMemo, useState } from "react"

const initialOrders = [
  {
    id: 1,
    orderNo: "ORD-2041",
    guestName: "Rahul Sharma",
    room: "204",
    items: ["Wood-Fired Pizza", "Garden Salad"],
    quantity: 2,
    total: 880,
    priority: "High",
    status: "New",
    time: "10:15 AM",
  },
  {
    id: 2,
    orderNo: "ORD-2042",
    guestName: "Sneha Joshi",
    room: "102",
    items: ["Chef Special Thali"],
    quantity: 1,
    total: 650,
    priority: "Normal",
    status: "Preparing",
    time: "10:25 AM",
  },
  {
    id: 3,
    orderNo: "ORD-2043",
    guestName: "Priya Patil",
    room: "108",
    items: ["Italian Pasta", "Dessert Platter"],
    quantity: 2,
    total: 870,
    priority: "Normal",
    status: "Ready",
    time: "10:40 AM",
  },
  {
    id: 4,
    orderNo: "ORD-2044",
    guestName: "Rahul Sharma",
    room: "204",
    items: ["Breakfast Platter"],
    quantity: 1,
    total: 350,
    priority: "High",
    status: "Out for Delivery",
    time: "10:55 AM",
  },
  {
    id: 5,
    orderNo: "ORD-2045",
    guestName: "Amit Deshmukh",
    room: "303",
    items: ["Wood-Fired Pizza"],
    quantity: 1,
    total: 600,
    priority: "Normal",
    status: "Delivered",
    time: "11:05 AM",
  },
  {
    id: 6,
    orderNo: "ORD-2046",
    guestName: "Sneha Joshi",
    room: "102",
    items: ["Garden Salad", "Dessert Platter"],
    quantity: 2,
    total: 600,
    priority: "Low",
    status: "New",
    time: "11:15 AM",
  },
]

const menuItems = [
  {
    name: "Breakfast Platter",
    category: "Breakfast",
    price: 350,
    available: true,
  },
  {
    name: "Garden Salad",
    category: "Healthy",
    price: 280,
    available: true,
  },
  {
    name: "Chef Special Thali",
    category: "Indian",
    price: 650,
    available: true,
  },
  {
    name: "Italian Pasta",
    category: "Italian",
    price: 550,
    available: true,
  },
  {
    name: "Wood-Fired Pizza",
    category: "Italian",
    price: 600,
    available: true,
  },
  {
    name: "Dessert Platter",
    category: "Dessert",
    price: 320,
    available: true,
  },
]

const inventoryItems = [
  {
    name: "Pizza Base",
    stock: 18,
    unit: "pcs",
    level: "Good",
  },
  {
    name: "Fresh Vegetables",
    stock: 12,
    unit: "kg",
    level: "Good",
  },
  {
    name: "Paneer",
    stock: 4,
    unit: "kg",
    level: "Low",
  },
  {
    name: "Cheese",
    stock: 7,
    unit: "kg",
    level: "Medium",
  },
  {
    name: "Rice",
    stock: 25,
    unit: "kg",
    level: "Good",
  },
  {
    name: "Dessert Ingredients",
    stock: 3,
    unit: "boxes",
    level: "Critical",
  },
]

const chefs = [
  {
    name: "Vijay Patil",
    role: "Head Chef",
    orders: 8,
    shift: "7 AM - 3 PM",
  },
  {
    name: "Amit More",
    role: "Sous Chef",
    orders: 6,
    shift: "8 AM - 4 PM",
  },
  {
    name: "Sunita Pawar",
    role: "Kitchen Staff",
    orders: 5,
    shift: "9 AM - 5 PM",
  },
  {
    name: "Meena Shinde",
    role: "Kitchen Staff",
    orders: 4,
    shift: "10 AM - 6 PM",
  },
]

const statusOptions = [
  "New",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
]

const statusStyles = {
  New: "bg-blue-100 text-blue-700",
  Preparing: "bg-yellow-100 text-yellow-700",
  Ready: "bg-green-100 text-green-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-100 text-red-700",
}

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Normal: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-600",
}

const getNextStatus = (status) => {
  const flow = {
    New: "Preparing",
    Preparing: "Ready",
    Ready: "Out for Delivery",
    "Out for Delivery": "Delivered",
  }

  return flow[status] || status
}

const KitchenDashboard = ({ onLogout }) => {
  const [orders, setOrders] = useState(initialOrders)
  const [activeSection, setActiveSection] = useState("overview")
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")

  const stats = useMemo(() => {
    return {
      total: orders.length,
      newOrders: orders.filter((o) => o.status === "New").length,
      preparing: orders.filter((o) => o.status === "Preparing").length,
      ready: orders.filter((o) => o.status === "Ready").length,
      delivery: orders.filter(
        (o) => o.status === "Out for Delivery"
      ).length,
      revenue: orders
        .filter((o) => o.status !== "Cancelled")
        .reduce((sum, o) => sum + o.total, 0),
    }
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const text = `
        ${order.orderNo}
        ${order.guestName}
        ${order.room}
        ${order.items.join(" ")}
      `.toLowerCase()

      const matchesSearch = text.includes(search.toLowerCase())

      const matchesStatus =
        filterStatus === "All" || order.status === filterStatus

      const matchesPriority =
        filterPriority === "All" || order.priority === filterPriority

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [orders, search, filterStatus, filterPriority])

  const updateOrderStatus = (id, status) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    )
  }

  const moveToNextStatus = (id, currentStatus) => {
    const next = getNextStatus(currentStatus)

    if (next !== currentStatus) {
      updateOrderStatus(id, next)
    }
  }

  const addOrder = () => {
    const guestName = window.prompt("Guest name:")
    if (!guestName) return

    const room = window.prompt("Room number:")
    if (!room) return

    const item = window.prompt(
      "Food item:",
      "Wood-Fired Pizza"
    )
    if (!item) return

    const newOrder = {
      id: Date.now(),
      orderNo: `ORD-${2047 + orders.length}`,
      guestName,
      room,
      items: [item],
      quantity: 1,
      total: 600,
      priority: "Normal",
      status: "New",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setOrders((current) => [newOrder, ...current])
  }

  const cancelOrder = (id) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status: "Cancelled" }
          : order
      )
    )
  }

  const navItems = [
    ["overview", "📊", "Overview"],
    ["orders", "🍽️", "Food Orders"],
    ["menu", "📋", "Menu Management"],
    ["inventory", "📦", "Inventory"],
    ["team", "👨‍🍳", "Kitchen Team"],
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-2xl text-white shadow-lg">
                👨‍🍳
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Smart Resort 360
                </h1>
                <p className="text-sm text-slate-500">
                  Kitchen Operations Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="font-semibold text-slate-800">
                Kitchen Staff
              </p>
              <p className="text-xs text-slate-500">
                Food & Beverage Department
              </p>
            </div>

            <button
              onClick={onLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)]">
        {/* SIDEBAR */}
        <aside className="hidden w-64 border-r border-slate-200 bg-white p-4 md:block">
          <div className="mb-5 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 p-5 text-white">
            <p className="text-xs uppercase tracking-wider text-orange-100">
              Kitchen
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Food Operations
            </h2>

            <p className="mt-2 text-sm text-orange-100">
              Manage orders, menu & kitchen inventory.
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === key
                    ? "bg-orange-50 text-orange-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-lg">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Today's Revenue
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              ₹{stats.revenue.toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-green-600">
              ● Kitchen operating normally
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-hidden p-4 sm:p-6">
          {/* MOBILE NAV */}
          <div className="mb-5 flex gap-2 overflow-x-auto md:hidden">
            {navItems.map(([key, icon, label]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold ${
                  activeSection === key
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-600"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Kitchen Overview 👨‍🍳
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor today's food orders and kitchen operations.
                </p>
              </div>

              {/* STATS */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <StatCard
                  title="Total Orders"
                  value={stats.total}
                  icon="🍽️"
                  bg="bg-orange-50"
                />

                <StatCard
                  title="New"
                  value={stats.newOrders}
                  icon="🔔"
                  bg="bg-blue-50"
                />

                <StatCard
                  title="Preparing"
                  value={stats.preparing}
                  icon="🔥"
                  bg="bg-yellow-50"
                />

                <StatCard
                  title="Ready"
                  value={stats.ready}
                  icon="✅"
                  bg="bg-green-50"
                />

                <StatCard
                  title="Delivery"
                  value={stats.delivery}
                  icon="🛵"
                  bg="bg-purple-50"
                />

                <StatCard
                  title="Revenue"
                  value={`₹${stats.revenue.toLocaleString()}`}
                  icon="💰"
                  bg="bg-emerald-50"
                />
              </div>

              {/* QUICK ACTIONS */}
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                <button
                  onClick={() => setActiveSection("orders")}
                  className="rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-6 text-left text-white shadow-lg transition hover:-translate-y-1"
                >
                  <div className="text-3xl">🍽️</div>

                  <h3 className="mt-4 text-xl font-bold">
                    Manage Food Orders
                  </h3>

                  <p className="mt-2 text-sm text-orange-100">
                    View and update all guest food orders.
                  </p>

                  <div className="mt-5 font-semibold">
                    {stats.newOrders} new orders →
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("inventory")}
                  className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1"
                >
                  <div className="text-3xl">📦</div>

                  <h3 className="mt-4 text-xl font-bold">
                    Check Inventory
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Monitor ingredients and low-stock items.
                  </p>

                  <div className="mt-5 font-semibold text-orange-600">
                    2 items need attention →
                  </div>
                </button>

                <button
                  onClick={() => setActiveSection("menu")}
                  className="rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1"
                >
                  <div className="text-3xl">📋</div>

                  <h3 className="mt-4 text-xl font-bold">
                    Manage Menu
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Manage food items and availability.
                  </p>

                  <div className="mt-5 font-semibold text-orange-600">
                    {menuItems.length} menu items →
                  </div>
                </button>
              </div>

              {/* RECENT ORDERS */}
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Recent Food Orders
                    </h3>

                    <p className="text-sm text-slate-500">
                      Latest orders received by the kitchen
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSection("orders")}
                    className="text-sm font-semibold text-orange-600"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <OrderMiniCard
                      key={order.id}
                      order={order}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ORDERS */}
          {activeSection === "orders" && (
            <section>
              <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Food Orders 🍽️
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage guest food orders from kitchen to room delivery.
                  </p>
                </div>

                <button
                  onClick={addOrder}
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600"
                >
                  + Add New Order
                </button>
              </div>

              {/* FILTERS */}
              <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="grid gap-3 lg:grid-cols-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search order, guest, room or food..."
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400"
                  />

                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="All">All Status</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterPriority}
                    onChange={(e) =>
                      setFilterPriority(e.target.value)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* ORDER CARDS */}
              <div className="grid gap-5 xl:grid-cols-2">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            {order.orderNo}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${priorityStyles[order.priority]}`}
                          >
                            {order.priority}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {order.time}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Guest
                        </p>
                        <p className="mt-1 font-semibold">
                          {order.guestName}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-400">
                          Room
                        </p>
                        <p className="mt-1 font-semibold">
                          {order.room}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-orange-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-500">
                        Order Items
                      </p>

                      <div className="mt-2 space-y-1">
                        {order.items.map((item, index) => (
                          <div
                            key={`${order.id}-${index}`}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium">
                              🍴 {item}
                            </span>

                            {index === 0 && (
                              <span className="text-xs text-slate-500">
                                Qty: {order.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400">
                          Total
                        </p>

                        <p className="text-xl font-bold text-slate-900">
                          ₹{order.total}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {order.status !== "Delivered" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() =>
                                moveToNextStatus(
                                  order.id,
                                  order.status
                                )
                              }
                              className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600"
                            >
                              {getNextStatus(order.status)}
                            </button>
                          )}

                        {order.status !== "Delivered" &&
                          order.status !== "Cancelled" && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <label className="mb-2 block text-xs font-semibold text-slate-500">
                        Change Status
                      </label>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                  <div className="text-5xl">🍽️</div>
                  <h3 className="mt-4 text-lg font-bold">
                    No orders found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* MENU */}
          {activeSection === "menu" && (
            <section>
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Menu Management 📋
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage restaurant menu and item availability.
                  </p>
                </div>

                <button
                  onClick={() =>
                    alert("Add menu item feature can be connected to backend.")
                  }
                  className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"
                >
                  + Add Menu Item
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
                        🍽️
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        Available
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.category}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">
                        ₹{item.price}
                      </span>

                      <button
                        onClick={() =>
                          alert(`${item.name} availability updated.`)
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* POPULAR */}
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="text-lg font-bold">
                  🔥 Popular Dishes
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <PopularDish
                    name="Wood-Fired Pizza"
                    orders="28 orders"
                  />
                  <PopularDish
                    name="Chef Special Thali"
                    orders="21 orders"
                  />
                  <PopularDish
                    name="Italian Pasta"
                    orders="17 orders"
                  />
                </div>
              </div>
            </section>
          )}

          {/* INVENTORY */}
          {activeSection === "inventory" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Kitchen Inventory 📦
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor ingredients and stock levels.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {inventoryItems.map((item) => {
                  const levelClass =
                    item.level === "Critical"
                      ? "bg-red-100 text-red-700"
                      : item.level === "Low"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.level === "Medium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"

                  return (
                    <div
                      key={item.name}
                      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
                          📦
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${levelClass}`}
                        >
                          {item.level}
                        </span>
                      </div>

                      <h3 className="mt-5 font-bold">
                        {item.name}
                      </h3>

                      <div className="mt-3 flex items-end justify-between">
                        <p className="text-2xl font-bold text-slate-900">
                          {item.stock}
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.unit}
                        </p>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            item.level === "Critical"
                              ? "w-[20%] bg-red-500"
                              : item.level === "Low"
                              ? "w-[35%] bg-yellow-500"
                              : item.level === "Medium"
                              ? "w-[60%] bg-blue-500"
                              : "w-[85%] bg-green-500"
                          }`}
                        />
                      </div>

                      {(item.level === "Low" ||
                        item.level === "Critical") && (
                        <button
                          onClick={() =>
                            alert(
                              `Restock request created for ${item.name}`
                            )
                          }
                          className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white"
                        >
                          Request Restock
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-orange-100">
                      Inventory Alert
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      2 ingredients need attention
                    </h3>

                    <p className="mt-1 text-sm text-orange-100">
                      Check Paneer and Dessert Ingredients stock.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      alert("Restock team notified.")
                    }
                    className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-orange-600"
                  >
                    Notify Store Manager
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TEAM */}
          {activeSection === "team" && (
            <section>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Kitchen Team 👨‍🍳
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor kitchen staff and current workload.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {chefs.map((chef) => (
                  <div
                    key={chef.name}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl">
                      👨‍🍳
                    </div>

                    <h3 className="mt-4 text-lg font-bold">
                      {chef.name}
                    </h3>

                    <p className="text-sm font-semibold text-orange-600">
                      {chef.role}
                    </p>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Active Orders
                        </span>
                        <span className="font-bold">
                          {chef.orders}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Shift
                        </span>
                        <span className="font-semibold">
                          {chef.shift}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      On Duty
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-bold">
                    Today's Kitchen Performance
                  </h3>

                  <div className="mt-5 space-y-4">
                    <PerformanceRow
                      label="Orders Completed"
                      value="87%"
                      width="87%"
                    />

                    <PerformanceRow
                      label="On-Time Delivery"
                      value="92%"
                      width="92%"
                    />

                    <PerformanceRow
                      label="Customer Satisfaction"
                      value="94%"
                      width="94%"
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-bold">
                    Kitchen Status
                  </h3>

                  <div className="mt-5 space-y-3">
                    <StatusLine
                      icon="🔥"
                      label="Cooking Stations"
                      value="4 / 4 Active"
                    />

                    <StatusLine
                      icon="❄️"
                      label="Cold Storage"
                      value="Normal"
                    />

                    <StatusLine
                      icon="🍳"
                      label="Equipment"
                      value="All Working"
                    />

                    <StatusLine
                      icon="🧹"
                      label="Kitchen Hygiene"
                      value="Verified"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, bg }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${bg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

const OrderMiniCard = ({ order }) => {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100">
          🍽️
        </div>

        <div>
          <p className="font-bold">
            {order.orderNo} · Room {order.room}
          </p>

          <p className="text-sm text-slate-500">
            {order.guestName} · {order.items.join(", ")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[order.status]}`}
        >
          {order.status}
        </span>

        <span className="font-bold">
          ₹{order.total}
        </span>
      </div>
    </div>
  )
}

const PopularDish = ({ name, orders }) => {
  return (
    <div className="rounded-2xl bg-orange-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl">🔥</span>
        <span className="text-xs font-semibold text-orange-600">
          {orders}
        </span>
      </div>

      <p className="mt-3 font-bold">{name}</p>
    </div>
  )
}

const PerformanceRow = ({ label, value, width }) => {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-bold">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-orange-500"
          style={{ width }}
        />
      </div>
    </div>
  )
}

const StatusLine = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>

      <span className="text-sm font-bold text-green-600">
        {value}
      </span>
    </div>
  )
}

export default KitchenDashboard