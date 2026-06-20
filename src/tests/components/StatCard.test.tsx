import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from '@/components/StatCard';

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Daily CO₂" value={12.5} />);
    expect(screen.getByText('Daily CO₂')).toBeInTheDocument();
    expect(screen.getByText('12.5')).toBeInTheDocument();
  });

  it('renders unit when provided', () => {
    render(<StatCard label="Monthly Estimate" value={375} unit="kg" />);
    expect(screen.getByText('kg')).toBeInTheDocument();
  });

  it('uses custom aria label when provided', () => {
    render(
      <StatCard label="Score" value={90} unit="/100" ariaLabel="Average sustainability score 90" />
    );
    expect(screen.getByLabelText('Average sustainability score 90')).toBeInTheDocument();
  });

  it('generates default aria label from props', () => {
    render(<StatCard label="Daily CO₂" value={10} unit="kg" />);
    expect(screen.getByLabelText('Daily CO₂: 10 kg')).toBeInTheDocument();
  });

  it.each(['green', 'blue', 'amber', 'purple'] as const)('renders with %s accent', (accent) => {
    const { container } = render(<StatCard label="Test" value={1} accent={accent} />);
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});
