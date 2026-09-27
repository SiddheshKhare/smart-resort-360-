import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"

/* =========================================================
   RESORT ENTITY GRAPH
   Mirrors the modules this app already has (Rooms, Kitchen,
   Housekeeping, Activities, Reception/Transport). Sensitivity
   coefficients stand in for what a trained model would learn
   from the resort's historical occupancy/demand data.
========================================================= */

const RESORT_LOCATION = { lat: 15.4989, lng: 73.8278, label: "Candolim, Goa" }

const ENTITIES = [
  {
    id: "activities",
    name: "Activities & Beach Access",
    icon: "🎯",
    lat: 15.5008,
    lng: 73.7638,
    sensitivity: { rain: -0.9, wind: -0.8, storm: -1.0, temp: 0.2, flood: -1.0 },
    metricLabel: "activity demand at risk",
    cascadesTo: ["kitchen"],
    cascadeWeight: 0.25,
  },
  {
    id: "rooms",
    name: "Rooms & Occupancy",
    icon: "🏨",
    lat: 15.4989,
    lng: 73.8278,
    sensitivity: { rain: 0.1, wind: 0.05, storm: 0.25, temp: 0.05, flood: 0.4 },
    metricLabel: "guest disruption risk",
    cascadesTo: ["housekeeping"],
    cascadeWeight: 0.2,
  },
  {
    id: "kitchen",
    name: "Kitchen & Food Orders",
    icon: "🍽️",
    lat: 15.4995,
    lng: 73.8290,
    sensitivity: { rain: 0.35, wind: 0.1, storm: 0.3, temp: -0.1, flood: -0.15 },
    metricLabel: "order volume shift",
    cascadesTo: ["housekeeping"],
    cascadeWeight: 0.1,
  },
  {
    id: "housekeeping",
    name: "Housekeeping Ops",
    icon: "🧹",
    lat: 15.5000,
    lng: 73.8265,
    sensitivity: { rain: 0.2, wind: 0.1, storm: 0.4, temp: 0.0, flood: 0.5 },
    metricLabel: "staffing pressure",
    cascadesTo: [],
    cascadeWeight: 0,
  },
  {
    id: "reception",
    name: "Reception & Transport",
    icon: "🛎️",
    lat: 15.3808,
    lng: 73.8314,
    sensitivity: { rain: 0.5, wind: 0.3, storm: 0.85, temp: 0.0, flood: 1.0 },
    metricLabel: "check-in delay risk",
    cascadesTo: ["rooms"],
    cascadeWeight: 0.2,
  },
]
const ENTITY_INDEX = Object.fromEntries(ENTITIES.map((e) => [e.id, e]))
const DRIVER_KEYS = ["rain", "wind", "temp", "storm", "flood"]

const PRESETS = {
  clear: { rain: 0.05, wind: 0.1, temp: 0.3, storm: 0.02, flood: 0 },
  heavyMonsoon: { rain: 0.85, wind: 0.5, temp: 0.2, storm: 0.6, flood: 0.55 },
  cyclone: { rain: 0.95, wind: 0.95, temp: 0.15, storm: 0.95, flood: 0.85 },
  heatwave: { rain: 0, wind: 0.15, temp: 0.95, storm: 0, flood: 0 },
}

const DRIVER_META = [
  { key: "rain", label: "Rainfall intensity" },
  { key: "wind", label: "Wind speed" },
  { key: "storm", label: "Storm duration" },
  { key: "temp", label: "Temperature (heat)" },
  { key: "flood", label: "Flood risk" },
]

const STATUS_COLOR = { calm: "#16a34a", watch: "#d97706", severe: "#dc2626" }
const STATUS_BADGE = {
  calm: "bg-green-100 text-green-700",
  watch: "bg-yellow-100 text-yellow-700",
  severe: "bg-red-100 text-red-700",
}

/* ---------------- SIMULATION ENGINE ---------------- */

function directSeverity(entity, drivers) {
  const raw = DRIVER_KEYS.reduce((acc, k) => acc + (entity.sensitivity[k] ?? 0) * (drivers[k] ?? 0), 0)
  return Math.max(-1, Math.min(1, raw / 2))
}

