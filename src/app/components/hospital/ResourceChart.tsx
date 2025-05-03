import { ResourceChartProps } from '@/types/hospital';

export default function ResourceChart({ title, used, total, color }: ResourceChartProps) {
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
