import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  data: {
    latitude: number | null;
    longitude: number | null;
    accuracy: number | null;
    timestamp: string | null;
    ipAddress: string | null;
  };
}

export default function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    data: {
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null,
      ipAddress: null,
    },
  });

  // Function to get IP address (client-side only)
  const getIpAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'Unable to fetch IP';
    }
  };

  // Function to get current location
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      async position => {
        const ipAddress = await getIpAddress();
        setState({
          loading: false,
          error: null,
          data: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
            ipAddress,
          },
        });
      },
      error => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    );
  };

  return {
    ...state,
    getCurrentPosition,
  };
} 