import React from "react";
import { motion } from "framer-motion";

interface BarData {
  label: string;
  value: string;
  percentage: number; // 0-100 for bar height
  color?: string;
}

interface HorizontalBarChartProps {
  data: BarData[];
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  data,
}) => {
  return (
    <div className="w-full py-8 overflow-hidden">
      <div className="flex items-end justify-between gap-4 h-80">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            {/* Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.percentage}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
              className="w-full rounded-t-lg relative"
              style={{
                background: `linear-gradient(to top, hsl(var(--gradient-from)), hsl(var(--gradient-to)))`,
                minHeight: "40px",
              }}
            >
              {/* Value on top of bar */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-lg font-bold text-[hsl(var(--card-title))]">
                  {item.value}
                </span>
              </div>
            </motion.div>

            {/* Label at bottom */}
            <div className="mt-4 text-center w-full">
              <p className="text-xs text-[hsl(var(--card-subtitle))] leading-tight px-1">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
