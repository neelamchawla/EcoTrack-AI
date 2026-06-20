import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useEcoTrack } from '@/hooks/useEcoTrack';
import { validInputs, veganBikeInputs } from '../fixtures';

describe('useEcoTrack', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('high-contrast');
  });

  it('initializes with default state from localStorage', () => {
    const { result } = renderHook(() => useEcoTrack());
    expect(result.current.state.entries).toEqual([]);
    expect(result.current.state.badges).toHaveLength(3);
    expect(result.current.coachMessages).toEqual([]);
    expect(result.current.highContrast).toBe(false);
  });

  it('logFootprint adds entry and returns result', () => {
    const { result } = renderHook(() => useEcoTrack());

    let calcResult: ReturnType<typeof result.current.logFootprint> | undefined;
    act(() => {
      calcResult = result.current.logFootprint(validInputs);
    });

    expect(calcResult).toBeDefined();
    expect(calcResult!.daily).toBeGreaterThan(0);
    expect(result.current.state.entries).toHaveLength(1);
    expect(result.current.latestEntry?.inputs).toEqual(validInputs);
  });

  it('replaces entry for same date on re-log', () => {
    const { result } = renderHook(() => useEcoTrack());

    act(() => {
      result.current.logFootprint(validInputs);
      result.current.logFootprint(veganBikeInputs);
    });

    expect(result.current.state.entries).toHaveLength(1);
    expect(result.current.latestEntry?.inputs.foodPreference).toBe('vegan');
  });

  it('persists state to localStorage on change', () => {
    const { result } = renderHook(() => useEcoTrack());

    act(() => {
      result.current.logFootprint(validInputs);
    });

    const stored = JSON.parse(localStorage.getItem('ecotrack-ai-state')!);
    expect(stored.entries).toHaveLength(1);
  });

  it('markChallengeComplete updates completed list and awards badge', () => {
    const { result } = renderHook(() => useEcoTrack());

    act(() => {
      result.current.markChallengeComplete('bike-to-work', 'eco-warrior');
    });

    expect(result.current.state.completedChallenges).toContain('bike-to-work');
    const badge = result.current.state.badges.find((b) => b.id === 'eco-warrior');
    expect(badge?.earnedAt).toBeDefined();
  });

  it('cacheAiResponse stores response in aiCache', () => {
    const { result } = renderHook(() => useEcoTrack());

    act(() => {
      result.current.cacheAiResponse('key-1', 'saved response');
    });

    expect(result.current.state.aiCache['key-1']).toBe('saved response');
  });

  it('addCoachMessage appends to coachMessages', () => {
    const { result } = renderHook(() => useEcoTrack());
    const msg = { role: 'user' as const, content: 'Hello', timestamp: '2025-06-01T00:00:00.000Z' };

    act(() => {
      result.current.addCoachMessage(msg);
    });

    expect(result.current.coachMessages).toHaveLength(1);
    expect(result.current.coachMessages[0]).toEqual(msg);
  });

  it('toggles high contrast class on document element', () => {
    const { result } = renderHook(() => useEcoTrack());

    act(() => {
      result.current.setHighContrast(true);
    });
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

    act(() => {
      result.current.setHighContrast(false);
    });
    expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
  });
});
