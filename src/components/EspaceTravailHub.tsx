import React, { useState, useMemo } from 'react';
import { calculateAutomatedImpactMetrics, downloadFile } from '../utils/helpers';
import { 
  ExecutiveMember, 
  MemberAssignedTask, 
  MemberTaskReport, 
  LogisticalNeedItem, 
  SocialNetworkChannel, 
  ImpactMetricsState, 
  FieldActionPost,
  ProjectItem,
  MonthlyReport,
  AuditLogEntry,
  PostJobDescription,
  OfficialDocument,
  TechnicalFinancialPartner
} from '../types';
import { 
  INITIAL_JOB_DESCRIPTIONS, 
  NGO_INFO, 
  INITIAL_OFFICIAL_DOCUMENTS 
} from '../data/initialData';
import { JobDescriptionsView } from './JobDescriptionsView';
import { WebmasteringDocumentsView } from './WebmasteringDocumentsView';
import { BoardOfDirectorsSection } from './BoardOfDirectorsSection';
import { 
  Users, 
  Video, 
  Share2, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Lock, 
  KeyRound, 
  LogOut, 
  PlusCircle, 
  Send, 
  FileCheck2, 
  Waves, 
  ShieldCheck, 
  BarChart3, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  Info, 
  Building2, 
  ChevronRight,
  Flame,
  Award,
  Globe2,
  FolderOpen,
  Scale,
  Egg,
  TrendingUp,
  Sliders,
  Filter,
  Search,
  MessageSquare,
  FileText,
  Download,
  Server,
  Database,
  Globe,
  Briefcase,
  ArrowRight,
  Shield,
  UserCheck,
  Landmark
} from 'lucide-react';

interface EspaceTravailHubProps {
  members: ExecutiveMember[];
  onUpdateMembers: (members: ExecutiveMember[]) => void;
  activeMember: ExecutiveMember | null;
  onSetActiveMember: (member: ExecutiveMember | null) => void;
  peutSuperviser?: boolean; // vrai pour le CPI et l'administrateur : consulter l'espace d'un autre membre
  logisticalNeeds: LogisticalNeedItem[];
  onAddLogisticalNeed: (item: LogisticalNeedItem) => void;
  onUpdateLogisticalNeed: (item: LogisticalNeedItem) => void;
  socialChannels: SocialNetworkChannel[];
  onAddSocialChannel: (ch: SocialNetworkChannel) => void;
  onUpdateSocialChannel: (ch: SocialNetworkChannel) => void;
  memberReports: MemberTaskReport[];
  onAddMemberReport: (rep: MemberTaskReport) => void;
  onUpdateMemberReport: (rep: MemberTaskReport) => void;
  impactMetrics: ImpactMetricsState;
  onSyncImpactMetrics: (newMetrics: Partial<ImpactMetricsState>) => void;
  onPublishActionToNewsfeed: (action: FieldActionPost) => void;
  onLogAudit: (authorName: string, authorRole: string, actionType: any, details: string) => void;
  onGoToPublicSite: () => void;
  projects?: ProjectItem[];
  monthlyReports?: MonthlyReport[];
  fieldActions?: FieldActionPost[];
  posts?: PostJobDescription[];
  officialDocuments?: OfficialDocument[];
  onAddOfficialDocument?: (doc: OfficialDocument) => void;
  onUpdateOfficialDocument?: (doc: OfficialDocument) => void;
  onDeleteOfficialDocument?: (docId: string) => void;
  onNotify?: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error', category?: 'document' | 'rapport' | 'delai' | 'systeme') => void;
  partners?: TechnicalFinancialPartner[];
}

