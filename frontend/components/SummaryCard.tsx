interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: string;
}

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  color = '#6366f1',
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
