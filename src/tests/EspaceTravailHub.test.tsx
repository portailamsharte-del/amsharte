import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { EspaceTravailHub } from '../components/EspaceTravailHub';
import {
  INITIAL_EXECUTIVE_MEMBERS,
  INITIAL_LOGISTICAL_NEEDS,
  INITIAL_SOCIAL_CHANNELS,
  INITIAL_MEMBER_REPORTS,
  INITIAL_IMPACT_METRICS,
  INITIAL_JOB_DESCRIPTIONS,
  INITIAL_OFFICIAL_DOCUMENTS
} from '../data/initialData';

describe('EspaceTravailHub - Cockpit Opérationnel & Gestion des 33 Membres', () => {
  const mockProps = {
    members: INITIAL_EXECUTIVE_MEMBERS,
    onUpdateMembers: vi.fn(),
    activeMember: null,
    onSetActiveMember: vi.fn(),
    logisticalNeeds: INITIAL_LOGISTICAL_NEEDS,
    onAddLogisticalNeed: vi.fn(),
    onUpdateLogisticalNeed: vi.fn(),
    socialChannels: INITIAL_SOCIAL_CHANNELS,
    onAddSocialChannel: vi.fn(),
    onUpdateSocialChannel: vi.fn(),
    memberReports: INITIAL_MEMBER_REPORTS,
    onAddMemberReport: vi.fn(),
    onUpdateMemberReport: vi.fn(),
    impactMetrics: INITIAL_IMPACT_METRICS,
    onSyncImpactMetrics: vi.fn(),
    onPublishActionToNewsfeed: vi.fn(),
    onLogAudit: vi.fn(),
    onGoToPublicSite: vi.fn(),
    posts: INITIAL_JOB_DESCRIPTIONS,
    officialDocuments: INITIAL_OFFICIAL_DOCUMENTS
  };

  it('renders the Hub title and key internal sub-tabs', () => {
    render(<EspaceTravailHub {...mockProps} />);

    // Hub Title & Header
    expect(
      screen.getByText(/Espace de Travail & Cockpit Opérationnel AMSHARTE/i)
    ).toBeInTheDocument();

    // Internal sub-tabs
    expect(screen.getByRole('button', { name: /Annuaire \(15 Membres\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cahiers de Charges & Rôles/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mon Espace & Dépôt Rapport/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cockpit CPI\/DE & Tableau de Bord/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Conseil d'Administration/i })).toBeInTheDocument();
  });

  it('displays the members directory and allows searching a member', () => {
    render(<EspaceTravailHub {...mockProps} />);

    // Verify search input exists
    const searchInput = screen.getByPlaceholderText(/Rechercher par nom, rôle ou département\.\.\./i);
    expect(searchInput).toBeInTheDocument();

    // Verify key members are present in the directory
    expect(
      screen.getAllByText(/SONON Tchéhouéa/i).length
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText(/Henri Doudédji FATCHINA/i).length
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText(/Christian SESSOU/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('switches to Cahiers de Charges sub-tab', () => {
    render(<EspaceTravailHub {...mockProps} />);

    const cahiersTab = screen.getByRole('button', { name: /Cahiers de Charges & Rôles/i });
    fireEvent.click(cahiersTab);

    // Verify Cahiers de Charges header
    expect(
      screen.getByText(/Cahiers de Charges & Rôles Officiels des Postes/i)
    ).toBeInTheDocument();
  });

  it('switches to Cockpit CPI / DE sub-tab', () => {
    render(<EspaceTravailHub {...mockProps} />);

    const cockpitTab = screen.getByRole('button', { name: /Cockpit CPI\/DE & Tableau de Bord/i });
    fireEvent.click(cockpitTab);

    // Verify Cockpit indicators are displayed
    expect(
      screen.getByText(/État Actuel des Indicateurs d'Impact Publics Synchronisés/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Tableau de Bord Stratégique du CPI \(Suivi des Projets & Règle J\+10\)/i)
    ).toBeInTheDocument();
  });
});
