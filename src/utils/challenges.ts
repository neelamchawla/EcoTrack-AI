import type { Badge, Challenge } from '@/types';

export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: 'meatless-monday',
    title: 'Meatless Monday',
    description: 'Go vegetarian or vegan for one full day this week.',
    category: 'food',
    estimatedSavingsKg: 3.4,
    badgeId: 'green-starter',
  },
  {
    id: 'reusable-bottle',
    title: 'Carry Reusable Bottles',
    description: 'Skip single-use plastic bottles for 7 days.',
    category: 'waste',
    estimatedSavingsKg: 1.2,
    badgeId: 'green-starter',
  },
  {
    id: 'bike-to-work',
    title: 'Bike to Work',
    description: 'Replace car trips with cycling at least twice this week.',
    category: 'transport',
    estimatedSavingsKg: 8.4,
    badgeId: 'eco-warrior',
  },
  {
    id: 'reduce-ac',
    title: 'Reduce AC Usage',
    description: 'Cut air conditioning by 1 hour daily for 5 days.',
    category: 'electricity',
    estimatedSavingsKg: 2.25,
    badgeId: 'carbon-saver',
  },
  {
    id: 'public-transport',
    title: 'Public Transport Days',
    description: 'Use bus or metro instead of driving twice this week.',
    category: 'transport',
    estimatedSavingsKg: 5.2,
    badgeId: 'eco-warrior',
  },
  {
    id: 'shorter-showers',
    title: 'Shorter Showers',
    description: 'Reduce shower time by 3 minutes daily.',
    category: 'water',
    estimatedSavingsKg: 0.8,
    badgeId: 'carbon-saver',
  },
];

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'green-starter',
    name: 'Green Starter',
    icon: '🏅',
    description: 'Completed your first eco challenge.',
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    icon: '🌱',
    description: 'Made significant transport sustainability changes.',
  },
  {
    id: 'carbon-saver',
    name: 'Carbon Saver',
    icon: '♻️',
    description: 'Reduced emissions through daily habit changes.',
  },
];

export const GREEN_ALTERNATIVES = [
  {
    title: 'Switch to Public Transport',
    description: 'Replace 2 car commutes per week with bus or metro.',
    estimatedSavingsKg: 18,
    category: 'transport' as const,
  },
  {
    title: 'Plant-Based Meals',
    description: 'Replace 3 meat meals per week with vegetarian options.',
    estimatedSavingsKg: 10.2,
    category: 'food' as const,
  },
  {
    title: 'LED Bulbs',
    description: 'Replace incandescent bulbs with LED lighting.',
    estimatedSavingsKg: 4.5,
    category: 'electricity' as const,
  },
  {
    title: 'Compost Organic Waste',
    description: 'Divert food scraps from landfill to compost.',
    estimatedSavingsKg: 2.8,
    category: 'waste' as const,
  },
];
