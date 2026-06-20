import type { AppState, DailyEntry } from '@/types';
import { BADGE_DEFINITIONS } from '@/utils/challenges';

const STORAGE_KEY = 'ecotrack-ai-state';

const DEFAULT_STATE: AppState = {
  entries: [],
  completedChallenges: [],
  badges: BADGE_DEFINITIONS.map((b) => ({ ...b })),
  aiCache: {},
};

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, badges: BADGE_DEFINITIONS.map((b) => ({ ...b })) };

    const parsed = JSON.parse(raw) as AppState;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      badges: mergeBadges(parsed.badges ?? []),
    };
  } catch {
    return { ...DEFAULT_STATE, badges: BADGE_DEFINITIONS.map((b) => ({ ...b })) };
  }
}

export function saveAppState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addDailyEntry(state: AppState, entry: DailyEntry): AppState {
  const filtered = state.entries.filter((e) => e.date !== entry.date);
  return { ...state, entries: [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date)) };
}

export function completeChallenge(state: AppState, challengeId: string, badgeId?: string): AppState {
  const completedChallenges = state.completedChallenges.includes(challengeId)
    ? state.completedChallenges
    : [...state.completedChallenges, challengeId];

  const badges = state.badges.map((badge) => {
    if (badge.id === badgeId && !badge.earnedAt) {
      return { ...badge, earnedAt: new Date().toISOString() };
    }
    return badge;
  });

  return { ...state, completedChallenges, badges };
}

function mergeBadges(stored: AppState['badges']) {
  return BADGE_DEFINITIONS.map((def) => {
    const existing = stored.find((b) => b.id === def.id);
    return existing ?? { ...def };
  });
}
