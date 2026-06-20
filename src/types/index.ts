export type TransportMode = 'car' | 'bike' | 'bus' | 'metro';

export type FoodPreference = 'vegan' | 'vegetarian' | 'mixed';

export type WasteType = 'plastic' | 'organic' | 'mixed';

export interface CarbonInputs {
  transportKm: number;
  transportMode: TransportMode;
  foodPreference: FoodPreference;
  electricityUnits: number;
  waterLiters: number;
  wasteKg: number;
  wasteType: WasteType;
}

export interface CategoryBreakdown {
  transport: number;
  food: number;
  electricity: number;
  water: number;
  waste: number;
}

export interface CarbonResult {
  daily: number;
  monthly: number;
  sustainabilityScore: number;
  breakdown: CategoryBreakdown;
}

export interface DailyEntry {
  id: string;
  date: string;
  inputs: CarbonInputs;
  result: CarbonResult;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: keyof CategoryBreakdown;
  estimatedSavingsKg: number;
  badgeId?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt?: string;
}

export interface GreenAlternative {
  title: string;
  description: string;
  estimatedSavingsKg: number;
  category: keyof CategoryBreakdown;
}

export interface AppState {
  entries: DailyEntry[];
  completedChallenges: string[];
  badges: Badge[];
  aiCache: Record<string, string>;
}

export interface CoachMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
