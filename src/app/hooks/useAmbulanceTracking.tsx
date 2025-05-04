import { useState, useEffect, useRef } from "react";

interface AmbulanceLocation {
  type: string;
  coordinates: number[];
}

interface AmbulanceData {
  _id: string;
  owner_user_id: string;
  vehicle_number: string;
  vehicle_type: string;
  model: string;
  registration_certificate_url: string;
  insurance_url: string;
  is_available: boolean;
  is_active: boolean;
  last_updated_at: string;
  location: AmbulanceLocation;
  isConnected?: boolean; // Added optional isConnected property
}

export function useAmbulanceTracking(ambulanceId: string | null) {
  const [ambulanceData, setAmbulanceData] = useState<AmbulanceData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!ambulanceId) {
      setIsLoading(false);
      return;
    }

    console.log("Starting tracking for Ambulance ID:", ambulanceId);

    const updateLocation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://rapid8-backend.onrender.com/api/ambulance/update-location",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ambulanceId: ambulanceId,
              location: {
                type: "Point",
                coordinates: [77.445183625, 28.634387250000003], // [longitude, latitude]
              },
            }),
          }
        );

        const result = await response.json();
        console.log("Location update response:", result);

        if (!response.ok) {
          throw new Error(result.message || "Failed to update location");
        }

        // Update state with API response format
        setAmbulanceData((prev) => {
          if (!prev) return result.data;
          return {
            ...result.data,
            isConnected: true,
          };
        });

        setError(null);
      } catch (err) {
        console.error("Location update failed:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update location"
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Initial update
    updateLocation();

    // Set up interval for periodic updates
    intervalRef.current = setInterval(updateLocation, 10000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [ambulanceId]);

  // Function to manually reconnect if connection is lost
  const reconnect = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      if (ambulanceData) {
        setAmbulanceData({
          ...ambulanceData,
          isConnected: true,
        });

        setIsLoading(false);
      }
    }, 1500);
  };

  return {
    ambulanceData: ambulanceData
      ? {
          ...ambulanceData,
          location: {
            lat: ambulanceData.location.coordinates[1],
            lng: ambulanceData.location.coordinates[0],
            lastUpdated: ambulanceData.last_updated_at,
          },
        }
      : null,
    isLoading,
    error,
    reconnect,
    isConnected: !!ambulanceData?.is_active,
  };
}
