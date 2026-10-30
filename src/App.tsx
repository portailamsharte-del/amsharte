/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { PublicWebsite } from './components/PublicWebsite';
import { JobDescriptionsView } from './components/JobDescriptionsView';
import { MonthlyReportsView } from './components/MonthlyReportsView';
import { ProjectsView } from './components/ProjectsView';
import { PartnersView } from './components/PartnersView';
import { GoogleDolibarrBridgeView } from './components/GoogleDolibarrBridgeView';
import { ArchitectureModal } from './components/ArchitectureModal';
import { CpiAiAssistantView } from './components/CpiAiAssistantView';
import { SiteSettingsAndAuditView } from './components/SiteSettingsAndAuditView';
import { SiteTrainingManualModal } from './components/SiteTrainingManualModal';
import { WorkspaceAuthModal } from './components/WorkspaceAuthModal';
import { supabase, chargerMaFiche, membreVersProfil } from './lib/supabase';
import { peutVoirOnglet, ongletParDefaut, normaliserOnglet, peutSuperviser } from './lib/droits';
import { MemberReportSubmissionModal } from './components/MemberReportSubmissionModal';
import { LogoProposalModal } from './components/LogoProposalModal';
import { EspaceTravailHub } from './components/EspaceTravailHub';
import { WebmasteringDocumentsView } from './components/WebmasteringDocumentsView';
import { BoardOfDirectorsSection } from './components/BoardOfDirectorsSection';
import { NotificationToast } from './components/NotificationToast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { 
  INITIAL_JOB_DESCRIPTIONS, 
  INITIAL_PROJECTS, 
  INITIAL_MONTHLY_REPORTS, 
  INITIAL_PTF_PARTNERS,
  INITIAL_FIELD_ACTIONS,
  INITIAL_FORUM_THREADS,
  INITIAL_AUDIT_LOGS,
  INITIAL_EXECUTIVE_MEMBERS,
  INITIAL_SITE_CONTACTS,
  INITIAL_MAINTENANCE_DELEGATION,
  INITIAL_LOGISTICAL_NEEDS,
  INITIAL_SOCIAL_CHANNELS,
  INITIAL_MEMBER_REPORTS,
  INITIAL_IMPACT_METRICS,
  INITIAL_OFFICIAL_DOCUMENTS
} from './data/initialData';
import { 
  MonthlyReport, 
  ProjectItem, 
  TechnicalFinancialPartner, 
  PostJobDescription,
  FieldActionPost,
  StakeholderForumThread,
  StakeholderForumComment,
  AuditLogEntry,
  ExecutiveMember,
  SiteContactSettings,
  SiteMaintenanceDelegation,
  LogisticalNeedItem,
  SocialNetworkChannel,
  MemberTaskReport,
  ImpactMetricsState,
  OfficialDocument,
  AppNotification
} from './types';
import { calculateAutomatedImpactMetrics } from './utils/helpers';

