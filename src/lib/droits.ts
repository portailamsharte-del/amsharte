// Droits d'accès du portail AMSHARTE — d'après le tableau « Qui peut faire quoi » validé par le CPI (oct. 2026)
// et le document « Cahiers de charge ». Ces droits règlent ce que l'écran affiche ; la vraie protection
// des données se fait dans Supabase (règles d'accès par rôle).
import type { RoleMembre } from './supabase';

export type Role = RoleMembre | string | undefined;

/** Rôles de la Direction Exécutive et de son équipe (accès à l'espace de travail). */
const EQUIPE_DE: string[] = [
  'administrateur', 'de', 'cpi', 'finances', 'site_web', 'communication', 'charge', 'secretaire',
];
/** Rôles qui peuvent consulter l'espace du Conseil d'Administration. */
const ESPACE_CA: string[] = ['pca', 'ca', 'de', 'cpi', 'administrateur'];

const ONGLETS: Record<string, string[]> = {
  'espace-travail': EQUIPE_DE,
  'conseil-administration': ESPACE_CA,
  'cahiers-charges': [...EQUIPE_DE, 'pca', 'ca'],
  'rapports-mensuels': ['de', 'cpi', 'administrateur', 'pca', 'ca'],
  'webmastering-docs': ['administrateur', 'cpi', 'de', 'site_web', 'communication'],
  'projets': ['de', 'cpi', 'administrateur', 'charge'],
  'ptf': ['de', 'cpi', 'administrateur', 'charge', 'finances'],
  'passerelle': ['de', 'cpi', 'administrateur', 'finances'],
  'assistant-ia': ['cpi', 'administrateur'],
  'parametres-audit': ['administrateur', 'cpi', 'de'],
};

/** L'ancien identifiant « dashboard » désigne l'espace de travail de la Direction Exécutive. */
export function normaliserOnglet(onglet: string): string {
  return onglet === 'dashboard' ? 'espace-travail' : onglet;
}

export function peutVoirOnglet(role: Role, onglet: string): boolean {
  if (!role) return false;
  return (ONGLETS[normaliserOnglet(onglet)] || []).includes(role);
}

/** Premier onglet ouvert à ce rôle (ou null s'il n'a aucun espace interne). */
export function ongletParDefaut(role: Role): string | null {
  if (!role) return null;
  if (peutVoirOnglet(role, 'espace-travail')) return 'espace-travail';
  if (peutVoirOnglet(role, 'conseil-administration')) return 'conseil-administration';
  return null;
}

/** Le CPI et l'administrateur peuvent consulter l'espace d'un autre membre (supervision). */
export function peutSuperviser(role: Role): boolean {
  return role === 'administrateur' || role === 'cpi';
}

export type Capacite =
  | 'saisirTerrain'
  | 'redigerRapportProgramme'
  | 'consoliderRapports'
  | 'reviserRapports'
  | 'viserRapports'
  | 'preparerContenus'
  | 'validerContenuCourant'
  | 'validerContenuOfficiel'
  | 'publierSurSite'
  | 'approuverMembres'
  | 'accesTechnique';

const CAPACITES: Record<Capacite, string[]> = {
  saisirTerrain: ['cpi', 'charge', 'eco_garde'],
  redigerRapportProgramme: ['charge'],
  consoliderRapports: ['cpi'],
  reviserRapports: ['cpi'],
  viserRapports: ['de'],
  preparerContenus: ['cpi', 'communication'],
  validerContenuCourant: ['cpi'],
  validerContenuOfficiel: ['de'],
  publierSurSite: ['cpi', 'site_web'],
  approuverMembres: ['de'],
  accesTechnique: ['administrateur', 'cpi'],
};

export function peut(role: Role, capacite: Capacite): boolean {
  if (!role) return false;
  return CAPACITES[capacite].includes(role);
}
