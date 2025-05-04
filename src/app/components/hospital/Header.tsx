import { FaBell } from "react-icons/fa";

export default function Header() {
  return (
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
  );
}
