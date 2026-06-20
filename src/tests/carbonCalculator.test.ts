import { describe, expect, it } from 'vitest';
import {
  calculateBreakdown,
  calculateCarbonFootprint,
  calculateDailyFootprint,
  calculateElectricity,
  calculateFood,
  calculateSustainabilityScore,
  calculateTransport,
  calculateWaste,
  calculateWater,
  getCategoryPercentages,
} from '@/utils/carbonCalculator';
import { validInputs, veganBikeInputs } from './fixtures';

describe('calculateTransport', () => {
  it.each([
    ['car', 20, 4.2],
    ['bike', 20, 0],
    ['bus', 10, 0.89],
    ['metro', 50, 2.05],
  ] as const)('returns %s emissions for %i km', (mode, km, expected) => {
    expect(calculateTransport(km, mode)).toBe(expected);
  });

  it('clamps negative distance to zero', () => {
    expect(calculateTransport(-10, 'car')).toBe(0);
  });

  it('returns zero for zero distance', () => {
    expect(calculateTransport(0, 'car')).toBe(0);
  });
});

describe('calculateFood', () => {
  it.each([
    ['vegan', 2.5],
    ['vegetarian', 3.8],
    ['mixed', 7.2],
  ] as const)('returns %s daily food emissions', (pref, expected) => {
    expect(calculateFood(pref)).toBe(expected);
  });
});

describe('calculateElectricity', () => {
  it('calculates electricity emissions', () => {
    expect(calculateElectricity(10)).toBe(4.5);
  });

  it('clamps negative units to zero', () => {
    expect(calculateElectricity(-5)).toBe(0);
  });
});

describe('calculateWater', () => {
  it('calculates water emissions with precision', () => {
    expect(calculateWater(100)).toBe(0.03);
  });

  it('clamps negative liters to zero', () => {
    expect(calculateWater(-50)).toBe(0);
  });
});

describe('calculateWaste', () => {
  it.each([
    ['plastic', 1, 6],
    ['organic', 2, 1],
    ['mixed', 0.5, 1.25],
  ] as const)('calculates %s waste emissions', (type, kg, expected) => {
    expect(calculateWaste(kg, type)).toBe(expected);
  });

  it('clamps negative kg to zero', () => {
    expect(calculateWaste(-1, 'plastic')).toBe(0);
  });
});

describe('calculateBreakdown', () => {
  it('returns all category values', () => {
    const breakdown = calculateBreakdown(validInputs);
    expect(breakdown).toEqual({
      transport: 4.2,
      food: 7.2,
      electricity: 3.6,
      water: 0.045,
      waste: 1.25,
    });
  });
});

describe('calculateDailyFootprint', () => {
  it('sums all breakdown categories', () => {
    const daily = calculateDailyFootprint(validInputs);
    expect(daily).toBe(16.3);
  });

  it('produces lower footprint for eco-friendly inputs', () => {
    const heavy = calculateDailyFootprint(validInputs);
    const light = calculateDailyFootprint(veganBikeInputs);
    expect(light).toBeLessThan(heavy);
  });
});

describe('calculateSustainabilityScore', () => {
  it('scores higher for lower emissions', () => {
    expect(calculateSustainabilityScore(5)).toBeGreaterThan(calculateSustainabilityScore(20));
  });

  it('returns 100 for zero emissions', () => {
    expect(calculateSustainabilityScore(0)).toBe(100);
  });

  it('returns 0 at or above max expected daily footprint', () => {
    expect(calculateSustainabilityScore(25)).toBe(0);
    expect(calculateSustainabilityScore(50)).toBe(0);
  });

  it('clamps score between 0 and 100', () => {
    expect(calculateSustainabilityScore(12.5)).toBe(50);
  });
});

describe('calculateCarbonFootprint', () => {
  it('computes full footprint with sustainability score', () => {
    const result = calculateCarbonFootprint(validInputs);

    expect(result.daily).toBeGreaterThan(0);
    expect(result.monthly).toBe(result.daily * 30);
    expect(result.sustainabilityScore).toBeGreaterThanOrEqual(0);
    expect(result.sustainabilityScore).toBeLessThanOrEqual(100);
    expect(result.breakdown.transport).toBe(4.2);
  });

  it('includes consistent breakdown in result', () => {
    const result = calculateCarbonFootprint(veganBikeInputs);
    expect(result.breakdown.food).toBe(2.5);
    expect(result.breakdown.transport).toBe(0);
  });
});

describe('getCategoryPercentages', () => {
  it('returns percentage breakdown that sums to ~100', () => {
    const breakdown = calculateBreakdown(validInputs);
    const percentages = getCategoryPercentages(breakdown);
    const sum = Object.values(percentages).reduce((a, b) => a + b, 0);
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
  });

  it('returns all zeros when total is zero', () => {
    const percentages = getCategoryPercentages({
      transport: 0,
      food: 0,
      electricity: 0,
      water: 0,
      waste: 0,
    });
    expect(percentages).toEqual({
      transport: 0,
      food: 0,
      electricity: 0,
      water: 0,
      waste: 0,
    });
  });

  it('assigns 100% to single non-zero category', () => {
    const percentages = getCategoryPercentages({
      transport: 0,
      food: 10,
      electricity: 0,
      water: 0,
      waste: 0,
    });
    expect(percentages.food).toBe(100);
  });
});
