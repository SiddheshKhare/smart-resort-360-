import { useEffect, useState } from "react";

/* AI Dynamic Pricing Logic Engine */
export function calculateDynamicPrice(basePrice, roomType, totalRooms, occupiedRooms) {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const month = now.getMonth(); // 0-11

  let multiplier = 1.0;
  let reasons = [];

  // 1. Weekend Surge (शनिवार/रविवार)
  if (day === 0 || day === 6) {
    multiplier += 0.25; // 25% वाढ
    reasons.push("Weekend Surge (+25%)");
  }

  // 2. Season Demand (हंगामी मागणी - Peak Season: Oct to Jan, May to June)
  if ([4, 5, 9, 10, 11, 0].includes(month)) {
    multiplier += 0.20; // 20% वाढ
    reasons.push("Peak Holiday Season (+20%)");
  }

  // 3. Occupancy Surge (ऑक्युपन्सीनुसार दरवाढ)
  const occupancyPercentage = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
  
  if (occupancyPercentage >= 80) {
    multiplier += 0.40; // 80% पेक्षा जास्त ऑक्युपन्सी असल्यास 40% वाढ
    reasons.push("High Demand & Low Availability (+40%)");
  } else if (occupancyPercentage >= 50) {
    multiplier += 0.15; // 50% पेक्षा जास्त असल्यास 15% वाढ
    reasons.push("Moderate Occupancy Surge (+15%)");
  }

  const finalPrice = Math.round(basePrice * multiplier);

  return {
    finalPrice,
    multiplier,
    reasons: reasons.length > 0 ? reasons.join(" + ") : "Standard Rate",
    occupancyPercentage: Math.round(occupancyPercentage),
  };
}

export default function AIDynamicPricingWidget({ rooms, onAutoUpdatePrices }) {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  useEffect(() => {
    if (!autoUpdateEnabled || !rooms || rooms.length === 0) return;

    // दर १० सेकंदांनी किंवा मागणीनुसार किंमत ऑटो-अपडेट करेल
    const interval = setInterval(() => {
      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(
        (r) => String(r.status).toLowerCase() === "occupied"
      ).length;

      const updatedRooms = rooms.map((room) => {
        const basePrice = room.basePrice || room.price || 8000;
        const pricingInfo = calculateDynamicPrice(
          basePrice,
          room.roomType,
          totalRooms,
          occupiedRooms
        );

        return {
          ...room,
          price: pricingInfo.finalPrice,
          pricingReason: pricingInfo.reasons,
          isAutoPriced: true,
        };
      });

      onAutoUpdatePrices(updatedRooms);
      setLastUpdated(new Date().toLocaleTimeString());
    }, 10000); // 10 sec interval

    return () => clearInterval(interval);
  }, [rooms, autoUpdateEnabled]);

  return (
    <div className="mb-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-ping" />
            AI Dynamic Pricing Engine Active
          </div>
          <h3 className="mt-1 text-2xl font-bold">Smart Auto-Surge Pricing</h3>
          <p className="mt-1 text-xs text-emerald-100">
            Prices automatically adjust based on Weekend, Holiday Season & Real-time Occupancy.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-emerald-200">Last Auto-Sync</p>
            <p className="text-sm font-bold">{lastUpdated}</p>
          </div>

          <button
            onClick={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
            className={`rounded-2xl px-4 py-2.5 text-xs font-bold transition shadow-md ${
              autoUpdateEnabled
                ? "bg-white text-emerald-700 hover:bg-emerald-50"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {autoUpdateEnabled ? "🤖 Auto-Pricing ON" : "⏸️ Auto-Pricing Paused"}
          </button>
        </div>
      </div>
    </div>
  );
}