import React from 'react';
import { useLocationContext } from '../../context/LocationContext';
import { Clock, MapPin } from 'lucide-react';

interface LocationHistoryProps {
  onSelect: (start: { lng: number; lat: number }, end: { lng: number; lat: number }) => void;
}

const LocationHistory: React.FC<LocationHistoryProps> = ({ onSelect }) => {
  const { locationHistory } = useLocationContext();

  if (locationHistory.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No search history yet</p>;
  }

  return (
    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
      {locationHistory.map((item, index) => (
        <div 
          key={index}
          className="history-item p-2 rounded-md border border-gray-100 cursor-pointer hover:border-gray-300 transition-colors"
          onClick={() => onSelect(item.start, item.end)}
        >
          <div className="flex items-center gap-1 mb-1">
            <Clock size={12} className="text-gray-400" />
            <span className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-start gap-2 text-xs">
            <MapPin size={12} className="text-[#FF6B6B] mt-0.5" />
            <span className="text-gray-700 truncate">
              {item.start.lng.toFixed(4)}, {item.start.lat.toFixed(4)}
            </span>
          </div>
          
          <div className="flex items-start gap-2 text-xs">
            <MapPin size={12} className="text-[#35D0BA] mt-0.5" />
            <span className="text-gray-700 truncate">
              {item.end.lng.toFixed(4)}, {item.end.lat.toFixed(4)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LocationHistory;