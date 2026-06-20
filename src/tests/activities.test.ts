import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  app: {},
}));

import { summarizeWeek } from '@/lib/activities';
import type { CarbonActivity } from '@/lib/types';

function makeActivity(
  category: CarbonActivity['category'],
  co2Kg: number,
  description = 'test activity'
): CarbonActivity {
  return {
    uid: 'user-1',
    category,
    description,
    co2Kg,
    recordedAt: new Date('2025-06-01'),
    createdAt: new Date('2025-06-01'),
  };
}

describe('summarizeWeek', () => {
  it('returns zero totals for empty activities', () => {
    const summary = summarizeWeek([]);
    expect(summary.totalCo2Kg).toBe(0);
    expect(summary.activityCount).toBe(0);
    expect(summary.byCategory.transport).toBe(0);
    expect(summary.byCategory.food).toBe(0);
    expect(summary.byCategory.energy).toBe(0);
    expect(summary.byCategory.shopping).toBe(0);
    expect(summary.byCategory.other).toBe(0);
  });

  it('sums total CO2 across activities', () => {
    const activities = [
      makeActivity('transport', 5.5),
      makeActivity('food', 2.3),
      makeActivity('energy', 1.2),
    ];
    const summary = summarizeWeek(activities);
    expect(summary.totalCo2Kg).toBeCloseTo(9, 5);
    expect(summary.activityCount).toBe(3);
  });

  it('groups emissions by category', () => {
    const activities = [
      makeActivity('transport', 4),
      makeActivity('transport', 2),
      makeActivity('food', 3),
    ];
    const summary = summarizeWeek(activities);
    expect(summary.byCategory.transport).toBe(6);
    expect(summary.byCategory.food).toBe(3);
    expect(summary.byCategory.energy).toBe(0);
  });

  it('handles single activity', () => {
    const summary = summarizeWeek([makeActivity('shopping', 7.7)]);
    expect(summary.totalCo2Kg).toBe(7.7);
    expect(summary.activityCount).toBe(1);
    expect(summary.byCategory.shopping).toBe(7.7);
  });
});
