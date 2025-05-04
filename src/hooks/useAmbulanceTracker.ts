import { useEffect, useRef, useState } from "react";
import socket from "@/utils/socket";

interface Position {
  lat: number;
  lng: number;
}

export function useAmbulanceTracker(ambulanceId: string) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      socket.connect();

      socket.on("connect", () => {
        try {
          setIsConnected(true);
          console.log("Connected to WebSocket");
          // Match the backend event name
          socket.emit("join-tracking", `ambulance-${ambulanceId}`);
        } catch (err) {
          console.warn("Connect handler error:", err);
        }
      });

      socket.on("disconnect", () => {
        try {
          setIsConnected(false);
          console.log("Disconnected from WebSocket");
        } catch (err) {
          console.warn("Disconnect handler error:", err);
        }
      });

      if ("geolocation" in navigator) {
        try {
          // Initial position setup
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude: lat, longitude: lng } = pos.coords;

              // Send initial location to backend
              await updateLocationInBackend(lat, lng);
            },
            (error) => console.warn("Initial position error:", error.message),
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
          );

          // Watch position changes
          watchIdRef.current = navigator.geolocation.watchPosition(
            async (pos) => {
              try {
                const { latitude: lat, longitude: lng } = pos.coords;

                // Update location in backend
                await updateLocationInBackend(lat, lng);

                // Emit location update through WebSocket with modified room format
                if (socket.connected) {
                  socket.emit("location_update", {
                    room: `ambulance-${ambulanceId}`,
                    data: {
                      location: {
                        coordinates: [lng, lat],
                        timestamp: new Date().toISOString(),
                      },
                    },
                  });
                }
              } catch (err) {
                console.warn("Position update error:", err);
              }
            },
            (error) => console.warn("Watch position error:", error.message),
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 5000,
            }
          );
        } catch (err) {
          console.warn("Geolocation setup error:", err);
        }
      }

      return () => {
        try {
          if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
          }
          // Match the backend event name
          socket.emit("leave-tracking", `ambulance-${ambulanceId}`);
          socket.disconnect();
        } catch (err) {
          console.warn("Cleanup error:", err);
        }
      };
    } catch (err) {
      console.warn("Socket initialization error:", err);
      return () => {};
    }
  }, [ambulanceId]);

  // Helper function to update location in backend
  const updateLocationInBackend = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        "https://rapid8-backend.onrender.com/api/ambulance/update-location",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: ambulanceId, // Changed from ambulanceId to id
            lat: lng, // API expects longitude first
            lng: lat, // API expects latitude second
            is_active: true,
            is_available: true,
            last_updated_at: new Date().toISOString(),
          }),
        }
      );

      const data = await response.json();
      console.log("Update response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update location");
      }

      setLastUpdate(new Date().toISOString());
      setPosition({ lat, lng });
      setIsConnected(true);
    } catch (err) {
      console.error("Error updating location:", err);
      setIsConnected(false);
      throw err;
    }
  };

  return { position, isConnected, lastUpdate };
}
