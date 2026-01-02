import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";

const HUB = { lat: 3.0738, lng: 101.5183 }; // Subang Jaya

const churchLocations = [
  { lat: 3.139, lng: 101.6869 }, // Kuala Lumpur
  { lat: 3.0738, lng: 101.5183 }, // Shah Alam
  { lat: 5.4141, lng: 100.3288 }, // Penang
  { lat: 6.121, lng: 100.369 }, // Alor Setar
  { lat: 2.1896, lng: 102.2501 }, // Malacca
  { lat: 1.4927, lng: 103.7414 }, // Johor Bahru
  { lat: 5.8405, lng: 118.1179 }, // Sandakan
  { lat: -6.2088, lng: 106.8456 }, // Jakarta
  { lat: 14.5995, lng: 120.9842 }, // Manila
  { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
  { lat: 23.6978, lng: 120.9605 }, // Taiwan
  { lat: 26.2124, lng: 127.6809 }, // Okinawa
  { lat: 18.5204, lng: 73.8567 }, // Pune
];

export default function WorldMapDemo() {
  return (
    <div className="bg-black w-full">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl text-white">
          One Church.{" "}
          <span className="text-neutral-400">
            {"Many Cities".split("").map((char, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        </p>

        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          From Malaysia to Asia, God is building one family across cities,
          cultures, and nations.
        </p>
      </div>

      <WorldMap
        dots={churchLocations.map((loc) => ({
          start: HUB,
          end: loc,
        }))}
      />
    </div>
  );
}
