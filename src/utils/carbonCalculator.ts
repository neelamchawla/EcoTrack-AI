import type {
  CarbonInputs,
  CarbonResult,
  CategoryBreakdown,
  FoodPreference,
  TransportMode,
} from '@/types';

/** kg CO₂ per km by transport mode */
const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  car: 0.21,
  bike: 0,
  bus: 0.089,
  metro: 0.041,
};

/** kg CO₂ per day by food preference */
const FOOD_FACTORS: Record<FoodPreference, number> = {
  vegan: 2.5,
  vegetarian: 3.8,
  mixed: 7.2,
};

/** kg CO₂ per kWh (grid average) */
const ELECTRICITY_FACTOR = 0.45;

/** kg CO₂ per liter of water (treatment + heating estimate) */
const WATER_FACTOR = 0.0003;

/** kg CO₂ per kg of waste */
const WASTE_FACTORS = {
  plastic: 6.0,
  organic: 0.5,
  mixed: 2.5,
} as const;

export function calculateTransport(km: number, mode: TransportMode): number {
  const safeKm = Math.max(0, km);
  return round(safeKm * TRANSPORT_FACTORS[mode]);
}

export function calculateFood(preference: FoodPreference): number {
  return FOOD_FACTORS[preference];
}

export function calculateElectricity(units: number): number {
  return round(Math.max(0, units) * ELECTRICITY_FACTOR);
}

export function calculateWater(liters: number): number {
  return round(Math.max(0, liters) * WATER_FACTOR, 4);
}

export function calculateWaste(kg: number, type: keyof typeof WASTE_FACTORS): number {
  return round(Math.max(0, kg) * WASTE_FACTORS[type]);
}

export function calculateBreakdown(inputs: CarbonInputs): CategoryBreakdown {
  return {
    transport: calculateTransport(inputs.transportKm, inputs.transportMode),
    food: calculateFood(inputs.foodPreference),
    electricity: calculateElectricity(inputs.electricityUnits),
    water: calculateWater(inputs.waterLiters),
    waste: calculateWaste(inputs.wasteKg, inputs.wasteType),
  };
}

export function calculateDailyFootprint(inputs: CarbonInputs): number {
  const breakdown = calculateBreakdown(inputs);
  return round(
    breakdown.transport +
      breakdown.food +
      breakdown.electricity +
      breakdown.water +
      breakdown.waste
  );
}

export function calculateSustainabilityScore(dailyKg: number): number {
  const maxExpected = 25;
  const score = Math.max(0, Math.min(100, 100 - (dailyKg / maxExpected) * 100));
  return Math.round(score);
}

export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonResult {
  const breakdown = calculateBreakdown(inputs);
  const daily = calculateDailyFootprint(inputs);
  const monthly = round(daily * 30);
  const sustainabilityScore = calculateSustainabilityScore(daily);

  return {
    daily,
    monthly,
    sustainabilityScore,
    breakdown,
  };
}

export function getCategoryPercentages(breakdown: CategoryBreakdown): Record<keyof CategoryBreakdown, number> {
  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  if (total === 0) {
    return { transport: 0, food: 0, electricity: 0, water: 0, waste: 0 };
  }

  const entries = Object.entries(breakdown) as [keyof CategoryBreakdown, number][];
  return Object.fromEntries(
    entries.map(([key, value]) => [key, Math.round((value / total) * 100)])
  ) as Record<keyof CategoryBreakdown, number>;
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
