import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';

describe('App Component - Navigation & Key Components', () => {
  beforeEach(() => {
    window.scrollTo = () => {};
  });

  it('renders the Public Website initially with Header branding and full AMSHARTE definition', () => {
    render(<App />);

    // 1. Verify Header branding
    const brandTitles = screen.getAllByText('AMSHARTE');
    expect(brandTitles.length).toBeGreaterThanOrEqual(1);

    // 2. Verify "Site Officiel" badge
    const officialBadges = screen.getAllByText(/Site Officiel/i);
    expect(officialBadges.length).toBeGreaterThanOrEqual(1);

    // 3. Verify the full legal definition of AMSHARTE is present
    const definitions = screen.getAllByText(
      /Amis du Monde pour la Sauvegarde de l'Hygiène, de la Santé Sécurité au Travail en Milieu Rural Artisanal et Environnemental/i
    );
    expect(definitions.length).toBeGreaterThanOrEqual(1);

    // 4. Verify public website content is present
    const publicHeadings = screen.getAllByText(/Tortues Marines de Togbin Plage/i);
    expect(publicHeadings.length).toBeGreaterThanOrEqual(1);

    // 5. Verify colored navigation buttons are rendered on the public line
    expect(screen.getAllByRole('button', { name: /Fil d'Actualité/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /🚨 Signaler Tortue/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /DE Amsharte/i }).length).toBeGreaterThanOrEqual(1);
  });

  it('ouvre la fenêtre de connexion (et non l\'intranet) quand un visiteur non connecté clique sur "DE Amsharte"', () => {
    render(<App />);

    const deButtons = screen.getAllByRole('button', { name: /DE Amsharte/i });
    expect(deButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(deButtons[0]);

    // La fenêtre de connexion des membres s'affiche
    expect(screen.getAllByText(/Espace de Travail AMSHARTE/i).length).toBeGreaterThanOrEqual(1);

    // L'espace de travail interne reste fermé : pas de bouton « Site Public », pas d'annuaire
    expect(screen.queryByRole('button', { name: /Site Public/i })).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Annuaire des Membres & Pilotage des Cahiers des Charges/i)
    ).not.toBeInTheDocument();
  });

  it('navigates between public tabs correctly', () => {
    render(<App />);

    // Click on Conseil d'Administration tab on the public page
    const caButtons = screen.getAllByRole('button', { name: /Conseil d'Administration/i });
    expect(caButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(caButtons[0]);

    // Verify governance & board section is shown
    expect(
      screen.getByText(/Conseil d'Administration de l'ONG AMSHARTE/i)
    ).toBeInTheDocument();

    // Click on Fil d'Actualité tab to return
    const newsfeedButtons = screen.getAllByRole('button', { name: /Fil d'Actualité/i });
    expect(newsfeedButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(newsfeedButtons[0]);

    // Verify feed is active
    expect(
      screen.getByText(/Fil d'Actualité des Actions de Terrain/i)
    ).toBeInTheDocument();
  });
});
