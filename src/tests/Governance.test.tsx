import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { GovernanceSection } from '../components/GovernanceSection';
import { BoardOfDirectorsSection } from '../components/BoardOfDirectorsSection';

describe('Governance & Board of Directors (Conseil d\'Administration)', () => {
  it('renders the GovernanceSection with President Philomène AKPODJI and legal status', () => {
    render(<GovernanceSection />);

    // 1. Verify President name
    expect(
      screen.getAllByText(/Mme Philomène AKPODJI/i).length
    ).toBeGreaterThanOrEqual(1);

    // 2. Verify instance label
    expect(
      screen.getByText(/Conseil d'Administration de l'ONG AMSHARTE/i)
    ).toBeInTheDocument();

    // 3. Verify sub-tabs presence
    expect(screen.getByRole('button', { name: /La Présidence & Composition du CA/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Organigramme \(CA \/ DE \/ CPI \/ chargés\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Règles Loi N° 2025-19 & Contrôle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Délibérations & PV Officiels/i })).toBeInTheDocument();
  });

  it('switches between governance sub-tabs properly', () => {
    render(<GovernanceSection />);

    // Click on "Règles Loi N° 2025-19 & Contrôle" tab
    const loiTab = screen.getByRole('button', { name: /Règles Loi N° 2025-19 & Contrôle/i });
    fireEvent.click(loiTab);

    expect(
      screen.getByText(/Enregistrement Biométrique des Administrateurs/i)
    ).toBeInTheDocument();

    // Click on "Organigramme (CA / DE / CPI / chargés)" tab
    const pyramideTab = screen.getByRole('button', { name: /Organigramme \(CA \/ DE \/ CPI \/ chargés\)/i });
    fireEvent.click(pyramideTab);

    expect(
      screen.getByText(/Équipe rattachée au Directeur Exécutif/i)
    ).toBeInTheDocument();
  });

  it('renders the BoardOfDirectorsSection with all 6 board members', () => {
    render(<BoardOfDirectorsSection />);

    // 1. President Philomène AKPODJI
    expect(
      screen.getAllByText(/Mme Philomène AKPODJI/i).length
    ).toBeGreaterThanOrEqual(1);

    // 2. Other administrators
    expect(screen.getByText(/M\. Pamphile SOSSOU/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr\. Marcellin GBEGAN/i)).toBeInTheDocument();
    expect(screen.getByText(/Mme Béatrice TOSSOU/i)).toBeInTheDocument();
    expect(screen.getByText(/M\. Barnabé AGBODJINOU/i)).toBeInTheDocument();
    expect(screen.getByText(/M\. Joseph KIKI/i)).toBeInTheDocument();

    // 3. Official export of Board members is present
    expect(
      screen.getByRole('button', { name: /Exporter Fiche CA \(Loi 2025-19\)/i })
    ).toBeInTheDocument();
  });
});
