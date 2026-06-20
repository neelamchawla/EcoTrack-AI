import type { CarbonResult, CategoryBreakdown } from '@/types';
import { getCategoryPercentages } from '@/utils/carbonCalculator';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface CoachContext {
  userMessage: string;
  latestResult?: CarbonResult;
  breakdown?: CategoryBreakdown;
}

const FALLBACK_RESPONSES: Record<string, string> = {
  transport:
    'Your transportation likely contributes a large share of your footprint. Switching to public transport twice a week could reduce emissions by approximately 18 kg CO₂/month.',
  food:
    'Food choices matter. Replacing 3 meat meals per week with plant-based options could save around 10 kg CO₂/month.',
  default:
    'Focus on your highest-impact category first. Small consistent changes—like shorter showers, LED bulbs, or biking once a week—add up to meaningful monthly savings.',
};

function buildPrompt(context: CoachContext): string {
  const percentages = context.breakdown ? getCategoryPercentages(context.breakdown) : null;
  const footprintInfo = context.latestResult
    ? `Daily footprint: ${context.latestResult.daily} kg CO₂. Monthly estimate: ${context.latestResult.monthly} kg. Sustainability score: ${context.latestResult.sustainabilityScore}/100.${
        percentages
          ? ` Category breakdown: transport ${percentages.transport}%, food ${percentages.food}%, electricity ${percentages.electricity}%, water ${percentages.water}%, waste ${percentages.waste}%.`
          : ''
      }`
    : 'No footprint data logged yet.';

  return `You are EcoTrack AI, a friendly sustainability coach. Give concise, actionable advice (2-4 sentences). Use approximate kg CO₂ savings when relevant. Be encouraging, not preachy.

User context: ${footprintInfo}

User message: ${context.userMessage}`;
}

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('drive') || lower.includes('car') || lower.includes('transport')) {
    return FALLBACK_RESPONSES.transport;
  }
  if (lower.includes('meat') || lower.includes('food') || lower.includes('eat')) {
    return FALLBACK_RESPONSES.food;
  }
  return FALLBACK_RESPONSES.default;
}

export async function getCoachResponse(
  context: CoachContext,
  cacheKey?: string,
  cached?: string
): Promise<{ response: string; fromCache: boolean }> {
  if (cached && cacheKey) {
    return { response: cached, fromCache: true };
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return { response: getFallbackResponse(context.userMessage), fromCache: false };
  }

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(context) }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Empty response from Gemini');

    return { response: text.trim(), fromCache: false };
  } catch {
    return { response: getFallbackResponse(context.userMessage), fromCache: false };
  }
}

export function createCacheKey(message: string, daily?: number): string {
  return `${message.toLowerCase().trim()}::${daily ?? 'none'}`;
}
