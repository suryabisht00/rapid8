"use client";

import {
  FaAmbulance,
  FaMapMarkedAlt,
  FaUserInjured,
  FaClock,
  FaPhone,
  FaHospital,
} from "react-icons/fa";
import { IoMdAlert } from "react-icons/io";
import Map from "@/app/components/map/Map";
import { LocationProvider } from "@/app/context/LocationContext";

export default function AmbulanceDashboard() {
  // Sample data with Rajasthan coordinates
  const ambulance = {
    id: "AMB-1023",
    status: "on_mission",
    currentLocation: { lat: 27.0238, lng: 74.2179 }, // Sikar, Rajasthan
    driver: "Rajesh Kumar",
    contact: "+91 98765 43210",
    hospital: "Rajasthan Hospital",
  };

  const activeEmergency = {
    id: "EMER-456",
    patient: "Priya Sharma",
    type: "Cardiac Arrest",
    location: { lat: 27.5529, lng: 76.6346 }, // Alwar, Rajasthan
    receivedAt: "2023-06-15T14:30:00Z",
    priority: "high",
  };

  const recentEmergencies = [
    {
      id: "EMER-455",
      patient: "Amit Patel",
      type: "Accident",
      time: "30 mins ago",
      status: "completed",
    },
    {
      id: "EMER-454",
      patient: "Neha Gupta",
      type: "Stroke",
      time: "2 hours ago",
      status: "completed",
    },
  ];

  return (
    <LocationProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <FaAmbulance className="text-red-600 text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Ambulance Control Panel -{" "}
                <span className="font-mono">{ambulance.id}</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ambulance.status === "on_mission"
                    ? "bg-red-100 text-red-800"
                    : ambulance.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {ambulance.status.replace("_", " ").toUpperCase()}
              </span>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center text-sm">
                <IoMdAlert className="mr-2" /> SOS
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Map */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Tracking Map */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-medium flex items-center">
                    <FaMapMarkedAlt className="text-blue-500 mr-2" />
                    Live Tracking
                  </h2>
                  <span className="text-sm text-gray-500">
                    Last updated: Just now
                  </span>
                </div>
                <div className="h-[calc(100vh-200px)] min-h-[600px]">
                  <Map
                    startLocation={ambulance.currentLocation}
                    endLocation={activeEmergency.location}
                    showRouteForm={false}
                    autoFitBounds={true}
                  />
                </div>
              </div>

              {/* Current Emergency */}
              {ambulance.status === "on_mission" && activeEmergency && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-red-50">
                    <h2 className="font-medium flex items-center text-red-700">
                      <FaUserInjured className="mr-2" />
                      Active Emergency
                    </h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Patient
                        </h3>
                        <p className="font-medium">{activeEmergency.patient}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Emergency Type
                        </h3>
                        <p className="font-medium">{activeEmergency.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Priority
                        </h3>
                        <p
                          className={`font-medium ${
                            activeEmergency.priority === "high"
                              ? "text-red-600"
                              : activeEmergency.priority === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {activeEmergency.priority.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaClock className="mr-2" /> Time Elapsed
                        </h3>
                        <p className="font-mono text-lg">38:24</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-500 flex items-center">
                          <FaMapMarkedAlt className="mr-2" /> Distance
                        </h3>
                        <p className="font-mono text-lg">2.4 km</p>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                        <FaPhone className="mr-2" /> Call Patient
                      </button>
                      <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                        <FaHospital className="mr-2" /> Reached Location
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Ambulance Status */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="font-medium">Ambulance Details</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Driver
                    </h3>
                    <p>{ambulance.driver}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Contact
                    </h3>
                    <p>{ambulance.contact}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Assigned Hospital
                    </h3>
                    <p>{ambulance.hospital}</p>
                  </div>
                  <div className="pt-4">
                    <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Emergencies */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="font-medium">Recent Missions</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentEmergencies.map((emergency) => (
                    <div key={emergency.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{emergency.patient}</h3>
                          <p className="text-sm text-gray-500">
                            {emergency.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {emergency.time}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                              emergency.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {emergency.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h2 className="font-medium">Quick Actions</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <button className="bg-blue-100 text-blue-800 p-3 rounded-lg flex flex-col items-center">
                    <FaPhone className="text-xl mb-1" />
                    <span className="text-sm">Call Hospital</span>
                  </button>
                  <button className="bg-green-100 text-green-800 p-3 rounded-lg flex flex-col items-center">
                    <FaHospital className="text-xl mb-1" />
                    <span className="text-sm">Check-in</span>
                  </button>
                  <button className="bg-purple-100 text-purple-800 p-3 rounded-lg flex flex-col items-center">
                    <FaUserInjured className="text-xl mb-1" />
                    <span className="text-sm">Patient Info</span>
                  </button>
                  <button className="bg-red-100 text-red-800 p-3 rounded-lg flex flex-col items-center">
                    <IoMdAlert className="text-xl mb-1" />
                    <span className="text-sm">Emergency</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </LocationProvider>
  );
}
