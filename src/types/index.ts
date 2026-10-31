export const NGO_OFFICIAL_NAME = "AMSHARTE - Amis du Monde pour la Sauvegarde de l'Hygiène, de la Santé Sécurité au Travail en Milieu Rural Artisanal et Environnemental";
export type NGOOfficialName = typeof NGO_OFFICIAL_NAME;

export type ProjectCategory = 'tortues' | 'mangroves' | 'education' | 'ptf' | 'gouvernance';

export interface PostJobDescription {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  incumbentName: string;
  isInterim?: boolean;
  reportsTo: string;
  functionSummary: string;
  tasks: string[];
  statusAndCompensation: string;
  badgeColor: string;
  department: string;
  emailContact?: string;
  phoneContact?: string;
  signatureDate?: string;
  serviceNoteRef?: string;
}

export interface ProjectIndicator {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
  responsible: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  category: ProjectCategory;
  leader: string;
  status: 'en_cours' | 'planifie' | 'termine' | 'vigilance';
  progressPercentage: number;
  budgetTotalFCFA: number;
  budgetDepenseFCFA: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  objectives: string[];
  keyIndicators: ProjectIndicator[];
  milestones: ProjectMilestone[];
}

export interface MonthlyReport {
  id: string;
  reference: string;
  month: string; // e.g. "Août"
  year: number;
  authorName: string;
  authorRole: string;
  projectCategory: ProjectCategory;
  dateSubmitted: string;
  status: 'brouillon' | 'soumis_cpi' | 'valide_cpi' | 'vise_de';
  summary: string;
  activitiesCompleted: string[];
  quantitativeResults: { label: string; value: string }[];
  challengesFaced: string;
  solutionsApplied: string;
  nextMonthPlanning: string;
  financialNeedsFCFA: number;
  cpiReviewNotes?: string;
  deVisaNotes?: string;
}

export interface TechnicalFinancialPartner {
  id: string;
  name: string;
  type: 'Bailleur International' | 'Agence ONU / Multilatéral' | 'ONG Internationale' | 'Ministère / État Béninois' | 'Fondation / RSE';
  status: 'Partenaire Actif' | 'Convention en négociation' | 'En prospection';
  conventionTitle: string;
  conventionBudgetFCFA: number;
  disbursedBudgetFCFA: number;
  nextDeliverableDate: string;
  nextDeliverableTitle: string;
  contactPerson: string;
  contactEmail: string;
  focusArea: string;
}

export interface DriveFolderNode {
  id: string;
  name: string;
  code: string;
  ownerRole: string;
  description: string;
  children?: DriveFolderNode[];
  colorTag: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  fullText: string;
  author: string;
  readTime: string;
}

export type ActionCategory = 
  | 'sauvetage_tortue' 
  | 'baguage_constante' 
  | 'patrouille_nocturne' 
  | 'ecloserie_oeufs' 
  | 'lacher_mer' 
  | 'action_conjointe_bplp' 
  | 'sensibilisation_pecheurs' 
  | 'salubrite_ayi_dji_ni_min';

export interface FieldActionPost {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: ActionCategory;
  authorName: string;
  authorRole: string;
  badgeNumber?: string;
  tagId?: string; // e.g. "BJ 2872", "BJ 2871"
  species?: string;
  measurements?: {
    lengthCarapaceCm?: number;
    widthCarapaceCm?: number;
    weightKg?: number;
    eggsCount?: number;
  };
  content: string;
  imageUrls?: string[];
  hasVideo?: boolean;
  videoCaption?: string;
  videoUrl?: string;
  videoDuration?: string;
  isAnimated?: boolean;
  animatedType?: 'corridor_carte' | 'eclosion_simulation' | 'demallage_tutoriel';
  isExampleMedia?: boolean;
  examplePlaceholderLabel?: string;
  verifiedBy?: string; // qui a réellement validé (ex. "Police BPLP & CPI") — vide tant qu'aucune validation n'a eu lieu
  visaValidatedAt?: string; // date réelle de la validation (AAAA-MM-JJ) ; sans elle, aucun visa n'est affiché
  extractedIntoReport?: boolean;
  likes: number;
  stakeholderCommentsCount: number;
}

