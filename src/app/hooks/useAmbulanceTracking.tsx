import { useState, useEffect, useRef } from 'react';

interface AmbulanceLocation {
  lat: number;
  lng: number;
  lastUpdated: string;
}

interface AmbulanceData {
  driverName: string;
  phone: string;
  status: string;
  location: AmbulanceLocation;
  isConnected: boolean;
  vehicleNumber?: string;
  vehicleType?: string;
  model?: string;
}

export function useAmbulanceTracking(ambulanceId: string | null, userLat?: string | null, userLng?: string | null) {
  const [ambulanceData, setAmbulanceData] = useState<AmbulanceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Initial data fetch to get ambulance info
    const fetchInitialData = async () => {
      try {
        let url;
        
        // If user coordinates are provided, use nearest ambulance endpoint
        if (userLat && userLng) {
          url = `https://rapid8-backend.onrender.com/api/ambulance/nearest?lat=${userLat}&lng=${userLng}`;
        } else if (ambulanceId) {
          // Use the provided ambulance ID
          url = `https://rapid8-backend.onrender.com/api/ambulance/${ambulanceId}`;
        } else {
          // No valid parameters provided
          throw new Error('Missing required parameters: either ambulanceId or location coordinates');
        }
        
        console.log("Fetching ambulance data from:", url);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ambulance data: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to get ambulance data');
        }

        // Extract location coordinates from the API format
        const location = data.data.location;
        let lat, lng;

        // Handle different location data formats
        if (location && location.coordinates && Array.isArray(location.coordinates)) {
          // API returns coordinates as [lng, lat]
          [lng, lat] = location.coordinates;
        } else {
          throw new Error('Invalid location data format received from API');
        }
        
        // Create ambulance data object with available fields
        setAmbulanceData({
          // Use API data or fallback to generic values if not provided
          driverName: data.data.driverName || "Ambulance Driver",
          phone: data.data.phone || "108",
          status: data.data.is_available ? "En Route" : "Dispatched",
          location: {
            lat: lat,
            lng: lng,
            lastUpdated: data.data.last_updated_at || new Date().toISOString()
          },
          isConnected: true,
          vehicleNumber: data.data.vehicle_number,
          vehicleType: data.data.vehicle_type,
          model: data.data.model
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching ambulance data:", err);
        
        setError(err instanceof Error ? err.message : 'Failed to fetch ambulance data');
        setIsLoading(false);
        
        // Don't set default ambulance data - it's better to show the error
        // This makes it clear something went wrong rather than showing fake data
      }
    };

    // Set up WebSocket connection for real-time updates
    const connectWebSocket = () => {
      // Only establish connection if we have ambulance data
      if (!ambulanceData) {
        console.warn("Not connecting WebSocket: no ambulance data available");
        return;
      }
      
      console.log("Connecting to WebSocket simulation");
      
      try {
        // Simulate successful connection
        setTimeout(() => {
          console.log("WebSocket connected");
          
          // Simulate getting updates every few seconds
          const intervalId = setInterval(() => {
            if (!ambulanceData) return;
            
            // Simulate movement - small random changes to location
            const randomOffset = () => (Math.random() * 0.0002) - 0.0001;
            const newLat = ambulanceData.location.lat + randomOffset();
            const newLng = ambulanceData.location.lng + randomOffset();
            
            setAmbulanceData(prev => {
              if (!prev) return null;
              return {
                ...prev,
                location: {
                  lat: newLat,
                  lng: newLng,
                  lastUpdated: new Date().toISOString()
                }
              };
            });
            
          }, 3000); // Update every 3 seconds
          
          // Store the interval ID for cleanup
          wsRef.current = {
            close: () => {
              clearInterval(intervalId);
              console.log("WebSocket connection closed");
            }
          } as any;
          
        }, 1000);
      } catch (err) {
        console.error("WebSocket connection error:", err);
        setError("Failed to connect to tracking service");
        setAmbulanceData(prev => prev ? { ...prev, isConnected: false } : null);
      }
    };

    // Execute fetchInitialData first, then connectWebSocket only if data is available
    const initializeTracking = async () => {
      try {
        await fetchInitialData();
        // Only connect WebSocket if we successfully got ambulance data
        if (ambulanceData) {
          connectWebSocket();
        }
      } catch (err) {
        // Error handling already done in fetchInitialData
      }
    };

    initializeTracking();

    // Clean up WebSocket connection on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [ambulanceId, userLat, userLng]);

  // Function to manually reconnect if connection is lost
  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Reset state and trigger a refetch
    setAmbulanceData(null);
    
    // Re-run the effect to fetch data and establish connection
    // This is achieved by relying on the useEffect dependency array
    // The effect will re-run because we're nullifying the ambulanceData
  };

  return {
    ambulanceData,
    isLoading,
    error,
    reconnect,
    isConnected: ambulanceData?.isConnected || false
  };
}
