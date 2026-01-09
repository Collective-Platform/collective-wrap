import DottedMap from "dotted-map";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface WorldMapProps {
  mainLocation: Location;
  locations: Location[];
  region: "malaysia" | "asia";
  lineColor?: string;
}

const REGION_BOUNDS = {
  malaysia: { north: 8, south: 0, west: 99, east: 120 },
  asia: { north: 32, south: -10, west: 70, east: 132 },
};

export function WorldMap({
  mainLocation,
  locations,
  region,
  lineColor = "currentColor",
}: WorldMapProps) {
  const map = new DottedMap({ height: 200, grid: "diagonal" });

  const svgMap = map.getSVG({
    radius: 0.22,
    color: "#FFFFFF15",
    shape: "circle",
    backgroundColor: "transparent",
  });

  const projectToWorld = (lat: number, lng: number) => ({
    x: (lng + 180) * (800 / 360),
    y: (90 - lat) * (400 / 180),
  });

  const bounds = REGION_BOUNDS[region];
  const topLeft = projectToWorld(bounds.north, bounds.west);
  const bottomRight = projectToWorld(bounds.south, bounds.east);
  const viewBox = `${topLeft.x} ${topLeft.y} ${bottomRight.x - topLeft.x} ${
    bottomRight.y - topLeft.y
  }`;

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const curveHeight = Math.max(
      Math.min(distance * (region === "malaysia" ? 0.4 : 0.25), 30),
      5
    );
    const midY = Math.min(start.y, end.y) - curveHeight;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  const mainPoint = projectToWorld(mainLocation.lat, mainLocation.lng);
  const strokeWidth = region === "malaysia" ? 1 : 0.6;
  const mainRadius = region === "malaysia" ? 3 : 2;
  const pointRadius = region === "malaysia" ? 2.5 : 1.5;
  const pulseRadius = region === "malaysia" ? 10 : 6;

  return (
    <div className="w-full h-full relative">
      {/* Background map */}
      <svg
        viewBox={viewBox}
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="xMidYMid slice"
      >
        <image
          href={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          width="800"
          height="400"
        />
      </svg>

      {/* Overlay */}
      <svg
        viewBox={viewBox}
        className="w-full h-full absolute inset-0 pointer-events-none"
      >
        <defs>
          <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="10%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="90%" stopColor={lineColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated paths */}
        {locations.map((loc, i) => {
          const end = projectToWorld(loc.lat, loc.lng);
          return (
            <path
              key={`path-${i}`}
              d={createCurvedPath(mainPoint, end)}
              fill="none"
              stroke="url(#line-grad)"
              strokeWidth={strokeWidth}
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1"
                to="0"
                dur="1.5s"
                begin={`${i * 0.1}s`}
                fill="freeze"
              />
            </path>
          );
        })}

        {/* Main point with glow */}
        <circle
          cx={mainPoint.x}
          cy={mainPoint.y}
          r={mainRadius}
          fill={lineColor}
          filter="url(#glow)"
        />
        <circle
          cx={mainPoint.x}
          cy={mainPoint.y}
          r={mainRadius}
          fill={lineColor}
        >
          <animate
            attributeName="r"
            from={mainRadius}
            to={pulseRadius * 1.2}
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.6"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Location points */}
        {locations.map((loc, i) => {
          const pt = projectToWorld(loc.lat, loc.lng);
          const delay = `${i * 0.1 + 0.5}s`;
          return (
            <g key={`pt-${i}`}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={pointRadius}
                fill={lineColor}
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="0.3s"
                  begin={delay}
                  fill="freeze"
                />
              </circle>
              <circle cx={pt.x} cy={pt.y} r={pointRadius} fill={lineColor}>
                <animate
                  attributeName="r"
                  from={pointRadius}
                  to={pulseRadius}
                  dur="1.5s"
                  begin={delay}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin={delay}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
