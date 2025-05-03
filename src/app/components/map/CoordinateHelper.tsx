import React, { useState } from 'react';
import { HelpCircle, X, Check, Copy, MapPin } from 'lucide-react';

const CoordinateHelper: React.FC = () => {
  const [showHelper, setShowHelper] = useState(false);

  const copyExample = (example: string) => {
    navigator.clipboard.writeText(example);
  };

  if (!showHelper) {
    return (
      <button 
        onClick={() => setShowHelper(true)}
        className="text-xs text-blue-600 flex items-center hover:underline mt-2"
      >
        <HelpCircle size={12} className="mr-1" /> How to find coordinates?
      </button>
    );
  }

  return (
    <div className="bg-blue-50 p-3 rounded-md mt-2 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-blue-800">Finding Coordinates</h4>
        <button 
          onClick={() => setShowHelper(false)} 
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={14} />
        </button>
      </div>

      <ul className="space-y-2">
        <li className="flex items-start">
          <Check size={12} className="text-green-600 mt-0.5 mr-1 flex-shrink-0" />
          <span>Use Google Maps: Right-click on a location and select "What's here?" to see coordinates</span>
        </li>
        <li className="flex items-start">
          <Check size={12} className="text-green-600 mt-0.5 mr-1 flex-shrink-0" />
          <span>The app accepts both formats: "latitude, longitude" and "longitude, latitude"</span>
        </li>
      </ul>

      <div className="mt-3">
        <p className="font-medium text-blue-800 mb-1">Example formats:</p>
        <div className="flex gap-2 flex-wrap">
          <div 
            className="bg-white px-2 py-1 rounded border border-blue-200 flex items-center cursor-pointer hover:bg-blue-100"
            onClick={() => copyExample("28.716328563029478, 75.78827946739135")}
          >
            <span className="mr-1">28.7163, 75.7882</span>
            <Copy size={10} className="text-blue-600" />
          </div>
          <div 
            className="bg-white px-2 py-1 rounded border border-blue-200 flex items-center cursor-pointer hover:bg-blue-100"
            onClick={() => copyExample("75.78827946739135, 28.716328563029478")}
          >
            <span className="mr-1">75.7882, 28.7163</span>
            <Copy size={10} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>App will automatically detect latitude/longitude order based on values</p>
      </div>

      <div className="mt-2">
        <a 
          href="https://www.latlong.net/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center"
        >
          <MapPin size={10} className="mr-1" /> 
          Find coordinates online
        </a>
      </div>
    </div>
  );
};

export default CoordinateHelper;
