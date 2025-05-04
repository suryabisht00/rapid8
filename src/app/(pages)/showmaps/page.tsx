'use client';

import { useState, useEffect } from 'react';
import Map from 'react-map-gl/mapbox';
// Remove or replace the Layout import with a component that exists in your project
// For now, we'll create a simple Layout component inline

export default function ShowMapsPage() {
  const [error, setError] = useState<string | null>(null);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Unhandled error:", event.error);
      setError("An unexpected error occurred. Please try again.");
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-red-600 text-lg font-medium mb-3">Application Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  // Simple layout component
  const SimpleLayout = ({ children }: { children?: React.ReactNode }) => (
    <div className="min-h-screen">
      <main className="p-4">
        {children || <div>Map content will go here</div>}
      </main>
    </div>
  );

  return (
    <SimpleLayout>
      <Map
        longitude={-100}
        latitude={40}
        zoom={3.5}
        style={{width: '100%', height: '400px'}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    </SimpleLayout>
  );
}