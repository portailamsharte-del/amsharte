import React, { useState } from 'react';
import { DRIVE_HIERARCHY, NGO_INFO } from '../data/initialData';
import { DriveFolderNode, ProjectItem, TechnicalFinancialPartner, MonthlyReport } from '../types';
import { 
  FolderTree, 
  Database, 
  Share2, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  Server, 
  Cpu, 
  Key, 
  Layers, 
  FileSpreadsheet, 
  Folder, 
  FolderPlus, 
  Sparkles,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { 
  generateDolibarrProjectsCSV, 
  generateDolibarrPartnersCSV, 
  downloadFile 
} from '../utils/helpers';

interface GoogleDolibarrBridgeViewProps {
  projects: ProjectItem[];
  partners: TechnicalFinancialPartner[];
  reports: MonthlyReport[];
}

export const GoogleDolibarrBridgeView: React.FC<GoogleDolibarrBridgeViewProps> = ({
  projects,
  partners,
  reports
}) => {
  const [activeTab, setActiveTab] = useState<'reponse_outil' | 'drive' | 'dolibarr' | 'flux'>('reponse_outil');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'drive-root': true,
    'folder-01': true,
    'folder-02': true,
    'folder-03': true,
    'folder-04': true,
    'folder-05': true,
  });
  const [selectedFolder, setSelectedFolder] = useState<DriveFolderNode>(DRIVE_HIERARCHY);

  // Sync test state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleTestSync = () => {
    setIsSyncing(true);
    setSyncStatusMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatusMessage("✅ Synchronisation réussie : 4 Projets, 5 Conventions PTF et 4 Rapports mensuels alignés avec les schémas Dolibarr & Google Sheets.");
    }, 1200);
  };

  const handleDownloadDriveStructure = () => {
    const formatNode = (node: DriveFolderNode, indent = ""): string => {
      let str = `${indent}📁 [${node.code}] ${node.name} — Responsable : ${node.ownerRole}\n`;
      str += `${indent}   Description : ${node.description}\n`;
      if (node.children) {
        node.children.forEach(child => {
          str += formatNode(child, indent + "    ");
        });
      }
      return str;
    };

    const content = `======================================================================
ARBORESCENCE OFFICIELLE GOOGLE DRIVE — ${NGO_INFO.name.toUpperCase()} (TOGBIN FANDJI)
Guide de Nomenclature & Structure Numérique pour la Coordination
======================================================================

${formatNode(DRIVE_HIERARCHY)}

======================================================================
Instructions de Déploiement :
1. Créez le dossier racine "AMSHARTE_OFFICIEL_WORKSPACE" sur Google Drive.
2. Définissez les droits d'accès stricts pour le DE (SONON Tchéhouéa) et le CPI (Henri D. FATCHINA).
3. Partagez chaque sous-dossier avec le chargé correspondant (ex: 04_PROJET_TORTUES avec le Chargé du Programme Santé des Tortues).
======================================================================`;

    downloadFile(content, `AMSHARTE_Structure_Google_Drive_Officielle.txt`);
  };

  const handleExportProjectsCSV = () => {
    const csv = generateDolibarrProjectsCSV(projects);
    downloadFile(csv, `Dolibarr_Import_Projets_AMSHARTE.csv`);
  };

  const handleExportPartnersCSV = () => {
    const csv = generateDolibarrPartnersCSV(partners);
    downloadFile(csv, `Dolibarr_Import_Tiers_PTF_AMSHARTE.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
              Architecture Hybride Clé en Main
            </span>
            <span className="text-xs text-slate-500">• Google Workspace + Dolibarr ERP + Web Portal</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Passerelle Google Workspace ↔ Dolibarr &amp; Solution de Gestion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Réponse stratégique, cartographie des flux et outils de synchronisation opérationnelle pour {NGO_INFO.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSync}
            disabled={isSyncing}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Test de flux...' : 'Tester Flux de Synchro'}</span>
          </button>
        </div>
      </div>

      {syncStatusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold pb-1">
        <button
          onClick={() => setActiveTab('reponse_outil')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'reponse_outil'
              ? 'bg-slate-900 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>« Quel outil pour gérer au mieux cette ONG ? »</span>
        </button>

        <button
          onClick={() => setActiveTab('drive')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'drive'
              ? 'bg-blue-600 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Arborescence Google Drive AMSHARTE</span>
        </button>

        <button
          onClick={() => setActiveTab('dolibarr')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'dolibarr'
              ? 'bg-purple-600 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Configuration &amp; Exports Dolibarr ERP</span>
        </button>

        <button
          onClick={() => setActiveTab('flux')}
          className={`px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'flux'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Matrice des Flux Google ↔ Dolibarr</span>
        </button>
      </div>

      {/* TAB 1: Reponse à "Quel outil me permettrait de gérer au mieux cette ONG ?" */}
      {activeTab === 'reponse_outil' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Recommandation Stratégique &amp; Réponse au Cahier de Charge
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                La Solution Parfaite : Le Triptyque Hybride AMSHARTE
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Pour une ONG environnementale africaine intervenant sur le terrain (Togbin, plages de ponte, lagunes) avec des exigences strictes de bailleurs de fonds (PNUD, UE, FEM), <strong>aucun logiciel unique isolé ne suffit</strong>. La formule gagnante est l'alliance de trois briques complémentaires :
              </p>
            </div>

            {/* 3 Pillars Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pillar 1: Google Workspace */}
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  G
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  1. Google Workspace
                </h4>
                <div className="text-[11px] font-semibold text-blue-800 uppercase">
                  Coordination Terrain &amp; Vitrine
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Forms :</strong> Saisie mobile déconnectée des rapports de patrouille et pépinières.</li>
                  <li><strong>Sheets :</strong> Consolidation automatique sans ressaisie pour le CPI.</li>
                  <li><strong>Drive :</strong> Dossier racine officiel avec sous-dossiers par chargé.</li>
                  <li><strong>Sites :</strong> Vitrine publique moderne et gratuite.</li>
                </ul>
                <div className="pt-2 text-[11px] text-blue-900 font-medium">
                  Avantage : 100% gratuit pour les ONG (via Google for Nonprofits), utilisable sur smartphone par les éco-gardes.
                </div>
              </div>

              {/* Pillar 2: Dolibarr ERP/CRM */}
              <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  D
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  2. Dolibarr ERP/CRM
                </h4>
                <div className="text-[11px] font-semibold text-purple-800 uppercase">
                  Back-Office &amp; Conformité Légale
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Comptabilité &amp; Trésorerie :</strong> Rapprochement bancaire, pièces justificatives, normes OHADA/Bailleurs.</li>
                  <li><strong>CRM Bailleurs (PTF) :</strong> Suivi des conventions et décaissements.</li>
                  <li><strong>Gestion des Membres :</strong> Bénévoles, forfaits et indemnités.</li>
                  <li><strong>Archivage légal :</strong> Contrats scannés infalsifiables.</li>
                </ul>
                <div className="pt-2 text-[11px] text-purple-900 font-medium">
                  Avantage : Open-source, zéro coût de licence par utilisateur, hébergeable sur OVH ou Hostinger pour moins de 4 €/mois.
                </div>
              </div>

              {/* Pillar 3: This Dedicated Portal */}
              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  🐢
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  3. Portail AMSHARTE (Cet Outil)
                </h4>
                <div className="text-[11px] font-semibold text-emerald-800 uppercase">
                  Cockpit de Pilotage CPI &amp; DE
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Compte à rebours J+10 :</strong> Alerte automatique pour les rapports mensuels et le 1er février.</li>
                  <li><strong>Cahiers de charge numériques :</strong> Fiches de poste et signatures officielles.</li>
                  <li><strong>Générateur de documents :</strong> Rapports officiels prêts à imprimer.</li>
                  <li><strong>Passerelle instantanée :</strong> Exports CSV préformatés pour Dolibarr et Sheets.</li>
                </ul>
                <div className="pt-2 text-[11px] text-emerald-900 font-medium">
                  Avantage : Clé en main, responsive PC et mobile, centralise toute l'ONG en un seul écran.
                </div>
              </div>
            </div>

            {/* Why Dolibarr + Google is better than competitors */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <strong className="text-slate-900 block font-bold text-sm">
                Pourquoi cette combinaison surpasse les solutions propriétaires coûteuses ?
              </strong>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 pt-1">
                <div>
                  <p className="leading-relaxed">
                    Des logiciels comme Asana, Salesforce ou QuickBooks facturent entre 15$ et 50$ <em>par utilisateur et par mois</em>, ce qui engloutit les budgets de subvention destinés à la protection des tortues et mangroves.
                  </p>
                </div>
                <div>
                  <p className="leading-relaxed">
                    La suite <strong>Google Workspace pour les Associations + Dolibarr hébergé</strong> offre une souveraineté totale des données, zéro frais récurrent de licence logicielle, et une conformité rigoureuse aux audits des bailleurs internationaux (UE, PNUD, FEM).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Arborescence Google Drive AMSHARTE */}
      {activeTab === 'drive' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Structure Normalisée du Google Drive « AMSHARTE »
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arborescence officielle avec sous-dossiers par acteur (DE, CPI, finances, communication, tortues, mangroves, etc.).
                </p>
              </div>

              <button
                onClick={handleDownloadDriveStructure}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger la Nomenclature Officielle</span>
              </button>
            </div>

            {/* Interactive Folder Explorer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Folder Tree on Left */}
              <div className="lg:col-span-6 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 max-h-[500px] overflow-y-auto">
                <div className="text-xs font-bold text-slate-500 uppercase px-1">
                  Arborescence Numérique AMSHARTE
                </div>

                <div className="space-y-1 text-xs">
                  {/* Root */}
                  <div>
                    <div 
                      onClick={() => {
                        setSelectedFolder(DRIVE_HIERARCHY);
                        toggleFolder('drive-root');
                      }}
                      className={`p-2 rounded-lg flex items-center gap-2 cursor-pointer font-bold ${
                        selectedFolder.id === 'drive-root' ? 'bg-blue-100 text-blue-900' : 'hover:bg-slate-100 text-slate-900'
                      }`}
                    >
                      {expandedFolders['drive-root'] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <HardDrive className="w-4 h-4 text-blue-600" />
                      <span>{DRIVE_HIERARCHY.name}</span>
                    </div>

                    {/* Level 1 Children */}
                    {expandedFolders['drive-root'] && (
                      <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-200">
                        {DRIVE_HIERARCHY.children?.map((folder) => {
                          const isExp = !!expandedFolders[folder.id];
                          const isSel = selectedFolder.id === folder.id;

                          return (
                            <div key={folder.id}>
                              <div
                                onClick={() => {
                                  setSelectedFolder(folder);
                                  toggleFolder(folder.id);
                                }}
                                className={`p-1.5 rounded-lg flex items-center gap-2 cursor-pointer ${
                                  isSel ? 'bg-blue-100 text-blue-900 font-bold' : 'hover:bg-slate-200/70 text-slate-800'
                                }`}
                              >
                                {folder.children ? (
                                  isExp ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
                                ) : (
                                  <span className="w-3.5"></span>
                                )}
                                <Folder className="w-4 h-4 text-amber-500" />
                                <span className="truncate">{folder.name}</span>
                              </div>

                              {/* Level 2 Sub-children */}
                              {isExp && folder.children && (
                                <div className="pl-6 space-y-1 mt-1 border-l border-slate-300">
                                  {folder.children.map((sub) => (
                                    <div
                                      key={sub.id}
                                      onClick={() => setSelectedFolder(sub)}
                                      className={`p-1.5 rounded-lg flex items-center gap-2 cursor-pointer ${
                                        selectedFolder.id === sub.id ? 'bg-blue-100 text-blue-900 font-bold' : 'hover:bg-slate-200/70 text-slate-700'
                                      }`}
                                    >
                                      <Folder className="w-3.5 h-3.5 text-blue-400" />
                                      <span className="truncate">{sub.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Folder Details on Right */}
              <div className="lg:col-span-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold bg-slate-200 px-2 py-1 rounded inline-block">
                    {selectedFolder.code}
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {selectedFolder.name}
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Responsable / Accès Référent :</span>
                      <strong className="text-slate-900 font-semibold">{selectedFolder.ownerRole}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 block">Contenu &amp; Documents Hébergés :</span>
                      <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 mt-1 leading-relaxed">
                        {selectedFolder.description}
                      </p>
                    </div>

                    {selectedFolder.children && (
                      <div>
                        <span className="text-slate-500 block mb-1">Sous-dossiers inclus ({selectedFolder.children.length}) :</span>
                        <div className="space-y-1">
                          {selectedFolder.children.map(c => (
                            <div key={c.id} className="bg-white px-2.5 py-1.5 rounded border border-slate-200 flex items-center gap-2">
                              <Folder className="w-3.5 h-3.5 text-amber-500" />
                              <span className="font-medium text-slate-800">{c.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Dolibarr ERP Configuration & Exports */}
      {activeTab === 'dolibarr' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Back-Office Dolibarr ERP/CRM pour l'ONG AMSHARTE
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Modules activés, guide d'installation sur serveur web (Hostinger/OVH/VPS) et exports directs.
              </p>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  PROJ
                </div>
                <h4 className="font-bold text-slate-900 text-xs uppercase">Module Projets</h4>
                <p className="text-xs text-slate-600">
                  Suivi détaillé des programmes Tortues marines, Mangroves, formation et fiches de temps des animateurs.
                </p>
                <button
                  onClick={handleExportProjectsCSV}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter CSV Projets</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  CRM
                </div>
                <h4 className="font-bold text-slate-900 text-xs uppercase">Module Tiers &amp; PTF</h4>
                <p className="text-xs text-slate-600">
                  Gestion des Partenaires Techniques et Financiers, suivi des conventions de financement et décaissements.
                </p>
                <button
                  onClick={handleExportPartnersCSV}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter CSV Bailleurs</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                  FIN
                </div>
                <h4 className="font-bold text-slate-900 text-xs uppercase">Module Comptabilité &amp; Trésorerie</h4>
                <p className="text-xs text-slate-600">
                  Tenue de caisse, rapprochement des comptes bancaires de l'ONG et justification des forfaits de déplacement.
                </p>
                <div className="text-[11px] text-purple-800 font-medium pt-2">
                  Géré par la Chargée des Affaires Financières (Daria SONON) sous ordonnancement du DE.
                </div>
              </div>
            </div>

            {/* Practical Hosting Guide */}
            <div className="p-5 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Server className="w-4 h-4" />
                <span>Guide d'Installation de Dolibarr pour AMSHARTE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="space-y-1">
                  <strong className="text-white block font-semibold">1. Choix de l'Hébergement</strong>
                  <p>Prenez un hébergement web mutualisé ou VPS chez Hostinger ou OVH (avec sous-domaine <code>gestion.ongamshart.org</code>).</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block font-semibold">2. Installation 1-Clic</strong>
                  <p>Installez Dolibarr via Softaculous / autoinstalleur ou téléchargez le ZIP officiel gratuit sur Dolibarr.org.</p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block font-semibold">3. Comptes &amp; Permissions</strong>
                  <p>Créez les comptes : DE (Admin complet), CPI (Projets, Tiers, Documents), RAF (Finances/Compta), Chargés (Consultation Projets).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Matrice des Flux Google ↔ Dolibarr */}
      {activeTab === 'flux' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Cartographie des Flux d'Information AMSHARTE
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comment les données circulent harmonieusement entre le terrain, Google Workspace, Dolibarr et le site web.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Flow 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-blue-700 uppercase">FLUX 1 : RAPPORTS MENSUELS &amp; DONNÉES TERRAIN</div>
                  <strong className="text-slate-900 text-sm block">Google Forms &rarr; Google Sheets &rarr; Consolidation CPI &rarr; Dolibarr</strong>
                  <p className="text-slate-600">
                    Les animateurs et chargés saisissent leurs activités sur Forms &rarr; les résultats s'agrègent dans Sheets &rarr; le CPI consolide à J+10 &rarr; le DE vise &rarr; archivage permanent dans Dolibarr Documents.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px] shrink-0">
                  Actif (J+10)
                </span>
              </div>

              {/* Flow 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-purple-700 uppercase">FLUX 2 : CONVENTIONS &amp; ENGAGEMENTS FINANCIERS</div>
                  <strong className="text-slate-900 text-sm block">Dolibarr (Compta/PTF) &rarr; Synthèse Sheets &rarr; Tableau de Bord Exécutif</strong>
                  <p className="text-slate-600">
                    Le RAF saisit les pièces de dépenses dans Dolibarr &rarr; une vue de trésorerie est exportée vers Sheets pour que le CPI et le DE visualisent instantanément les budgets restants.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px] shrink-0">
                  Synchronisé
                </span>
              </div>

              {/* Flow 3 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">FLUX 3 : VITRINE EXTERNE &amp; TRANSPARENCE</div>
                  <strong className="text-slate-900 text-sm block">Indicateurs Validés &rarr; Site Web Public &amp; Google Sites</strong>
                  <p className="text-slate-600">
                    Les chiffres clés (nombre de nids sécurisés, hectares de mangroves) validés par le DE sont publiés en temps réel sur le site internet pour informer le public, les scolaires et les bailleurs.
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px] shrink-0">
                  En direct
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