function cascadeInto(directMap) {
  const cascadeMap = Object.fromEntries(ENTITIES.map((e) => [e.id, 0]))
  for (const entity of ENTITIES) {
    const upstream = directMap[entity.id]
    if (upstream <= 0 || !entity.cascadesTo?.length) continue
    for (const targetId of entity.cascadesTo) {
      cascadeMap[targetId] += upstream * entity.cascadeWeight
    }
  }
  return cascadeMap
}

function classify(mag) {
  if (mag < 0.18) return "calm"
  if (mag < 0.5) return "watch"
  return "severe"
}

function gaussianNoise(sigma) {
  const u1 = Math.random() || 1e-9
  const u2 = Math.random()
  return sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function runDigitalTwin(drivers, { buzzIndex = 0, uncertainty = 0.15, samples = 100 } = {}) {
  const buzzed = { ...drivers }
  const dominant = DRIVER_KEYS.reduce((a, b) => (drivers[a] >= drivers[b] ? a : b))
  buzzed[dominant] = Math.min(1, buzzed[dominant] + buzzIndex * 0.15)

  const sampleResults = []
  for (let s = 0; s < samples; s++) {
    const sampleDrivers = {}
    for (const k of DRIVER_KEYS) {
      sampleDrivers[k] = Math.max(0, Math.min(1, buzzed[k] + gaussianNoise(uncertainty)))
    }
    const directMap = Object.fromEntries(ENTITIES.map((e) => [e.id, directSeverity(e, sampleDrivers)]))
    const cascadeMap = cascadeInto(directMap)
    sampleResults.push(
      Object.fromEntries(
        ENTITIES.map((e) => [e.id, Math.max(-1, Math.min(1, directMap[e.id] + cascadeMap[e.id]))])
      )
    )
  }

  const entityStats = {}
  for (const entity of ENTITIES) {
    const values = sampleResults.map((r) => r[entity.id]).sort((a, b) => a - b)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const p10 = values[Math.floor(values.length * 0.1)]
    const p90 = values[Math.floor(values.length * 0.9)]
    entityStats[entity.id] = {
      entity,
      severity: mean,
      deltaPercent: Math.round(mean * 100),
      bandPercent: [Math.round(p10 * 100), Math.round(p90 * 100)],
      status: classify(Math.abs(mean)),
      confidence: Math.max(0, 1 - (p90 - p10)),
    }
  }

  const pointDirect = Object.fromEntries(ENTITIES.map((e) => [e.id, directSeverity(e, buzzed)]))
  const cascadeEdges = []
  for (const entity of ENTITIES) {
    if (pointDirect[entity.id] <= 0.05) continue
    for (const targetId of entity.cascadesTo ?? []) {
      cascadeEdges.push({ from: entity.id, to: targetId, strength: Math.abs(pointDirect[entity.id] * entity.cascadeWeight) })
    }
  }

  const overallSeverity = Object.values(entityStats).reduce((acc, s) => acc + Math.abs(s.severity), 0) / ENTITIES.length

  return { entityStats, cascadeEdges, overallStatus: classify(overallSeverity) }
}

/* ---------------- LIVE WEATHER (Open-Meteo, no key) ---------------- */

async function fetchLiveWeather(lat, lng) {
  const url = new URL("https://api.open-meteo.com/v1/forecast")
  url.searchParams.set("latitude", lat)
  url.searchParams.set("longitude", lng)
  url.searchParams.set("current", "temperature_2m,precipitation,wind_speed_10m,weather_code")
  url.searchParams.set("hourly", "precipitation,precipitation_probability")
  url.searchParams.set("forecast_days", "2")
  url.searchParams.set("timezone", "auto")

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Weather API error ${res.status}`)
  const json = await res.json()

  const nowIso = json.current.time
  const startIdx = Math.max(0, json.hourly.time.findIndex((t) => t >= nowIso))
  const next6 = json.hourly.precipitation.slice(startIdx, startIdx + 6)
  const probs = json.hourly.precipitation_probability.slice(startIdx, startIdx + 6)
  const rainNext6 = next6.reduce((a, b) => a + b, 0)

  const mean = probs.reduce((a, b) => a + b, 0) / (probs.length || 1)
  const variance = probs.reduce((a, b) => a + (b - mean) ** 2, 0) / (probs.length || 1)
  const uncertainty = Math.min(0.5, Math.max(0.05, Math.sqrt(variance) / 100))

  const clamp01 = (v) => Math.max(0, Math.min(1, v))

  return {
    current: json.current,
    rainNext6,
    drivers: {
      rain: clamp01(rainNext6 / 30),
      wind: clamp01(json.current.wind_speed_10m / 60),
      temp: clamp01((json.current.temperature_2m - 24) / 12),
      storm: clamp01((rainNext6 / 30) * 0.6 + clamp01(json.current.wind_speed_10m / 60) * 0.4),
      flood: clamp01(rainNext6 / 60),
    },
    uncertainty,
  }
}

/* ---------------- SOCIAL SIGNAL (Mastodon public tags, no key) ---------------- */

const STORM_WORDS = ["flood", "flooding", "storm", "delay", "closed", "heavy rain", "rough", "backed up", "stuck"]

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

async function fetchSocialSignals(severityHint = 0.2) {
  const tags = ["rain", "monsoon", "flooding", "goa"]
  try {
    const results = await Promise.all(
      tags.map(async (tag) => {
        const res = await fetch(`https://mastodon.social/api/v1/timelines/tag/${tag}?limit=6`)
        if (!res.ok) throw new Error("tag fetch failed")
        const posts = await res.json()
        return posts.map((p) => ({
          id: p.id,
          author: p.account?.username ?? "traveler",
          text: stripHtml(p.content).slice(0, 180),
          tag,
        }))
      })
    )
    const posts = results.flat()
    if (posts.length === 0) throw new Error("no live posts")
    const score = posts.reduce((acc, p) => {
      const t = p.text.toLowerCase()
      return acc + STORM_WORDS.reduce((a, w) => a + (t.includes(w) ? 1 : 0), 0)
    }, 0)
    return { posts: posts.slice(0, 8), buzzIndex: Math.max(0, Math.min(1, score / (posts.length * 2))), live: true }
  } catch {
    const templates = [
      "Beach looking rough today, watersports desk turning people away.",
      "Pool's closed because of the storm, moved everyone indoors.",
      "Monsoon hitting hard this week, roads near the beach are flooding a bit.",
      "Shuttle running late, driver says roads are backed up from the rain.",
      "Gorgeous after the rain cleared, sunset dinner back on at the deck.",
    ]
    const count = 4 + Math.round(severityHint * 4)
    const posts = Array.from({ length: count }).map((_, i) => ({
      id: `sim-${i}`,
      author: `guest_${100 + i}`,
      text: templates[i % templates.length],
      tag: "weather",
    }))
    const score = posts.reduce((acc, p) => {
      const t = p.text.toLowerCase()
      return acc + STORM_WORDS.reduce((a, w) => a + (t.includes(w) ? 1 : 0), 0)
    }, 0)
    return {
      posts,
      buzzIndex: Math.max(0, Math.min(1, score / (posts.length * 2) + severityHint * 0.2)),
      live: false,
    }
  }
}

