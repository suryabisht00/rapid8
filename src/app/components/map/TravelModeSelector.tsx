import React from 'react';
import { useLocationContext } from '../../context/LocationContext';
import { Car, Navigation, Bike } from 'lucide-react';

const TravelModeSelector: React.FC = () => {
  const { travelMode, setTravelMode } = useLocationContext();

  return (
    <div className="my-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Travel Mode</p>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setTravelMode('driving')}
          className={`travel-mode-btn flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center ${
            travelMode === 'driving'
              ? 'bg-[#0A2540] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Car size={16} className="mr-1" />
          Driving
        </button>
        
        <button
          type="button"
          onClick={() => setTravelMode('walking')}
          className={`travel-mode-btn flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center ${
            travelMode === 'walking'
              ? 'bg-[#0A2540] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Navigation size={16} className="mr-1" />
          Walking
        </button>
        
        <button
          type="button"
          onClick={() => setTravelMode('cycling')}
          className={`travel-mode-btn flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center ${
            travelMode === 'cycling'
              ? 'bg-[#0A2540] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Bike size={16} className="mr-1" />
          Cycling
        </button>
      </div>
    </div>
  );
};

export default TravelModeSelector;