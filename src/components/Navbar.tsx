import { memo } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Calculator', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/coach', label: 'AI Coach' },
  { to: '/challenges', label: 'Challenges' },
];

interface NavbarProps {
  highContrast: boolean;
  onToggleContrast: () => void;
}

function NavbarComponent({ highContrast, onToggleContrast }: NavbarProps) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <nav
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🌿
          </span>
          <div>
            <h1 className="text-lg font-bold text-eco-700 dark:text-eco-400">EcoTrack AI</h1>
            <p className="text-xs text-gray-500">Personal Carbon Footprint Companion</p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-1 sm:gap-2" role="list">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                    isActive
                      ? 'bg-eco-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onToggleContrast}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-pressed={highContrast}
              aria-label="Toggle high contrast mode"
            >
              {highContrast ? '◐ Normal' : '◑ Contrast'}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export const Navbar = memo(NavbarComponent);
