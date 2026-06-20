import { FormEvent, useMemo, useState } from 'react';
import type { CarbonInputs, CarbonResult, FoodPreference, TransportMode, WasteType } from '@/types';
import { StatCard } from '@/components/StatCard';
import { ProgressRing } from '@/components/ProgressRing';
import { validateCarbonInputs } from '@/utils/validation';

const DEFAULT_INPUTS: CarbonInputs = {
  transportKm: 20,
  transportMode: 'car',
  foodPreference: 'mixed',
  electricityUnits: 8,
  waterLiters: 150,
  wasteKg: 0.5,
  wasteType: 'mixed',
};

interface CalculatorPageProps {
  logFootprint: (inputs: CarbonInputs) => CarbonResult;
}

export function CalculatorPage({ logFootprint }: CalculatorPageProps) {
  const [inputs, setInputs] = useState<CarbonInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<CarbonResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const fieldError = useMemo(() => errors, [errors]);

  function updateField<K extends keyof CarbonInputs>(key: K, value: CarbonInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateCarbonInputs(inputs);
    if (validationErrors.length) {
      setErrors(Object.fromEntries(validationErrors.map((err) => [err.field, err.message])));
      return;
    }
    const calcResult = logFootprint(inputs);
    setResult(calcResult);
    setSaved(true);
  }

  return (
    <section aria-labelledby="calculator-heading">
      <header className="mb-8">
        <h2 id="calculator-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
          Carbon Calculator
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter your daily habits to estimate CO₂ emissions and your sustainability score.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          noValidate
        >
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Transportation</legend>
            <div>
              <label htmlFor="transport-km" className="block text-sm font-medium">
                Daily distance (km)
              </label>
              <input
                id="transport-km"
                type="number"
                min={0}
                max={500}
                value={inputs.transportKm}
                onChange={(e) => updateField('transportKm', Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
                aria-invalid={!!fieldError.transportKm}
                aria-describedby={fieldError.transportKm ? 'transport-km-error' : undefined}
              />
              {fieldError.transportKm && (
                <p id="transport-km-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fieldError.transportKm}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="transport-mode" className="block text-sm font-medium">
                Mode
              </label>
              <select
                id="transport-mode"
                value={inputs.transportMode}
                onChange={(e) => updateField('transportMode', e.target.value as TransportMode)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="bus">Bus</option>
                <option value="metro">Metro</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Food</legend>
            <label htmlFor="food-pref" className="block text-sm font-medium">
              Diet preference
            </label>
            <select
              id="food-pref"
              value={inputs.foodPreference}
              onChange={(e) => updateField('foodPreference', e.target.value as FoodPreference)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
            >
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="mixed">Mixed (includes meat)</option>
            </select>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold">Utilities & Waste</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="electricity" className="block text-sm font-medium">
                  Electricity (units/day)
                </label>
                <input
                  id="electricity"
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={inputs.electricityUnits}
                  onChange={(e) => updateField('electricityUnits', Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
                  aria-invalid={!!fieldError.electricityUnits}
                />
              </div>
              <div>
                <label htmlFor="water" className="block text-sm font-medium">
                  Water (liters/day)
                </label>
                <input
                  id="water"
                  type="number"
                  min={0}
                  max={1000}
                  value={inputs.waterLiters}
                  onChange={(e) => updateField('waterLiters', Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
                  aria-invalid={!!fieldError.waterLiters}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="waste-kg" className="block text-sm font-medium">
                  Waste (kg/day)
                </label>
                <input
                  id="waste-kg"
                  type="number"
                  min={0}
                  max={50}
                  step={0.1}
                  value={inputs.wasteKg}
                  onChange={(e) => updateField('wasteKg', Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
                  aria-invalid={!!fieldError.wasteKg}
                />
              </div>
              <div>
                <label htmlFor="waste-type" className="block text-sm font-medium">
                  Waste type
                </label>
                <select
                  id="waste-type"
                  value={inputs.wasteType}
                  onChange={(e) => updateField('wasteType', e.target.value as WasteType)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-eco-500 focus:outline-none focus:ring-2 focus:ring-eco-500 dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="plastic">Plastic</option>
                  <option value="organic">Organic</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-lg bg-eco-600 px-4 py-3 font-semibold text-white transition hover:bg-eco-700 focus:outline-none focus:ring-2 focus:ring-eco-500 focus:ring-offset-2"
          >
            Calculate & Save
          </button>
          {saved && (
            <p className="text-center text-sm text-eco-600" role="status">
              ✓ Saved to your footprint history
            </p>
          )}
        </form>

        <aside aria-labelledby="results-heading" className="space-y-6">
          <h3 id="results-heading" className="sr-only">
            Calculation results
          </h3>
          {result ? (
            <>
              <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <ProgressRing score={result.sustainabilityScore} />
                <p className="mt-4 text-sm text-gray-500">Sustainability Score</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Daily CO₂" value={result.daily} unit="kg" accent="green" />
                <StatCard label="Monthly Estimate" value={result.monthly} unit="kg" accent="blue" />
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h4 className="mb-4 font-semibold">Category Breakdown</h4>
                <ul className="space-y-2" role="list">
                  {Object.entries(result.breakdown).map(([key, value]) => (
                    <li key={key} className="flex justify-between text-sm capitalize">
                      <span>{key}</span>
                      <span className="font-medium">{value} kg</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-gray-300 p-6 text-gray-500 dark:border-gray-600">
              Submit the form to see your footprint estimate.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
