import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { useEcoTrack } from '@/hooks/useEcoTrack';

const CalculatorPage = lazy(() =>
  import('@/pages/CalculatorPage').then((m) => ({ default: m.CalculatorPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const CoachPage = lazy(() => import('@/pages/CoachPage').then((m) => ({ default: m.CoachPage })));
const ChallengesPage = lazy(() =>
  import('@/pages/ChallengesPage').then((m) => ({ default: m.ChallengesPage }))
);

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-live="polite">
      <p className="text-gray-500">Loading…</p>
    </div>
  );
}

export default function App() {
  const eco = useEcoTrack();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar highContrast={eco.highContrast} onToggleContrast={() => eco.setHighContrast((v) => !v)} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<CalculatorPage logFootprint={eco.logFootprint} />} />
            <Route
              path="/dashboard"
              element={<DashboardPage entries={eco.state.entries} latestEntry={eco.latestEntry} />}
            />
            <Route
              path="/coach"
              element={
                <CoachPage
                  latestEntry={eco.latestEntry}
                  messages={eco.coachMessages}
                  aiCache={eco.state.aiCache}
                  onMessage={eco.addCoachMessage}
                  onCache={eco.cacheAiResponse}
                />
              }
            />
            <Route
              path="/challenges"
              element={
                <ChallengesPage
                  completed={eco.state.completedChallenges}
                  badges={eco.state.badges}
                  onComplete={eco.markChallengeComplete}
                />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500 dark:border-gray-800">
        EcoTrack AI · Educational estimates · Not a substitute for certified carbon accounting
      </footer>
    </div>
  );
}
