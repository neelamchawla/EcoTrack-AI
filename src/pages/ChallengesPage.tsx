import type { Badge } from '@/types';
import { WEEKLY_CHALLENGES } from '@/utils/challenges';

interface ChallengesPageProps {
  completed: string[];
  badges: Badge[];
  onComplete: (challengeId: string, badgeId?: string) => void;
}

export function ChallengesPage({ completed, badges, onComplete }: ChallengesPageProps) {
  const earnedCount = badges.filter((b) => b.earnedAt).length;

  return (
    <section aria-labelledby="challenges-heading" className="space-y-8">
      <header>
        <h2 id="challenges-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
          Weekly Eco Challenges
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Complete challenges to earn badges and reduce your carbon footprint.
        </p>
      </header>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h3 className="mb-4 font-semibold">Your Badges ({earnedCount}/{badges.length})</h3>
        <ul className="grid gap-4 sm:grid-cols-3" role="list">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className={`rounded-xl border p-4 text-center transition ${
                badge.earnedAt
                  ? 'border-eco-400 bg-eco-50 dark:border-eco-600 dark:bg-eco-900/30'
                  : 'border-gray-200 opacity-50 grayscale dark:border-gray-700'
              }`}
              aria-label={`${badge.name}${badge.earnedAt ? ', earned' : ', not yet earned'}`}
            >
              <span className="text-4xl" aria-hidden="true">
                {badge.icon}
              </span>
              <h4 className="mt-2 font-semibold">{badge.name}</h4>
              <p className="mt-1 text-xs text-gray-500">{badge.description}</p>
              {badge.earnedAt && (
                <p className="mt-2 text-xs text-eco-600">
                  Earned {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      </article>

      <ul className="grid gap-4 sm:grid-cols-2" role="list">
        {WEEKLY_CHALLENGES.map((challenge) => {
          const isDone = completed.includes(challenge.id);
          return (
            <li
              key={challenge.id}
              className={`rounded-2xl border p-6 shadow-sm ${
                isDone
                  ? 'border-eco-400 bg-eco-50 dark:border-eco-700 dark:bg-eco-900/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{challenge.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                  <p className="mt-2 text-sm font-medium text-eco-600">
                    ~{challenge.estimatedSavingsKg} kg CO₂ saved
                  </p>
                  <p className="mt-1 text-xs capitalize text-gray-400">Category: {challenge.category}</p>
                </div>
                {isDone ? (
                  <span className="rounded-full bg-eco-600 px-3 py-1 text-xs font-medium text-white">
                    Done ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onComplete(challenge.id, challenge.badgeId)}
                    className="shrink-0 rounded-lg bg-eco-600 px-4 py-2 text-sm font-medium text-white hover:bg-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-500"
                    aria-label={`Mark ${challenge.title} as complete`}
                  >
                    Complete
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
