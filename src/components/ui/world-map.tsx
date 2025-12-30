import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Church {
  name: string;
  location: string;
  lat: number;
  lng: number;
}

interface WorldMapProps {
  churches: Church[];
  mainChurch: Church;
  lineColor?: string;
  dotColor?: string;
}

export function WorldMap({
  churches,
  mainChurch,
  lineColor = "hsl(var(--gradient-from))",
  dotColor = "hsl(var(--gradient-to))",
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Convert lat/lng to SVG coordinates
  const latLngToXY = (lat: number, lng: number) => {
    // Simple mercator projection
    const x = ((lng + 180) / 360) * dimensions.width;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y =
      dimensions.height / 2 - (dimensions.width * mercN) / (2 * Math.PI);
    return { x, y };
  };

  const mainPos = latLngToXY(mainChurch.lat, mainChurch.lng);

  return (
    <div className="w-full h-125 relative bg-[hsl(var(--card-bg-from))] rounded-lg overflow-hidden border border-[hsl(var(--card-border))]">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {/* Draw lines from main church to all other churches */}
        {churches.map((church, index) => {
          const churchPos = latLngToXY(church.lat, church.lng);
          return (
            <motion.line
              key={`line-${index}`}
              x1={mainPos.x}
              y1={mainPos.y}
              x2={churchPos.x}
              y2={churchPos.y}
              stroke={lineColor}
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.05 }}
            />
          );
        })}

        {/* Main church dot */}
        <motion.circle
          cx={mainPos.x}
          cy={mainPos.y}
          r="8"
          fill={dotColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </motion.circle>

        {/* Other church dots */}
        {churches.map((church, index) => {
          const pos = latLngToXY(church.lat, church.lng);
          return (
            <g key={`church-${index}`}>
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="5"
                fill={lineColor}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Church labels */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main church label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute text-xs font-bold text-[hsl(var(--card-title))] bg-[hsl(var(--card-bg-to))]/90 px-2 py-1 rounded border border-[hsl(var(--card-border))]"
          style={{
            left: `${mainPos.x}px`,
            top: `${mainPos.y - 25}px`,
            transform: "translateX(-50%)",
          }}
        >
          {mainChurch.name}
        </motion.div>

        {/* Other church labels */}
        {churches.map((church, index) => {
          const pos = latLngToXY(church.lat, church.lng);
          return (
            <motion.div
              key={`label-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="absolute text-[10px] text-[hsl(var(--card-subtitle))] bg-[hsl(var(--card-bg-to))]/80 px-1.5 py-0.5 rounded whitespace-nowrap"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y - 20}px`,
                transform: "translateX(-50%)",
              }}
            >
              {church.name}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
