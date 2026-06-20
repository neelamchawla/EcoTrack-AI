import { FormEvent, useRef, useState } from 'react';
import type { CoachMessage, DailyEntry } from '@/types';
import { createCacheKey, getCoachResponse } from '@/services/aiService';

interface CoachPageProps {
  latestEntry?: DailyEntry;
  messages: CoachMessage[];
  aiCache: Record<string, string>;
  onMessage: (message: CoachMessage) => void;
  onCache: (key: string, response: string) => void;
}

const SUGGESTIONS = [
  'I drive 20 km daily and eat meat regularly.',
  'How can I reduce my electricity footprint?',
  'What is my biggest emission category?',
];

export function CoachPage({ latestEntry, messages, aiCache, onMessage, onCache }: CoachPageProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: CoachMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    onMessage(userMsg);
    setInput('');
    setLoading(true);

    const cacheKey = createCacheKey(text, latestEntry?.result.daily);
    const { response, fromCache } = await getCoachResponse(
      {
        userMessage: text.trim(),
        latestResult: latestEntry?.result,
        breakdown: latestEntry?.result.breakdown,
      },
      cacheKey,
      aiCache[cacheKey]
    );

    if (!fromCache) {
      onCache(cacheKey, response);
    }

    onMessage({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
    });

    setLoading(false);
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <section aria-labelledby="coach-heading" className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h2 id="coach-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Sustainability Coach
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Get personalized tips based on your habits. Add a Gemini API key in{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">.env</code> for live AI responses.
        </p>
      </header>

      <div
        className="mb-4 flex min-h-[400px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
        role="log"
        aria-live="polite"
        aria-label="Chat with sustainability coach"
      >
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="rounded-xl bg-eco-50 p-4 text-sm text-gray-700 dark:bg-eco-900/20 dark:text-gray-300">
              <p className="font-medium">Example exchange:</p>
              <p className="mt-2 italic">
                User: I drive 20 km daily and eat meat regularly.
              </p>
              <p className="mt-2">
                AI: Your transportation contributes ~55% of your footprint. Switching to public transport
                twice a week could reduce emissions by approximately 18 kg CO₂/month.
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-eco-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-500" role="status">
              Coach is thinking…
            </p>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {s.slice(0, 40)}…
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="coach-input" className="sr-only">
              Ask the sustainability coach
            </label>
            <input
              id="coach-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about reducing your footprint…"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-eco-600 px-4 py-2 font-medium text-white hover:bg-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-500 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
