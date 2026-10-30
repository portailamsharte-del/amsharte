import React, { useState } from 'react';
import { NGO_INFO, INITIAL_PROJECTS, INITIAL_NEWS } from '../data/initialData';
import { FieldActionPost, StakeholderForumThread, StakeholderForumComment, ImpactMetricsState, OfficialDocument } from '../types';
import { FieldNewsfeed } from './FieldNewsfeed';
import { StakeholdersSection } from './StakeholdersSection';
import { AcronymExplainerCard } from './AcronymExplainerCard';
import { MediathequePhotothequeSection } from './MediathequePhotothequeSection';
import { TurtleAlertSection } from './TurtleAlertSection';
import { GovernanceSection } from './GovernanceSection';
import { AuthenticLogo } from './AuthenticLogo';
import { 
  ShieldCheck, 
  Leaf, 
  Waves, 
  Users, 
  FileCheck2, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Award,
  Globe2,
  Compass,
  MessageSquare,
  Newspaper,
  HeartHandshake,
  AlertTriangle,
  History,
  ShieldAlert,
  Camera,
  FileText,
  FolderArchive,
  Send,
  Landmark
} from 'lucide-react';
import { formatFCFA } from '../utils/helpers';

interface PublicWebsiteProps {
  onGoToIntranet: (tab?: string) => void;
  actions: FieldActionPost[];
  onAddAction: (action: FieldActionPost) => void;
  onUpdateAction?: (action: FieldActionPost) => void;
  onExtractActionToReport: (action: FieldActionPost) => void;
  threads: StakeholderForumThread[];
  onAddThread: (thread: StakeholderForumThread) => void;
  onAddComment: (threadId: string, comment: StakeholderForumComment) => void;
  onExtractThreadToReport: (thread: StakeholderForumThread) => void;
  impactMetrics?: ImpactMetricsState;
  officialDocuments?: OfficialDocument[];
  onGoToWebmastering?: () => void;
  estConnecte?: boolean;
  effectifMembres?: number;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({ 
  onGoToIntranet,
  actions,
  onAddAction,
  onUpdateAction,
  onExtractActionToReport,
  threads,
  onAddThread,
  onAddComment,
  onExtractThreadToReport,
  impactMetrics,
  officialDocuments,
  onGoToWebmastering,
  estConnecte = false,
  effectifMembres = 0
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'fil_actualite'
    | 'tortues_parties_prenantes'
    | 'alerte_urgence'
    | 'mediatheque_phototheque'
    | 'gouvernance_ca'
  >('fil_actualite');

  // Key metrics (synchronized live with CPI & DE validation)
  const totalNests = impactMetrics?.nidsProtegesTotal ?? 87;
  const totalHatchlings = impactMetrics?.bebesTortuesRelacheesTotal ?? 6140;
  const totalMangrovesHectares = impactMetrics?.mangrovesRestaureesHa ?? 24.5;
  const totalEcoGuards = impactMetrics?.ecoGardesActifs ?? 28;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Top Banner Alert / Emergency hotline */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Alerte Nids &amp; Tortues Marines Littoral Bénin :</span>
            <span className="font-mono text-emerald-400 font-bold">01 95 35 08 62 / 01 65 40 87 84</span>
          </div>
          <div className="flex items-center gap-3 text-2xs sm:text-xs">
            <a 
              href={NGO_INFO.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition text-slate-300"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Site Togbin (6°21'04.9"N 2°21'08.0"E)</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href={NGO_INFO.facebookPage} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950 text-white py-8 sm:py-10 px-4 border-b border-teal-800/40">
        <div className="max-w-6xl mx-auto text-center space-y-5">
          {/* Badges de Reconnaissance Officielle */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-300">
              <span>🇧🇯 ONG AMSHARTE (Ex-AMSHART)</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              <span>22 ans de Résilience (2004 - 2026)</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
              <span>Partenaire Officiel MCVT</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>« A » pour <strong>Amis du Monde</strong> (et non « Action »)</span>
            </div>
          </div>

          {/* Texte Descriptif Officiel */}
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl mx-auto font-light leading-relaxed text-center">
            Site officiel des <strong>Tortues Marines de Togbin Plage</strong> (6°21'04.9"N 2°21'08.0"E), 
            patrouilles de surveillance conjointes avec la <strong>Police Républicaine (BPLP)</strong>, 
            sauvegarde des nids, baguage biométrique (<span className="text-emerald-300 font-mono font-semibold">BJ 2872, BJ 2871</span>) 
            et restauration communautaire des mangroves.
          </p>

          {/* Ligne Blanche Fondue avec Représentation Coloriée des Boutons (entre le texte et les chiffres) */}
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl border border-slate-200/90 max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 overflow-x-auto py-0.5">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-medium">
                {/* 1. FIL D'ACTUALITÉ - VERT */}
                <button
                  onClick={() => setActiveTab('fil_actualite')}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-xs font-bold ${
                    activeTab === 'fil_actualite'
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/40'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <span>Fil d'Actualité</span>
                </button>

                {/* 2. PARTIES PRENANTES - TEAL/BLEU */}
                <button
                  onClick={() => setActiveTab('tortues_parties_prenantes')}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-xs font-bold ${
                    activeTab === 'tortues_parties_prenantes'
                      ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-500/40'
                      : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200/90'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                  <span>Parties Prenantes</span>
                </button>

                {/* 3. SIGNALER TORTUE - ROUGE VIF */}
                <button
                  onClick={() => setActiveTab('alerte_urgence')}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-xs font-bold shadow-md ${
                    activeTab === 'alerte_urgence'
                      ? 'bg-red-700 text-white ring-2 ring-red-500/50 animate-pulse'
                      : 'bg-red-600 hover:bg-red-700 text-white ring-1 ring-red-400/80 animate-pulse'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>🚨 Signaler Tortue</span>
                </button>

                {/* 4. MÉDIATHÈQUE & PHOTOTHÈQUE - AMBRE */}
                <button
                  onClick={() => setActiveTab('mediatheque_phototheque')}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-xs font-bold ${
                    activeTab === 'mediatheque_phototheque'
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-500/40'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90'
                  }`}
                >
                  <FolderArchive className="w-4 h-4 text-amber-600" />
                  <span>Médiathèque &amp; Photothèque</span>
                </button>

                {/* 5. CONSEIL D'ADMINISTRATION - INDIGO */}
                <button
                  onClick={() => setActiveTab('gouvernance_ca')}
                  className={`px-3 py-2 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-xs font-bold ${
                    activeTab === 'gouvernance_ca'
                      ? 'bg-indigo-700 text-white shadow-md ring-2 ring-indigo-500/40'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200/90'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-indigo-600" />
                  <span>Conseil d'Administration</span>
                </button>
              </div>

              {/* 6. DIRECTION EXÉCUTIVE - ARDOISE/VERT */}
              <button
                onClick={() => onGoToIntranet('espace-travail')}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-600/40 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md transition cursor-pointer whitespace-nowrap shrink-0"
                title="Direction Exécutive AMSHARTE — Espace de Travail des membres et Cockpit"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>DE Amsharte</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar (Chiffres Clés placés immédiatement après la ligne de boutons) */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-3">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">{totalNests}</div>
              <div className="text-xs text-slate-300 mt-0.5 font-medium">Nids protégés en écloserie</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-3">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">+{totalHatchlings.toLocaleString('fr-FR')}</div>
              <div className="text-xs text-slate-300 mt-0.5 font-medium">Tortues relâchées en mer</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-3">
              <div className="text-2xl sm:text-3xl font-black text-teal-400">{effectifMembres} Membres</div>
              <div className="text-xs text-slate-300 mt-0.5 font-medium">Équipe &amp; Bénévoles dévoués</div>
            </div>
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-xl p-3">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">35 km</div>
              <div className="text-xs text-slate-300 mt-0.5 font-medium">Plage littorale sous veille</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dynamic Content depending on Tab */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* TAB: FIL D'ACTUALITE DES ACTIONS DE TERRAIN */}
        {activeTab === 'fil_actualite' && (
          <FieldNewsfeed
            actions={actions}
            onAddAction={onAddAction}
            onUpdateAction={onUpdateAction}
            onExtractToReport={onExtractActionToReport}
            onGoToForum={() => setActiveTab('tortues_parties_prenantes')}
            estConnecte={estConnecte}
          />
        )}

        {/* TAB: GOUVERNANCE & CONSEIL D'ADMINISTRATION */}
        {activeTab === 'gouvernance_ca' && (
          <GovernanceSection
            officialDocuments={officialDocuments}
            onGoToMediatheque={() => setActiveTab('mediatheque_phototheque')}
            onGoToIntranet={onGoToIntranet}
          />
        )}

        {/* TAB: TORTUES ET PARTIES PRENANTES */}
        {activeTab === 'tortues_parties_prenantes' && (
          <StakeholdersSection
            threads={threads}
            onAddThread={onAddThread}
            onAddComment={onAddComment}
            onExtractThreadToReport={onExtractThreadToReport}
            onGoToNewsfeed={() => setActiveTab('fil_actualite')}
          />
        )}

        {/* TAB: ALERTE & SIGNALEMENT D'URGENCE */}
        {activeTab === 'alerte_urgence' && (
          <TurtleAlertSection />
        )}

        {/* TAB: MÉDIATHÈQUE & PHOTOTHÈQUE (Unified component with 2 sub-buttons: Médiathèque & Photothèque) */}
        {activeTab === 'mediatheque_phototheque' && (
          <MediathequePhotothequeSection 
            documents={officialDocuments} 
            onGoToWebmastering={onGoToWebmastering} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-2.5 inline-block shadow-sm">
              <AuthenticLogo size="sm" className="w-24 h-13" />
            </div>
            <div className="text-white font-bold text-sm leading-snug">{NGO_INFO.name}</div>
            <p className="text-slate-400 text-xs">Organisation Non Gouvernementale régie par la Loi 2025-19 (Attestation N° {NGO_INFO.legalCompliance.certificateNo})</p>
            <p className="text-slate-500">Siège : {NGO_INFO.headquarters}</p>
            <div className="text-2xs text-emerald-400 font-mono">
              6°21'04.9"N 2°21'08.0"E • Togbin Plage
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">Contact d'Urgence</div>
            <p>{NGO_INFO.postalAddress}</p>
            <p className="font-mono flex flex-wrap items-center gap-1.5 text-xs">
              <span>Tél :</span>
              <a 
                href={`tel:${NGO_INFO.phones[0].replace(/[^0-9+]/g, '')}`} 
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
              >
                {NGO_INFO.phones[0]}
              </a>
              <span>/</span>
              <a 
                href={`tel:${NGO_INFO.phones[1].replace(/[^0-9+]/g, '')}`} 
                className="text-slate-300 hover:text-white hover:underline"
              >
                {NGO_INFO.phones[1]}
              </a>
            </p>
            <p>
              Email :{' '}
              <a 
                href={`mailto:${NGO_INFO.email}`} 
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
              >
                {NGO_INFO.email}
              </a>
            </p>
            <p className="text-slate-500">Partenaire Officiel MCVT (Lettre N° 878/MCVT)</p>
          </div>

          <div className="space-y-3">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">Gouvernance Institutionnelle &amp; Intranet</div>
            <p className="text-slate-300 text-xs">
              Présidente du Conseil d'Administration : <strong className="text-white">{NGO_INFO.boardPresident}</strong>
            </p>
            <p className="text-slate-400 text-2xs">
              Directeur Exécutif : <strong>{NGO_INFO.executiveDirector}</strong> • Chargé de Programmes (CPI) : <strong>{NGO_INFO.interimProgramManager}</strong>
            </p>
            <div className="pt-1 flex flex-col gap-1.5 text-xs">
              <button
                onClick={() => {
                  setActiveTab('gouvernance_ca');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer text-left"
              >
                <span>Conseil d'Administration (Statuts &amp; Pouvoirs)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onGoToIntranet('espace-travail')}
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer text-left"
              >
                <span>Direction Exécutive AMSHARTE — Espace de Travail DE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800/80 text-center text-slate-500 text-2xs">
          © 2004 - 2026 ONG AMSHARTE (22 ans de résilience). Conformité Loi 2025-19. Système Hybride Google Workspace &amp; Dolibarr.
        </div>
      </footer>
    </div>
  );
};
