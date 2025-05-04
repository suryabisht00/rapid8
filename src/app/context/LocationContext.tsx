'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Location {
  lng: number;
  lat: number;
}

interface Route {
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  distance: number;
  duration: number;
}

interface LocationHistoryItem {
  start: Location;
  end: Location;
  timestamp: number;
  travelMode: string;
}

interface LocationContextType {
  startLocation: Location | null;
  setStartLocation: (location: Location) => void;
  endLocation: Location | null;
  setEndLocation: (location: Location) => void;
  travelMode: string;
  setTravelMode: (mode: string) => void;
  route: Route | null;
  isLoading: boolean;
  calculateRoute: (start?: Location, end?: Location) => void;
  locationHistory: LocationHistoryItem[];
  error: string | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [startLocation, setStartLocation] = useState<Location | null>(null);
  const [endLocation, setEndLocation] = useState<Location | null>(null);
  const [travelMode, setTravelMode] = useState<string>('driving');
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateRoute = async (start?: Location, end?: Location) => {
    // Use provided locations or fall back to state
    const useStartLocation = start || startLocation;
    const useEndLocation = end || endLocation;
    
    if (!useStartLocation || !useEndLocation) {
      setError("Start and end locations are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Calculating route with:", {
        start: { lng: useStartLocation.lng, lat: useStartLocation.lat },
        end: { lng: useEndLocation.lng, lat: useEndLocation.lat },
        mode: travelMode
      });
      
      // Ensure coordinates are in the correct order for the Mapbox API (longitude,latitude)
      const startCoord = `${useStartLocation.lng},${useStartLocation.lat}`;
      const endCoord = `${useEndLocation.lng},${useEndLocation.lat}`;
      
      // Mapbox Directions API
      const profile = travelMode === 'driving' 
        ? 'mapbox/driving' 
        : travelMode === 'walking' 
        ? 'mapbox/walking' 
        : 'mapbox/cycling';
      
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibW9oYW5zaGFybWEwMDAwNyIsImEiOiJjbWE2Y2U5OGEwbWR3MmtzZ3hyczQxdWQzIn0.uFhP71t33Jh1bRPn1U55Bg';
      const url = `https://api.mapbox.com/directions/v5/${profile}/${startCoord};${endCoord}?steps=true&geometries=geojson&access_token=${mapboxToken}`;
      
      console.log("Fetching URL:", url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error(data.message || "No route found between these coordinates");
      }

      const routeData = data.routes[0];
      setRoute(routeData);
      
      // Add to history
      const historyItem: LocationHistoryItem = {
        start: useStartLocation,
        end: useEndLocation,
        timestamp: Date.now(),
        travelMode,
      };
      
      setLocationHistory(prevHistory => {
        // Keep only the latest 5 searches
        const newHistory = [historyItem, ...prevHistory];
        return newHistory.slice(0, 5);
      });
    } catch (error) {
      console.error('Error calculating route:', error);
      setError(error instanceof Error ? error.message : "Failed to calculate route");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        startLocation,
        setStartLocation,
        endLocation,
        setEndLocation,
        travelMode,
        setTravelMode,
        route,
        isLoading,
        calculateRoute,
        locationHistory,
        error
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};