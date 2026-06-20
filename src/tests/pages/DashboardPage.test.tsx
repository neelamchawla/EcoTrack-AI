import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DashboardPage } from '@/pages/DashboardPage';
import { makeEntry, validInputs, veganBikeInputs } from '../fixtures';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => null,
  Bar: () => null,
  Pie: () => null,
  Cell: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('DashboardPage', () => {
  it('shows empty state when no entries exist', () => {
    render(<DashboardPage entries={[]} />);
    expect(screen.getByRole('heading', { name: 'Analytics Dashboard' })).toBeInTheDocument();
    expect(
      screen.getByText('Log your first footprint on the Calculator page to see trends and charts.')
    ).toBeInTheDocument();
  });

  it('renders stats and charts when entries exist', () => {
    const entry = makeEntry('2025-06-15');
    render(<DashboardPage entries={[entry]} latestEntry={entry} />);

    expect(screen.getByText('Latest Daily CO₂')).toBeInTheDocument();
    expect(screen.getByText('Monthly Estimate')).toBeInTheDocument();
    expect(screen.getByText('Avg. Score')).toBeInTheDocument();
    expect(screen.getByText('Monthly Savings')).toBeInTheDocument();
    expect(screen.getByText('Carbon Trend')).toBeInTheDocument();
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Green Alternatives')).toBeInTheDocument();
  });

  it('displays green alternatives list', () => {
    const entry = makeEntry('2025-06-15');
    render(<DashboardPage entries={[entry]} latestEntry={entry} />);
    expect(screen.getByText('Switch to Public Transport')).toBeInTheDocument();
    expect(screen.getByText('Plant-Based Meals')).toBeInTheDocument();
    expect(screen.getByText('LED Bulbs')).toBeInTheDocument();
    expect(screen.getByText('Compost Organic Waste')).toBeInTheDocument();
  });

  it('computes monthly savings from first to last entry', () => {
    const heavy = makeEntry('2025-06-01', validInputs);
    const light = makeEntry('2025-06-15', veganBikeInputs);
    render(<DashboardPage entries={[heavy, light]} latestEntry={light} />);

    const savings = Math.max(0, heavy.result.monthly - light.result.monthly);
    expect(screen.getByText(savings.toFixed(1))).toBeInTheDocument();
  });

  it('shows average sustainability score', () => {
    const entry1 = makeEntry('2025-06-01');
    const entry2 = makeEntry('2025-06-02', veganBikeInputs);
    const avg = Math.round(
      (entry1.result.sustainabilityScore + entry2.result.sustainabilityScore) / 2
    );
    render(<DashboardPage entries={[entry1, entry2]} latestEntry={entry2} />);
    expect(screen.getByText(String(avg))).toBeInTheDocument();
  });

  it('renders current score ring from latest entry', () => {
    const entry = makeEntry('2025-06-15');
    render(<DashboardPage entries={[entry]} latestEntry={entry} />);
    expect(
      screen.getByRole('img', {
        name: `Sustainability score ${entry.result.sustainabilityScore} out of 100`,
      })
    ).toBeInTheDocument();
  });
});
