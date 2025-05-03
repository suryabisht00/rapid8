import {
  FaAmbulance,
  FaBed,
  FaUserMd,
  FaBell,
  FaChartLine,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function HospitalDashboard() {
  // Sample data - replace with real API calls
  const stats = {
    activeEmergencies: 5,
    availableBeds: 24,
    icuAvailable: 8,
    ambulancesAvailable: 3,
    staffOnDuty: 12,
  };

  const emergencies = [
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
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-red-600">Emergency</span> Command Center
          </h1>
          <div className="flex items-center space-x-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
              <FaBell className="mr-2" /> Alerts
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Emergency Alerts */}
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

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Dispatch Ambulance
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Add New Staff
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                Update Bed Status
              </button>
              <button className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                Generate Reports
              </button>
            </div>
          </div>

          {/* Resource Status */}
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
        </div>
      </main>
    </div>
  );
}

// Component for Stat Cards
function StatCard({ icon, title, value, trend }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gray-100 p-3 rounded-full">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {trend && (
                <div
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend === "up" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {trend === "up" ? "↑" : "↓"}
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for Resource Charts
function ResourceChart({ title, used, total, color }) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className={`${color} h-4 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>{used} in use</span>
        <span>{total - used} available</span>
      </div>
    </div>
  );
}
