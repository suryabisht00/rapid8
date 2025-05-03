// components/LocationTracker.tsx
"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: string;
  deviceId?: string;
}

export default function LocationTracker() {
  const [position, setPosition] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_WS_SERVER || "http://localhost:3001"
    );
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle location tracking
  useEffect(() => {
    if (!isTracking || !socket) return;

    let watchId: number;
    let intervalId: NodeJS.Timeout;

    const sendLocation = (location: GeolocationPosition) => {
      const locationData: LocationData = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date().toISOString(),
        deviceId: "user-device", // Replace with actual device ID
      };

      setPosition(locationData);
      socket.emit("locationUpdate", locationData);
    };

    // Get immediate position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendLocation(pos);

        // Then set up continuous tracking
        watchId = navigator.geolocation.watchPosition(
          sendLocation,
          (err) => setError(`Geolocation error: ${err.message}`),
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );

        // Backup: Send every 5 seconds even if position hasn't changed
        intervalId = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            sendLocation,
            (err) => setError(`Geolocation error: ${err.message}`),
            { enableHighAccuracy: true }
          );
        }, 5000);
      },
      (err) => setError(`Initial geolocation error: ${err.message}`)
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, socket]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    setError(null);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Location Tracker</h2>

      <button
        onClick={toggleTracking}
        className={`px-4 py-2 rounded-md text-white ${
          isTracking
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isTracking ? "Stop Tracking" : "Start Tracking"}
      </button>

      {position && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium">Current Location</h3>
          <p>Latitude: {position.lat.toFixed(6)}</p>
          <p>Longitude: {position.lng.toFixed(6)}</p>
          <p>Accuracy: {position.accuracy?.toFixed(2)} meters</p>
          <p>Last Sent: {new Date(position.timestamp).toLocaleTimeString()}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <p>Status: {isTracking ? "Active - Sending to server" : "Inactive"}</p>
        {socket && (
          <p>Connection: {socket.connected ? "Connected" : "Disconnected"}</p>
        )}
      </div>
    </div>
  );
}
