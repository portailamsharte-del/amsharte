import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MediathequePhotothequeSection } from '../components/MediathequePhotothequeSection';

describe('MediathequePhotothequeSection', () => {
  it('renders both sub-buttons for Médiathèque and Photothèque', () => {
    render(<MediathequePhotothequeSection />);

    // Header & Sub-buttons
    expect(
      screen.getByText(/Centre de Ressources Documentaires & Visuelles/i)
    ).toBeInTheDocument();

    const btnMediatheque = screen.getByRole('button', { name: /1\. Médiathèque/i });
    const btnPhototheque = screen.getByRole('button', { name: /2\. Photothèque/i });

    expect(btnMediatheque).toBeInTheDocument();
    expect(btnPhototheque).toBeInTheDocument();

    // Default view is Médiathèque -> shows official documents
    expect(
      screen.getByText(/Documents Officiels, Agréments & Protocoles d'AMSHARTE/i)
    ).toBeInTheDocument();
  });

  it('switches to Photothèque and renders photo gallery items', () => {
    render(<MediathequePhotothequeSection />);

    const btnPhototheque = screen.getByRole('button', { name: /2\. Photothèque/i });
    fireEvent.click(btnPhototheque);

    // Verify Photothèque content is rendered
    expect(
      screen.getByText(/Photothèque & Témoignages du Littoral de Togbin/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Immersion dans les missions d'AMSHARTE/i)
    ).toBeInTheDocument();
  });
});
