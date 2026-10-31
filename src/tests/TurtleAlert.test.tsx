import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { TurtleAlertSection } from '../components/TurtleAlertSection';

describe('TurtleAlertSection - Sauvetage & Ligne d\'Urgence', () => {
  beforeEach(() => {
    // Mock window.open and window.alert
    vi.spyOn(window, 'open').mockImplementation(() => null);
    vi.spyOn(window, 'alert').mockImplementation(() => null);
  });

  it('renders the emergency helpline and reporting form properly', () => {
    render(<TurtleAlertSection />);

    // 1. Verify emergency header & helpline
    expect(
      screen.getByText(/Ligne Verte & Sauvetage Immédiat 24h\/24/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Guichet d'Alerte : Signaler une Tortue ou un Nid/i)
    ).toBeInTheDocument();

    // 2. Verify emergency contact phone numbers
    expect(screen.getAllByText(/95 35 08 62/i).length).toBeGreaterThanOrEqual(1);

    // 3. Verify form fields
    expect(screen.getByPlaceholderText(/Ex: Koffi S\., Pêcheur Togbin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ex: \(\+229\) 01 XX XX XX XX/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Précisez si le filet est déchiré, si des blessures sont visibles/i)
    ).toBeInTheDocument();

    // 4. Verify submit button
    expect(
      screen.getByRole('button', { name: /Envoyer l'Alerte & WhatsApp Direct/i })
    ).toBeInTheDocument();
  });

  it('submits a new emergency alert successfully', () => {
    render(<TurtleAlertSection />);

    const nameInput = screen.getByPlaceholderText(/Ex: Koffi S\., Pêcheur Togbin/i);
    const phoneInput = screen.getByPlaceholderText(/Ex: \(\+229\) 01 XX XX XX XX/i);
    const descInput = screen.getByPlaceholderText(/Précisez si le filet est déchiré, si des blessures sont visibles/i);

    fireEvent.change(nameInput, { target: { value: 'Capitaine Agossou' } });
    fireEvent.change(phoneInput, { target: { value: '+229 95 00 11 22' } });
    fireEvent.change(descInput, { target: { value: 'Tortue luth de grande taille observée en train de pondre près du repère 14.' } });

    const submitBtn = screen.getByRole('button', { name: /Envoyer l'Alerte & WhatsApp Direct/i });
    fireEvent.click(submitBtn);

    // Verify success confirmation banner
    expect(
      screen.getByText(/Alerte enregistrée avec succès !/i)
    ).toBeInTheDocument();

    // Verify the newly created alert appears in the recent alerts list by its description
    expect(
      screen.getByText(/Tortue luth de grande taille observée en train de pondre près du repère 14\./i)
    ).toBeInTheDocument();
  });
});
