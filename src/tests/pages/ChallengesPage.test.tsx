import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { BADGE_DEFINITIONS, WEEKLY_CHALLENGES } from '@/utils/challenges';

describe('ChallengesPage', () => {
  const defaultBadges = BADGE_DEFINITIONS.map((b) => ({ ...b }));

  it('renders heading and all weekly challenges', () => {
    render(<ChallengesPage completed={[]} badges={defaultBadges} onComplete={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Weekly Eco Challenges' })).toBeInTheDocument();
    for (const challenge of WEEKLY_CHALLENGES) {
      expect(screen.getByText(challenge.title)).toBeInTheDocument();
    }
  });

  it('shows badge count', () => {
    render(<ChallengesPage completed={[]} badges={defaultBadges} onComplete={vi.fn()} />);
    expect(screen.getByText(`Your Badges (0/${defaultBadges.length})`)).toBeInTheDocument();
  });

  it('shows earned badge count', () => {
    const badges = defaultBadges.map((b) =>
      b.id === 'green-starter' ? { ...b, earnedAt: '2025-06-01T00:00:00.000Z' } : b
    );
    render(<ChallengesPage completed={[]} badges={badges} onComplete={vi.fn()} />);
    expect(screen.getByText(`Your Badges (1/${defaultBadges.length})`)).toBeInTheDocument();
    expect(screen.getByLabelText('Green Starter, earned')).toBeInTheDocument();
  });

  it('marks completed challenges as Done', () => {
    render(
      <ChallengesPage
        completed={['meatless-monday']}
        badges={defaultBadges}
        onComplete={vi.fn()}
      />
    );
    expect(screen.getByText('Done ✓')).toBeInTheDocument();
    expect(screen.queryByLabelText('Mark Meatless Monday as complete')).not.toBeInTheDocument();
  });

  it('calls onComplete with challenge and badge ids', () => {
    const onComplete = vi.fn();
    render(<ChallengesPage completed={[]} badges={defaultBadges} onComplete={onComplete} />);

    fireEvent.click(screen.getByLabelText('Mark Bike to Work as complete'));
    expect(onComplete).toHaveBeenCalledWith('bike-to-work', 'eco-warrior');
  });

  it('displays estimated savings for each challenge', () => {
    render(<ChallengesPage completed={[]} badges={defaultBadges} onComplete={vi.fn()} />);
    for (const challenge of WEEKLY_CHALLENGES) {
      expect(screen.getByText(`~${challenge.estimatedSavingsKg} kg CO₂ saved`)).toBeInTheDocument();
    }
  });
});
