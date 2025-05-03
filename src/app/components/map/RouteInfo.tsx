import React from 'react';
import { useLocationContext } from '../../context/LocationContext';
import { MapPin, LocateFixed, ArrowRight, Clock, Navigation2 } from 'lucide-react';

const RouteInfo: React.FC = () => {
  const { route, startLocation, endLocation, travelMode } = useLocationContext();

  if (!route || !startLocation || !endLocation) return null;

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds.toFixed(0)} seconds`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`;
  };

  const getModeIcon = () => {
    switch (travelMode) {
      case 'driving':
        return <div className="bg-[#FF6B6B]/10 p-2 rounded-full"><Clock size={18} className="text-[#FF6B6B]" /></div>;
      case 'walking':
        return <div className="bg-[#35D0BA]/10 p-2 rounded-full"><Clock size={18} className="text-[#35D0BA]" /></div>;
      case 'cycling':
        return <div className="bg-[#4D96FF]/10 p-2 rounded-full"><Clock size={18} className="text-[#4D96FF]" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><Clock size={18} className="text-gray-500" /></div>;
    }
  };

  const distance = route.distance || 0;
  const duration = route.duration || 0;
  
  const getTravelModeText = () => {
    switch (travelMode) {
      case 'driving': return 'Driving';
      case 'walking': return 'Walking';
      case 'cycling': return 'Cycling';
      default: return 'Travel';
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 info-box">
      <h3 className="text-lg font-medium text-[#0A2540] mb-4 flex items-center">
        <Navigation2 size={18} className="mr-2" />
        Route Details
      </h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-start mb-3">
          <div className="min-w-8 mt-1">
            <MapPin size={16} className="text-[#FF6B6B]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-sm font-medium">{startLocation.lng.toFixed(4)}, {startLocation.lat.toFixed(4)}</p>
          </div>
        </div>
        
        <div className="ml-4 my-1">
          <ArrowRight size={14} className="text-gray-400" />
        </div>
        
        <div className="flex items-start">
          <div className="min-w-8 mt-1">
            <LocateFixed size={16} className="text-[#35D0BA]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">To</p>
            <p className="text-sm font-medium">{endLocation.lng.toFixed(4)}, {endLocation.lat.toFixed(4)}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-[#0A2540]/10 p-2 rounded-full">
              <Navigation2 size={18} className="text-[#0A2540]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-sm font-semibold">{formatDistance(distance)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            {getModeIcon()}
            <div>
              <p className="text-xs text-gray-500">{getTravelModeText()} Time</p>
              <p className="text-sm font-semibold">{formatDuration(duration)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;