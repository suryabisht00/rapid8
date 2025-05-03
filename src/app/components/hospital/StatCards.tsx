import { FaAmbulance, FaBed, FaUserMd } from "react-icons/fa";
import StatCard from './StatCard';
import { Stats } from '@/types/hospital';

export default function StatCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <StatCard
        icon={<FaAmbulance className="text-red-500" />}
        title="Active Emergencies"
        value={stats.activeEmergencies}
        trend="up"
      />
      <StatCard
        icon={<FaBed className="text-blue-500" />}
        title="Available Beds"
        value={stats.availableBeds}
        trend="down"
      />
      <StatCard
        icon={<FaBed className="text-purple-500" />}
        title="ICU Available"
        value={stats.icuAvailable}
      />
      <StatCard
        icon={<FaAmbulance className="text-green-500" />}
        title="Ambulances Ready"
        value={stats.ambulancesAvailable}
      />
      <StatCard
        icon={<FaUserMd className="text-yellow-500" />}
        title="Staff On Duty"
        value={stats.staffOnDuty}
      />
    </div>
  );
}
