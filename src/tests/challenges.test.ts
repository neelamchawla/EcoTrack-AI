import { describe, expect, it } from 'vitest';
import {
  BADGE_DEFINITIONS,
  GREEN_ALTERNATIVES,
  WEEKLY_CHALLENGES,
} from '@/utils/challenges';

describe('WEEKLY_CHALLENGES', () => {
  it('contains expected number of challenges', () => {
    expect(WEEKLY_CHALLENGES).toHaveLength(6);
  });

  it('has unique challenge ids', () => {
    const ids = WEEKLY_CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('references valid badge ids when badgeId is set', () => {
    const badgeIds = new Set(BADGE_DEFINITIONS.map((b) => b.id));
    for (const challenge of WEEKLY_CHALLENGES) {
      if (challenge.badgeId) {
        expect(badgeIds.has(challenge.badgeId)).toBe(true);
      }
    }
  });

  it('has positive estimated savings for every challenge', () => {
    for (const challenge of WEEKLY_CHALLENGES) {
      expect(challenge.estimatedSavingsKg).toBeGreaterThan(0);
    }
  });

  it('uses valid category keys', () => {
    const validCategories = ['transport', 'food', 'electricity', 'water', 'waste'];
    for (const challenge of WEEKLY_CHALLENGES) {
      expect(validCategories).toContain(challenge.category);
    }
  });

  it('includes required fields on each challenge', () => {
    for (const challenge of WEEKLY_CHALLENGES) {
      expect(challenge.title.length).toBeGreaterThan(0);
      expect(challenge.description.length).toBeGreaterThan(0);
    }
  });
});

describe('BADGE_DEFINITIONS', () => {
  it('defines three badges', () => {
    expect(BADGE_DEFINITIONS).toHaveLength(3);
  });

  it('has unique badge ids', () => {
    const ids = BADGE_DEFINITIONS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes icon and description for each badge', () => {
    for (const badge of BADGE_DEFINITIONS) {
      expect(badge.icon.length).toBeGreaterThan(0);
      expect(badge.name.length).toBeGreaterThan(0);
      expect(badge.description.length).toBeGreaterThan(0);
    }
  });
});

describe('GREEN_ALTERNATIVES', () => {
  it('lists four green alternatives', () => {
    expect(GREEN_ALTERNATIVES).toHaveLength(4);
  });

  it('has unique titles', () => {
    const titles = GREEN_ALTERNATIVES.map((a) => a.title);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('has positive savings estimates', () => {
    for (const alt of GREEN_ALTERNATIVES) {
      expect(alt.estimatedSavingsKg).toBeGreaterThan(0);
    }
  });

  it('covers multiple categories', () => {
    const categories = new Set(GREEN_ALTERNATIVES.map((a) => a.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });
});
