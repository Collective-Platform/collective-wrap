import React from "react";
import { motion } from "framer-motion";

interface BarData {
  label: string;
  value: string;
  percentage: number; // 0–100 for bar width
  color?: string;
}

interface HorizontalBarChartProps {
  data: BarData[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
}) => {
  return (
    <div className="w-full py-8 space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          {/* Label */}
          <div className="w-24 text-sm text-[hsl(var(--card-subtitle))]">
            {item.label}
          </div>

          {/* Bar track */}
          <div className="flex-1 h-8 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{
                duration: 1,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="h-full rounded-lg"
              style={{
                background: `linear-gradient(to right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))`,
                minWidth: "40px",
              }}
            />

            {/* Value */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-[hsl(var(--card-title))]">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
