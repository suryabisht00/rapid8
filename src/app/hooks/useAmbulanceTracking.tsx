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
}

export function useAmbulanceTracking(ambulanceId: string | null) {
  const [ambulanceData, setAmbulanceData] = useState<AmbulanceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!ambulanceId) {
      setIsLoading(false);
      return;
    }

    // Initial data fetch to get ambulance info
    const fetchInitialData = async () => {
      try {
        const response = await fetch(`https://rapid8-backend.onrender.com/api/ambulance/68161ba466578384f4b229d1`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ambulance data: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to get ambulance data');
        }

        // Extract location coordinates noting that API returns them as [lng, lat]
        const [lng, lat] = data.data.location.coordinates;
        
        setAmbulanceData({
          driverName: data.data.driverName,
          phone: data.data.phone,
          status: data.data.status,
          location: {
            lat: lat, // API returns [lng, lat] but we store as {lat, lng}
            lng: lng,
            lastUpdated: data.data.lastUpdated
          },
          isConnected: true
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching ambulance data:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch ambulance data');
        setIsLoading(false);
      }
    };

    // Set up WebSocket connection for real-time updates
    const connectWebSocket = () => {
      // For the production app, this would be a real WebSocket endpoint
      // For now, we'll simulate WebSocket behavior
      const wsUrl = `wss://rapid8-backend.onrender.com/api/ambulance-tracking/68161ba466578384f4b229d1`;
      
      try {
        // Simulating WebSocket since we don't have a real WebSocket endpoint
        // In a real app, you would use: wsRef.current = new WebSocket(wsUrl);
        console.log(`Connecting to WebSocket: ${wsUrl}`);
        
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

    // Fix: Execute fetchInitialData first, then connectWebSocket
    const initializeTracking = async () => {
      try {
        await fetchInitialData();
        connectWebSocket();
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
  }, [ambulanceId]);

  // Function to manually reconnect if connection is lost
  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      // This simulates fetching the data again and reconnecting
      if (ambulanceData) {
        setAmbulanceData({
          ...ambulanceData,
          isConnected: true
        });
        
        // In a real app, you would call fetchInitialData() and connectWebSocket() here
        setIsLoading(false);
      }
    }, 1500);
  };

  return {
    ambulanceData,
    isLoading,
    error,
    reconnect,
    isConnected: ambulanceData?.isConnected || false
  };
}
