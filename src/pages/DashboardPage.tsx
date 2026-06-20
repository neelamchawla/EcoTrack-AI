import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DailyEntry } from '@/types';
import { StatCard } from '@/components/StatCard';
import { ProgressRing } from '@/components/ProgressRing';
import { GREEN_ALTERNATIVES } from '@/utils/challenges';

const CATEGORY_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#06b6d4', '#a855f7'];

interface DashboardPageProps {
  entries: DailyEntry[];
  latestEntry?: DailyEntry;
}

export function DashboardPage({ entries, latestEntry }: DashboardPageProps) {
  const trendData = useMemo(
    () =>
      entries.slice(-14).map((e) => ({
        date: e.date.slice(5),
        daily: e.result.daily,
        score: e.result.sustainabilityScore,
      })),
    [entries]
  );

  const breakdownData = useMemo(() => {
    if (!latestEntry) return [];
    return Object.entries(latestEntry.result.breakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [latestEntry]);

  const monthlySavings = useMemo(() => {
    if (entries.length < 2) return 0;
    const first = entries[0].result.monthly;
    const last = entries[entries.length - 1].result.monthly;
    return Math.max(0, first - last);
  }, [entries]);

  const avgScore = useMemo(() => {
    if (!entries.length) return 0;
    const sum = entries.reduce((acc, e) => acc + e.result.sustainabilityScore, 0);
    return Math.round(sum / entries.length);
  }, [entries]);

  if (!latestEntry) {
    return (
      <section aria-labelledby="dashboard-heading">
        <h2 id="dashboard-heading" className="text-3xl font-bold">
          Analytics Dashboard
        </h2>
        <p className="mt-8 rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500 dark:border-gray-600">
          Log your first footprint on the Calculator page to see trends and charts.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-8">
      <header>
        <h2 id="dashboard-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your carbon trends, category breakdown, and potential savings.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Latest Daily CO₂" value={latestEntry.result.daily} unit="kg" />
        <StatCard label="Monthly Estimate" value={latestEntry.result.monthly} unit="kg" accent="blue" />
        <StatCard label="Avg. Score" value={avgScore} unit="/100" accent="amber" />
        <StatCard label="Monthly Savings" value={monthlySavings.toFixed(1)} unit="kg" accent="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold">Carbon Trend</h3>
          <div className="h-64" role="img" aria-label="Carbon footprint trend chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="daily" stroke="#22c55e" fill="#bbf7d0" name="Daily kg CO₂" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold">Category Breakdown</h3>
          <div className="h-64" role="img" aria-label="Category breakdown pie chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={breakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {breakdownData.map((_, index) => (
                    <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 font-semibold">Sustainability Score Trend</h3>
          <div className="h-64" role="img" aria-label="Sustainability score bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#3b82f6" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="mb-4 self-start font-semibold">Current Score</h3>
          <ProgressRing score={latestEntry.result.sustainabilityScore} size={140} />
        </article>
      </div>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 font-semibold">Green Alternatives</h3>
        <ul className="grid gap-4 sm:grid-cols-2" role="list">
          {GREEN_ALTERNATIVES.map((alt) => (
            <li
              key={alt.title}
              className="rounded-xl border border-eco-200 bg-eco-50 p-4 dark:border-eco-800 dark:bg-eco-900/20"
            >
              <h4 className="font-medium text-eco-800 dark:text-eco-300">{alt.title}</h4>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{alt.description}</p>
              <p className="mt-2 text-sm font-semibold text-eco-600">
                ~{alt.estimatedSavingsKg} kg CO₂/month saved
              </p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
