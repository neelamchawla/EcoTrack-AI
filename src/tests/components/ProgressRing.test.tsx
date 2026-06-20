import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressRing } from '@/components/ProgressRing';

describe('ProgressRing', () => {
  it('displays the score value', () => {
    render(<ProgressRing score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('provides accessible label with score', () => {
    render(<ProgressRing score={42} />);
    expect(screen.getByRole('img', { name: 'Sustainability score 42 out of 100' })).toBeInTheDocument();
  });

  it('renders svg at custom size', () => {
    const { container } = render(<ProgressRing score={50} size={200} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it.each([0, 100])('renders boundary score %i', (score) => {
    render(<ProgressRing score={score} />);
    expect(screen.getByText(String(score))).toBeInTheDocument();
  });
});
