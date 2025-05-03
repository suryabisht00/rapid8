import { FaBell, FaMapMarkerAlt } from "react-icons/fa";
import { Emergency } from '@/types/hospital';

export default function EmergencyList({ emergencies }: { emergencies: Emergency[] }) {
  return (
    <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FaBell className="text-red-500 mr-2" />
          Active Emergency Cases
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{emergency.patient}</h4>
                <p className="text-sm text-gray-500">
                  {emergency.type} Emergency
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FaMapMarkerAlt className="mr-1" />
                  {emergency.location}
                </span>
                <span className="text-sm font-medium">
                  ETA: {emergency.eta}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
