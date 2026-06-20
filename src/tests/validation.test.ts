import { describe, expect, it } from 'vitest';
import { validateCarbonInputs } from '@/utils/validation';
import { validInputs } from './fixtures';

describe('validateCarbonInputs', () => {
  it('returns no errors for valid inputs', () => {
    expect(validateCarbonInputs(validInputs)).toEqual([]);
  });

  describe('transportKm', () => {
    it('rejects negative distance', () => {
      const errors = validateCarbonInputs({ ...validInputs, transportKm: -1 });
      expect(errors).toContainEqual({
        field: 'transportKm',
        message: 'Distance must be between 0 and 500 km.',
      });
    });

    it('rejects distance over 500 km', () => {
      const errors = validateCarbonInputs({ ...validInputs, transportKm: 501 });
      expect(errors).toContainEqual({
        field: 'transportKm',
        message: 'Distance must be between 0 and 500 km.',
      });
    });

    it('accepts boundary values 0 and 500', () => {
      expect(validateCarbonInputs({ ...validInputs, transportKm: 0 })).toEqual([]);
      expect(validateCarbonInputs({ ...validInputs, transportKm: 500 })).toEqual([]);
    });
  });

  describe('electricityUnits', () => {
    it('rejects negative electricity', () => {
      const errors = validateCarbonInputs({ ...validInputs, electricityUnits: -0.1 });
      expect(errors).toContainEqual({
        field: 'electricityUnits',
        message: 'Electricity must be between 0 and 100 units.',
      });
    });

    it('rejects electricity over 100 units', () => {
      const errors = validateCarbonInputs({ ...validInputs, electricityUnits: 100.1 });
      expect(errors).toContainEqual({
        field: 'electricityUnits',
        message: 'Electricity must be between 0 and 100 units.',
      });
    });
  });

  describe('waterLiters', () => {
    it('rejects negative water usage', () => {
      const errors = validateCarbonInputs({ ...validInputs, waterLiters: -1 });
      expect(errors).toContainEqual({
        field: 'waterLiters',
        message: 'Water usage must be between 0 and 1000 liters.',
      });
    });

    it('rejects water over 1000 liters', () => {
      const errors = validateCarbonInputs({ ...validInputs, waterLiters: 1001 });
      expect(errors).toContainEqual({
        field: 'waterLiters',
        message: 'Water usage must be between 0 and 1000 liters.',
      });
    });
  });

  describe('wasteKg', () => {
    it('rejects negative waste', () => {
      const errors = validateCarbonInputs({ ...validInputs, wasteKg: -1 });
      expect(errors).toContainEqual({
        field: 'wasteKg',
        message: 'Waste must be between 0 and 50 kg.',
      });
    });

    it('rejects waste over 50 kg', () => {
      const errors = validateCarbonInputs({ ...validInputs, wasteKg: 50.1 });
      expect(errors).toContainEqual({
        field: 'wasteKg',
        message: 'Waste must be between 0 and 50 kg.',
      });
    });
  });

  it('returns multiple errors when several fields are invalid', () => {
    const errors = validateCarbonInputs({
      ...validInputs,
      transportKm: -5,
      electricityUnits: 200,
      waterLiters: -10,
      wasteKg: 100,
    });
    expect(errors).toHaveLength(4);
    expect(errors.map((e) => e.field)).toEqual([
      'transportKm',
      'electricityUnits',
      'waterLiters',
      'wasteKg',
    ]);
  });
});
