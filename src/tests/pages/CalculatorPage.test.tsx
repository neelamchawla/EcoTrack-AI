import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { validInputs } from '../fixtures';

describe('CalculatorPage', () => {
  it('renders calculator heading and form fields', () => {
    render(<CalculatorPage logFootprint={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Carbon Calculator' })).toBeInTheDocument();
    expect(screen.getByLabelText('Daily distance (km)')).toBeInTheDocument();
    expect(screen.getByLabelText('Mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Diet preference')).toBeInTheDocument();
    expect(screen.getByLabelText('Electricity (units/day)')).toBeInTheDocument();
    expect(screen.getByLabelText('Water (liters/day)')).toBeInTheDocument();
    expect(screen.getByLabelText('Waste (kg/day)')).toBeInTheDocument();
    expect(screen.getByLabelText('Waste type')).toBeInTheDocument();
  });

  it('shows placeholder before calculation', () => {
    render(<CalculatorPage logFootprint={vi.fn()} />);
    expect(screen.getByText('Submit the form to see your footprint estimate.')).toBeInTheDocument();
  });

  it('calculates and displays results on valid submit', async () => {
    const logFootprint = vi.fn((inputs) => ({
      daily: 16.3,
      monthly: 489,
      sustainabilityScore: 35,
      breakdown: {
        transport: 4.2,
        food: 7.2,
        electricity: 3.6,
        water: 0.045,
        waste: 1.25,
      },
    }));

    render(<CalculatorPage logFootprint={logFootprint} />);
    fireEvent.click(screen.getByRole('button', { name: 'Calculate & Save' }));

    expect(logFootprint).toHaveBeenCalledWith(
      expect.objectContaining({ transportKm: validInputs.transportKm })
    );
    expect(screen.getByText('✓ Saved to your footprint history')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Sustainability score 35/ })).toBeInTheDocument();
    expect(screen.getByText('Daily CO₂')).toBeInTheDocument();
    expect(screen.getByText('Category Breakdown')).toBeInTheDocument();
  });

  it('shows validation error for invalid transport distance', () => {
    render(<CalculatorPage logFootprint={vi.fn()} />);

    const distanceInput = screen.getByLabelText('Daily distance (km)');
    fireEvent.change(distanceInput, { target: { value: '600' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate & Save' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Distance must be between 0 and 500 km.');
  });

  it('clears field error when user edits the field', async () => {
    render(<CalculatorPage logFootprint={vi.fn()} />);

    const distanceInput = screen.getByLabelText('Daily distance (km)');
    fireEvent.change(distanceInput, { target: { value: '600' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate & Save' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.change(distanceInput, { target: { value: '20' } });
    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('does not call logFootprint when validation fails', () => {
    const logFootprint = vi.fn();
    render(<CalculatorPage logFootprint={logFootprint} />);

    const wasteInput = screen.getByLabelText('Waste (kg/day)');
    fireEvent.change(wasteInput, { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: 'Calculate & Save' }));

    expect(logFootprint).not.toHaveBeenCalled();
  });
});
