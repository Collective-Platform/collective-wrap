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
}: CircularProgressProps) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false });
  const displayValue = animateOnInView ? (isInView ? value : 0) : value;

  const radius = size / 2 - 10;
  const circumference = Math.ceil(3.14 * radius * 2);
  const percentage = Math.ceil(circumference * ((100 - displayValue) / 100));

  const viewBox = `-${size * 0.125} -${size * 0.125} ${size * 1.25} ${
    size * 1.25
  }`;

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
        {/* Base Circle */}
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset="0"
          className={cn("stroke-primary/25", className)}
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
          className={cn("stroke-primary", progressClassName)}
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
