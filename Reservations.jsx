function Reservations() {
  const bookings = [
    {
      id: "SR360-204",
      guest: "Rahul Sharma",
      room: "Room 204",
      date: "10 Sept 2026",
      amount: "₹13,000",
    },
    {
      id: "SR360-108",
      guest: "Priya Patil",
      room: "Room 108",
      date: "11 Sept 2026",
      amount: "₹9,500",
    },
    {
      id: "SR360-303",
      guest: "Amit Deshmukh",
      room: "Villa 303",
      date: "12 Sept 2026",
      amount: "₹18,000",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">
          Reservations
        </h2>
        <p className="text-slate-500 mt-1">
          Manage guest bookings and upcoming stays
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Today's Check-ins</p>
          <h3 className="text-3xl font-bold mt-2">8</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Today's Check-outs</p>
          <h3 className="text-3xl font-bold mt-2">5</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-slate-500">Upcoming Bookings</p>
          <h3 className="text-3xl font-bold mt-2">24</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-5">
          Upcoming Reservations
        </h3>

        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-bold">{booking.guest}</p>
                <p className="text-sm text-slate-500">
                  {booking.id} • {booking.room}
                </p>
              </div>

              <div className="text-sm text-slate-500">
                {booking.date}
              </div>

              <div className="font-bold">
                {booking.amount}
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Confirmed
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reservations