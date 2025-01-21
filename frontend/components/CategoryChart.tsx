'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CategoryData {
  name: string;
  total: number;
  color: string;
  icon: string;
}

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No spending data for this month
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          formatter={(value: number | undefined) =>
            value !== undefined ? [`$${value.toFixed(2)}`, 'Amount'] : ['$0.00', 'Amount']
          }
          cursor={{ fill: '#f3f4f6' }}
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
