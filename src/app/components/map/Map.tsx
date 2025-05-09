import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl/dist/mapbox-gl.css'; // Add this import for mapbox CSS
import { useLocationContext } from '../../context/LocationContext'; // Fix import path

// Replace this with your MapBox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibW9oYW5zaGFybWEwMDAwNyIsImEiOiJjbWE2Y2U5OGEwbWR3MmtzZ3hyczQxdWQzIn0.uFhP71t33Jh1bRPn1U55Bg';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const routeSource = useRef<string>('route');
  const [mapInitialized, setMapInitialized] = useState(false);
  const startMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const endMarkerRef = useRef<mapboxgl.Marker | null>(null);
  
  const { 
    startLocation, 
    endLocation, 
    route, 
    travelMode,
    setStartLocation,
    setEndLocation 
  } = useLocationContext();

  // Initialize map
  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [78.9629, 20.5937], // Default center of India
        zoom: 4,
      });

      // Wait for map to load before adding controls and layers
      map.current.on('load', () => {
        if (!map.current) return;
        
        map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        // Add geocoder controls for start and end locations
        const startGeocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken as string,
          mapboxgl: mapboxgl as any,
          placeholder: 'Start location',
          marker: false
        });

        const endGeocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken as string,
          mapboxgl: mapboxgl as any,
          placeholder: 'End location',
          marker: false
        });

        map.current.addControl(startGeocoder, 'top-left');
        map.current.addControl(endGeocoder, 'top-left');

        // Handle geocoder results
        startGeocoder.on('result', (e) => {
          const coords = e.result.center;
          setStartLocation({ lng: coords[0], lat: coords[1] });
        });

        endGeocoder.on('result', (e) => {
          const coords = e.result.center;
          setEndLocation({ lng: coords[0], lat: coords[1] });
        });
        
        // Setup layers and sources
        try {
          // Add source for route
          map.current.addSource(routeSource.current, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [],
              },
            },
          });

          // Add route layer
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: routeSource.current,
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': travelMode === 'driving' ? '#FF6B6B' : 
                          travelMode === 'walking' ? '#35D0BA' : '#4D96FF',
              'line-width': 5,
              'line-opacity': 0.8,
            },
          });

          // Add source for markers
          map.current.addSource('markers', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          // Add markers layer
          map.current.addLayer({
            id: 'markers',
            type: 'circle',
            source: 'markers',
            paint: {
              'circle-radius': 8,
              'circle-color': ['match', ['get', 'type'], 
                'start', '#FF6B6B', 
                'end', '#35D0BA', 
                '#0A2540'],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });
          
          setMapInitialized(true);
        } catch (error) {
          console.error("Error setting up map layers:", error);
        }
        
        // Handle map clicks
        map.current.on('click', (e) => {
          if (!startLocation) {
            setStartLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });
          } else if (!endLocation) {
            setEndLocation({ lng: e.lngLat.lng, lat: e.lngLat.lat });
          }
        });
      });
    }
    
    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update line color when travel mode changes
  useEffect(() => {
    if (!map.current || !mapInitialized) return;
    
    try {
      if (map.current.getLayer('route')) {
        map.current.setPaintProperty('route', 'line-color', 
          travelMode === 'driving' ? '#FF6B6B' : 
          travelMode === 'walking' ? '#35D0BA' : '#4D96FF'
        );
      }
    } catch (error) {
      console.error("Error updating route color:", error);
    }
  }, [travelMode, mapInitialized]);

  // Update route visualization when route data changes
  useEffect(() => {
    if (!map.current || !mapInitialized || !route) return;
    
    try {
      const source = map.current.getSource(routeSource.current) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route.geometry.coordinates,
          },
        });
      }

      if (startLocation && endLocation) {
        const markersSource = map.current.getSource('markers') as mapboxgl.GeoJSONSource;
        if (markersSource) {
          markersSource.setData({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: { type: 'start' },
                geometry: {
                  type: 'Point',
                  coordinates: [startLocation.lng, startLocation.lat],
                },
              },
              {
                type: 'Feature',
                properties: { type: 'end' },
                geometry: {
                  type: 'Point',
                  coordinates: [endLocation.lng, endLocation.lat],
                },
              },
            ],
          });
        }

        if (route.geometry.coordinates.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          route.geometry.coordinates.forEach(coord => {
            bounds.extend([coord[0], coord[1]]);
          });
          
          map.current.fitBounds(bounds, {
            padding: 100,
            maxZoom: 15,
            duration: 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating route visualization:", error);
    }
  }, [route, startLocation, endLocation, mapInitialized]);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Update or create start marker
    if (startLocation) {
      if (startMarkerRef.current) {
        startMarkerRef.current.setLngLat([startLocation.lng, startLocation.lat]);
      } else {
        // Create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'marker-start';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#FF6B6B';
        el.style.border = '2px solid white';
        
        startMarkerRef.current = new mapboxgl.Marker(el)
          .setLngLat([startLocation.lng, startLocation.lat])
          .addTo(map.current);
      }
    } else if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    
    // Update or create end marker
    if (endLocation) {
      if (endMarkerRef.current) {
        endMarkerRef.current.setLngLat([endLocation.lng, endLocation.lat]);
      } else {
        // Create a DOM element for the marker
        const el = document.createElement('div');
        el.className = 'marker-end';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#35D0BA';
        el.style.border = '2px solid white';
        
        endMarkerRef.current = new mapboxgl.Marker(el)
          .setLngLat([endLocation.lng, endLocation.lat])
          .addTo(map.current);
      }
    } else if (endMarkerRef.current) {
      endMarkerRef.current.remove();
      endMarkerRef.current = null;
    }
    
    // Fit bounds to markers if both exist
    if (startLocation && endLocation) {
      const bounds = new mapboxgl.LngLatBounds()
        .extend([startLocation.lng, startLocation.lat])
        .extend([endLocation.lng, endLocation.lat]);
      
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15,
      });
    }
  }, [startLocation, endLocation, mapInitialized]);

  // Add cleanup for markers
  useEffect(() => {
    return () => {
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.remove();
        endMarkerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex-1 h-full map-container">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;