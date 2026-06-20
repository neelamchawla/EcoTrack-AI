import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AppState, CarbonInputs, CoachMessage, DailyEntry } from '@/types';
import {
  addDailyEntry,
  completeChallenge,
  loadAppState,
  saveAppState,
} from '@/services/storageService';
import { calculateCarbonFootprint } from '@/utils/carbonCalculator';

export function useEcoTrack() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const latestEntry = useMemo(
    () => (state.entries.length ? state.entries[state.entries.length - 1] : undefined),
    [state.entries]
  );

  const logFootprint = useCallback((inputs: CarbonInputs) => {
    const result = calculateCarbonFootprint(inputs);
    const entry: DailyEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      inputs,
      result,
    };
    setState((prev) => addDailyEntry(prev, entry));
    return result;
  }, []);

  const markChallengeComplete = useCallback((challengeId: string, badgeId?: string) => {
    setState((prev) => completeChallenge(prev, challengeId, badgeId));
  }, []);

  const cacheAiResponse = useCallback((key: string, response: string) => {
    setState((prev) => ({
      ...prev,
      aiCache: { ...prev.aiCache, [key]: response },
    }));
  }, []);

  const addCoachMessage = useCallback((message: CoachMessage) => {
    setCoachMessages((prev) => [...prev, message]);
  }, []);

  return {
    state,
    latestEntry,
    coachMessages,
    highContrast,
    setHighContrast,
    logFootprint,
    markChallengeComplete,
    cacheAiResponse,
    addCoachMessage,
  };
}
