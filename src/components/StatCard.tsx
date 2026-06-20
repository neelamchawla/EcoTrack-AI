import { memo } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  accent?: 'green' | 'blue' | 'amber' | 'purple';
  ariaLabel?: string;
}

const accentClasses = {
  green: 'border-eco-500 bg-eco-50 dark:bg-eco-900/30',
  blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30',
  amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/30',
  purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/30',
};

function StatCardComponent({ label, value, unit, accent = 'green', ariaLabel }: StatCardProps) {
  return (
    <article
      className={`rounded-xl border-l-4 p-4 shadow-sm ${accentClasses[accent]}`}
      aria-label={ariaLabel ?? `${label}: ${value}${unit ? ` ${unit}` : ''}`}
    >
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        {unit && <span className="ml-1 text-base font-normal text-gray-500">{unit}</span>}
      </p>
    </article>
  );
}

export const StatCard = memo(StatCardComponent);
