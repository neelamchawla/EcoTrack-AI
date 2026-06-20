import { describe, expect, it } from 'vitest';
import {
  calculateCarbonFootprint,
  calculateElectricity,
  calculateFood,
  calculateSustainabilityScore,
  calculateTransport,
  calculateWaste,
  calculateWater,
} from '@/utils/carbonCalculator';

describe('Carbon Calculator', () => {
  it('calculates transport emissions correctly', () => {
    expect(calculateTransport(20, 'car')).toBe(4.2);
  });

  it('returns zero for bike transport', () => {
    expect(calculateTransport(20, 'bike')).toBe(0);
  });

  it('calculates bus emissions correctly', () => {
    expect(calculateTransport(10, 'bus')).toBe(0.89);
  });

  it('calculates food emissions by preference', () => {
    expect(calculateFood('vegan')).toBe(2.5);
    expect(calculateFood('mixed')).toBe(7.2);
  });

  it('calculates electricity emissions', () => {
    expect(calculateElectricity(10)).toBe(4.5);
  });

  it('calculates water emissions', () => {
    expect(calculateWater(100)).toBe(0.03);
  });

  it('calculates waste emissions by type', () => {
    expect(calculateWaste(1, 'plastic')).toBe(6);
    expect(calculateWaste(2, 'organic')).toBe(1);
  });

  it('computes full footprint with sustainability score', () => {
    const result = calculateCarbonFootprint({
      transportKm: 20,
      transportMode: 'car',
      foodPreference: 'mixed',
      electricityUnits: 8,
      waterLiters: 150,
      wasteKg: 0.5,
      wasteType: 'mixed',
    });

    expect(result.daily).toBeGreaterThan(0);
    expect(result.monthly).toBe(result.daily * 30);
    expect(result.sustainabilityScore).toBeGreaterThanOrEqual(0);
    expect(result.sustainabilityScore).toBeLessThanOrEqual(100);
    expect(result.breakdown.transport).toBe(4.2);
  });

  it('scores higher sustainability for lower emissions', () => {
    const low = calculateSustainabilityScore(5);
    const high = calculateSustainabilityScore(20);
    expect(low).toBeGreaterThan(high);
  });
});
