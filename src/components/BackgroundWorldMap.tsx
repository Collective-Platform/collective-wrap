import React from "react";
import { WorldMap } from "@/components/ui/world-map";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface BackgroundWorldMapProps {
  mainLocation: Location;
  locations: Location[];
  region: "malaysia" | "asia";
}

export const BackgroundWorldMap: React.FC<BackgroundWorldMapProps> = ({
  mainLocation,
  locations,
  region,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
      <div className="w-full h-full">
        <WorldMap
          mainLocation={mainLocation}
          locations={locations}
          region={region}
          lineColor="currentColor"
        />
      </div>
    </div>
  );
};
