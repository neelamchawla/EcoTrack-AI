import type { CarbonInputs } from '@/types';

export interface ValidationError {
  field: keyof CarbonInputs;
  message: string;
}

export function validateCarbonInputs(inputs: CarbonInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  if (inputs.transportKm < 0 || inputs.transportKm > 500) {
    errors.push({ field: 'transportKm', message: 'Distance must be between 0 and 500 km.' });
  }
  if (inputs.electricityUnits < 0 || inputs.electricityUnits > 100) {
    errors.push({ field: 'electricityUnits', message: 'Electricity must be between 0 and 100 units.' });
  }
  if (inputs.waterLiters < 0 || inputs.waterLiters > 1000) {
    errors.push({ field: 'waterLiters', message: 'Water usage must be between 0 and 1000 liters.' });
  }
  if (inputs.wasteKg < 0 || inputs.wasteKg > 50) {
    errors.push({ field: 'wasteKg', message: 'Waste must be between 0 and 50 kg.' });
  }

  return errors;
}
