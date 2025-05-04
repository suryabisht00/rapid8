 "use client";

import { useAmbulanceTracker } from "@/hooks/useAmbulanceTracker";

interface AmbulanceTrackerProps {
  ambulanceId: string;
}

export default function AmbulanceTracker({
  ambulanceId,
}: AmbulanceTrackerProps) {
  const { position, isConnected, lastUpdate } =
    useAmbulanceTracker(ambulanceId);

  return (
    <div>
      <h2>Status: {isConnected ? "Connected ✅" : "Disconnected ❌"}</h2>
      {position ? (
        <div>
          <p>Latitude: {position.lat}</p>
          <p>Longitude: {position.lng}</p>
          <p>Last Update: {lastUpdate}</p>
        </div>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
}
