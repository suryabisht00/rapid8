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
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude: lat, longitude: lng } = pos.coords;
              setPosition({ lat, lng });
              setLastUpdate(new Date().toLocaleTimeString());
            },
            (error) => console.warn("Initial position error:", error.message),
            { timeout: 30000, maximumAge: 60000, enableHighAccuracy: false }
          );

          watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
              try {
                const { latitude: lat, longitude: lng } = pos.coords;
                setPosition({ lat, lng });
                setLastUpdate(new Date().toLocaleTimeString());

                if (socket.connected) {
                  socket.emit("update_location", {
                    ambulanceId,
                    lat,
                    lng,
                  });
                }
              } catch (err) {
                console.warn("Position update error:", err);
              }
            },
            (error) => {
              console.warn("Watch position error:", error.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 10000,
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

  return { position, isConnected, lastUpdate };
}
