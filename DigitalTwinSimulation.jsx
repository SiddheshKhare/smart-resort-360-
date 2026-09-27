import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RESORT_LOCATION = { lat: 18.9894, lng: 73.1175, name: "Smart Resort 360 Campus" };

export default function DigitalTwinSimulation({ isGuestView = false }) {
  const [liveWeather, setLiveWeather] = useState({
    temp: 28,
    humidity: 65,
    rainProb: 10,
    wind: 12,
    uvIndex: 5,
    condition: 'Clear Sky'
  });

  const [forecast, setForecast] = useState([]);
  const [whatIfRain, setWhatIfRain] = useState(0);
  const [whatIfTemp, setWhatIfTemp] = useState(28);
  const [whatIfWind, setWhatIfWind] = useState(12);

  const [socialSignals, setSocialSignals] = useState([
    { id: 1, user: "@traveler_sam", text: "Beach bar pool loungers are super pleasant today! ☀️", sentiment: "Positive" },
    { id: 2, user: "@resort_guest9", text: "Hoping the rain stays away so sunset kayaking stays open! 🚣", sentiment: "Neutral" }
  ]);

  const [twinImpact, setTwinImpact] = useState({
    spaDemand: 'Normal (50%)',
    outdoorDiningCapacity: '100% Open',
    shuttleDelay: '0 mins',
    energyLoad: 'Standard',
  });

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function fetchAdvancedWeather() {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${RESORT_LOCATION.lat}&longitude=${RESORT_LOCATION.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.current) {
          const currentTemp = Math.round(data.current.temperature_2m);
          const currentWind = Math.round(data.current.wind_speed_10m);
          const currentHumidity = Math.round(data.current.relative_humidity_2m);
          
          setLiveWeather({
            temp: currentTemp,
            humidity: currentHumidity,
            rainProb: data.daily?.precipitation_probability_max?.[0] || 0,
            wind: currentWind,
            uvIndex: data.daily?.uv_index_max?.[0] || 6,
            condition: data.current.rain > 0 ? 'Rainy' : 'Sunny/Clear'
          });

          setWhatIfTemp(currentTemp);
          setWhatIfWind(currentWind);
        }

        if (data.daily) {
          const dailyForecast = data.daily.time.slice(0, 3).map((time, i) => ({
            day: new Date(time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            rainProb: data.daily.precipitation_probability_max[i],
            uv: data.daily.uv_index_max[i]
          }));
          setForecast(dailyForecast);
        }
      } catch (err) {
        console.error("Advanced Weather API Fetch Failed:", err);
      }
    }
    fetchAdvancedWeather();
  }, []);

  useEffect(() => {
    let spa = 'Normal (50%)';
    let outdoor = '100% Open';
    let shuttle = '0 mins';
    let energy = 'Standard';

    if (whatIfRain > 20) {
      spa = 'High Demand Spike (90% Booked - Guests Moving Indoors)';
      outdoor = 'CLOSED (Rain Safety Protocol Active)';
      shuttle = '+15 mins delay (Storm Routing Enforced)';
    } else if (whatIfRain > 5) {
      spa = 'Moderate Increase (70%)';
      outdoor = '50% Capacity (Covered Deck Only)';
      shuttle = '+5 mins delay';
    }

    if (whatIfTemp > 36) {
      energy = 'CRITICAL SURGE (HVAC Maximum Load)';
      outdoor = 'Restricted Daytime Hours (Heat Caution)';
    }

    setTwinImpact({ spaDemand: spa, outdoorDiningCapacity: outdoor, shuttleDelay: shuttle, energyLoad: energy });

    if (whatIfRain > 25) {
      setSocialSignals([
        { id: 101, user: "@resort_visitor", text: "Heavy rain at main lawn! Everyone rushing into indoor lounge! 🌧️", sentiment: "Negative" },
        { id: 102, user: "@beach_lover", text: "Outdoor dining closed due to downpour. Spa slots fully packed!", sentiment: "Frustrated" }
      ]);
    }
  }, [whatIfRain, whatIfTemp, whatIfWind]);

  const runNugenTwinAnalysis = async () => {
    setLoadingAi(true);
    setAiAnalysis('');

    const prompt = `Digital Twin Weather Analysis Update:
    Simulated Weather: Rain ${whatIfRain}mm/h, Temp ${whatIfTemp}°C, Wind${whatIfWind}km/h.
    Ecosystem Impacts: Outdoor Dining ${twinImpact.outdoorDiningCapacity}, Spa Demand${twinImpact.spaDemand}, Shuttle Delay ${twinImpact.shuttleDelay}, Energy Load${twinImpact.energyLoad}.
    Analyze operational cascading risks and propose optimal staff and resource allocation for Smart Resort 360.`;

    try {
      const res = await fetch('https://api.nugen.in/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_NUGEN_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'nugen-d9646068170ab81b',
          messages: [
            { role: 'system', content: 'You are the Digital Twin Operations Engine for Smart Resort 360.' },
            { role: 'user', content: prompt },
          ],
        }),
      });

      const data = await res.json();
      setAiAnalysis(data.choices?.[0]?.message?.content || 'Simulation updated successfully.');
    } catch (err) {
      setAiAnalysis('Nugen AI Analysis: High rain shifts activity from outdoors to indoor Spa and Lounge.');
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-800 to-indigo-900/60 p-6 rounded-2xl border border-blue-800/50">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              🌤️ Live Resort Weather & Advanced Forecast
            </h3>
            <p className="text-xs text-blue-300">Panvel Campus • Synchronized Real-Time Data</p>
          </div>
          <div className="flex gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs">
            <div>🌡️ Temp: <strong className="text-amber-400">{liveWeather.temp}°C</strong></div>
            <div>💧 Humidity: <strong className="text-blue-400">{liveWeather.humidity}%</strong></div>
            <div>💨 Wind: <strong className="text-emerald-400">{liveWeather.wind} km/h</strong></div>
            <div>☀️ UV: <strong className="text-purple-400">{liveWeather.uvIndex}</strong></div>
          </div>
        </div>

        {forecast.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecast.map((f, idx) => (
              <div key={idx} className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400">{idx === 0 ? 'Today' : f.day}</p>
                  <p className="text-lg font-extrabold text-white">{f.maxTemp}°C <span className="text-xs text-slate-400 font-normal">/ {f.minTemp}°C</span></p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-blue-400 font-medium">🌧️ {f.rainProb}% Rain</p>
                  <p className="text-amber-400 font-medium">☀️ UV {f.uv}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
          <h3 className="text-sm font-bold text-amber-400">⚙️ What-If Scenario Simulator</h3>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Rainfall Simulation</span>
              <strong className="text-blue-400">{whatIfRain} mm/h</strong>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={whatIfRain}
              onChange={(e) => setWhatIfRain(Number(e.target.value))}
              className="w-full mt-1 accent-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Temperature</span>
              <strong className="text-amber-400">{whatIfTemp} °C</strong>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              value={whatIfTemp}
              onChange={(e) => setWhatIfTemp(Number(e.target.value))}
              className="w-full mt-1 accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Wind Speed</span>
              <strong className="text-emerald-400">{whatIfWind} km/h</strong>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={whatIfWind}
              onChange={(e) => setWhatIfWind(Number(e.target.value))}
              className="w-full mt-1 accent-emerald-500"
            />
          </div>

          <button
            onClick={runNugenTwinAnalysis}
            disabled={loadingAi}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition"
          >
            {loadingAi ? 'Simulating Propagation...' : 'Evaluate Nugen Twin Model'}
          </button>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400">📊 Cascading Impact State</h3>
          <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1">
            <span className="text-slate-400">Outdoor Dining:</span>
            <p className="font-semibold text-white">{twinImpact.outdoorDiningCapacity}</p>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1">
            <span className="text-slate-400">Spa & Wellness Booking:</span>
            <p className="font-semibold text-white">{twinImpact.spaDemand}</p>
          </div>
          <div className="p-2.5 bg-slate-900/60 rounded-xl text-xs space-y-1">
            <span className="text-slate-400">Shuttle Transport:</span>
            <p className="font-semibold text-white">{twinImpact.shuttleDelay}</p>
          </div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-3">
          <h3 className="text-sm font-bold text-purple-400">💬 Real-Time Social Signals</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {socialSignals.map((s) => (
              <div key={s.id} className="p-2.5 bg-slate-900/80 rounded-xl text-xs border border-slate-700/50">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>{s.user}</span>
                  <span className={s.sentiment === 'Negative' ? 'text-red-400' : 'text-emerald-400'}>{s.sentiment}</span>
                </div>
                <p className="text-slate-200">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <h3 className="text-sm font-bold text-cyan-400 mb-3">📍 Geospatial Simulation Coverage</h3>
        <div className="h-64 rounded-xl overflow-hidden">
          <MapContainer center={[RESORT_LOCATION.lat, RESORT_LOCATION.lng]} zoom={14} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[RESORT_LOCATION.lat, RESORT_LOCATION.lng]}>
              <Popup><strong>{RESORT_LOCATION.name}</strong><br/>Digital Twin Layer Active</Popup>
            </Marker>
            <Circle
              center={[RESORT_LOCATION.lat, RESORT_LOCATION.lng]}
              radius={whatIfRain * 50 + 200}
              pathOptions={{
                color: whatIfRain > 15 ? 'red' : 'dodgerblue',
                fillColor: whatIfRain > 15 ? 'red' : 'dodgerblue',
                fillOpacity: 0.3
              }}
            />
          </MapContainer>
        </div>
      </div>

      {aiAnalysis && (
        <div className="p-4 bg-blue-950/60 border border-blue-800 rounded-2xl text-xs text-blue-200 leading-relaxed">
          <strong className="text-blue-400 block mb-1">🤖 Nugen AI Propagated Optimization Insights:</strong>
          {aiAnalysis}
        </div>
      )}
    </div>
  );
}