export interface StakeholderForumComment {
  id: string;
  authorName: string;
  authorRole: string; // e.g. "Chef de Pêche Togbin", "Officier Police BPLP", "Délégué MCVT", "Éco-garde"
  organization: string;
  timestamp: string;
  content: string;
  isOfficialVisa?: boolean;
}

export interface StakeholderForumThread {
  id: string;
  title: string;
  category: 'tortues' | 'pecheurs_filets' | 'securite_bplp' | 'financement_ptf' | 'amp_politiques' | 'communaute';
  createdAt: string;
  authorName: string;
  authorRole: string;
  authorOrg: string;
  description: string;
  status: 'ouvert' | 'en_cours_resolution' | 'integre_rapport_cpi';
  priority: 'haute' | 'moyenne' | 'urgente';
  extractedToReportId?: string;
  linkedActionId?: string;
  comments: StakeholderForumComment[];
}

export interface OfficialDocument {
  id: string;
  title: string;
  category: 'reconnaissance_etat' | 'juridique' | 'protocole_scientifique' | 'guide_terrain' | 'partenariat';
  referenceNumber: string;
  reference?: string;
  issueDate: string;
  issuedBy: string;
  description: string;
  downloadFileName: string;
  contentSummary: string[];
  keyTerms: string[];
  isFeatured?: boolean;
  version?: string;
  lastUpdated?: string;
  status?: 'actif' | 'en_revision' | 'archive';
  fileContentText?: string;
  fileUrl?: string;
  fileSize?: string;
}

export interface AiDraftDocument {
  id: string;
  rawPromptOrText: string;
  proposedDoc: OfficialDocument;
  aiConfidenceScore: number;
  aiAnalysisNotes: string;
  createdAt: string;
  status: 'en_attente_visa' | 'valide_publie' | 'rejete';
  preparedBy: string; // e.g. 'Assistant IA AMSHARTE v2.5'
  reviewedBy?: string;
  reviewNotes?: string;
  validatedAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read?: boolean;
  isRead?: boolean;
  actionLabel?: string;
  actionUrl?: string;
  category?: 'rapport' | 'document' | 'impact' | 'tache' | 'securite' | 'systeme' | 'delai';
}

export interface GalleryMediaItem {
  id: string;
  title: string;
  category: 'tortues' | 'ecloserie' | 'patrouille' | 'mangroves' | 'communaute';
  imageUrl: string;
  location: string;
  date: string;
  description: string;
  photographer: string;
  badgeTag?: string;
  gpsCoordinates?: string;
}

export interface SeasonalCalendarItem {
  id: string;
  monthRange: string;
  title: string;
  category: 'tortues' | 'mangroves' | 'peche' | 'citoyennete';
  status: 'en_cours' | 'a_venir' | 'passe';
  description: string;
  fieldActions: string[];
  stakeholderAlert: string;
}

export interface EmergencyTurtleAlert {
  id: string;
  reporterName: string;
  reporterPhone: string;
  reporterType: 'pecheur' | 'riverain' | 'touriste' | 'eco_garde';
  location: string;
  gpsCoordinates?: string;
  date: string;
  time: string;
  turtleCondition: 'vivante_saine' | 'piegee_filet' | 'blessee' | 'ponte_en_cours' | 'echouee_morte';
  estimatedSize: 'petite_nouveau_ne' | 'moyenne_jeune' | 'grande_adulte';
  description: string;
  status: 'transmis_urgence' | 'equipe_deployee' | 'secourue_traitee';
  alertDispatchedToAll?: boolean;
  dispatchedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  authorName: string;
  authorRole: string;
  actionType: 'connexion' | 'inscription' | 'validation_rapport' | 'maj_projet' | 'contact_maj' | 'media_import' | 'alerte_diffusee' | 'delegation_com' | 'ia_requete' | 'modification_site';
  details: string;
}

