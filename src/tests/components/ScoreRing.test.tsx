import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScoreRing } from '@/components/ScoreRing';

describe('ScoreRing', () => {
  it('displays score and max label', () => {
    render(<ScoreRing score={80} />);
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('/ 100')).toBeInTheDocument();
  });

  it('provides accessible label', () => {
    render(<ScoreRing score={55} />);
    expect(screen.getByRole('img', { name: 'Sustainability score 55 out of 100' })).toBeInTheDocument();
  });

  it('renders at custom size', () => {
    const { container } = render(<ScoreRing score={60} size={160} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '160');
  });
});