export default function App() {
  const [currentView, setCurrentView] = useState<'public' | 'intranet'>('public');
  const [intranetTab, setIntranetTab] = useState<string>('espace-travail');
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);
  const [isTrainingManualOpen, setIsTrainingManualOpen] = useState<boolean>(false);
  const [isWorkspaceAuthModalOpen, setIsWorkspaceAuthModalOpen] = useState<boolean>(false);
  const [isMemberReportModalOpen, setIsMemberReportModalOpen] = useState<boolean>(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [logoVariant, setLogoVariant] = useState<'authentic_asr' | 'heraldic_e' | 'monogram_e' | 'heritage_asre'>('authentic_asr');

  // Official Documents (CMS / Webmastering) State
  const [officialDocs, setOfficialDocs] = useState<OfficialDocument[]>(INITIAL_OFFICIAL_DOCUMENTS);

  // Notification System State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-init-1',
      title: 'Système de Webmastering Actif',
      message: 'Le module de gestion, modification et insertion des documents officiels pour le CPI est configuré.',
      type: 'info',
      timestamp: 'Aujourd\'hui',
      isRead: false,
      category: 'document'
    },
    {
      id: 'notif-init-2',
      title: 'Export PDF Officiel PTF Prêt',
      message: 'Vous pouvez désormais générer et imprimer les rapports d\'activités au format officiel pour les bailleurs.',
      type: 'success',
      timestamp: 'Aujourd\'hui',
      isRead: false,
      category: 'rapport'
    },
    {
      id: 'notif-init-3',
      title: 'Règle J+10 : Échéance Rapportage',
      message: 'Les fiches d\'activités mensuelles du mois échu doivent être transmises et visées au plus tard le 10.',
      type: 'warning',
      timestamp: 'Permanence',
      isRead: false,
      category: 'delai'
    }
  ]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);

  // Executive Workspace & Audit States
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [executiveMembers, setExecutiveMembers] = useState<ExecutiveMember[]>(INITIAL_EXECUTIVE_MEMBERS);
  const [currentMember, setCurrentMember] = useState<ExecutiveMember>(INITIAL_EXECUTIVE_MEMBERS[0]);
  const [estConnecte, setEstConnecte] = useState<boolean>(false);
  // Rôle réel du membre connecté (ne change pas quand le CPI consulte l'espace d'un autre membre)
  const [roleReel, setRoleReel] = useState<string | undefined>(undefined);
  // Session Supabase : au chargement, on retrouve le membre déjà connecté
  useEffect(() => {
    const synchroniser = async () => {
      const fiche = await chargerMaFiche();
      if (fiche && fiche.statut === 'actif') {
        setCurrentMember(membreVersProfil(fiche));
        setRoleReel(fiche.role);
        setEstConnecte(true);
      }
    };
    synchroniser();
    const { data: abonnement } = supabase.auth.onAuthStateChange((evenement) => {
      if (evenement === 'SIGNED_IN' || evenement === 'TOKEN_REFRESHED' || evenement === 'USER_UPDATED') {
        synchroniser();
      }
      if (evenement === 'SIGNED_OUT') {
        setEstConnecte(false);
        setRoleReel(undefined);
      }
    });
    return () => abonnement.subscription.unsubscribe();
  }, []);
  const [contactSettings, setContactSettings] = useState<SiteContactSettings>(INITIAL_SITE_CONTACTS);
  const [delegation, setDelegation] = useState<SiteMaintenanceDelegation>(INITIAL_MAINTENANCE_DELEGATION);

  // Espace de Travail Hub States (Logistics, Social Channels, Tasks, Impact Sync)
  const [logisticalNeeds, setLogisticalNeeds] = useState<LogisticalNeedItem[]>(INITIAL_LOGISTICAL_NEEDS);
  const [socialChannels, setSocialChannels] = useState<SocialNetworkChannel[]>(INITIAL_SOCIAL_CHANNELS);
  const [memberReports, setMemberReports] = useState<MemberTaskReport[]>(INITIAL_MEMBER_REPORTS);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetricsState>(() => 
    calculateAutomatedImpactMetrics(INITIAL_FIELD_ACTIONS, INITIAL_MEMBER_REPORTS, INITIAL_MONTHLY_REPORTS, INITIAL_EXECUTIVE_MEMBERS.length)
  );

  // Core Data States
  const [posts] = useState<PostJobDescription[]>(INITIAL_JOB_DESCRIPTIONS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [reports, setReports] = useState<MonthlyReport[]>(INITIAL_MONTHLY_REPORTS);
  const [partners] = useState<TechnicalFinancialPartner[]>(INITIAL_PTF_PARTNERS);

  // Newsfeed & Stakeholders Forum Data States
  const [actions, setActions] = useState<FieldActionPost[]>(INITIAL_FIELD_ACTIONS);
  const [threads, setThreads] = useState<StakeholderForumThread[]>(INITIAL_FORUM_THREADS);

  // Automated Impact Metrics Engine (Always live & synchronized across Public site, Workspace & Reports)
  const automatedMetrics = useMemo(() => {
    return calculateAutomatedImpactMetrics(actions, memberReports, reports, executiveMembers.length);
  }, [actions, memberReports, reports, executiveMembers.length]);

  // Continuously synchronize live automated impact metrics
  useEffect(() => {
    setImpactMetrics(automatedMetrics);
  }, [automatedMetrics]);

  // Audit Logger
  const handleAddAuditLog = (authorName: string, authorRole: string, actionType: AuditLogEntry['actionType'], details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      authorName,
      authorRole,
      actionType,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Notification Dispatcher
  const handleNotify = (
    title: string,
    message: string,
    type: AppNotification['type'] = 'info',
    category: AppNotification['category'] = 'systeme',
    actionUrl?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + ' • Aujourd\'hui',
      isRead: false,
      category,
      actionUrl
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Official Documents CRUD Handlers
  const handleAddDocument = (newDoc: OfficialDocument) => {
    setOfficialDocs(prev => [newDoc, ...prev]);
    const ref = newDoc.referenceNumber || newDoc.reference || 'Ref N/A';
    handleAddAuditLog(
      currentMember.name,
      currentMember.role,
      'modification_site',
      `Insertion d'un nouvel acte officiel : ${newDoc.title} (${ref})`
    );
    handleNotify(
      'Nouveau Document Enregistré',
      `L'acte officiel « ${newDoc.title} » (${ref}) a été ajouté au répertoire public & archivage.`,
      'success',
      'document'
    );
  };

  const handleUpdateDocument = (updatedDoc: OfficialDocument) => {
    setOfficialDocs(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
    const ref = updatedDoc.referenceNumber || updatedDoc.reference || 'Ref N/A';
    handleAddAuditLog(
      currentMember.name,
      currentMember.role,
      'modification_site',
      `Mise à jour acte officiel : ${updatedDoc.title} (${ref})`
    );
    handleNotify(
      'Document Mis à Jour',
      `L'acte « ${updatedDoc.title} » (${ref}) a été mis à jour avec succès.`,
      'info',
      'document'
    );
  };

  const handleDeleteDocument = (docId: string) => {
    const target = officialDocs.find(d => d.id === docId);
    setOfficialDocs(prev => prev.filter(d => d.id !== docId));
    if (target) {
      const ref = target.referenceNumber || target.reference || 'Ref N/A';
      handleAddAuditLog(
        currentMember.name,
        currentMember.role,
        'modification_site',
        `Archivage / Retrait d'un acte officiel : ${target.title} (${ref})`
      );
      handleNotify(
        'Document Retiré',
        `L'acte officiel « ${target.title} » a été retiré du répertoire actif.`,
        'warning',
        'document'
      );
    }
  };

  // Handlers for Newsfeed & Forum
  const handleAddAction = (newAction: FieldActionPost) => {
    setActions(prev => [newAction, ...prev]);
  };

  const handleUpdateAction = (updatedAction: FieldActionPost) => {
    setActions(prev => prev.map(a => a.id === updatedAction.id ? updatedAction : a));
  };

  const handleAddThread = (newThread: StakeholderForumThread) => {
    setThreads(prev => [newThread, ...prev]);
  };

  const handleAddComment = (threadId: string, comment: StakeholderForumComment) => {
    setThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      return {
        ...t,
        comments: [...t.comments, comment]
      };
    }));
  };

  const handleExtractActionToReport = (action: FieldActionPost) => {
    const newReport: MonthlyReport = {
      id: `rep-field-${Date.now()}`,
      reference: `RAP-TERRAIN-${Date.now().toString().slice(-4)}`,
      month: 'Septembre',
      year: 2026,
      dateSubmitted: new Date().toISOString().split('T')[0],
      authorName: action.authorName,
      authorRole: action.authorRole,
      projectCategory: 'tortues',
      status: 'soumis_cpi',
      summary: `Action de terrain extraite (${action.title}) : ${action.content}`,
      activitiesCompleted: [
        `Intervention sur le site de ${action.location}`,
        action.tagId ? `Baguage & identification de la tortue ${action.tagId} (${action.species || 'Chélonien'})` : 'Patrouille et sécurisation de secteur',
        action.measurements?.eggsCount ? `Collecte et mise en écloserie de ${action.measurements.eggsCount} œufs` : 'Contrôle biométrique et mise en bassin d\'observation',
        ...(action.verifiedBy && action.visaValidatedAt ? [`Visa de conformité : ${action.verifiedBy}`] : [])
      ],
      quantitativeResults: [
        { label: "Tortues / nids traités", value: action.tagId || "1" },
        { label: "Poids / Mesures", value: action.measurements?.weightKg ? `${action.measurements.weightKg} kg` : "Conforme" },
        { label: "Œufs en écloserie", value: action.measurements?.eggsCount ? `${action.measurements.eggsCount}` : "N/A" }
      ],
      challengesFaced: "Contraintes de transport nocturne, vigilance braconniers et renouvellement en eau des bacs.",
      solutionsApplied: "Coordination avec la Police BPLP et les pêcheurs sentinelles de Togbin.",
      nextMonthPlanning: "Poursuivre les patrouilles de nuit, distribuer le fil de réparation et assurer le lâcher des émergents.",
      financialNeedsFCFA: 65000,
      cpiReviewNotes: "Extrait directement du Fil d'Actualité de Terrain par le CPI."
    };

    setReports(prev => [newReport, ...prev]);
    setIntranetTab('rapports-mensuels');
    setCurrentView('intranet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExtractThreadToReport = (thread: StakeholderForumThread) => {
    const newReport: MonthlyReport = {
      id: `rep-forum-${Date.now()}`,
      reference: `RAP-FORUM-${Date.now().toString().slice(-4)}`,
      month: 'Septembre',
      year: 2026,
      dateSubmitted: new Date().toISOString().split('T')[0],
      authorName: 'Henri Doudédji FATCHINA',
      authorRole: 'Chargé de Programmes par Intérim (CPI)',
      projectCategory: 'tortues',
      status: 'soumis_cpi',
      summary: `Synthèse de concertation Parties Prenantes : ${thread.title}`,
      activitiesCompleted: [
        `Animation du cadre de concertation avec ${thread.authorName} (${thread.authorOrg})`,
        `Consolidation de ${thread.comments.length} avis d'experts (Police BPLP, pêcheurs, MCVT, AGL)`,
        `Enjeux traités : ${thread.description}`
      ],
      quantitativeResults: [
        { label: "Contributions d'experts", value: `${thread.comments.length}` },
        { label: "Niveau d'urgence", value: thread.priority }
      ],
      challengesFaced: "Nécessité de concilier la protection des tortues et les pertes de filets pour les pêcheurs artisans.",
      solutionsApplied: "Adoption du principe de compensation en fil de réparation et renforcement des patrouilles conjointes.",
      nextMonthPlanning: "Organiser la restitution avec le Directeur Exécutif et soumettre la note au MCVT.",
      financialNeedsFCFA: 120000,
      cpiReviewNotes: "Synthèse issue du forum multi-acteurs Tortues & Parties Prenantes."
    };

    setReports(prev => [newReport, ...prev]);
    setIntranetTab('rapports-mensuels');
    setCurrentView('intranet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers for Intranet Reports & Projects
  const handleAddReport = (newReport: MonthlyReport) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleUpdateReportStatus = (reportId: string, newStatus: MonthlyReport['status'], notes?: string) => {
    setReports(prev => prev.map(rep => {
      if (rep.id !== reportId) return rep;
      if (newStatus === 'valide_cpi') {
        return {
          ...rep,
          status: newStatus,
          cpiReviewNotes: notes || "Validé par le Chargé de Programmes par Intérim."
        };
      } else if (newStatus === 'vise_de') {
        return {
          ...rep,
          status: newStatus,
          deVisaNotes: notes || "Vu et approuvé pour ordonnancement. — SONON Tchéhouéa, DE"
        };
      }
      return { ...rep, status: newStatus };
    }));
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      const updatedMilestones = proj.milestones.map(m => {
        if (m.id === milestoneId) {
          return { ...m, done: !m.done };
        }
        return m;
      });
      const completedCount = updatedMilestones.filter(m => m.done).length;
      const progressPercentage = Math.round((completedCount / updatedMilestones.length) * 100);
      return {
        ...proj,
        milestones: updatedMilestones,
        progressPercentage
      };
    }));
  };

  const ongletAffiche = estConnecte && peutVoirOnglet(roleReel, intranetTab) ? normaliserOnglet(intranetTab) : null;

  const handleGoToIntranet = (tab: string = 'dashboard') => {
    // L'intranet n'est ouvert qu'à un membre connecté, et seulement sur les espaces autorisés à son rôle
    if (!estConnecte) {
      setIsWorkspaceAuthModalOpen(true);
      return;
    }
    const cible = peutVoirOnglet(roleReel, tab) ? tab : (ongletParDefaut(roleReel) || tab);
    setIntranetTab(cible);
    setCurrentView('intranet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Bar */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        intranetTab={intranetTab}
        setIntranetTab={setIntranetTab}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
        currentMember={currentMember}
        onOpenTrainingManual={() => setIsTrainingManualOpen(true)}
        onOpenWorkspaceAuth={() => setIsWorkspaceAuthModalOpen(true)}
        estConnecte={estConnecte}
        roleCle={roleReel}
        onDeconnexion={async () => {
          handleAddAuditLog(currentMember.name, currentMember.role, 'connexion', 'Fermeture de session');
          await supabase.auth.signOut();
          setEstConnecte(false);
          setRoleReel(undefined);
          setCurrentMember(INITIAL_EXECUTIVE_MEMBERS[0]);
          setCurrentView('public');
        }}
        onOpenMemberReportModal={() => setIsMemberReportModalOpen(true)}
        logoVariant={logoVariant}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
      />

      {/* Main View Container */}
      <div className="flex-1">
        {currentView === 'public' ? (
          <PublicWebsite 
            onGoToIntranet={handleGoToIntranet}
            actions={actions}
            onAddAction={handleAddAction}
            onUpdateAction={handleUpdateAction}
            onExtractActionToReport={handleExtractActionToReport}
            threads={threads}
            onAddThread={handleAddThread}
            onAddComment={handleAddComment}
            onExtractThreadToReport={handleExtractThreadToReport}
            impactMetrics={impactMetrics}
            officialDocuments={officialDocs}
            estConnecte={estConnecte}
            effectifMembres={executiveMembers.length}
            onGoToWebmastering={() => handleGoToIntranet('webmastering-docs')}
          />
        ) : (
          <main className="max-w-7xl mx-auto px-4 py-8">
            {ongletAffiche === 'espace-travail' && (
              <EspaceTravailHub
                members={executiveMembers}
                onUpdateMembers={setExecutiveMembers}
                activeMember={currentMember}
                onSetActiveMember={setCurrentMember}
                peutSuperviser={peutSuperviser(roleReel)}
                logisticalNeeds={logisticalNeeds}
                onAddLogisticalNeed={(item) => setLogisticalNeeds(prev => [item, ...prev])}
                onUpdateLogisticalNeed={(item) => setLogisticalNeeds(prev => prev.map(n => n.id === item.id ? item : n))}
                socialChannels={socialChannels}
                onAddSocialChannel={(ch) => setSocialChannels(prev => [...prev, ch])}
                onUpdateSocialChannel={(ch) => setSocialChannels(prev => prev.map(s => s.id === ch.id ? ch : s))}
                memberReports={memberReports}
                onAddMemberReport={(rep) => {
                  setMemberReports(prev => [rep, ...prev]);
                  handleAddAuditLog(rep.authorName, rep.authorRole, 'validation_rapport', `Nouveau rapport de tâche transmis au CPI/DE : ${rep.title}`);
                }}
                onUpdateMemberReport={(rep) => {
                  setMemberReports(prev => prev.map(r => r.id === rep.id ? rep : r));
                  handleAddAuditLog(rep.authorName, rep.authorRole, 'validation_rapport', `Mise à jour rapport de tâche : ${rep.title}`);
                }}
                impactMetrics={impactMetrics}
                onSyncImpactMetrics={(newMetrics) => {
                  setImpactMetrics(prev => ({ ...prev, ...newMetrics }));
                  handleAddAuditLog('SONON Tchéhouéa', 'Directeur Exécutif', 'modification_site', 'Synchronisation automatique des métriques validées vers le Tableau de Bord Public');
                }}
                onPublishActionToNewsfeed={handleAddAction}
                onLogAudit={handleAddAuditLog}
                onGoToPublicSite={() => setCurrentView('public')}
                projects={projects}
                monthlyReports={reports}
                fieldActions={actions}
                posts={posts}
                officialDocuments={officialDocs}
                onAddOfficialDocument={handleAddDocument}
                onUpdateOfficialDocument={handleUpdateDocument}
                onDeleteOfficialDocument={handleDeleteDocument}
                onNotify={handleNotify}
                partners={partners}
              />
            )}

            {ongletAffiche === 'conseil-administration' && (
              <BoardOfDirectorsSection onNavigateTab={(tab) => setIntranetTab(tab)} />
            )}

            {ongletAffiche === 'cahiers-charges' && (
              <JobDescriptionsView posts={posts} />
            )}

            {ongletAffiche === 'rapports-mensuels' && (
              <MonthlyReportsView
                reports={reports}
                onAddReport={handleAddReport}
                onUpdateReportStatus={handleUpdateReportStatus}
                onNotify={handleNotify}
              />
            )}

            {ongletAffiche === 'webmastering-docs' && (
              <WebmasteringDocumentsView
                documents={officialDocs}
                onAddDocument={handleAddDocument}
                onUpdateDocument={handleUpdateDocument}
                onDeleteDocument={handleDeleteDocument}
                onNotify={handleNotify}
                onGoToPublicMediatheque={() => {
                  setCurrentView('public');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {ongletAffiche === 'projets' && (
              <ProjectsView
                projects={projects}
                onToggleMilestone={handleToggleMilestone}
              />
            )}

            {ongletAffiche === 'ptf' && (
              <PartnersView partners={partners} />
            )}

            {ongletAffiche === 'passerelle' && (
              <GoogleDolibarrBridgeView
                projects={projects}
                partners={partners}
                reports={reports}
              />
            )}

            {ongletAffiche === 'assistant-ia' && (
              <CpiAiAssistantView
                reports={reports}
                projects={projects}
                onInsertIntoMonthlyReports={handleAddReport}
                onLogAudit={(author, role, details) => handleAddAuditLog(author, role, 'ia_requete', details)}
              />
            )}

            {ongletAffiche === 'parametres-audit' && (
              <SiteSettingsAndAuditView
                currentMember={currentMember}
                contactSettings={contactSettings}
                onUpdateContactSettings={setContactSettings}
                auditLogs={auditLogs}
                delegation={delegation}
                onUpdateDelegation={setDelegation}
                onAddAuditLog={handleAddAuditLog}
              />
            )}

            {ongletAffiche === null && (
              <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-rose-200 shadow-sm text-center space-y-3">
                <h3 className="text-xl font-black text-slate-900">Accès réservé</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {estConnecte
                    ? "Votre profil ne donne pas accès à cet espace. Adressez-vous au Chargé de Programmes par Intérim (CPI) ou au Directeur Exécutif pour toute demande d'accès."
                    : "Connectez-vous avec votre compte membre pour accéder à cet espace."}
                </p>
                <button
                  onClick={() => (estConnecte ? setCurrentView('public') : setIsWorkspaceAuthModalOpen(true))}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  {estConnecte ? 'Retour au site public' : 'Se connecter'}
                </button>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Architecture & Strategy Guide Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Site Training Manual Modal */}
      <SiteTrainingManualModal
        isOpen={isTrainingManualOpen}
        onClose={() => setIsTrainingManualOpen(false)}
      />

      {/* Executive Workspace & Identity Modal */}
      <WorkspaceAuthModal
        isOpen={isWorkspaceAuthModalOpen}
        onClose={() => setIsWorkspaceAuthModalOpen(false)}
        onLoginSuccess={(member) => {
          setCurrentMember(member);
          setRoleReel(member.roleCle);
          setEstConnecte(true);
          const premier = ongletParDefaut(member.roleCle);
          if (premier) {
            setCurrentView('intranet');
            setIntranetTab(premier);
          } else {
            // Profil sans espace interne (éco-garde, partenaire, presse…) : retour au site public
            setCurrentView('public');
          }
          handleAddAuditLog(member.name, member.role, 'connexion', 'Ouverture de session Espace de Travail réussie');
        }}
      />

      {/* Member Report Direct Submission Modal */}
      <MemberReportSubmissionModal
        isOpen={isMemberReportModalOpen}
        onClose={() => setIsMemberReportModalOpen(false)}
        onSubmitReport={(rep) => {
          handleAddReport(rep);
          handleAddAuditLog(rep.authorName, rep.authorRole, 'validation_rapport', `Dépôt direct de rapport de terrain : ${rep.reference}`);
        }}
        onLogAudit={(author, role, details) => handleAddAuditLog(author, role, 'validation_rapport', details)}
      />

      {/* Official Logo Proposals (with E) Modal */}
      <LogoProposalModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        activeLogoVariant={logoVariant}
        onSelectVariant={(variant) => {
          setLogoVariant(variant);
          handleAddAuditLog(
            currentMember?.name || 'Direction Exécutive',
            currentMember?.role || 'Coordination',
            'modification_site',
            `Adoption de la charte de logo : ${variant === 'authentic_asr' ? 'Logo Authentique ASR (Original Fondateur)' : variant === 'heraldic_e' ? 'Sceau Éco-Environnemental avec E' : variant === 'monogram_e' ? 'Monogramme Typographique ASR-E' : 'Sceau Héritage 2004'}`
          );
        }}
      />

      {/* Notification Toast & History Drawer */}
      <NotificationToast
        activeToast={activeToast}
        onDismissToast={() => setActiveToast(null)}
        notifications={notifications}
        isOpenDrawer={isNotificationDrawerOpen}
        onCloseDrawer={() => setIsNotificationDrawerOpen(false)}
        onClearAll={handleClearNotifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onNavigateTab={(tab) => {
          setCurrentView('intranet');
          setIntranetTab(tab);
          setIsNotificationDrawerOpen(false);
        }}
      />

      {/* Offline Status Connectivity Banner */}
      <OfflineIndicator />
    </div>
  );
}