export interface MemberAssignedTask {
  id: string;
  title: string;
  category: 'terrain' | 'rapport' | 'logistique' | 'reunion' | 'sensibilisation';
  dueDate: string;
  status: 'a_faire' | 'en_cours' | 'termine';
  cahierDesChargesReference: string;
  description?: string;
}

export interface MemberTaskReport {
  id: string;
  memberId: string;
  authorName: string;
  authorRole: string;
  dateSubmitted: string;
  title: string;
  summary: string;
  tasksCompleted: string[];
  fieldMetrics: {
    tortuesObservees?: number;
    nidsProteges?: number;
    oeufsTransferes?: number;
    bebesRelaches?: number;
    dechetsCollectesKg?: number;
    personnesSensibilisees?: number;
  };
  logisticalNeedsReported: string[];
  status: 'transmis_cpi_de' | 'integre_rapport_mensuel' | 'valide_de';
  cpiNotes?: string;
  deVisaDate?: string;
}

export interface LogisticalNeedItem {
  id: string;
  item: string;
  category: 'sauvetage_tortues' | 'assainissement_plage' | 'securite_nocturne' | 'ecloserie' | 'bureautique';
  quantityNeeded: number;
  unit: string;
  urgency: 'critique' | 'haute' | 'normale';
  requestedBy: string;
  collectionLocation: string;
  status: 'demande' | 'approuve_cpi' | 'valide_de' | 'dote';
  dateReported: string;
  notes: string;
}

export interface SocialNetworkChannel {
  id: string;
  name: string;
  iconType: 'whatsapp' | 'facebook' | 'youtube' | 'linkedin' | 'instagram' | 'x' | 'globe';
  url: string;
  description: string;
  isPermanent: boolean;
  color: string;
  badgeLabel?: string;
}

export interface ImpactMetricsState {
  turtlesRescued: number;
  nestsProtected: number;
  hatchlingsReleased: number;
  plasticWasteKg: number;
  beachKmMonitored: number;
  artisansSupported: number;
  lastSyncDate: string;
  validatedByDE: boolean;
  visaReference: string;
  nidsProtegesTotal?: number;
  bebesTortuesRelacheesTotal?: number;
  mangrovesRestaureesHa?: number;
  ecoGardesActifs?: number;
  tortuesAdultesSauvees?: number;
  dechetsPlastiquesCollectesKg?: number;
  patrouillesEffectuees?: number;
  lastSynchronizedAt?: string;
  isAutomated?: boolean;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  roleCle?: string; // clé de droit : cpi, de, pca, ca, finances, site_web, communication, charge, secretaire, point_focal_presse, eco_garde…
  department: string;
  photo: string;
  accessCode: string;
  password?: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  meetLink: string;
  email: string;
  isRegistered: boolean;
  canMaintainSite: boolean;
  canManageMedia: boolean;
  status: 'disponible' | 'en_patrouille' | 'en_redaction' | 'en_mission';
  performanceScore: number;
  assignedTasks?: MemberAssignedTask[];
  submittedReportsCount?: number;
}

export interface SiteContactSettings {
  emergencyPhone1: string;
  emergencyPhone2: string;
  emergencyPhone3: string;
  email: string;
  whatsappAlertNumber: string;
  whatsappCommunityUrl: string;
  facebookPage: string;
  headquarters: string;
  localMediaFolderHint: string;
  googleMeetGeneralUrl?: string;
}

export interface SiteMaintenanceDelegation {
  delegatedToCom: boolean;
  delegatedDate: string;
  delegatedBy: string;
  delegatedPersonName: string;
  permissions: {
    manageMedia: boolean;
    manageNewsfeed: boolean;
    updateAlerts: boolean;
    editContacts: boolean;
  };
}

export interface BoardMember {
  id: string;
  name: string;
  role: string;
  title: string;
  college: 'presidence_tresorerie' | 'scientifique_environnement' | 'communautaire_riverain';
  collegeLabel: string;
  mandatePeriod: string;
  photo: string;
  bio: string;
  responsibilities: string[];
  qualifications: string[];
  contactEmail?: string;
  contactPhone?: string;
  npiNumber?: string;
  isPresident?: boolean;
}