export const EspaceTravailHub: React.FC<EspaceTravailHubProps> = ({
  members,
  onUpdateMembers,
  activeMember,
  onSetActiveMember,
  peutSuperviser = false,
  logisticalNeeds,
  onAddLogisticalNeed,
  onUpdateLogisticalNeed,
  socialChannels,
  onAddSocialChannel,
  onUpdateSocialChannel,
  memberReports,
  onAddMemberReport,
  onUpdateMemberReport,
  impactMetrics,
  onSyncImpactMetrics,
  onPublishActionToNewsfeed,
  onLogAudit,
  onGoToPublicSite,
  projects = [],
  monthlyReports = [],
  fieldActions = [],
  posts = INITIAL_JOB_DESCRIPTIONS,
  officialDocuments = INITIAL_OFFICIAL_DOCUMENTS,
  onAddOfficialDocument,
  onUpdateOfficialDocument,
  onDeleteOfficialDocument,
  onNotify,
  partners = []
}) => {
  // Navigation tabs inside Espace de Travail DE
  const [currentTab, setCurrentTab] = useState<
    | 'annuaire_membres'
    | 'cahiers_charges'
    | 'mon_espace'
    | 'cockpit_cpi_de'
    | 'conseil_administration'
    | 'webmastering_architecture'
    | 'logistique_collectes'
    | 'assistant_ia_social'
    | 'gestion_reseaux'
  >('annuaire_membres');

  // Webmastering Access & Delegation State (CPI & DE exclusive, with delegation to Chargé de communication)
  const [isDelegationActive, setIsDelegationActive] = useState<boolean>(true);
  const [delegatedMemberId, setDelegatedMemberId] = useState<string>('exec-06'); // M. Landry (Chargé du Site Web)

  // Verify access privileges for Webmastering
  const isCpiOrDe = useMemo(() => {
    if (!activeMember) return false;
    return (
      activeMember.id === 'exec-01' || 
      activeMember.id === 'exec-02' || 
      ['cpi', 'de', 'administrateur'].includes(activeMember.roleCle || '') || 
      activeMember.role.toLowerCase().includes('directeur exécutif') || 
      activeMember.role.toLowerCase().includes('chargé de programmes')
    );
  }, [activeMember]);

  const isDelegatedUser = useMemo(() => {
    if (!activeMember) return false;
    return isDelegationActive && (activeMember.id === delegatedMemberId || ['site_web', 'communication'].includes(activeMember.roleCle || '') || activeMember.role.toLowerCase().includes('communication'));
  }, [activeMember, isDelegationActive, delegatedMemberId]);

  const hasWebmasterAccess = isCpiOrDe || isDelegatedUser;

  // Search and filter in directory
  const [searchMemberQuery, setSearchMemberQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('tous');

  // Login modal state
  const [memberToLogin, setMemberToLogin] = useState<ExecutiveMember | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Permanent Google Meet URL state (editable by DE/CPI)
  const [meetUrl, setMeetUrl] = useState('https://meet.google.com/ams-general-togbin');
  const [showMeetConfig, setShowMeetConfig] = useState(false);

  // Sub-tab inside Webmastering & Architecture
  const [webmasterSubTab, setWebmasterSubTab] = useState<'architecture_strategie' | 'mediatheque_documents' | 'delegation_site'>('architecture_strategie');

  const handleDownloadRoadmap = () => {
    const content = `========================================================================================
GUIDE STRATÉGIQUE D'ÉQUIPEMENT ET D'ORGANISATION — ONG AMSHARTE
Réalisé pour : Henri Doudédji FATCHINA, Chargé de Programmes par Intérim (CPI)
Sous le visa de : SONON Tchéhouéa, Directeur Exécutif (DE)
Siège : Togbin Fandji, Arrondissement de Godomey, Commune d'Abomey-Calavi, Bénin
Contact : contact@amsharte.org | +229 01 97 22 45 10 / 01 95 38 12 70
========================================================================================

QUESTION POSÉE : "Quel outil me permettrait de gérer au mieux cette ONG ?"

RÉPONSE ET RECOMMANDATION STRATÉGIQUE OFFICIELLE :
Le modèle optimal et pérenne pour l'ONG AMSHARTE repose sur le TRIPTYQUE HYBRIDE :

1. GOOGLE WORKSPACE (Programme Google for Nonprofits — 100% Gratuit)
   - Rôle : Coordination quotidienne, messagerie professionnelle @amsharte.org et travail collaboratif terrain.
   - Google Drive Partagé : Arborescence stricte avec dossiers cloisonnés :
     * 01_DIRECTION_EXECUTIVE (Visas, décisions, contrats de travail)
     * 02_PROGRAMMES_CPI (Rapports de patrouilles, suivi tortues & mangroves)
     * 03_FINANCES_COMPTABILITE (Justificatifs dépenses, factures, relevés bancaires)
     * 04_COMMUNICATION_RELATIONS_PUBLIQUES (Communiqués, photothèque, logos)
     * 05_PARTENAIRES_PTF (Conventions, requêtes de subvention, audits)
   - Google Forms : Fiches de patrouilles nocturnes déconnectées sur smartphone (saisie hors-ligne sur les plages de Togbin à Avlékété).
   - Google Sheets : Consolidation automatisée des données de nidification et d'éclosion pour le reporting mensuel J+10.

2. DOLIBARR ERP/CRM (Open-Source, sans frais de licence par utilisateur)
   - Rôle : Rigueur administrative, conformité comptable SYSCOHADA pour les audits des bailleurs (PTF).
   - Hébergement : Serveur infogéré ou cloud associatif (environ 2 500 à 4 000 FCFA / mois).
   - Modules activés :
     * Module Projets : Suivi budgétaire du Projet Tortues (P1) et du Projet Mangroves (P2).
     * Module Tiers & Bailleurs : Historique des relations avec les PTF (Fonds pour l'Environnement Mondial, PNUD, UICN, Ministère du Cadre de Vie).
     * Module Comptabilité/Banque : Rapprochement bancaire, journal des dépenses terrain, suivi des caisses d'avances.
     * Module Adhérents/Bénévoles : Suivi des membres et éco-gardes volontaires.

3. PORTAIL NUMÉRIQUE UNIFIÉ AMSHARTE (L'application actuelle)
   - Rôle : Cockpit temps réel, synchronisation publique certifiée, médiathèque officielle et annuaire dynamique.
   - Accès Webmaster : Exclusif au CPI et au DE, avec délégation opérationnelle au Chargé du Site Web et au Chargé à la Communication, sous la supervision du CPI et du DE.
   - Remplacement de l'ancien Google Sites : Cet intranet/portail unifié assure une sécurité maximale et une centralisation totale des flux sans doublons.

========================================================================================
Fait à Cotonou / Togbin Fandji, le ${new Date().toLocaleDateString('fr-FR')}
Pour la Coordination Opérationnelle,
Henri D. FATCHINA, Chargé de Programmes par Intérim (CPI)
SONON Tchéhouéa, Directeur Exécutif (DE)
========================================================================================`;
    downloadFile(content, 'AMSHARTE_Guide_Strategique_Organisation.txt', 'text/plain');
  };

  // New report submission form state (for logged-in member)
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [reportTasksDone, setReportTasksDone] = useState('');
  const [reportTurtles, setReportTurtles] = useState('');
  const [reportNests, setReportNests] = useState('');
  const [reportEggs, setReportEggs] = useState('');
  const [reportHatchlings, setReportHatchlings] = useState('');
  const [reportWasteKg, setReportWasteKg] = useState('');
  const [reportSensitized, setReportSensitized] = useState('');
  const [reportLogisticsNeeded, setReportLogisticsNeeded] = useState('');
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'terrain' | 'rapport' | 'logistique' | 'reunion' | 'sensibilisation'>('terrain');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskRef, setNewTaskRef] = useState('');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New logistical need form state
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [newLogItem, setNewLogItem] = useState('');
  const [newLogCat, setNewLogCat] = useState<'sauvetage_tortues' | 'assainissement_plage' | 'securite_nocturne' | 'ecloserie' | 'bureautique'>('sauvetage_tortues');
  const [newLogQty, setNewLogQty] = useState('2');
  const [newLogUnit, setNewLogUnit] = useState('unités');
  const [newLogUrgency, setNewLogUrgency] = useState<'critique' | 'haute' | 'normale'>('haute');
  const [newLogLocation, setNewLogLocation] = useState('Plage de Togbin Fandji');
  const [newLogNotes, setNewLogNotes] = useState('');

  // AI Social Media Ingestion State
  const [rawSocialText, setRawSocialText] = useState('');
  const [socialSourceType, setSocialSourceType] = useState<'facebook' | 'whatsapp' | 'autre'>('whatsapp');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiExtractedAction, setAiExtractedAction] = useState<Partial<FieldActionPost> | null>(null);
  const [aiPublishSuccess, setAiPublishSuccess] = useState(false);

  // New social channel form state
  const [showAddChannelModal, setShowAddChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [newChannelIcon, setNewChannelIcon] = useState<'whatsapp' | 'facebook' | 'youtube' | 'linkedin' | 'instagram' | 'x' | 'globe'>('facebook');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelColor, setNewChannelColor] = useState('#1877F2');

  // CPI/DE automatic impact sync feedback state
  const [syncSuccessMessage, setSyncSuccessMessage] = useState('');

  // Calculate aggregated performance and stats
  const totalMembersCount = members.length; // Effectif réel de la liste des membres
  const registeredDirectoryCount = members.length;
  const avgPerformance = useMemo(() => {
    if (members.length === 0) return 0;
    const sum = members.reduce((acc, m) => acc + (m.performanceScore || 85), 0);
    return Math.round(sum / members.length);
  }, [members]);

  const totalReportsSubmitted = useMemo(() => {
    return memberReports.length;
  }, [memberReports]);

  // Filtered members for directory covering all 33 members across 6 operational poles
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchSearch = 
        m.name.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
        m.department.toLowerCase().includes(searchMemberQuery.toLowerCase()) ||
        m.accessCode.toLowerCase().includes(searchMemberQuery.toLowerCase());
      
      let matchDept = true;
      if (selectedDepartment === 'direction') {
        matchDept = ['exec-01', 'exec-02', 'exec-03'].includes(m.id) || 
                    m.department.toLowerCase().includes('direction') || 
                    m.department.toLowerCase().includes('financière');
      } else if (selectedDepartment === 'terrain') {
        matchDept = m.department.toLowerCase().includes('surveillance') || 
                    m.department.toLowerCase().includes('patrouille') || 
                    m.role.toLowerCase().includes('éco-garde') || 
                    m.role.toLowerCase().includes('sentinelle') || 
                    m.role.toLowerCase().includes('patrouilleur');
      } else if (selectedDepartment === 'ecloserie') {
        matchDept = m.department.toLowerCase().includes('écloserie') || 
                    m.department.toLowerCase().includes('biométrie') || 
                    m.role.toLowerCase().includes('écloserie') || 
                    m.role.toLowerCase().includes('biométrie') || 
                    m.role.toLowerCase().includes('soins');
      } else if (selectedDepartment === 'mangroves') {
        matchDept = m.department.toLowerCase().includes('mangroves') || 
                    m.role.toLowerCase().includes('mangroves') || 
                    m.role.toLowerCase().includes('pépiniériste') || 
                    m.department.toLowerCase().includes('écosystèmes') ||
                    m.role.toLowerCase().includes('aviaire');
      } else if (selectedDepartment === 'salubrite') {
        matchDept = m.department.toLowerCase().includes('hygiène') || 
                    m.department.toLowerCase().includes('salubrité') || 
                    m.department.toLowerCase().includes('logistique') || 
                    m.role.toLowerCase().includes('salubrité') || 
                    m.role.toLowerCase().includes('sst') || 
                    m.role.toLowerCase().includes('transport') || 
                    m.role.toLowerCase().includes('maintenance');
      } else if (selectedDepartment === 'communication') {
        matchDept = m.department.toLowerCase().includes('sensibilisation') || 
                    m.department.toLowerCase().includes('communication') || 
                    m.role.toLowerCase().includes('sensibilisation') || 
                    m.role.toLowerCase().includes('jeunesse') || 
                    m.role.toLowerCase().includes('médiatrice');
      }

      return matchSearch && matchDept;
    });
  }, [members, searchMemberQuery, selectedDepartment]);

  // Quick switch to any member directly
  const handleQuickSwitchMember = (member: ExecutiveMember) => {
    onSetActiveMember(member);
    setCurrentTab('mon_espace');
    onLogAudit(
      member.name,
      member.role,
      'connexion',
      `Accès direct à l'espace de travail personnel (${member.role})`
    );
  };

  // Handle opening login modal for a member
  const handleOpenLogin = (member: ExecutiveMember) => {
    setMemberToLogin(member);
    setInputCode(member.accessCode);
    setInputPassword(member.password || '1234');
    setLoginError('');
  };

  // Handle member authentication
  const handleConfirmLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberToLogin) return;

    if (inputCode.trim().toUpperCase() !== memberToLogin.accessCode.trim().toUpperCase()) {
      setLoginError('Code statut incorrect. Veuillez vérifier votre identifiant d\'affectation.');
      return;
    }

    if (memberToLogin.password && inputPassword.trim() !== memberToLogin.password) {
      setLoginError('Mot de passe incorrect pour cet espace de travail.');
      return;
    }

    onSetActiveMember(memberToLogin);
    setMemberToLogin(null);
    setCurrentTab('mon_espace');
    onLogAudit(
      memberToLogin.name,
      memberToLogin.role,
      'connexion',
      `Accès réussi à l'espace de travail personnel (${memberToLogin.role})`
    );
  };

  // Handle logout
  const handleLogout = () => {
    if (activeMember) {
      onLogAudit(
        activeMember.name,
        activeMember.role,
        'connexion',
        `Déconnexion de l'espace de travail personnel`
      );
    }
    onSetActiveMember(null);
    setCurrentTab('annuaire_membres');
  };

  // Handle task status toggle
  const handleToggleTaskStatus = (taskId: string) => {
    if (!activeMember) return;
    const currentTasks = activeMember.assignedTasks || [];
    const updatedTasks = currentTasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'termine' ? 'a_faire' : t.status === 'en_cours' ? 'termine' : 'en_cours';
        return { ...t, status: nextStatus };
      }
      return t;
    });

    // Recalculate performance score based on tasks completed
    const completedCount = updatedTasks.filter(t => t.status === 'termine').length;
    const newScore = updatedTasks.length > 0 
      ? Math.round(75 + (completedCount / updatedTasks.length) * 25)
      : activeMember.performanceScore;

    const updatedMember: ExecutiveMember = {
      ...activeMember,
      assignedTasks: updatedTasks,
      performanceScore: newScore
    };

    onSetActiveMember(updatedMember);
    const updatedAll = members.map(m => m.id === activeMember.id ? updatedMember : m);
    onUpdateMembers(updatedAll);

    onLogAudit(
      activeMember.name,
      activeMember.role,
      'maj_projet',
      `Mise à jour de tâche dans le cahier de charges (Score recalculé: ${newScore}%)`
    );
  };

  // Handle adding a new task to active member
  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember || !newTaskTitle.trim()) return;

    const newTask: MemberAssignedTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      dueDate: newTaskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'a_faire',
      cahierDesChargesReference: newTaskRef.trim() || 'Activité de terrain assignée'
    };

    const updatedTasks = [...(activeMember.assignedTasks || []), newTask];
    const updatedMember: ExecutiveMember = {
      ...activeMember,
      assignedTasks: updatedTasks
    };

    onSetActiveMember(updatedMember);
    const updatedAll = members.map(m => m.id === activeMember.id ? updatedMember : m);
    onUpdateMembers(updatedAll);

    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskRef('');
    setShowAddTaskModal(false);

    onLogAudit(
      activeMember.name,
      activeMember.role,
      'maj_projet',
      `Ajout d'une nouvelle tâche au cahier de charges : "${newTask.title}"`
    );
  };

  // Handle submitting a task report to CPI and DE
  const handleSubmitTaskReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember || !reportTitle.trim() || !reportSummary.trim()) return;

    const newReport: MemberTaskReport = {
      id: `mrep-${Date.now()}`,
      memberId: activeMember.id,
      authorName: activeMember.name,
      authorRole: activeMember.role,
      dateSubmitted: new Date().toISOString().replace('T', ' ').substring(0, 16),
      title: reportTitle.trim(),
      summary: reportSummary.trim(),
      tasksCompleted: reportTasksDone.split('\n').map(s => s.trim()).filter(Boolean),
      fieldMetrics: {
        tortuesObservees: reportTurtles ? parseInt(reportTurtles) : undefined,
        nidsProteges: reportNests ? parseInt(reportNests) : undefined,
        oeufsTransferes: reportEggs ? parseInt(reportEggs) : undefined,
        bebesRelaches: reportHatchlings ? parseInt(reportHatchlings) : undefined,
        dechetsCollectesKg: reportWasteKg ? parseFloat(reportWasteKg) : undefined,
        personnesSensibilisees: reportSensitized ? parseInt(reportSensitized) : undefined,
      },
      logisticalNeedsReported: reportLogisticsNeeded.split('\n').map(s => s.trim()).filter(Boolean),
      status: 'transmis_cpi_de'
    };

    onAddMemberReport(newReport);

    // If logistical needs were reported, also create them in the logistics ledger!
    if (reportLogisticsNeeded.trim()) {
      const needs = reportLogisticsNeeded.split('\n').map(s => s.trim()).filter(Boolean);
      needs.forEach((need, idx) => {
        onAddLogisticalNeed({
          id: `log-from-rep-${Date.now()}-${idx}`,
          item: need,
          category: 'sauvetage_tortues',
          quantityNeeded: 1,
          unit: 'lot',
          urgency: 'haute',
          requestedBy: `${activeMember.name} (${activeMember.role})`,
          collectionLocation: 'Plage de Togbin Fandji',
          status: 'demande',
          dateReported: new Date().toISOString().split('T')[0],
          notes: `Signalé suite au rapport de mission : "${reportTitle.trim()}"`
        });
      });
    }

    // Update member reports count
    const updatedMember: ExecutiveMember = {
      ...activeMember,
      submittedReportsCount: (activeMember.submittedReportsCount || 0) + 1,
      performanceScore: Math.min(100, (activeMember.performanceScore || 85) + 2)
    };
    onSetActiveMember(updatedMember);
    const updatedAll = members.map(m => m.id === activeMember.id ? updatedMember : m);
    onUpdateMembers(updatedAll);

    onLogAudit(
      activeMember.name,
      activeMember.role,
      'validation_rapport',
      `Transmission du rapport de tâche "${reportTitle.trim()}" au CPI et au DE`
    );

    setReportSubmittedSuccess(true);
    setTimeout(() => {
      setReportTitle('');
      setReportSummary('');
      setReportTasksDone('');
      setReportTurtles('');
      setReportNests('');
      setReportEggs('');
      setReportHatchlings('');
      setReportWasteKg('');
      setReportSensitized('');
      setReportLogisticsNeeded('');
      setReportSubmittedSuccess(false);
    }, 2500);
  };

  // Handle adding logistical need manually
  const handleAddLogisticalNeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogItem.trim()) return;

    const newItem: LogisticalNeedItem = {
      id: `log-${Date.now()}`,
      item: newLogItem.trim(),
      category: newLogCat,
      quantityNeeded: parseFloat(newLogQty) || 1,
      unit: newLogUnit.trim() || 'unités',
      urgency: newLogUrgency,
      requestedBy: activeMember ? `${activeMember.name} (${activeMember.role})` : 'Équipe de patrouille Togbin',
      collectionLocation: newLogLocation.trim() || 'Plage de Togbin Fandji',
      status: 'demande',
      dateReported: new Date().toISOString().split('T')[0],
      notes: newLogNotes.trim() || 'Besoin logistique consécutif aux collectes nocturnes.'
    };

    onAddLogisticalNeed(newItem);
    setNewLogItem('');
    setNewLogNotes('');
    setShowAddLogModal(false);

    onLogAudit(
      activeMember ? activeMember.name : 'Éco-garde',
      activeMember ? activeMember.role : 'Terrain',
      'maj_projet',
      `Déclaration d'un besoin logistique post-collecte : "${newItem.item}" (${newItem.quantityNeeded} ${newItem.unit})`
    );
  };

  // Handle AI analysis of social media text to generate field action
  const handleAnalyzeSocialPostWithAi = () => {
    if (!rawSocialText.trim()) return;
    setIsAnalyzingAi(true);
    setAiPublishSuccess(false);

    setTimeout(() => {
      // Intelligent parser simulating automated AI extraction
      const text = rawSocialText;
      let detectedCategory: any = 'sauvetage_tortue';
      if (text.toLowerCase().includes('plastique') || text.toLowerCase().includes('nettoyage') || text.toLowerCase().includes('déchet')) {
        detectedCategory = 'assainissement_plage';
      } else if (text.toLowerCase().includes('lâcher') || text.toLowerCase().includes('nouveau-né') || text.toLowerCase().includes('bébé')) {
        detectedCategory = 'lacher_mer';
      } else if (text.toLowerCase().includes('bplp') || text.toLowerCase().includes('police')) {
        detectedCategory = 'action_conjointe_bplp';
      }

      // Extract numbers if present
      const eggMatch = text.match(/(\d+)\s*(œufs|oeufs|eggs)/i);
      const turtleMatch = text.match(/(\d+)\s*(tortues?|femelles?)/i);
      const kgMatch = text.match(/(\d+)\s*(kg|kilos)/i);

      const generatedAction: Partial<FieldActionPost> = {
        id: `action-social-ai-${Date.now()}`,
        title: `Collecte Réseaux Sociaux : ${text.slice(0, 60)}...`,
        category: detectedCategory,
        location: text.toLowerCase().includes('avlekete') ? 'Plage d\'Avlékété' : 'Plage de Togbin Fandji',
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        authorName: socialSourceType === 'facebook' ? 'Page Facebook AMSHARTE (Import IA)' : 'Sentinelle WhatsApp Communauté',
        authorRole: 'Cellule Médias & Modération IA',
        content: `Publication extraite et vérifiée depuis le canal officiel ${socialSourceType.toUpperCase()} :\n\n"${text.trim()}"\n\nTraitée et mise en conformité selon la charte éditoriale AMSHARTE.`,
        species: text.toLowerCase().includes('luth') ? 'Tortue Luth (Dermochelys coriacea)' : 'Tortue Olivâtre (Lepidochelys olivacea)',
        measurements: {
          eggsCount: eggMatch ? parseInt(eggMatch[1]) : undefined,
          weightKg: kgMatch ? parseInt(kgMatch[1]) : undefined,
        },
        imageUrls: [
          detectedCategory === 'assainissement_plage'
            ? "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1000&auto=format&fit=crop&q=80"
            : "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=1000&auto=format&fit=crop&q=80"
        ],
        likes: 1,
        stakeholderCommentsCount: 0,
        extractedIntoReport: false
      };

      setAiExtractedAction(generatedAction);
      setIsAnalyzingAi(false);
    }, 900);
  };

  // Publish AI extracted action to newsfeed
  const handlePublishAiAction = () => {
    if (!aiExtractedAction) return;
    onPublishActionToNewsfeed(aiExtractedAction as FieldActionPost);
    setAiPublishSuccess(true);
    onLogAudit(
      activeMember ? activeMember.name : "Cellule Médias",
      activeMember ? activeMember.role : "Communication",
      'media_import',
      `Publication automatique dans le fil d'actualité depuis le flux ${socialSourceType}`
    );
    setTimeout(() => {
      setAiExtractedAction(null);
      setRawSocialText('');
      setAiPublishSuccess(false);
    }, 2000);
  };

  // Automatic consolidation & sync with Public Dashboard (CPI / DE feature)
  const handleConsolidateAndSyncPublicDashboard = () => {
    // Calculate total using the full automated metrics engine from all 33 members, reports, and field operations
    const automated = calculateAutomatedImpactMetrics(fieldActions, memberReports, monthlyReports, members.length);

    const newMetrics: Partial<ImpactMetricsState> = {
      ...automated,
      lastSyncDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      validatedByDE: true,
      visaReference: `VISA-DE-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-CERTIFIE`
    };

    onSyncImpactMetrics(newMetrics);
    setSyncSuccessMessage('Indicateurs publics synchronisés avec succès depuis les données de terrain validées par le DE !');

    onLogAudit(
      activeMember?.name || "Directeur Exécutif (SONON Tchéhouéa)",
      activeMember?.role || "Direction",
      'validation_rapport',
      `Synchronisation automatique des indicateurs d'impact public (Visa: ${newMetrics.visaReference})`
    );

    setTimeout(() => setSyncSuccessMessage(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER BANNER: GOOGLE MEET PERMANENT & SOCIAL HUB & STATS */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-800/40 space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Espace de Travail &amp; Cockpit Opérationnel AMSHARTE
              </span>
              <span className="bg-teal-500/20 text-teal-200 text-xs px-2.5 py-0.5 rounded-full">
                {members.length} Membres
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Annuaire des Membres &amp; Pilotage des Cahiers des Charges
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consultez l'annuaire complet de l'ONG, les tableaux de bord de performance individuels et accédez à votre propre espace de travail pour exécuter vos tâches et transmettre vos comptes-rendus au CPI et au DE.
            </p>
          </div>

          {/* Quick Actions Header: Google Meet permanent button + Active Member status */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            {/* GOOGLE MEET PERMANENT ACCESS BUTTON (ACCESSIBLE TO ALL) */}
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex flex-col justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xs font-bold text-teal-200 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Salle Virtuelle AMSHARTE
                </span>
                <button
                  onClick={() => setShowMeetConfig(!showMeetConfig)}
                  title="Configurer le lien Google Meet"
                  className="text-slate-300 hover:text-white text-2xs cursor-pointer hover:underline"
                >
                  ⚙ Modifier
                </button>
              </div>

              <a
                href={meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <Video className="w-4 h-4" />
                <span>Rejoindre la Réunion Google Meet</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>

            {/* Active User Card with 33-Member Quick Selector */}
            <div className="bg-emerald-950/90 border border-emerald-500/50 p-3.5 rounded-2xl flex flex-col justify-between gap-2.5 min-w-[280px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xs text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Espace Actif ({members.length} Membres) :
                </span>
                {activeMember && (
                  <button
                    onClick={handleLogout}
                    title="Changer d'utilisateur / Déconnexion"
                    className="p-1 px-2 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition cursor-pointer text-2xs font-bold flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Déconnexion</span>
                  </button>
                )}
              </div>

              {/* Direct 33-Member Selector */}
              <div className="flex items-center gap-2.5">
                <img
                  src={activeMember ? activeMember.photo : members[0]?.photo}
                  alt={activeMember ? activeMember.name : "Membre"}
                  className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-400 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  {peutSuperviser ? (
                  <select
                    value={activeMember ? activeMember.id : ''}
                    onChange={(e) => {
                      const target = members.find(m => m.id === e.target.value);
                      if (target) handleQuickSwitchMember(target);
                    }}
                    className="w-full bg-slate-900 border border-emerald-500/60 rounded-lg text-white text-xs font-semibold px-2 py-1.5 focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                    title={`Basculer instantanément sur l'espace de n'importe lequel des ${members.length} membres`}
                  >
                    <option value="" disabled>Sélectionner un membre ({members.length})</option>
                    {members.map((m, idx) => (
                      <option key={m.id} value={m.id}>
                        N°{idx + 1} • {m.name} ({m.role.substring(0, 26)}...)
                      </option>
                    ))}
                  </select>
                  ) : (
                    <div className="w-full text-white text-xs font-semibold px-2 py-1.5 truncate">
                      {activeMember ? activeMember.name : ''}
                    </div>
                  )}
                  <div className="text-2xs text-emerald-300 font-medium truncate mt-0.5">
                    {activeMember ? `${activeMember.role}` : 'Sélectionnez un profil'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Meet URL Configuration Panel */}
        {showMeetConfig && (
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-center gap-3 text-xs">
            <label className="font-semibold text-slate-200 shrink-0">Lien Google Meet Permanent :</label>
            <input
              type="text"
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-white text-xs font-mono w-full sm:w-auto"
            />
            <button
              onClick={() => {
                setShowMeetConfig(false);
                onLogAudit(
                  activeMember ? activeMember.name : "Direction",
                  activeMember ? activeMember.role : "Coordination",
                  'modification_site',
                  `Mise à jour du lien permanent Google Meet: ${meetUrl}`
                );
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
            >
              Enregistrer
            </button>
          </div>
        )}

        {/* KPI Strip: Performance, 33 members, reports, logistics needs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-teal-800/50">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-2xs uppercase block font-medium">Effectif Total ONG</span>
            <span className="text-lg font-black text-white">{totalMembersCount} Membres</span>
            <span className="text-2xs text-emerald-400 block mt-0.5">{registeredDirectoryCount} fiches répertoriées</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-2xs uppercase block font-medium">Performance Moyenne</span>
            <span className="text-lg font-black text-emerald-400">{avgPerformance}%</span>
            <span className="text-2xs text-slate-400 block mt-0.5">Taux d'exécution global</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-2xs uppercase block font-medium">Rapports de Tâches Reçus</span>
            <span className="text-lg font-black text-teal-300">{totalReportsSubmitted}</span>
            <span className="text-2xs text-slate-400 block mt-0.5">Transmis au CPI &amp; DE</span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5">
            <span className="text-slate-400 text-2xs uppercase block font-medium">Besoins Logistiques</span>
            <span className="text-lg font-black text-amber-300">{logisticalNeeds.length}</span>
            <span className="text-2xs text-slate-400 block mt-0.5">Post-collectes déclarés</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS (DIRECTION EXÉCUTIVE AMSHARTE) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('annuaire_membres')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'annuaire_membres'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Annuaire ({members.length} Membres)</span>
          </button>

          <button
            onClick={() => setCurrentTab('cahiers_charges')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'cahiers_charges'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>Cahiers de Charges &amp; Rôles</span>
          </button>

          <button
            onClick={() => setCurrentTab('mon_espace')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'mon_espace'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-200" />
            <span>Mon Espace &amp; Dépôt Rapport {activeMember ? `(${activeMember.name.split(' ')[0]})` : ''}</span>
          </button>

          <button
            onClick={() => setCurrentTab('cockpit_cpi_de')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'cockpit_cpi_de'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Cockpit CPI/DE &amp; Tableau de Bord</span>
          </button>

          <button
            onClick={() => setCurrentTab('conseil_administration')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'conseil_administration'
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Landmark className="w-4 h-4 text-indigo-400" />
            <span>Conseil d'Administration</span>
          </button>

          <button
            onClick={() => setCurrentTab('webmastering_architecture')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'webmastering_architecture'
                ? 'bg-indigo-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Espace Webmastering, Architecture & Stratégie — Accès exclusif CPI & DE (délégation possible au Chargé de communication)"
          >
            <Globe className="w-4 h-4 text-indigo-300" />
            <span>Webmastering &amp; Architecture</span>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-bold">
              CPI/DE
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('logistique_collectes')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'logistique_collectes'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Besoins Logistiques Post-Collectes</span>
          </button>

          <button
            onClick={() => setCurrentTab('assistant_ia_social')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'assistant_ia_social'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>Assistant IA Social</span>
          </button>

          <button
            onClick={() => setCurrentTab('gestion_reseaux')}
            className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              currentTab === 'gestion_reseaux'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-4 h-4 text-blue-200" />
            <span>Hub Réseaux</span>
          </button>
        </div>

        <button
          onClick={onGoToPublicSite}
          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition whitespace-nowrap hidden md:flex items-center gap-1"
        >
          <span>Retour Site Public</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ACCUEIL & ANNUAIRE COMPLET DES MEMBRES DE L'ONG */}
      {/* ========================================================= */}
      {currentTab === 'annuaire_membres' && (
        <div className="space-y-6">
          {/* Controls: search and filter */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, rôle ou département..."
                value={searchMemberQuery}
                onChange={(e) => setSearchMemberQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs pb-1">
              <span className="text-slate-400 text-2xs font-bold uppercase shrink-0">Pôles ({filteredMembers.length}/33) :</span>
              {[
                { id: 'tous', label: `Tous les membres (${members.length})` },
                { id: 'direction', label: 'Direction & Bureau (4)' },
                { id: 'terrain', label: 'Patrouilles & Éco-gardes (14)' },
                { id: 'ecloserie', label: 'Écloserie & Biométrie (5)' },
                { id: 'mangroves', label: 'Mangroves & Écosystèmes (3)' },
                { id: 'salubrite', label: 'Salubrité & Logistique (4)' },
                { id: 'communication', label: 'Communication & Sensibilisation (3)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedDepartment(f.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition cursor-pointer ${
                    selectedDepartment === f.id
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Grid with Instant Performance Dashboards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((member) => {
              const tasks = member.assignedTasks || [];
              const completedTasks = tasks.filter(t => t.status === 'termine').length;
              const isCurrentActive = activeMember?.id === member.id;

              return (
                <div
                  key={member.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                    isCurrentActive
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Member Card Header with Photo and Identity */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <span 
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            member.status === 'disponible' ? 'bg-emerald-500' :
                            member.status === 'en_patrouille' ? 'bg-amber-500 animate-pulse' :
                            member.status === 'en_mission' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                          title={`Statut : ${member.status}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">
                            {member.accessCode}
                          </span>
                          <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                            member.status === 'en_patrouille' ? 'bg-amber-100 text-amber-800' :
                            member.status === 'disponible' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {member.status === 'en_patrouille' ? 'En patrouille' :
                             member.status === 'disponible' ? 'Disponible' :
                             member.status === 'en_mission' ? 'En mission' : 'En rédaction'}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5">
                          {member.name}
                        </h3>
                        <p className="text-xs text-emerald-700 font-semibold leading-tight mt-0.5">
                          {member.role}
                        </p>
                        <p className="text-2xs text-slate-500 truncate mt-0.5">
                          {member.department}
                        </p>
                      </div>
                    </div>

                    {/* DIRECT COMMUNICATION CHANNELS: PHONE, WHATSAPP, MEET */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-3 gap-1.5 text-center">
                      <a
                        href={`tel:${member.mobile || member.phone}`}
                        className="p-1.5 bg-white hover:bg-slate-100 rounded-lg text-slate-700 hover:text-slate-900 border border-slate-200 transition text-2xs font-semibold flex items-center justify-center gap-1"
                        title={`Appeler : ${member.phone}`}
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>Appel</span>
                      </a>

                      <a
                        href={`https://wa.me/${member.whatsapp}?text=Bonjour%20${encodeURIComponent(member.name)}%2C%20message%20de%20coordination%20AMSHARTE`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-800 border border-emerald-200 transition text-2xs font-semibold flex items-center justify-center gap-1"
                        title={`WhatsApp : ${member.whatsapp}`}
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={member.meetLink || meetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-teal-50 hover:bg-teal-100 rounded-lg text-teal-800 border border-teal-200 transition text-2xs font-semibold flex items-center justify-center gap-1"
                        title="Réunion Google Meet directe"
                      >
                        <Video className="w-3 h-3 text-teal-600" />
                        <span>Meet</span>
                      </a>
                    </div>

                    {/* INDIVIDUAL PERFORMANCE DASHBOARD (VISIBLE DIRECTLY ON CARD) */}
                    <div className="bg-gradient-to-r from-slate-50 to-emerald-50/40 p-3 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                          Performance &amp; Cahier des charges :
                        </span>
                        <span className="font-black text-emerald-700 text-sm">
                          {member.performanceScore}%
                        </span>
                      </div>

                      {/* Performance Progress bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${member.performanceScore}%` }}
                        />
                      </div>

                      {/* Mini stats counters */}
                      <div className="grid grid-cols-2 gap-2 text-2xs text-slate-600 pt-1">
                        <div className="bg-white p-1.5 rounded-md border border-slate-200 text-center">
                          <span className="text-slate-400 block">Tâches Réalisées</span>
                          <strong className="text-slate-800 font-bold">
                            {completedTasks} / {tasks.length}
                          </strong>
                        </div>
                        <div className="bg-white p-1.5 rounded-md border border-slate-200 text-center">
                          <span className="text-slate-400 block">Rapports au CPI/DE</span>
                          <strong className="text-emerald-700 font-bold">
                            {member.submittedReportsCount || 0} transmis
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Link to Cahier de Charges & Rôles */}
                    <div className="pt-2">
                      <button
                        onClick={() => setCurrentTab('cahiers_charges')}
                        className="w-full py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-2xs font-bold border border-blue-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Consulter le cahier des charges et rôle officiel"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Consulter Cahier de charges &amp; Rôles</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Action Buttons: Direct 1-Click Access or Secure Code Auth */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    {isCurrentActive ? (
                      <div className="w-full flex items-center justify-between gap-2">
                        <span className="text-2xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Espace Actif</span>
                        </span>
                        <button
                          onClick={() => setCurrentTab('mon_espace')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Voir mes tâches</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => handleQuickSwitchMember(member)}
                          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                          title="Accès immédiat sans mot de passe (mode travail)"
                        >
                          <span>⚡ Accéder</span>
                        </button>

                        <button
                          onClick={() => handleOpenLogin(member)}
                          className="py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Connexion formelle avec code statut & mot de passe"
                        >
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">Code</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: CAHIERS DE CHARGES ET RÔLES OFFICIELS DE L'ÉQUIPE   */}
      {/* ========================================================= */}
      {currentTab === 'cahiers_charges' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-400/20 text-blue-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    Gouvernance &amp; Organisation
                  </span>
                  <span className="text-2xs text-slate-300">
                    Direction Exécutive AMSHARTE
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Cahiers de Charges &amp; Rôles Officiels des Postes
                </h2>
                <p className="text-xs text-blue-200 max-w-2xl">
                  Consultez les attributions statutaires, fiches de postes, notes de service et indicateurs de performance de chaque responsable et département opérationnel.
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('annuaire_membres')}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4 text-blue-300" />
                <span>Retour Annuaire</span>
              </button>
            </div>
          </div>

          <JobDescriptionsView posts={posts} />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MON ESPACE DE TRAVAIL PERSONNEL (ACTIVE MEMBER)   */}
      {/* ========================================================= */}
      {currentTab === 'mon_espace' && activeMember && (
        <div className="space-y-6">
          {/* Member Banner with quick stats */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <img
                  src={activeMember.photo}
                  alt={activeMember.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-2xs font-bold px-2.5 py-0.5 rounded-full">
                      Session Active
                    </span>
                    <span className="font-mono text-xs text-slate-500">{activeMember.accessCode}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Espace de Travail de {activeMember.name}
                  </h2>
                  <p className="text-xs text-emerald-700 font-semibold">
                    {activeMember.role} — {activeMember.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ajouter une Tâche</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Quitter mon Espace</span>
                </button>
              </div>
            </div>

            {/* Performance gauge and tasks list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Tasks and Cahier des Charges */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck2 className="w-5 h-5 text-emerald-600" />
                      <span>Mon Cahier des Charges &amp; Mes Tâches</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cochez chaque tâche exécutée pour actualiser automatiquement votre performance.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {(activeMember.assignedTasks || []).filter(t => t.status === 'termine').length} / {(activeMember.assignedTasks || []).length} terminées
                  </span>
                </div>

                <div className="space-y-3">
                  {(activeMember.assignedTasks || []).map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                        task.status === 'termine'
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                          : task.status === 'en_cours'
                          ? 'bg-amber-50/50 border-amber-200 text-slate-800'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => handleToggleTaskStatus(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                            task.status === 'termine'
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : task.status === 'en_cours'
                              ? 'bg-amber-500 border-amber-500 text-white'
                              : 'bg-white border-slate-300 hover:border-emerald-500'
                          }`}
                          title="Cliquer pour changer le statut (À faire / En cours / Terminé)"
                        >
                          {task.status === 'termine' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          {task.status === 'en_cours' && <Clock className="w-3.5 h-3.5" />}
                        </button>

                        <div className="space-y-1">
                          <p className={`text-xs sm:text-sm font-semibold leading-snug ${
                            task.status === 'termine' ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 text-2xs text-slate-500 flex-wrap">
                            <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">
                              {task.cahierDesChargesReference}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              Échéance : {task.dueDate}
                            </span>
                            <span>•</span>
                            <span className={`font-bold ${
                              task.status === 'termine' ? 'text-emerald-700' :
                              task.status === 'en_cours' ? 'text-amber-700' : 'text-slate-500'
                            }`}>
                              {task.status === 'termine' ? 'Terminé' :
                               task.status === 'en_cours' ? 'En cours d\'exécution' : 'À faire'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="text-2xs font-bold text-slate-400 hover:text-slate-700 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition cursor-pointer shrink-0"
                      >
                        Basculer statut
                      </button>
                    </div>
                  ))}

                  {(activeMember.assignedTasks || []).length === 0 && (
                    <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      Aucune tâche assignée pour le moment. Utilisez le bouton « Ajouter une Tâche ».
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Performance Gauge & Direct Transmit Form Info */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white">Indicateur de Performance</h4>
                    <span className="text-2xs bg-emerald-500/30 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Temps Réel
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-4xl font-black text-emerald-400 tracking-tight">
                      {activeMember.performanceScore}%
                    </div>
                    <p className="text-2xs text-slate-300 mt-1">
                      Calculé selon l'exécution de vos tâches et la régularité de vos rapports de mission.
                    </p>
                  </div>

                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${activeMember.performanceScore}%` }}
                    />
                  </div>

                  <div className="border-t border-emerald-800/60 pt-3 text-2xs text-slate-300 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Rapports transmis au CPI/DE :</span>
                      <strong className="text-white">{activeMember.submittedReportsCount || 0}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Règle J+10 respectée :</span>
                      <strong className="text-emerald-400">100% Conforme</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-teal-600" />
                    <span>Circuit de Transmission Officiel :</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-2xs">
                    Chaque rapport que vous transmettez ci-dessous est instantanément notifié et archivé dans l'Espace du <strong>Chargé de Programmes (CPI Henri D. FATCHINA)</strong> et du <strong>Directeur Exécutif (SONON Tchéhouéa)</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FORM: TRANSMIT TASK REPORT TO CPI & DE */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600" />
                  <span>Rédiger &amp; Transmettre un Résumé / Rapport de Tâche au CPI et au DE</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Les données transmises seront exploitées par le CPI pour présenter les rapports mensuels J+10 et le rapport annuel à bonne date.
                </p>
              </div>

              {reportSubmittedSuccess && (
                <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rapport transmis avec succès au CPI et au DE !
                </span>
              )}
            </div>

            <form onSubmit={handleSubmitTaskReport} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Titre de la mission ou de l'activité *
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Ex : Patrouille nocturne Togbin Plage Est & Sauvegarde de 115 œufs"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Résumé exécutif &amp; Constats de terrain *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  placeholder="Décrivez les conditions de la mission, l'état de la plage, les interventions menées, la présence des pêcheurs ou des forces de sécurité..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>

              {/* Quantitative indicators collected */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-3">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Données Quantitatives Collectées (Alimentera le Tableau de bord Public après validation)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className="block text-2xs text-slate-600 mb-1">Tortues assistées</label>
                    <input
                      type="number"
                      value={reportTurtles}
                      onChange={(e) => setReportTurtles(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-slate-600 mb-1">Nids sécurisés</label>
                    <input
                      type="number"
                      value={reportNests}
                      onChange={(e) => setReportNests(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-slate-600 mb-1">Œufs transférés</label>
                    <input
                      type="number"
                      value={reportEggs}
                      onChange={(e) => setReportEggs(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-slate-600 mb-1">Bébés relâchés</label>
                    <input
                      type="number"
                      value={reportHatchlings}
                      onChange={(e) => setReportHatchlings(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-slate-600 mb-1">Plastiques (kg)</label>
                    <input
                      type="number"
                      value={reportWasteKg}
                      onChange={(e) => setReportWasteKg(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs text-slate-600 mb-1">Sensibilisés</label>
                    <input
                      type="number"
                      value={reportSensitized}
                      onChange={(e) => setReportSensitized(e.target.value)}
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Post-collection Logistical Needs Section */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-700" />
                    <span>Besoins Logistiques Constatés Après Collecte (Optionnel)</span>
                  </label>
                  <span className="text-2xs text-amber-800 font-medium">
                    1 besoin par ligne
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={reportLogisticsNeeded}
                  onChange={(e) => setReportLogisticsNeeded(e.target.value)}
                  placeholder="Ex : Besoin de 2 caisses de contention isothermes pour transport sans heurt&#10;Besoin de 5 torches étanches à faisceau rouge pour patrouille nocturne"
                  className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmettre au CPI &amp; au DE</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: COCKPIT DU CPI ET DU DE (SYNTHÈSE & SYNC PUBLIC)   */}
      {/* ========================================================= */}
      {currentTab === 'cockpit_cpi_de' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400/20 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    Gouvernance &amp; Rapports J+10
                  </span>
                  <span className="text-2xs text-slate-300">
                    CPI Henri D. FATCHINA &amp; DE SONON Tchéhouéa
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Boîte de Réception des Tâches &amp; Consolidation des Rapports
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Le CPI exploite l'ensemble des données remontées par les 33 membres pour présenter le rapport mensuel et annuel à bonne date. Le DE appose son visa avant la synchronisation automatique vers le Tableau de Bord Public.
                </p>
              </div>

              {/* Automatic Sync Trigger Button */}
              <button
                onClick={handleConsolidateAndSyncPublicDashboard}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Compiler &amp; Synchroniser vers le Site Public</span>
              </button>
            </div>

            {syncSuccessMessage && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-xs font-bold text-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{syncSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Synchronized Impact Status Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  État Actuel des Indicateurs d'Impact Publics Synchronisés
                </h3>
                <p className="text-xs text-slate-500">
                  Dernière synchronisation certifiée le {impactMetrics.lastSyncDate} (Visa officiel DE : {impactMetrics.visaReference})
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                ✓ En Ligne sur la Vitrine Publique
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-2xs text-slate-500 uppercase block font-semibold">Tortues Sauvées</span>
                <span className="text-xl font-black text-slate-900">{impactMetrics.turtlesRescued}</span>
                <span className="text-2xs text-emerald-600 block">Sur le littoral béninois</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-2xs text-slate-500 uppercase block font-semibold">Nids Sécurisés</span>
                <span className="text-xl font-black text-slate-900">{impactMetrics.nestsProtected}</span>
                <span className="text-2xs text-emerald-600 block">Écloserie &amp; Dunes Togbin</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-2xs text-slate-500 uppercase block font-semibold">Nouveau-nés Relâchés</span>
                <span className="text-xl font-black text-slate-900">{impactMetrics.hatchlingsReleased.toLocaleString()}</span>
                <span className="text-2xs text-emerald-600 block">Retournés à l'Atlantique</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-2xs text-slate-500 uppercase block font-semibold">Plastiques Collectés</span>
                <span className="text-xl font-black text-slate-900">{impactMetrics.plasticWasteKg.toLocaleString()} kg</span>
                <span className="text-2xs text-emerald-600 block">Opérations Ayi Dji Ni Min</span>
              </div>
            </div>
          </div>

          {/* TABLEAU DE BORD PRIVÉ DU CHARGÉ DE PROGRAMMES (CPI) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-black text-slate-900">
                    Tableau de Bord Stratégique du CPI (Suivi des Projets &amp; Règle J+10)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisation opérationnelle des projets P1 (Tortues) et P2 (Mangroves), engagement budgétaire et contrôle des échéances.
                </p>
              </div>
              <span className="text-2xs font-bold bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full">
                Pilotage Opérationnel CPI Henri D. FATCHINA
              </span>
            </div>

            {/* Project Progress Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Projet 1: Tortues Marines */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-2xs font-black px-2 py-0.5 rounded">P1</span>
                    <h4 className="font-bold text-slate-900 text-sm">Sauvegarde Tortues Marines (Togbin-Fandji)</h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                    78% Exécuté
                  </span>
                </div>
                <p className="text-2xs text-slate-600">
                  Zone d'intervention : Littoral de Togbin Fandji à Avlékété. Patrouilles nocturnes 7j/7, protection des écloseries et relâcher en mer.
                </p>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78%' }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-2xs pt-1">
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">Nids transférés</span>
                    <strong className="text-emerald-800 font-black text-sm">{impactMetrics.nestsProtected} / 300</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">Éclosions</span>
                    <strong className="text-emerald-800 font-black text-sm">{impactMetrics.hatchlingsReleased}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block">Budget Alloué</span>
                    <strong className="text-slate-800 font-black text-xs">12 500 000 FCFA</strong>
                  </div>
                </div>
              </div>

              {/* Projet 2: Mangroves */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/50 to-blue-50/50 border border-teal-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-600 text-white text-2xs font-black px-2 py-0.5 rounded">P2</span>
                    <h4 className="font-bold text-slate-900 text-sm">Restauration des Écosystèmes de Mangroves</h4>
                  </div>
                  <span className="text-xs font-black text-teal-700 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                    62% Exécuté
                  </span>
                </div>
                <p className="text-2xs text-slate-600">
                  Zone d'intervention : Chenal de Togbin &amp; Bouche du Roy. Reboisement de palétuviers rouges, pépinières et sensibilisation des riverains.
                </p>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: '62%' }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-2xs pt-1">
                  <div className="bg-white p-2 rounded-lg border border-teal-100">
                    <span className="text-slate-500 block">Propagules plantés</span>
                    <strong className="text-teal-800 font-black text-sm">18 500</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-teal-100">
                    <span className="text-slate-500 block">Superficie</span>
                    <strong className="text-teal-800 font-black text-sm">14,5 ha</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-teal-100">
                    <span className="text-slate-500 block">Budget Alloué</span>
                    <strong className="text-slate-800 font-black text-xs">8 200 000 FCFA</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Reports Compliance J+10 Strip */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Calendrier de Transmission des Rapports Mensuels (Règle d'or J+10)
                  </h4>
                </div>
                <span className="text-2xs text-slate-500">Délai statutaire : au plus tard le 10 du mois M+1</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-2xs font-semibold text-slate-500 block">Rapport Mensuel Juillet 2026</span>
                    <strong className="text-xs text-slate-900">Transmis le 08/08/2026</strong>
                  </div>
                  <span className="text-2xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ✓ Validé DE
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-2xs font-semibold text-slate-500 block">Rapport Mensuel Août 2026</span>
                    <strong className="text-xs text-slate-900">Transmis le 07/09/2026</strong>
                  </div>
                  <span className="text-2xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    ✓ Validé DE
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-300 flex items-center justify-between">
                  <div>
                    <span className="text-2xs font-semibold text-slate-500 block">Rapport Mensuel Septembre 2026</span>
                    <strong className="text-xs text-amber-900">Échéance : 10 Octobre 2026</strong>
                  </div>
                  <span className="text-2xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    En consolidation (J-22)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inbox of Submitted Task Reports from Members */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Résumés et Rapports de Tâches Transmis par l'Équipe ({memberReports.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Rapports de terrain soumis au CPI et au DE pour examen, validation et intégration mensuelle J+10.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {memberReports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-2xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {rep.dateSubmitted}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                        {rep.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Par <strong>{rep.authorName}</strong> ({rep.authorRole})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        rep.status === 'integre_rapport_mensuel'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status === 'integre_rapport_mensuel' ? 'Intégré au Rapport Mensuel' : 'Reçu (En attente visa)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {rep.summary}
                  </p>

                  {/* Quantitative metrics */}
                  <div className="flex flex-wrap gap-2 text-2xs">
                    {rep.fieldMetrics.tortuesObservees !== undefined && (
                      <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-semibold text-slate-800">
                        🐢 {rep.fieldMetrics.tortuesObservees} Tortues
                      </span>
                    )}
                    {rep.fieldMetrics.nidsProteges !== undefined && (
                      <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-semibold text-slate-800">
                        🪺 {rep.fieldMetrics.nidsProteges} Nids protégés
                      </span>
                    )}
                    {rep.fieldMetrics.oeufsTransferes !== undefined && (
                      <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-semibold text-slate-800">
                        🥚 {rep.fieldMetrics.oeufsTransferes} Œufs transférés
                      </span>
                    )}
                    {rep.fieldMetrics.bebesRelaches !== undefined && (
                      <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-semibold text-slate-800">
                        🌊 {rep.fieldMetrics.bebesRelaches} Nouveaux-nés
                      </span>
                    )}
                    {rep.fieldMetrics.dechetsCollectesKg !== undefined && (
                      <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-semibold text-slate-800">
                        ♻ {rep.fieldMetrics.dechetsCollectesKg} kg Plastiques
                      </span>
                    )}
                  </div>

                  {/* Logistical needs attached */}
                  {rep.logisticalNeedsReported && rep.logisticalNeedsReported.length > 0 && (
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-2xs text-amber-900 space-y-1">
                      <strong>Besoins logistiques signalés après cette collecte :</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {rep.logisticalNeedsReported.map((need, i) => (
                          <li key={i}>{need}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Visa and CPI notes */}
                  {rep.cpiNotes && (
                    <div className="text-2xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <strong>Visa &amp; Note du CPI :</strong> {rep.cpiNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Liaison Institutionnelle : Conseil d'Administration (Loi 2025-19) */}
          <div className="pt-6 border-t border-slate-200">
            <div className="bg-gradient-to-r from-indigo-900/5 via-slate-50 to-indigo-900/10 p-5 rounded-2xl border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <Landmark className="w-5 h-5 text-indigo-600 shrink-0" />
                  <span>Conseil d'Administration (Organe Délibérant &amp; Surveillance)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Présidence de Mme Philomène AKPODJI • Registre officiel des 6 administrateurs, délibérations statutaires, quitus financiers et PV de sessions.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('conseil_administration')}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Accéder au Conseil d'Administration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: WEBMASTERING & ARCHITECTURE STRATÉGIQUE (CPI & DE)   */}
      {/* ========================================================= */}
      {currentTab === 'webmastering_architecture' && (
        <div className="space-y-6">
          {/* ACCESS VERIFICATION BARRIER */}
          {!hasWebmasterAccess ? (
            <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-sm space-y-6 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">
                  Accès Réservé au Webmastering &amp; Architecture
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cet espace de travail est <strong>exclusivement réservé au Chargé de Programmes par Intérim (CPI Henri D. FATCHINA)</strong> et au <strong>Directeur Exécutif (SONON Tchéhouéa)</strong>.
                </p>
                <p className="text-2xs text-slate-500">
                  Toutefois, une délégation opérationnelle peut être accordée au <strong>Chargé du Site Web (M. Landry)</strong> et au <strong>Chargé à la Communication (M. Christian SESSOU)</strong>, sous la supervision du CPI et du DE, pour publier les contenus validés.
                </p>
              </div>

              <p className="text-2xs text-slate-500 pt-4 border-t border-slate-100">
                Pour obtenir une délégation, adressez-vous au CPI ou au Directeur Exécutif.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Webmaster Authorized Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-400/20 text-indigo-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                        Espace Webmastering Exclusif CPI &amp; DE
                      </span>
                      {isDelegatedUser && !isCpiOrDe && (
                        <span className="bg-amber-400/20 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full">
                          ✓ Accès Délégué au Chargé de Com
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Espace de Travail Webmaster, Architecture &amp; Stratégie
                    </h2>
                    <p className="text-xs text-indigo-200 max-w-2xl">
                      Centre unique de pilotage technique : administration de la médiathèque officielle, mise à jour des documents, stratégie des outils numériques et délégation de maintenance.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadRoadmap}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger Guide Stratégique (.txt)</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab Navigation inside Webmastering */}
                <div className="flex items-center gap-2 pt-2 border-t border-indigo-900/60 overflow-x-auto text-xs">
                  <button
                    onClick={() => setWebmasterSubTab('architecture_strategie')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      webmasterSubTab === 'architecture_strategie'
                        ? 'bg-white text-indigo-950 shadow-sm'
                        : 'text-indigo-200 hover:bg-white/10'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5" />
                    <span>1. Architecture &amp; Stratégie Opérationnelle</span>
                  </button>

                  <button
                    onClick={() => setWebmasterSubTab('mediatheque_documents')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      webmasterSubTab === 'mediatheque_documents'
                        ? 'bg-white text-indigo-950 shadow-sm'
                        : 'text-indigo-200 hover:bg-white/10'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>2. Médiathèque &amp; Mises à Jour du Site</span>
                  </button>

                  <button
                    onClick={() => setWebmasterSubTab('delegation_site')}
                    className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      webmasterSubTab === 'delegation_site'
                        ? 'bg-white text-indigo-950 shadow-sm'
                        : 'text-indigo-200 hover:bg-white/10'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>3. Délégation des Droits de Mise à Jour</span>
                  </button>
                </div>
              </div>

              {/* SUB-SECTION 1: ARCHITECTURE & STRATÉGIE OPÉRATIONNELLE */}
              {webmasterSubTab === 'architecture_strategie' && (
                <div className="space-y-6">
                  {/* Google Sites Phasing Out Notice */}
                  <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Clarification Importante sur l'Ancien Google Sites :</strong>
                      <span>
                        L'ancien Google Sites autonome a été <strong>définitivement absorbé et remplacé</strong> par cette présente application unifiée. Toutes les mises à jour publiques, documents de formation, rapports et actes sont désormais gérés directement à partir de cet espace webmaster afin de supprimer les doublons et de garantir l'exclusivité d'accès au CPI et au DE.
                      </span>
                    </div>
                  </div>

                  {/* The 3 Pillars of AMSHARTE Digital Architecture */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pillar 1: Google Workspace */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                        1
                      </div>
                      <h4 className="font-black text-slate-900 text-base">Google Workspace</h4>
                      <span className="inline-block text-2xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        100% Gratuit (Google for Nonprofits)
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Gestion documentaire partagée dans Google Drive avec 5 dossiers stricts (DE, CPI, Finances, Com, Bailleurs). Formulaires Google Forms pour les patrouilles hors-ligne.
                      </p>
                    </div>

                    {/* Pillar 2: Dolibarr */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                        2
                      </div>
                      <h4 className="font-black text-slate-900 text-base">Dolibarr ERP/CRM</h4>
                      <span className="inline-block text-2xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Open-Source &amp; Auto-hébergé
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Conformité comptable SYSCOHADA pour les audits des bailleurs (PTF). Suivi analytique des dépenses des projets P1 et P2, gestion des adhérents et caisses d'avances.
                      </p>
                    </div>

                    {/* Pillar 3: Portail Unifié */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-black">
                        3
                      </div>
                      <h4 className="font-black text-slate-900 text-base">Portail Unifié AMSHARTE</h4>
                      <span className="inline-block text-2xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                        Le Présent Système Certifié
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Cockpit CPI/DE, synchronisation publique infalsifiable, règle d'or J+10, médiathèque officielle et annuaire dynamique des 33 membres.
                      </p>
                    </div>
                  </div>

                  {/* Strategic Guidance Response */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-600" />
                      <span>Recommandation Officielle : &quot;Quel outil me permettrait de gérer au mieux cette ONG ?&quot;</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Pour une ONG de conservation marine comme AMSHARTE avec 33 membres et des obligations de reddition de comptes strictes envers les Partenaires Techniques et Financiers (PTF), aucun outil unique ne suffit. La synergie éprouvée repose sur l&apos;articulation entre <strong>Google Workspace</strong> (terrain &amp; documents), <strong>Dolibarr</strong> (conformité légale &amp; finances) et ce <strong>Portail Numérique</strong> (gouvernance, transparence &amp; vitrine).
                    </p>
                  </div>
                </div>
              )}

              {/* SUB-SECTION 2: MÉDIATHÈQUE & GESTION DES DOCUMENTS OFFICIELS */}
              {webmasterSubTab === 'mediatheque_documents' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl text-xs text-indigo-900 flex items-center justify-between">
                    <div>
                      <strong className="block font-bold">Mises à Jour en Direct de la Vitrine Publique :</strong>
                      <span>Tout document ajouté, modifié ou supprimé ici se répercute instantanément dans la Médiathèque Publique du site.</span>
                    </div>
                  </div>

                  {/* Embed WebmasteringDocumentsView */}
                  <WebmasteringDocumentsView
                    documents={officialDocuments}
                    onAddDocument={(doc) => {
                      if (onAddOfficialDocument) onAddOfficialDocument(doc);
                      onLogAudit(activeMember?.name || 'Webmaster', activeMember?.role || 'Direction', 'ajout_document', `Ajout document officiel : ${doc.title}`);
                    }}
                    onUpdateDocument={(doc) => {
                      if (onUpdateOfficialDocument) onUpdateOfficialDocument(doc);
                      onLogAudit(activeMember?.name || 'Webmaster', activeMember?.role || 'Direction', 'modification_site', `Mise à jour document officiel : ${doc.title}`);
                    }}
                    onDeleteDocument={(id) => {
                      if (onDeleteOfficialDocument) onDeleteOfficialDocument(id);
                      onLogAudit(activeMember?.name || 'Webmaster', activeMember?.role || 'Direction', 'suppression_document', `Suppression document officiel ID : ${id}`);
                    }}
                    currentMember={activeMember || undefined}
                    onNotify={onNotify}
                  />
                </div>
              )}

              {/* SUB-SECTION 3: DÉLÉGATION DE MAINTENANCE DU SITE */}
              {webmasterSubTab === 'delegation_site' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-600" />
                      <span>Délégation Officielle des Droits de Mise à Jour du Portail</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Le Directeur Exécutif ou le CPI peut habiliter formellement le Chargé de Communication ou un autre cadre à opérer les mises à jour courantes du site.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="block text-sm font-bold text-slate-900">
                          Statut Actuel de la Délégation
                        </strong>
                        <span className="text-xs text-slate-500">
                          Permet au délégataire d'accéder au module Webmastering et de publier sur le site.
                        </span>
                      </div>

                      <button
                        onClick={() => setIsDelegationActive(!isDelegationActive)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                          isDelegationActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isDelegationActive ? 'Délégation Active' : 'Délégation Révoquée'}</span>
                      </button>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Membre Bénéficiaire de la Délégation :
                        </label>
                        <select
                          value={delegatedMemberId}
                          onChange={(e) => setDelegatedMemberId(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium"
                        >
                          {members.map(m => (
                            <option key={m.id} value={m.id}>
                              {m.name} — {m.role}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Périmètre Autorisé par le DE / CPI :
                        </label>
                        <div className="space-y-1.5 text-2xs text-slate-600 pt-1">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                            <span>Médiathèque (ajout de rapports et documents de formation)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                            <span>Assistant IA et publication sur les réseaux sociaux</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                            <span>Mise à jour des photos et communiqués de presse</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: BESOINS LOGISTIQUES POST-COLLECTES                 */}
      {/* ========================================================= */}
      {currentTab === 'logistique_collectes' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="bg-white/20 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                  Équipements &amp; Matériel Terrain
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Gestion des Besoins Logistiques Post-Collectes
                </h2>
                <p className="text-xs text-amber-100 max-w-2xl mt-1">
                  Après chaque collecte nocturne ou opération de salubrité, l'équipe inventorie ses besoins matériels (caisses isothermes, pesons biométriques, torches infrarouges, balais et sacs de collecte).
                </p>
              </div>

              <button
                onClick={() => setShowAddLogModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-amber-100 text-amber-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-amber-700" />
                <span>Déclarer un Besoin Post-Collecte</span>
              </button>
            </div>
          </div>

          {/* Logistical Needs List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logisticalNeeds.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                      item.urgency === 'critique' ? 'bg-rose-100 text-rose-800' :
                      item.urgency === 'haute' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Urgence : {item.urgency.toUpperCase()}
                    </span>

                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'dote' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'valide_de' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'approuve_cpi' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {item.status === 'dote' ? '✓ Matériel Doté' :
                       item.status === 'valide_de' ? 'Validé par le DE' :
                       item.status === 'approuve_cpi' ? 'Approuvé par CPI' : 'En attente d\'arbitrage'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {item.item}
                  </h4>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span>Quantité requise :</span>
                      <strong className="text-slate-800">{item.quantityNeeded} {item.unit}</strong>
                    </div>
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span>Lieu de collecte concerné :</span>
                      <strong className="text-slate-800">{item.collectionLocation}</strong>
                    </div>
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span>Demandé par :</span>
                      <strong className="text-slate-800">{item.requestedBy}</strong>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-2xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {item.notes}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400">
                  <span>Déclaré le {item.dateReported}</span>
                  <div className="flex items-center gap-1.5">
                    {item.status !== 'dote' && (
                      <button
                        onClick={() => {
                          const nextStatus = item.status === 'demande' ? 'approuve_cpi' : item.status === 'approuve_cpi' ? 'valide_de' : 'dote';
                          onUpdateLogisticalNeed({ ...item, status: nextStatus });
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded cursor-pointer"
                      >
                        Avancer statut
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: ASSISTANT IA DE COLLECTE RÉSEAUX SOCIAUX           */}
      {/* ========================================================= */}
      {currentTab === 'assistant_ia_social' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
            <div className="space-y-2">
              <span className="bg-purple-500/20 text-purple-200 font-bold text-xs px-2.5 py-0.5 rounded-full border border-purple-400/30">
                Intelligence Artificielle &amp; Automatisation
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Collecte Automatique depuis les Réseaux Sociaux vers le Fil d'Actualité
              </h2>
              <p className="text-xs text-purple-200 max-w-2xl leading-relaxed">
                Collez un message brut d'une communauté WhatsApp, un texte de post Facebook ou une alerte terrain. L'IA extrait instantanément les informations clés, les biométries et formate une publication prête à être mise en ligne.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Texte brut du Réseau Social ou Alerte</span>
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Source :</span>
                {[
                  { id: 'whatsapp', label: 'Communauté WhatsApp' },
                  { id: 'facebook', label: 'Page Facebook' },
                  { id: 'autre', label: 'SMS / Alerte Pêcheurs' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSocialSourceType(s.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                      socialSourceType === s.id
                        ? 'bg-purple-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <textarea
                rows={7}
                value={rawSocialText}
                onChange={(e) => setRawSocialText(e.target.value)}
                placeholder="Ex : [ALERTE TOGBIN PLAGE] Bonsoir les amis d'Amsharte ! Les pêcheurs de Togbin Fandji viennent de trouver une grande tortue olivâtre montée pondre près de l'embarcadère. On a sécurisé 112 œufs avant la marée haute et la BPLP est avec nous. On demande à l'équipe de venir pour le marquage et le transfert !"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setRawSocialText(
                      "[POST FACEBOOK AMSHARTE] Grande opération d'assainissement Ayi Dji Ni Min ce matin à Togbin Plage ! Plus de 40 villageois et pêcheurs mobilisés. Résultat : 280 kg de débris plastiques et filets fantômes évacués pour protéger les nids de tortues de mer."
                    );
                    setSocialSourceType('facebook');
                  }}
                  className="text-2xs text-purple-700 font-semibold hover:underline cursor-pointer"
                >
                  Insérer un exemple de test
                </button>

                <button
                  type="button"
                  disabled={!rawSocialText.trim() || isAnalyzingAi}
                  onClick={handleAnalyzeSocialPostWithAi}
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAnalyzingAi ? 'Analyse par IA en cours...' : 'Structurer avec l\'IA'}</span>
                </button>
              </div>
            </div>

            {/* AI Output Preview and Publish Button */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Publication Générée Prête pour le Fil d'Actualité</span>
                  </h3>
                  {aiPublishSuccess && (
                    <span className="bg-emerald-100 text-emerald-800 text-2xs font-bold px-2 py-0.5 rounded-full">
                      ✓ Publié dans le fil !
                    </span>
                  )}
                </div>

                {aiExtractedAction ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-2xs text-slate-500">
                      <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                        Catégorie : {aiExtractedAction.category}
                      </span>
                      <span>Lieu : {aiExtractedAction.location}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      {aiExtractedAction.title}
                    </h4>

                    <p className="text-slate-700 whitespace-pre-line text-xs">
                      {aiExtractedAction.content}
                    </p>

                    {aiExtractedAction.measurements?.eggsCount && (
                      <div className="text-2xs font-bold text-amber-700 bg-amber-50 p-2 rounded">
                        Donnée extraite : {aiExtractedAction.measurements.eggsCount} œufs protégés
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                    Collez votre texte à gauche et cliquez sur « Structurer avec l'IA » pour voir la prévisualisation.
                  </div>
                )}
              </div>

              {aiExtractedAction && (
                <button
                  type="button"
                  onClick={handlePublishAiAction}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publier dans le Fil d'Actualité Public</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: GESTION & CONFIGURATION DES RÉSEAUX PERMANENTS     */}
      {/* ========================================================= */}
      {currentTab === 'gestion_reseaux' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="bg-white/20 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                  Visibilité &amp; Liens Permanents
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Hub des Réseaux Sociaux Permanents AMSHARTE
                </h2>
                <p className="text-xs text-blue-100 max-w-2xl mt-1">
                  Tous les boutons de réseaux sociaux ouvrent directement la page de l'ONG dans un nouvel onglet. Vous pouvez ajouter de nouveaux canaux selon l'évolution de la communication.
                </p>
              </div>

              <button
                onClick={() => setShowAddChannelModal(true)}
                className="px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-blue-700" />
                <span>Ajouter un Réseau Social</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialChannels.map((chan) => (
              <div
                key={chan.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-4 hover:shadow-md transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: chan.color }}
                    />
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                      {chan.name}
                    </h4>
                    {chan.badgeLabel && (
                      <span className="bg-slate-100 text-slate-700 text-2xs font-bold px-2 py-0.5 rounded-full">
                        {chan.badgeLabel}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600">
                    {chan.description}
                  </p>

                  <div className="font-mono text-2xs text-slate-400 break-all pt-1">
                    {chan.url}
                  </div>
                </div>

                <a
                  href={chan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <span>Ouvrir</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: CONSEIL D'ADMINISTRATION PRÉSIDÉ PAR PHILOMÈNE AKPODJI*/}
      {/* ========================================================= */}
      {currentTab === 'conseil_administration' && (
        <div className="space-y-6">
          <BoardOfDirectorsSection />
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AUTHENTIFICATION INDIVIDUELLE DU MEMBRE            */}
      {/* ========================================================= */}
      {memberToLogin && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 text-center relative">
              <button
                onClick={() => setMemberToLogin(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>

              <img
                src={memberToLogin.photo}
                alt={memberToLogin.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-4 border-emerald-400/50 shadow-md mb-3"
                referrerPolicy="no-referrer"
              />
              <h3 className="font-black text-lg text-white">
                {memberToLogin.name}
              </h3>
              <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                {memberToLogin.role}
              </p>
              <p className="text-2xs text-slate-400">
                {memberToLogin.department}
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleConfirmLogin} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Statut Code d'Affectation *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Ex : CPI-2026-PROG"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mot de Passe Personnel *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Convenience hint for demonstration */}
              <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 text-2xs text-emerald-950 flex items-center justify-between">
                <span>Code démo pré-rempli pour test immédiat.</span>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode(memberToLogin.accessCode);
                    setInputPassword(memberToLogin.password || '1234');
                  }}
                  className="font-bold text-emerald-700 underline cursor-pointer"
                >
                  Auto-remplir
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMemberToLogin(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Déverrouiller mon Espace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER UNE TÂCHE AU CAHIER DES CHARGES             */}
      {/* ========================================================= */}
      {showAddTaskModal && activeMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Ajouter une Tâche au Cahier des Charges</span>
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewTask} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intitulé de la tâche *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ex : Patrouille de surveillance de 22h à 04h (Secteur Avlékété)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="terrain">Mission de terrain</option>
                    <option value="rapport">Rapportage / Données</option>
                    <option value="logistique">Logistique &amp; Matériel</option>
                    <option value="reunion">Réunion / Coordination</option>
                    <option value="sensibilisation">Sensibilisation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Référence au Cahier des Charges</label>
                <input
                  type="text"
                  value={newTaskRef}
                  onChange={(e) => setNewTaskRef(e.target.value)}
                  placeholder="Ex : Protocole de Patrouille Art. 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Enregistrer la Tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DÉCLARER UN BESOIN LOGISTIQUE POST-COLLECTE         */}
      {/* ========================================================= */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-300" />
                <span>Déclarer un Besoin Logistique Post-Collecte</span>
              </h3>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLogisticalNeed} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Désignation du matériel ou équipement *</label>
                <input
                  type="text"
                  required
                  value={newLogItem}
                  onChange={(e) => setNewLogItem(e.target.value)}
                  placeholder="Ex : Caisses isothermes de transport, Torches infrarouges, Balais Ayi Dji Ni Min..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={newLogCat}
                    onChange={(e) => setNewLogCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="sauvetage_tortues">Sauvetage Tortues Marines</option>
                    <option value="securite_nocturne">Sécurité Nocturne / Éco-gardes</option>
                    <option value="ecloserie">Écloserie &amp; Nids</option>
                    <option value="assainissement_plage">Assainissement &amp; Ayi Dji Ni Min</option>
                    <option value="bureautique">Bureautique &amp; Fiches terrain</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Niveau d'urgence</label>
                  <select
                    value={newLogUrgency}
                    onChange={(e) => setNewLogUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="normale">Normale</option>
                    <option value="haute">Haute</option>
                    <option value="critique">Critique (Blocage de patrouille)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantité requise</label>
                  <input
                    type="number"
                    value={newLogQty}
                    onChange={(e) => setNewLogQty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={newLogUnit}
                    onChange={(e) => setNewLogUnit(e.target.value)}
                    placeholder="unités / kits / m linéaires"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lieu de collecte concerné</label>
                <input
                  type="text"
                  value={newLogLocation}
                  onChange={(e) => setNewLogLocation(e.target.value)}
                  placeholder="Ex : Plage de Togbin Fandji (Secteur Écloserie)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Justification / Observations</label>
                <textarea
                  rows={2}
                  value={newLogNotes}
                  onChange={(e) => setNewLogNotes(e.target.value)}
                  placeholder="Expliquez pourquoi ce matériel est urgent après les collectes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Transmettre au CPI &amp; DE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJOUTER UN NOUVEAU RÉSEAU SOCIAL                    */}
      {/* ========================================================= */}
      {showAddChannelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-300" />
                <span>Ajouter un Canal / Réseau Social Permanent</span>
              </h3>
              <button
                onClick={() => setShowAddChannelModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newChannelName.trim() || !newChannelUrl.trim()) return;
                onAddSocialChannel({
                  id: `soc-${Date.now()}`,
                  name: newChannelName.trim(),
                  iconType: newChannelIcon,
                  url: newChannelUrl.trim(),
                  description: newChannelDesc.trim() || 'Canal officiel permanent AMSHARTE.',
                  isPermanent: true,
                  color: newChannelColor,
                  badgeLabel: 'Nouveau'
                });
                setShowAddChannelModal(false);
                setNewChannelName('');
                setNewChannelUrl('');
                setNewChannelDesc('');
              }}
              className="p-6 space-y-4 text-xs sm:text-sm"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nom du réseau *</label>
                <input
                  type="text"
                  required
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="Ex : TikTok Environnement Bénin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lien URL Permanent *</label>
                <input
                  type="url"
                  required
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type d'icône</label>
                  <select
                    value={newChannelIcon}
                    onChange={(e) => setNewChannelIcon(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">X / Twitter</option>
                    <option value="globe">Site / Blog Web</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Couleur d'accent</label>
                  <input
                    type="color"
                    value={newChannelColor}
                    onChange={(e) => setNewChannelColor(e.target.value)}
                    className="w-full h-9 p-1 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newChannelDesc}
                  onChange={(e) => setNewChannelDesc(e.target.value)}
                  placeholder="Ex : Vidéos courtes des sauvetages et patrouilles"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChannelModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Ajouter le Réseau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
