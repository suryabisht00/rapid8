import { FaChartLine } from "react-icons/fa";
import ResourceChart from './ResourceChart';

export default function ResourceStatus() {
  return (
    <div className="lg:col-span-3 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FaChartLine className="text-blue-500 mr-2" />
          Resource Utilization
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResourceChart
          title="Bed Occupancy"
          used={56}
          total={80}
          color="bg-blue-500"
        />
        <ResourceChart
          title="Ambulances In Use"
          used={4}
          total={7}
          color="bg-red-500"
        />
        <ResourceChart
          title="Staff Availability"
          used={18}
          total={25}
          color="bg-green-500"
        />
      </div>
    </div>
  );
}
