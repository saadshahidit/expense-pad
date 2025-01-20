'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import SummaryCard from '@/components/SummaryCard';
import CategoryChart from '@/components/CategoryChart';
import api from '@/lib/api';

interface CategoryBreakdown {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
  total: number;
}

interface RecentExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: { name: string; color: string; icon: string };
}

interface DashboardData {
  monthlyTotal: number;
  byCategory: CategoryBreakdown[];
  recentExpenses: RecentExpense[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((r) => setData(r.data))
      .finally(() => setIsLoading(false));
  }, []);

  const currentMonth = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">{currentMonth} overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard
          title="Total This Month"
          value={`$${(data?.monthlyTotal || 0).toFixed(2)}`}
          icon="💰"
          color="#6366f1"
        />
        <SummaryCard
          title="Categories Used"
          value={String(data?.byCategory?.length || 0)}
          subtitle="spending categories"
          icon="📊"
          color="#10b981"
        />
        <SummaryCard
          title="Recent Transactions"
          value={String(data?.recentExpenses?.length || 0)}
          subtitle="last 5 entries"
          icon="📝"
          color="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Spending by Category
          </h2>
          <CategoryChart data={data?.byCategory || []} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Recent Expenses
          </h2>
          {!data?.recentExpenses?.length ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No recent expenses
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{
                        backgroundColor: `${expense.category?.color || '#6b7280'}20`,
                      }}
                    >
                      {expense.category?.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {expense.category?.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${parseFloat(String(expense.amount)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
