import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '@/components/Navbar';

function renderNavbar(props: { highContrast?: boolean; onToggleContrast?: () => void } = {}) {
  const onToggleContrast = props.onToggleContrast ?? vi.fn();
  render(
    <MemoryRouter>
      <Navbar highContrast={props.highContrast ?? false} onToggleContrast={onToggleContrast} />
    </MemoryRouter>
  );
  return { onToggleContrast };
}

describe('Navbar', () => {
  it('renders app title and navigation links', () => {
    renderNavbar();
    expect(screen.getByText('EcoTrack AI')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Calculator' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'AI Coach' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Challenges' })).toBeInTheDocument();
  });

  it('has main navigation landmark', () => {
    renderNavbar();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('calls onToggleContrast when contrast button clicked', () => {
    const { onToggleContrast } = renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: 'Toggle high contrast mode' }));
    expect(onToggleContrast).toHaveBeenCalledOnce();
  });

  it('shows Contrast label when high contrast is off', () => {
    renderNavbar({ highContrast: false });
    expect(screen.getByRole('button', { name: 'Toggle high contrast mode' })).toHaveTextContent(
      '◑ Contrast'
    );
  });

  it('shows Normal label when high contrast is on', () => {
    renderNavbar({ highContrast: true });
    expect(screen.getByRole('button', { name: 'Toggle high contrast mode' })).toHaveTextContent(
      '◐ Normal'
    );
    expect(screen.getByRole('button', { name: 'Toggle high contrast mode' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });
});
