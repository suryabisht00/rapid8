import { StatCardProps } from '@/types/hospital';

export default function StatCard({ icon, title, value, trend }: StatCardProps) {
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
