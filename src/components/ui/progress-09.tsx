import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "motion/react";

interface CircularProgressProps {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: "square" | "round";
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
  animateOnInView?: boolean;
  gradient?: { from: string; to: string };
}

const CircularProgress = ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel,
  shape = "round",
  size = 80,
  strokeWidth,
  circleStrokeWidth = 10,
  progressStrokeWidth = 10,
  animateOnInView = false,
  gradient,
}: CircularProgressProps) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false });
  const displayValue = animateOnInView ? (isInView ? value : 0) : value;

  const maxStrokeWidth = Math.max(
    strokeWidth ?? circleStrokeWidth,
    strokeWidth ?? progressStrokeWidth
  );
  const radius = (size - maxStrokeWidth) / 2;
  const circumference = Math.ceil(2 * Math.PI * radius);
  const percentage = Math.ceil(circumference * ((100 - displayValue) / 100));

  const viewBox = `0 0 ${size} ${size}`;

  return (
    <div className="relative">
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={viewBox}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
        className="relative"
      >
        {gradient && (
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradient.from} />
              <stop offset="100%" stopColor={gradient.to} />
            </linearGradient>
          </defs>
        )}
        {/* Base Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className={cn("stroke-progress-track", className)}
        />

        {/* Progress */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeLinecap={shape}
          strokeDashoffset={percentage}
          fill="transparent"
          strokeDasharray={circumference}
          stroke={gradient ? "url(#progress-gradient)" : undefined}
          className={cn(!gradient && "stroke-progress-fill", progressClassName)}
        />
      </svg>
      {showLabel && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center text-md",
            labelClassName
          )}
        >
          {renderLabel ? renderLabel(value) : value}
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
