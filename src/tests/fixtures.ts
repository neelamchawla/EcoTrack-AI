import type { AppState, CarbonInputs, CarbonResult, DailyEntry } from '@/types';
import { calculateCarbonFootprint } from '@/utils/carbonCalculator';
import { BADGE_DEFINITIONS } from '@/utils/challenges';

export const validInputs: CarbonInputs = {
  transportKm: 20,
  transportMode: 'car',
  foodPreference: 'mixed',
  electricityUnits: 8,
  waterLiters: 150,
  wasteKg: 0.5,
  wasteType: 'mixed',
};

export const veganBikeInputs: CarbonInputs = {
  transportKm: 10,
  transportMode: 'bike',
  foodPreference: 'vegan',
  electricityUnits: 5,
  waterLiters: 100,
  wasteKg: 0.2,
  wasteType: 'organic',
};

export function makeResult(inputs: CarbonInputs = validInputs): CarbonResult {
  return calculateCarbonFootprint(inputs);
}

export function makeEntry(
  date: string,
  inputs: CarbonInputs = validInputs,
  id = `entry-${date}`
): DailyEntry {
  return { id, date, inputs, result: makeResult(inputs) };
}

export function makeAppState(overrides: Partial<AppState> = {}): AppState {
  return {
    entries: [],
    completedChallenges: [],
    badges: BADGE_DEFINITIONS.map((b) => ({ ...b })),
    aiCache: {},
    ...overrides,
  };
}
