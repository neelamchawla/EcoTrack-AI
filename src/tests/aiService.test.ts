import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCacheKey, getCoachResponse } from '@/services/aiService';
import { makeResult } from './fixtures';

describe('aiService', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe('createCacheKey', () => {
    it('normalizes message and includes daily footprint', () => {
      expect(createCacheKey('  Hello World  ', 12.5)).toBe('hello world::12.5');
    });

    it('uses none when daily is undefined', () => {
      expect(createCacheKey('test')).toBe('test::none');
    });
  });

  describe('getCoachResponse', () => {
    it('returns cached response when cache hit', async () => {
      const result = await getCoachResponse(
        { userMessage: 'test' },
        'test::none',
        'cached answer'
      );
      expect(result).toEqual({ response: 'cached answer', fromCache: true });
    });

    it('returns transport fallback for car-related messages without API key', async () => {
      const result = await getCoachResponse({ userMessage: 'I drive to work every day' });
      expect(result.fromCache).toBe(false);
      expect(result.response).toContain('transportation');
    });

    it('returns food fallback for meat-related messages without API key', async () => {
      const result = await getCoachResponse({ userMessage: 'How can I reduce meat consumption?' });
      expect(result.response).toContain('Food choices');
    });

    it('returns default fallback for generic messages without API key', async () => {
      const result = await getCoachResponse({ userMessage: 'Help me be greener' });
      expect(result.response).toContain('highest-impact category');
    });

    it('uses placeholder API key as missing key', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'your_gemini_api_key_here');
      const result = await getCoachResponse({ userMessage: 'general question' });
      expect(result.fromCache).toBe(false);
      expect(result.response).toContain('highest-impact category');
    });

    it('calls Gemini API when key is configured', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            candidates: [{ content: { parts: [{ text: '  Live AI advice  ' }] } }],
          }),
      });
      vi.stubGlobal('fetch', fetchMock);

      const latestResult = makeResult();
      const result = await getCoachResponse({
        userMessage: 'How do I improve?',
        latestResult,
        breakdown: latestResult.breakdown,
      });

      expect(fetchMock).toHaveBeenCalledOnce();
      expect(result.response).toBe('Live AI advice');
      expect(result.fromCache).toBe(false);
    });

    it('falls back when API returns error status', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

      const result = await getCoachResponse({ userMessage: 'I drive a lot' });
      expect(result.fromCache).toBe(false);
      expect(result.response).toContain('transportation');
    });

    it('falls back when API returns empty response', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ candidates: [] }),
      }));

      const result = await getCoachResponse({ userMessage: 'What about food?' });
      expect(result.response).toContain('Food choices');
    });

    it('falls back when fetch throws', async () => {
      vi.stubEnv('VITE_GEMINI_API_KEY', 'test-key');
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

      const result = await getCoachResponse({ userMessage: 'random' });
      expect(result.fromCache).toBe(false);
      expect(result.response).toBeTruthy();
    });
  });
});
