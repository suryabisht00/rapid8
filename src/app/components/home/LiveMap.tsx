"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define TypeScript interfaces
interface Location {
  lat: number;
  lng: number;
}

interface LiveMapProps {
  ambulanceLocation: Location;
  emergencyLocation?: Location;
  hospitalLocation?: Location;
}

// Fix for default marker icons in Leaflet with proper error handling
if (typeof window !== "undefined") {
  // Removed unnecessary line as _getIconUrl is not a valid property
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/marker-icon-2x.png",
    iconUrl: "/marker-icon.png",
    shadowUrl: "/marker-shadow.png",
  });
}

const LiveMap = ({
  ambulanceLocation,
  emergencyLocation,
  hospitalLocation,
}: LiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const ambulanceMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize map only if container exists
    if (!mapRef.current && mapContainerRef.current) {
      try {
        mapRef.current = L.map(mapContainerRef.current).setView(
          [ambulanceLocation.lat, ambulanceLocation.lng],
          13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(mapRef.current);
      } catch (error) {
        console.error("Error initializing map:", error);
        return;
      }
    }

    const map = mapRef.current;
    if (!map) return;

    // Custom icons
    const ambulanceIcon = L.divIcon({
      className: "ambulance-marker",
      html: `<div class="relative">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M8 16v-1H4a1 1 0 01-1-1V1a1 1 0 011-1h9a1 1 0 011 1v5h1a2 2 0 012 2v8a2 2 0 01-2 2H8zM5 2v12h7V2H5zm5 5a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1h-1a1 1 0 01-1-1V7z" />
               </svg>
               <div class="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow">
                 <div class="h-3 w-3 bg-red-600 rounded-full animate-pulse"></div>
               </div>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Clear existing markers and routes
    if (ambulanceMarkerRef.current) {
      ambulanceMarkerRef.current.remove();
    }
    if (routeLineRef.current) {
      routeLineRef.current.remove();
    }

    // Add new ambulance marker
    try {
      ambulanceMarkerRef.current = L.marker(
        [ambulanceLocation.lat, ambulanceLocation.lng],
        { icon: ambulanceIcon, zIndexOffset: 1000 }
      ).addTo(map);

      if (emergencyLocation) {
        const emergencyIcon = L.divIcon({
          className: "emergency-marker",
          html: `<div class="relative">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white bg-red-600 rounded-full p-1" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                   </svg>
                 </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([emergencyLocation.lat, emergencyLocation.lng], {
          icon: emergencyIcon,
        }).addTo(map);

        // Draw route
        const route: L.LatLngExpression[] = [
          [ambulanceLocation.lat, ambulanceLocation.lng],
          [emergencyLocation.lat, emergencyLocation.lng],
        ];

        routeLineRef.current = L.polyline(route, {
          color: "#ef4444",
          weight: 5,
          dashArray: "10, 10",
          lineJoin: "round",
        }).addTo(map);

        // Fit bounds to show both points
        map.fitBounds([
          [ambulanceLocation.lat, ambulanceLocation.lng],
          [emergencyLocation.lat, emergencyLocation.lng],
        ]);
      }

      if (hospitalLocation) {
        const hospitalIcon = L.divIcon({
          className: "hospital-marker",
          html: `<div class="relative">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white bg-blue-600 rounded-full p-1" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm0 4h2v2H7V9zm0 4h2v2H7v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" clipRule="evenodd" />
                   </svg>
                 </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker([hospitalLocation.lat, hospitalLocation.lng], {
          icon: hospitalIcon,
        }).addTo(map);
      }
    } catch (error) {
      console.error("Error adding markers or routes:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [ambulanceLocation, emergencyLocation, hospitalLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full rounded-lg z-0"
      style={{ minHeight: "400px" }}
    />
  );
};

export default LiveMap;
