import { beforeEach, describe, expect, it } from 'vitest';
import {
  addDailyEntry,
  completeChallenge,
  loadAppState,
  saveAppState,
} from '@/services/storageService';
import { makeAppState, makeEntry } from './fixtures';

const STORAGE_KEY = 'ecotrack-ai-state';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadAppState', () => {
    it('returns default state when localStorage is empty', () => {
      const state = loadAppState();
      expect(state.entries).toEqual([]);
      expect(state.completedChallenges).toEqual([]);
      expect(state.badges).toHaveLength(3);
      expect(state.aiCache).toEqual({});
    });

    it('loads persisted state from localStorage', () => {
      const saved = makeAppState({
        completedChallenges: ['bike-to-work'],
        aiCache: { hello: 'world' },
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const loaded = loadAppState();
      expect(loaded.completedChallenges).toEqual(['bike-to-work']);
      expect(loaded.aiCache).toEqual({ hello: 'world' });
    });

    it('merges stored badges with definitions', () => {
      const saved = makeAppState({
        badges: [
          {
            id: 'green-starter',
            name: 'Green Starter',
            icon: '🏅',
            description: 'Completed your first eco challenge.',
            earnedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      const loaded = loadAppState();
      expect(loaded.badges).toHaveLength(3);
      expect(loaded.badges.find((b) => b.id === 'green-starter')?.earnedAt).toBe(
        '2025-01-01T00:00:00.000Z'
      );
      expect(loaded.badges.find((b) => b.id === 'eco-warrior')).toBeDefined();
    });

    it('returns default state on invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      const state = loadAppState();
      expect(state.entries).toEqual([]);
      expect(state.badges).toHaveLength(3);
    });
  });

  describe('saveAppState', () => {
    it('persists state to localStorage', () => {
      const state = makeAppState({ completedChallenges: ['meatless-monday'] });
      saveAppState(state);
      const raw = localStorage.getItem(STORAGE_KEY);
      expect(raw).toBeTruthy();
      expect(JSON.parse(raw!).completedChallenges).toEqual(['meatless-monday']);
    });
  });

  describe('addDailyEntry', () => {
    it('appends a new entry', () => {
      const state = makeAppState();
      const entry = makeEntry('2025-06-01');
      const next = addDailyEntry(state, entry);
      expect(next.entries).toHaveLength(1);
      expect(next.entries[0]).toEqual(entry);
    });

    it('replaces entry for the same date', () => {
      const entry1 = makeEntry('2025-06-01', undefined, 'id-1');
      const entry2 = makeEntry('2025-06-01', undefined, 'id-2');
      const state = addDailyEntry(makeAppState(), entry1);
      const next = addDailyEntry(state, entry2);
      expect(next.entries).toHaveLength(1);
      expect(next.entries[0].id).toBe('id-2');
    });

    it('sorts entries by date ascending', () => {
      const state = makeAppState();
      let next = addDailyEntry(state, makeEntry('2025-06-03'));
      next = addDailyEntry(next, makeEntry('2025-06-01'));
      next = addDailyEntry(next, makeEntry('2025-06-02'));
      expect(next.entries.map((e) => e.date)).toEqual(['2025-06-01', '2025-06-02', '2025-06-03']);
    });
  });

  describe('completeChallenge', () => {
    it('adds challenge id to completed list', () => {
      const state = makeAppState();
      const next = completeChallenge(state, 'bike-to-work');
      expect(next.completedChallenges).toContain('bike-to-work');
    });

    it('does not duplicate completed challenges', () => {
      const state = makeAppState({ completedChallenges: ['bike-to-work'] });
      const next = completeChallenge(state, 'bike-to-work');
      expect(next.completedChallenges).toEqual(['bike-to-work']);
    });

    it('awards badge with earnedAt timestamp', () => {
      const state = makeAppState();
      const next = completeChallenge(state, 'bike-to-work', 'eco-warrior');
      const badge = next.badges.find((b) => b.id === 'eco-warrior');
      expect(badge?.earnedAt).toBeDefined();
      expect(new Date(badge!.earnedAt!).getTime()).not.toBeNaN();
    });

    it('does not overwrite already earned badge', () => {
      const earnedAt = '2024-01-01T00:00:00.000Z';
      const state = makeAppState({
        badges: makeAppState().badges.map((b) =>
          b.id === 'eco-warrior' ? { ...b, earnedAt } : b
        ),
      });
      const next = completeChallenge(state, 'public-transport', 'eco-warrior');
      const badge = next.badges.find((b) => b.id === 'eco-warrior');
      expect(badge?.earnedAt).toBe(earnedAt);
    });

    it('completes challenge without badge when badgeId omitted', () => {
      const state = makeAppState();
      const next = completeChallenge(state, 'shorter-showers');
      expect(next.completedChallenges).toContain('shorter-showers');
      expect(next.badges.every((b) => !b.earnedAt)).toBe(true);
    });
  });
});
