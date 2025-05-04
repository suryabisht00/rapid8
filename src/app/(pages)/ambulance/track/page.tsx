"use client";

import AmbulanceTracker from "@/app/components/home/AmbulanceTracker";

export default function TrackPage() {
  // Using the test ambulance ID
  const testAmbulanceId = "6816f18e760101a2c41984c6";

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ambulance Location Tracker</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-gray-600">Ambulance ID: {testAmbulanceId}</p>
          <p className="text-gray-600 text-sm">Testing WebSocket Connection</p>
        </div>

        <AmbulanceTracker ambulanceId={testAmbulanceId} />
      </div>
    </div>
  );
}