/* =========================================================
   COMPONENT
========================================================= */

function WeatherDigitalTwin({ rooms = [], orders = [], activityBookings = [] }) {
  const [mode, setMode] = useState("live") // 'live' | 'whatif'
  const [manualDrivers, setManualDrivers] = useState(PRESETS.clear)

  const [live, setLive] = useState(null)
  const [liveLoading, setLiveLoading] = useState(true)
  const [liveError, setLiveError] = useState(null)

  const [social, setSocial] = useState(null)
  const [socialLoading, setSocialLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLiveLoading(true)
      try {
        const data = await fetchLiveWeather(RESORT_LOCATION.lat, RESORT_LOCATION.lng)
        if (!cancelled) {
          setLive(data)
          setLiveError(null)
        }
      } catch (err) {
        if (!cancelled) setLiveError(err.message)
      } finally {
        if (!cancelled) setLiveLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 10 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setSocialLoading(true)
      const data = await fetchSocialSignals(live?.drivers?.storm ?? 0.2)
      if (!cancelled) {
        setSocial(data)
        setSocialLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live])

  const activeDrivers = mode === "live" && live ? live.drivers : manualDrivers
  const uncertainty = mode === "live" && live ? live.uncertainty : 0.12

  const twin = useMemo(
    () => runDigitalTwin(activeDrivers, { buzzIndex: social?.buzzIndex ?? 0, uncertainty }),
    [activeDrivers, social?.buzzIndex, uncertainty]
  )

  // Real counts from the app's own live data, so the twin reads on the
  // actual current occupancy/orders/bookings this resort is managing.
  const occupiedRooms = rooms.filter((r) => String(r.status).toLowerCase().includes("occupied")).length
  const pendingOrders = orders.filter((o) => !String(o.status).toLowerCase().includes("delivered")).length
  const pendingActivities = activityBookings.filter((b) => String(b.status).toLowerCase() !== "cancelled").length

  function handleModeChange(next) {
    if (next === "whatif" && mode === "live" && live) {
      setManualDrivers(live.drivers)
    }
    setMode(next)
  }

  return (
    <div className="space-y-6">
      {/* Overall status banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌦️</span>
          <div>
            <h2 className="text-xl font-bold">Weather-Driven Digital Twin</h2>
            <p className="text-slate-400 text-sm mt-1">
              Simulation layer — doesn't touch live bookings or ops
            </p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${STATUS_BADGE[twin.overallStatus]}`}>
          {twin.overallStatus === "calm" && "🟢 Normal operations"}
          {twin.overallStatus === "watch" && "🟡 Elevated watch"}
          {twin.overallStatus === "severe" && "🔴 Severe weather response"}
        </span>
      </div>

      {/* Real ecosystem snapshot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Occupied Rooms</p>
          <h3 className="text-3xl font-bold mt-2">{occupiedRooms}</h3>
          <p className="text-xs text-slate-400 mt-1">feeding the "Rooms" entity below</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Active Food Orders</p>
          <h3 className="text-3xl font-bold mt-2">{pendingOrders}</h3>
          <p className="text-xs text-slate-400 mt-1">feeding the "Kitchen" entity below</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500 text-sm">Activity Bookings</p>
          <h3 className="text-3xl font-bold mt-2">{pendingActivities}</h3>
          <p className="text-xs text-slate-400 mt-1">feeding the "Activities" entity below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="font-bold">Impact propagation map</h3>
              <div className="flex items-center gap-3 text-xs">
                {Object.entries(STATUS_COLOR).map(([status, color]) => (
                  <span key={status} className="flex items-center gap-1 text-slate-500">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                    {status}
                  </span>
                ))}
              </div>
            </div>
            <MapContainer
              center={[RESORT_LOCATION.lat, RESORT_LOCATION.lng]}
              zoom={12}
              style={{ height: 380, width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {twin.cascadeEdges.map((edge, i) => {
                const from = ENTITY_INDEX[edge.from]
                const to = ENTITY_INDEX[edge.to]
                return (
                  <Polyline
                    key={i}
                    positions={[[from.lat, from.lng], [to.lat, to.lng]]}
                    pathOptions={{ color: "#dc2626", weight: 1 + edge.strength * 6, opacity: 0.35 + edge.strength * 0.5, dashArray: "4 6" }}
                  />
                )
              })}
              {Object.values(twin.entityStats).map(({ entity, status, deltaPercent, bandPercent, confidence }) => (
                <CircleMarker
                  key={entity.id}
                  center={[entity.lat, entity.lng]}
                  radius={9 + Math.abs(deltaPercent) / 12}
                  pathOptions={{ color: STATUS_COLOR[status], fillColor: STATUS_COLOR[status], fillOpacity: 0.75, weight: 2 }}
                >
                  <Tooltip direction="top" offset={[0, -6]}>{entity.icon} {entity.name}</Tooltip>
                  <Popup>
                    <div className="text-xs">
                      <p className="font-semibold mb-1">{entity.name}</p>
                      <p>{entity.metricLabel}: {deltaPercent >= 0 ? "+" : ""}{deltaPercent}%</p>
                      <p>Range: {bandPercent[0]}% to {bandPercent[1]}%</p>
                      <p>Confidence: {Math.round(confidence * 100)}%</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>

          {/* Per-entity impact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Probabilistic impact by entity</h3>
            <div className="space-y-3">
              {Object.values(twin.entityStats)
                .sort((a, b) => Math.abs(b.severity) - Math.abs(a.severity))
                .map((s) => (
                  <EntityRow key={s.entity.id} stat={s} />
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Weather + mode toggle */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Live weather · {RESORT_LOCATION.label}</h3>
              <div className="flex rounded-full border border-slate-200 p-0.5 text-xs">
                {["live", "whatif"].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`rounded-full px-3 py-1 font-semibold ${
                      mode === m ? "bg-blue-600 text-white" : "text-slate-500"
                    }`}
                  >
                    {m === "live" ? "Live" : "What-if"}
                  </button>
                ))}
              </div>
            </div>

            {liveLoading && <p className="text-sm text-slate-500">Fetching live forecast…</p>}
            {liveError && (
              <p className="text-sm text-red-600">
                Couldn't reach the weather API ({liveError}). Use What-if mode instead.
              </p>
            )}
            {live && !liveError && (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-slate-500">Temp</p>
                  <p className="text-lg font-bold">{Math.round(live.current.temperature_2m)}°C</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rain</p>
                  <p className="text-lg font-bold">{live.current.precipitation.toFixed(1)}mm</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Wind</p>
                  <p className="text-lg font-bold">{Math.round(live.current.wind_speed_10m)}km/h</p>
                </div>
              </div>
            )}
          </div>

          {/* What-if controls */}
          <div className={`bg-white rounded-2xl p-5 shadow-sm ${mode !== "whatif" ? "opacity-60" : ""}`}>
            <h3 className="font-bold mb-3">
              {mode === "whatif" ? "What-if scenario" : "What-if (switch mode to edit)"}
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(PRESETS).map((id) => (
                <button
                  key={id}
                  disabled={mode !== "whatif"}
                  onClick={() => setManualDrivers(PRESETS[id])}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold hover:bg-slate-50 disabled:cursor-not-allowed"
                >
                  {id === "clear" && "Clear day"}
                  {id === "heavyMonsoon" && "Heavy monsoon"}
                  {id === "cyclone" && "Cyclonic storm"}
                  {id === "heatwave" && "Extreme heat"}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {DRIVER_META.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold">{Math.round(activeDrivers[key] * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    disabled={mode !== "whatif"}
                    value={Math.round(activeDrivers[key] * 100)}
                    onChange={(e) =>
                      setManualDrivers((prev) => ({ ...prev, [key]: Number(e.target.value) / 100 }))
                    }
                    className="w-full accent-blue-600 disabled:cursor-not-allowed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social signal */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">Real-world social signal</h3>
              {social && (
                <span className="text-xs font-semibold text-slate-500">
                  {social.live ? "live · mastodon" : "simulated fallback"}
                </span>
              )}
            </div>

            {socialLoading && <p className="text-sm text-slate-500">Reading public posts…</p>}

            {social && (
              <>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">Buzz / distress index</span>
                    <span className="font-semibold">{Math.round(social.buzzIndex * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${social.buzzIndex * 100}%` }} />
                  </div>
                </div>

                <ul className="max-h-52 space-y-2 overflow-y-auto pr-1">
                  {social.posts.map((p) => (
                    <li key={p.id} className="rounded-xl bg-slate-50 p-3 text-xs">
                      <p className="text-slate-400 mb-1">@{p.author} · #{p.tag}</p>
                      <p className="text-slate-700">{p.text}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EntityRow({ stat }) {
  const { entity, deltaPercent, bandPercent, status, confidence } = stat
  const color = STATUS_COLOR[status]
  const [lo, hi] = bandPercent
  const toPct = (v) => ((v + 100) / 200) * 100

  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold">{entity.icon} {entity.name}</p>
          <p className="text-xs text-slate-500">{entity.metricLabel}</p>
        </div>
        <div className="text-right">
          <p className="font-bold" style={{ color }}>
            {deltaPercent >= 0 ? "+" : ""}{deltaPercent}%
          </p>
          <p className="text-xs text-slate-500">{Math.round(confidence * 100)}% confidence</p>
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-slate-100">
        <div className="absolute inset-y-0 opacity-40 rounded-full" style={{ left: `${toPct(lo)}%`, width: `${toPct(hi) - toPct(lo)}%`, background: color }} />
        <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white" style={{ left: `${toPct(deltaPercent)}%`, background: color }} />
      </div>
    </div>
  )
}

export default WeatherDigitalTwin
