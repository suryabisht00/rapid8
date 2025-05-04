import { Stats, Emergency } from '@/types/hospital';
import Header from '@/app/components/hospital/Header';
import StatCards from '@/app/components/hospital/StatCards';
import EmergencyList from '@/app/components/hospital/EmergencyList';
import QuickActions from '@/app/components/hospital/QuickActions';
import ResourceStatus from '@/app/components/hospital/ResourceStatus';

export default function HospitalDashboard() {
  // Sample data - replace with real API calls
  const stats: Stats = {
    activeEmergencies: 5,
    availableBeds: 24,
    icuAvailable: 8,
    ambulancesAvailable: 3,
    staffOnDuty: 12,
  };

  const emergencies: Emergency[] = [
    {
      id: 1,
      patient: "Rahul Sharma",
      type: "Cardiac",
      location: "12.9716,77.5946",
      eta: "8 min",
    },
    {
      id: 2,
      patient: "Priya Patel",
      type: "Accident",
      location: "12.9352,77.6245",
      eta: "15 min",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <EmergencyList emergencies={emergencies} />
          <QuickActions />
          <ResourceStatus />
        </div>
      </main>
    </div>
  );
}
