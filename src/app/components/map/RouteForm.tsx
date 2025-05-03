import React, { useState } from 'react';
import { useLocationContext } from '../../context/LocationContext';
import { Car, Clock, Navigation2, LocateFixed, History, AlertCircle, MapPin, Route } from 'lucide-react';
import TravelModeSelector from './TravelModeSelector';
import RouteInfo from './RouteInfo';
import LocationHistory from './LocationHistory';
import CoordinateHelper from './CoordinateHelper';

const RouteForm: React.FC = () => {
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  
  const { 
    setStartLocation, 
    setEndLocation, 
    calculateRoute, 
    route, 
    isLoading,
    locationHistory,
    error: contextError
  } = useLocationContext();

  const parseCoordinates = (input: string): [number, number] | null => {
    // Try various formats: "12.34, 56.78" or "12.34 56.78" or "12.34,56.78"
    input = input.trim();
    
    // Try parsing as comma or space separated values
    let parts: string[] = [];
    if (input.includes(',')) {
      parts = input.split(',');
    } else {
      parts = input.split(/\s+/);
    }
    
    // Clean up parts and check if we have exactly two
    parts = parts.map(p => p.trim()).filter(p => p !== '');
    if (parts.length !== 2) return null;
    
    // Try to parse as numbers
    const firstValue = parseFloat(parts[0]);
    const secondValue = parseFloat(parts[1]);
    
    // Check if values are valid numbers
    if (isNaN(firstValue) || isNaN(secondValue)) return null;
    
    // Detect format based on value ranges
    // If first value is between -90 and 90, it's likely latitude
    // If second value is between -90 and 90, it's likely longitude
    let lng, lat;
    
    if (Math.abs(firstValue) <= 90 && Math.abs(secondValue) <= 180) {
      // Format: "latitude, longitude"
      lat = firstValue;
      lng = secondValue;
    } else if (Math.abs(secondValue) <= 90 && Math.abs(firstValue) <= 180) {
      // Format: "longitude, latitude"
      lng = firstValue;
      lat = secondValue;
    } else {
      // Values outside valid ranges
      return null;
    }
    
    // Validate final ranges
    if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      return [lng, lat];
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError(null);
    
    const startCoords = parseCoordinates(startInput);
    const endCoords = parseCoordinates(endInput);
    
    if (!startCoords) {
      setInputError('Invalid start coordinates. Please enter valid latitude, longitude values.');
      return;
    }
    
    if (!endCoords) {
      setInputError('Invalid end coordinates. Please enter valid latitude, longitude values.');
      return;
    }
    
    // Set locations and directly calculate route without setTimeout
    const newStartLocation = { lng: startCoords[0], lat: startCoords[1] };
    const newEndLocation = { lng: endCoords[0], lat: endCoords[1] };
    
    setStartLocation(newStartLocation);
    setEndLocation(newEndLocation);
    calculateRoute();
  };

  // Example coordinates for quick testing - updated to match the user's format
  const fillExampleCoordinates = () => {
    setStartInput('28.716328563029478, 75.78827946739135');
    setEndInput('28.69333198256195, 75.47219835116');
  };

  const error = inputError || contextError;

  return (
    <div className="md:w-96 w-full bg-white md:h-full absolute md:relative top-0 right-0 md:shadow-xl z-10 md:z-auto">
      <div className="route-card m-4 p-6 h-auto max-h-[calc(100vh-120px)] md:max-h-[calc(100%-2rem)] overflow-y-auto">
        <div className="mb-6 animate-fade-in">
          <h2 className="text-xl font-semibold text-[#0A2540] mb-2 flex items-center">
            <Route size={20} className="mr-2" />
            Find the Shortest Route
          </h2>
          <p className="text-gray-600 text-sm">
            Enter the coordinates of two locations to find the shortest path between them
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MapPin size={16} className="mr-1 text-[#FF6B6B]" />
              Start Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="Latitude, Longitude (e.g. 28.7163, 75.7882)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Format: latitude, longitude or longitude, latitude</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <LocateFixed size={16} className="mr-1 text-[#35D0BA]" />
              End Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={endInput}
                onChange={(e) => setEndInput(e.target.value)}
                placeholder="Latitude, Longitude (e.g. 28.6933, 75.4721)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                required
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Format: latitude, longitude or longitude, latitude</p>
            <CoordinateHelper />
          </div>

          <div className="text-right">
            <button 
              type="button" 
              onClick={fillExampleCoordinates}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Use example coordinates
            </button>
          </div>
          
          <TravelModeSelector />
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 flex items-start">
              <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#0A2540] text-white py-2 rounded-md flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0D2E4D] transition-colors'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Calculating...
              </>
            ) : (
              <>
                <Navigation2 size={16} className="mr-2" />
                Calculate Route
              </>
            )}
          </button>
        </form>
        
        {/* Display route information if available */}
        {route && <RouteInfo />}
        
        {/* Location history section */}
        <div className="mt-6">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-[#0A2540] text-sm font-medium flex items-center"
          >
            <History size={16} className="mr-1" />
            {showHistory ? 'Hide History' : 'Show Recent Searches'}
          </button>
          
          {showHistory && locationHistory.length > 0 && (
            <LocationHistory 
              onSelect={(start, end) => {
                setStartInput(`${start.lng}, ${start.lat}`);
                setEndInput(`${end.lng}, ${end.lat}`);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteForm;