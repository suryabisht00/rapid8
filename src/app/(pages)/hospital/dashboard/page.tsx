import { Stats } from '@/types/hospital';
import Header from '@/app/components/hospital/Header';
import StatCards from '@/app/components/hospital/StatCards';
import ResourceStatus from '@/app/components/hospital/ResourceStatus';
import QuickActions from '@/app/components/hospital/QuickActions';

export default function HospitalDashboard() {
  // Sample data - replace with real API calls
  const stats: Stats = {
    activeEmergencies: 3,
    availableBeds: 32,
    icuAvailable: 12,
    ambulancesAvailable: 5,
    staffOnDuty: 18,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Hospital Dashboard</h1>
          <p className="text-gray-600">View hospital resources and status</p>
        </div>
        
        <StatCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ResourceStatus />
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
