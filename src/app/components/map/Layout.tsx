import React from 'react';
import Map from './Map';
import RouteForm from './RouteForm';
import { Navigation, History } from 'lucide-react';
import { LocationProvider } from '../../context/LocationContext';

const Layout: React.FC = () => {
  return (
    <LocationProvider>
      <div className="flex flex-col h-screen">
        <header className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Navigation size={24} className="text-[#35D0BA]" />
            <h1 className="text-xl font-semibold">Route Finder</h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <History size={16} />
            <span>History</span>
          </div>
        </header>
        
        <main className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
          <Map />
          <RouteForm />
        </main>
      </div>
    </LocationProvider>
  );
};

export default Layout;