"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Clock, Navigation, Phone, MessageSquare, Wifi, WifiOff, Cable, AlertCircle, Info } from "lucide-react";
import { useAmbulanceTracking } from "@/app/hooks/useAmbulanceTracking";

// Set Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 
  'pk.eyJ1IjoibW9oYW5zaGFybWEwMDAwNyIsImEiOiJjbWE2Y2U5OGEwbWR3MmtzZ3hyczQxdWQzIn0.uFhP71t33Jh1bRPn1U55Bg';

export default function EmergencyMap() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <EmergencyMapContent />
    </Suspense>
  );
}

function LoadingUI() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-700">Loading emergency map...</p>
      </div>
    </div>
  );
}

function EmergencyMapContent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const routeRef = useRef<mapboxgl.GeoJSONSource | null>(null);
  const ambulanceMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const userLat = searchParams.get("userLat");
  const userLng = searchParams.get("userLng");
  const ambulanceId = searchParams.get("ambulanceId");
  const eta = searchParams.get("eta") || "10";

  // Use our WebSocket hook to track ambulance in real-time
  // Pass user coordinates to get the nearest ambulance
  const { ambulanceData, isLoading, error, reconnect, isConnected } = 
    useAmbulanceTracking(ambulanceId, userLat, userLng);

  // Track remaining time for ETA countdown
  const [remainingTime, setRemainingTime] = useState(parseInt(eta));

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    if (!userLat || !userLng) {
      // If we're missing coordinates, redirect back to home
      alert("Missing user location data. Redirecting to home page.");
      router.push("/");
      return;
    }

    const userLatNum = parseFloat(userLat);
    const userLngNum = parseFloat(userLng);

    // Create map centered on user's location initially
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userLngNum, userLatNum],
      zoom: 14
    });

    // Wait for map to load before adding markers and route
    map.current.on("load", () => {
      if (!map.current) return;
      setMapLoaded(true);
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      
      try {
        // Add route source
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [],
            }
          }
        });
  
        // Add route layer
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          paint: {
            "line-color": "#FF3B30",
            "line-width": 4,
            "line-dasharray": [0, 4, 3]
          }
        });
      } catch (err) {
        console.error("Error adding route source/layer:", err);
      }

      // Create user marker (red pin)
      const userElement = document.createElement("div");
      userElement.className = "user-marker";
      userElement.style.width = "20px";
      userElement.style.height = "20px";
      userElement.style.borderRadius = "50%";
      userElement.style.backgroundColor = "#FF3B30";
      userElement.style.border = "2px solid white";
      userElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";

      userMarkerRef.current = new mapboxgl.Marker(userElement)
        .setLngLat([userLngNum, userLatNum])
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Your location</strong>"))
        .addTo(map.current);
    });

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLat, userLng, router]);

  // Update ambulance marker when ambulance data changes (from WebSocket)
  useEffect(() => {
    if (!mapLoaded || !map.current || !ambulanceData) return;
    
    const { lat, lng } = ambulanceData.location;
    
    if (ambulanceMarkerRef.current) {
      // Update existing marker position
      ambulanceMarkerRef.current.setLngLat([lng, lat]);
    } else {
      // Create ambulance marker
      const ambulanceElement = document.createElement("div");
      ambulanceElement.className = "ambulance-marker";
      ambulanceElement.style.width = "30px";
      ambulanceElement.style.height = "30px";
      ambulanceElement.style.backgroundImage = "url('https://img.icons8.com/color/48/ambulance.png')";
      ambulanceElement.style.backgroundSize = "contain";
      ambulanceElement.style.backgroundRepeat = "no-repeat";

      ambulanceMarkerRef.current = new mapboxgl.Marker(ambulanceElement)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>Ambulance ${ambulanceData.vehicleNumber || ''}</strong>
             <p>Driver: ${ambulanceData.driverName}</p>
             <p>Status: ${ambulanceData.status}</p>
             <p>Type: ${ambulanceData.vehicleType || 'Standard'}</p>`
          )
        )
        .addTo(map.current);
    }
    
    // Try to update route when ambulance location changes
    try {
      updateRoute();
    } catch (err) {
      console.error("Error updating route:", err);
    }
    
  }, [ambulanceData, mapLoaded]);

  // Update the route between user and ambulance
  const updateRoute = async () => {
    if (!map.current || !mapLoaded || !userLat || !userLng || !ambulanceData) return;
    
    try {
      const { lat: ambLat, lng: ambLng } = ambulanceData.location;
      const userLatNum = parseFloat(userLat);
      const userLngNum = parseFloat(userLng);
      
      // Fetch route from Mapbox Directions API
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${ambLng},${ambLat};${userLngNum},${userLatNum}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      
      const data = await response.json();
      
      if (!data.routes || data.routes.length === 0) {
        console.error("No route found");
        return;
      }

      const route = data.routes[0];
      
      // Calculate new ETA based on route duration
      const newEta = Math.ceil(route.duration / 60); // Convert seconds to minutes
      setRemainingTime(newEta);
      
      // Update the route on the map
      const source = map.current?.getSource("route") as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.geometry.coordinates
          }
        });

        // Store the source for later updates
        routeRef.current = source;
      }
      
      // Fit the map to show both points
      const bounds = new mapboxgl.LngLatBounds()
        .extend([ambLng, ambLat])
        .extend([userLngNum, userLatNum]);
      
      map.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 15
      });
      
    } catch (error) {
      console.error("Error updating route:", error);
    }
  };

  // ETA countdown timer
  useEffect(() => {
    if (remainingTime <= 0) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1));
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [remainingTime]);

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-red-600 text-white p-4">
        <h1 className="text-lg font-bold flex items-center">
          <span className="animate-pulse mr-2">⚡</span>
          Emergency Response Active
        </h1>
        <p className="text-sm opacity-90">Help is on the way to your location</p>
        
        {/* Connection status indicator */}
        <div className="flex items-center mt-1">
          {isConnected ? (
            <>
              <Wifi size={14} className="mr-1" />
              <span className="text-xs">Live tracking active</span>
            </>
          ) : (
            <>
              <WifiOff size={14} className="mr-1" />
              <span className="text-xs">Tracking connection lost</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Map container */}
        <div className="flex-1 relative">
          {/* Loading overlay */}
          {(isLoading || !ambulanceData) && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600 mb-4"></div>
                <p className="text-gray-700">Connecting to ambulance...</p>
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {error && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
              <div className="text-center p-6 max-w-md">
                <AlertCircle size={36} className="text-red-600 mx-auto mb-4" />
                <p className="text-red-700 font-medium">Connection Error</p>
                <p className="text-gray-600 mt-2 mb-4">{error}</p>
                <button 
                  onClick={reconnect} 
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          <div ref={mapContainer} className="absolute inset-0" />
        </div>

        {/* Status panel */}
        <div className="md:w-80 bg-white p-4 shadow-lg md:h-full overflow-y-auto">
          {ambulanceData && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Status</h2>
                <div className="bg-green-50 border-l-4 border-green-500 p-3">
                  <p className="text-green-700 font-medium">Ambulance dispatched</p>
                  <p className="text-sm text-green-600">Medical team is on the way</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                  <Clock size={16} className="mr-1" />
                  Estimated Arrival
                </h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-2xl font-bold text-red-600">{remainingTime} min</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-red-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.max(0, 100 - (remainingTime / parseInt(eta) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mb-6 border border-gray-200 rounded-md p-3">
                <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                  <Info size={16} className="mr-1" />
                  Ambulance Details
                </h3>
                <div className="space-y-2 text-sm">
                  {ambulanceData.vehicleNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Vehicle #:</span>
                      <span className="font-medium">{ambulanceData.vehicleNumber}</span>
                    </div>
                  )}
                  {ambulanceData.model && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Model:</span>
                      <span className="font-medium">{ambulanceData.model}</span>
                    </div>
                  )}
                  {ambulanceData.vehicleType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">{ambulanceData.vehicleType}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Driver:</span>
                    <span className="font-medium">{ambulanceData.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium capitalize">{ambulanceData.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(ambulanceData.location.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-2">Emergency Contacts</h3>
                <div className="space-y-2">
                  <button 
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                    onClick={() => window.open(`tel:${ambulanceData.phone}`)}
                  >
                    <Phone size={16} />
                    Call Driver ({ambulanceData.phone})
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">
                    <MessageSquare size={16} />
                    Send Message
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-md font-medium text-gray-700 mb-2">What to do while waiting</h3>
                <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                  <li>Stay calm and remain at your location</li>
                  <li>Keep your phone turned on and nearby</li>
                  <li>Clear a path for medical personnel</li>
                  <li>If possible, send someone to guide the ambulance</li>
                  <li>Follow any specific instructions from the emergency team</li>
                </ul>
              </div>
            </>
          )}
          
          {!ambulanceData && !error && (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">Loading ambulance data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
