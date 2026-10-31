import { createClient } from '@supabase/supabase-js';
import { ExecutiveMember } from '../types';
import { INITIAL_EXECUTIVE_MEMBERS } from '../data/initialData';

// Adresse et clé publique du projet Supabase d'AMSHARTE.
// La clé « publishable » est faite pour être visible dans le navigateur :
// la sécurité est assurée par les règles d'accès (RLS) dans Supabase.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://iqgtvrgwovdfqhpmagxo.supabase.co';
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_eDcnqXCS7vWZPfDMmMEcVA_k-M35wtK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type RoleMembre =
  | 'administrateur' | 'cpi' | 'de' | 'pca' | 'ca'
  | 'finances' | 'site_web' | 'communication' | 'charge' | 'secretaire' | 'point_focal_presse'
  | 'eco_garde' | 'partenaire' | 'bplp';

export type StatutMembre = 'en_attente' | 'actif' | 'suspendu';

export interface Membre {
  id: string;
  nom_complet: string;
  email: string;
  telephone: string | null;
  role: RoleMembre;
  statut: StatutMembre;
  approuve_par: string | null;
  approuve_le: string | null;
  cree_le: string;
  modifie_le: string;
}

export const LIBELLES_ROLES: Record<RoleMembre, string> = {
  administrateur: 'Administrateur du site',
  cpi: 'Chargé de Programmes par Intérim (CPI)',
  de: 'Directeur Exécutif (DE)',
  pca: "Présidente du Conseil d'Administration (PCA)",
  ca: "Membre du Conseil d'Administration (CA)",
  finances: 'Chargée des Affaires Financières',
  site_web: 'Chargé du Site Web et de la Présence Numérique',
  communication: 'Chargé à la Communication',
  charge: 'Chargé(e) de programme ou de mission',
  secretaire: 'Secrétaire Particulier du DE',
  point_focal_presse: 'Point Focal Presse',
  eco_garde: 'Éco-garde',
  partenaire: 'Partenaire',
  bplp: 'Agent BPLP',
};

// Rôles proposés à l'inscription. Les rôles de direction (administrateur, CPI, DE, PCA) ne s'obtiennent pas
// en s'inscrivant : ils sont attribués par l'administrateur après vérification.
export const ROLES_INSCRIPTION: RoleMembre[] = [
  'ca', 'finances', 'site_web', 'communication', 'charge', 'secretaire', 'point_focal_presse',
  'eco_garde', 'partenaire', 'bplp',
];

const PHOTO_PAR_DEFAUT =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

const DEPARTEMENTS: Record<RoleMembre, string> = {
  administrateur: 'Maintenance du site',
  cpi: 'Programmes, Planification & Suivi Évaluation',
  de: 'Direction Exécutive',
  pca: "Conseil d'Administration",
  ca: "Conseil d'Administration",
  finances: 'Affaires Financières & Trésorerie',
  site_web: 'Site Web & Présence Numérique',
  communication: 'Communication & Médias',
  charge: 'Programmes & Missions',
  secretaire: 'Secrétariat Particulier du DE',
  point_focal_presse: 'Presse (correspondants externes)',
  eco_garde: 'Opérations de Terrain',
  partenaire: 'Partenaires',
  bplp: 'Partenaires – BPLP',
};

/** Lit la fiche du membre connecté dans Supabase. */
export async function chargerMaFiche(): Promise<Membre | null> {
  const { data: session } = await supabase.auth.getUser();
  const uid = session.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase.from('membres').select('*').eq('id', uid).maybeSingle();
  if (error) {
    console.error('Lecture de la fiche membre impossible :', error.message);
    return null;
  }
  return data as Membre | null;
}

/** Transforme une fiche Supabase en profil utilisable par le reste du portail. */
export function membreVersProfil(m: Membre): ExecutiveMember {
  // Reprend la photo et les tâches d'un profil existant si le rôle correspond
  const modele = INITIAL_EXECUTIVE_MEMBERS.find(
    (e) => e.email.toLowerCase() === m.email.toLowerCase() || e.role === LIBELLES_ROLES[m.role]
  );
  const tel = m.telephone || '';
  const telChiffres = tel.replace(/[^0-9]/g, '');
  const accesTotal = m.role === 'administrateur' || m.role === 'cpi';
  return {
    id: m.id,
    name: m.nom_complet || m.email,
    role: LIBELLES_ROLES[m.role],
    roleCle: m.role,
    department: DEPARTEMENTS[m.role],
    photo: modele?.photo || PHOTO_PAR_DEFAUT,
    accessCode: '',
    phone: tel,
    mobile: tel,
    whatsapp: telChiffres,
    meetLink: modele?.meetLink || 'https://meet.google.com/',
    email: m.email,
    isRegistered: true,
    canMaintainSite: accesTotal || m.role === 'de' || m.role === 'site_web',
    canManageMedia: accesTotal || m.role === 'site_web' || m.role === 'communication',
    status: 'disponible',
    performanceScore: modele?.performanceScore ?? 0,
    assignedTasks: modele?.assignedTasks,
    submittedReportsCount: modele?.submittedReportsCount ?? 0,
  };
}
