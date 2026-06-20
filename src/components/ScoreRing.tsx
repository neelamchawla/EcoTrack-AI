import { memo } from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
}

function ScoreRingComponent({ score, size = 120 }: ScoreRingProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`Sustainability score ${score} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="block text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

export const ScoreRing = memo(ScoreRingComponent);
