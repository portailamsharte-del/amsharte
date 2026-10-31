import React, { useState } from 'react';
import { StakeholderForumThread, StakeholderForumComment } from '../types';
import { NGO_INFO } from '../data/initialData';
import {
  Users,
  Shield,
  MessageSquare,
  Building2,
  FileText,
  MapPin,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Send,
  HeartHandshake,
  Compass,
  PhoneCall,
  Sparkles,
  Share2,
  Anchor,
  HelpCircle
} from 'lucide-react';

interface StakeholdersSectionProps {
  threads: StakeholderForumThread[];
  onAddThread: (thread: StakeholderForumThread) => void;
  onAddComment: (threadId: string, comment: StakeholderForumComment) => void;
  onExtractThreadToReport: (thread: StakeholderForumThread) => void;
  onGoToNewsfeed?: () => void;
}

export const StakeholdersSection: React.FC<StakeholdersSectionProps> = ({
  threads,
  onAddThread,
  onAddComment,
  onExtractThreadToReport,
  onGoToNewsfeed
}) => {
  const [activeTab, setActiveTab] = useState<'forum' | 'ecosystem' | 'challenges' | 'communities'>('forum');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(threads[0]?.id || null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [replyAuthorName, setReplyAuthorName] = useState('Délégué Partenaire / Éco-garde');
  const [replyOrg, setReplyOrg] = useState('Acteur Local Togbin');
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);

  // New Thread State
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<StakeholderForumThread['category']>('tortues');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<StakeholderForumThread['priority']>('haute');
  const [newAuthor, setNewAuthor] = useState('SONON Tchéhouéa');
  const [newRole, setNewRole] = useState('Directeur Exécutif');
  const [newOrg, setNewOrg] = useState(NGO_INFO.name);

  const handleSendComment = (threadId: string) => {
    const text = replyContent[threadId]?.trim();
    if (!text) return;

    const now = new Date();
    const timestampStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) + 
      ' à ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newComm: StakeholderForumComment = {
      id: `comm-${Date.now()}`,
      authorName: replyAuthorName.trim() || 'Intervenant',
      authorRole: 'Partie Prenante Partenaire',
      organization: replyOrg.trim() || 'Réseau Littoral',
      timestamp: timestampStr,
      content: text,
      isOfficialVisa: true
    };

    onAddComment(threadId, newComm);
    setReplyContent(prev => ({ ...prev, [threadId]: '' }));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const now = new Date();
    const createdDate = now.toISOString().split('T')[0];

    const newThreadObj: StakeholderForumThread = {
      id: `thread-${Date.now()}`,
      title: newTitle.trim(),
      category: newCat,
      createdAt: createdDate,
      authorName: newAuthor.trim() || 'Partenaire',
      authorRole: newRole.trim() || 'Représentant',
      authorOrg: newOrg.trim() || 'Partie Prenante',
      description: newDesc.trim(),
      status: 'ouvert',
      priority: newPriority,
      comments: []
    };

    onAddThread(newThreadObj);
    setShowNewThreadModal(false);
    setNewTitle('');
    setNewDesc('');
    setExpandedThreadId(newThreadObj.id);
  };

  const getPriorityBadge = (p: StakeholderForumThread['priority']) => {
    switch (p) {
      case 'urgente':
        return { label: 'Urgence Terrain', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'haute':
        return { label: 'Priorité Haute', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'Concertation Régulière', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
  };

  const filteredThreads = threads.filter(t => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-teal-700/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
            <span>Pôle de Concertation Multi-Acteurs &amp; Co-Gestion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Tortues et Parties Prenantes
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
            Espace d'échange et d'alliance stratégique réunissant le Ministère du Cadre de Vie (MCVT), 
            la Police Républicaine (BPLP), les chefs de pêche de Togbin, les mécènes (AGL, Bénin Terminal, SOGEA SATOM), 
            la Maison de la Société Civile (MdSC) et les communautés côtières.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <button
              onClick={() => setShowNewThreadModal(true)}
              className="inline-flex items-center gap-2 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ouvrir un fil de concertation</span>
            </button>
            <a
              href={NGO_INFO.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Communauté WhatsApp Alerte</span>
            </a>
            <a
              href={NGO_INFO.facebookPage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Page Facebook Officielle</span>
            </a>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('forum')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'forum'
              ? 'bg-white border-t-2 border-t-teal-600 text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-teal-600" />
          <span>Forum de Discussion ({threads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ecosystem')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ecosystem'
              ? 'bg-white border-t-2 border-t-teal-600 text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Écosystème des Partenaires &amp; Reconnaissances</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'challenges'
              ? 'bg-white border-t-2 border-t-teal-600 text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Besoins Logistiques &amp; Défis de Terrain</span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-2 rounded-t-xl transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'communities'
              ? 'bg-white border-t-2 border-t-teal-600 text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Localisation Togbin &amp; Dialogue Réseaux</span>
        </button>
      </div>

      {/* TAB 1: FORUM DE DISCUSSION */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          {/* Quick info alert on the extraction bridge */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-indigo-900">
            <FileText className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Passerelle de Consolidation des Rapports (Règle J+10) :</strong>
              <p className="text-indigo-800 text-xs mt-0.5">
                Chaque sujet et chaque retour de terrain de ce forum peut être extrait en un clic pour nourrir 
                directement le rapport d'activité mensuel du Chargé de Programmes par Intérim (Henri Doudédji FATCHINA). 
                Cliquez sur <strong>« 📋 Verser au Rapport Mensuel »</strong>.
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tous les sujets ({threads.length})
            </button>
            <button
              onClick={() => setSelectedCategory('securite_bplp')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
                selectedCategory === 'securite_bplp'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              Sécurité BPLP &amp; Alertes
            </button>
            <button
              onClick={() => setSelectedCategory('financement_ptf')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
                selectedCategory === 'financement_ptf'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              AGL, Bénin Terminal &amp; SOGEA
            </button>
            <button
              onClick={() => setSelectedCategory('pecheurs_filets')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
                selectedCategory === 'pecheurs_filets'
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
              }`}
            >
              Pêcheurs &amp; Filets
            </button>
            <button
              onClick={() => setSelectedCategory('amp_politiques')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
                selectedCategory === 'amp_politiques'
                  ? 'bg-purple-600 text-white font-semibold'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              Aires Marines Protégées (MCVT)
            </button>
          </div>

          {/* Thread Cards */}
          <div className="space-y-4">
            {filteredThreads.map(thread => {
              const isExpanded = expandedThreadId === thread.id;
              const priorityBadge = getPriorityBadge(thread.priority);

              return (
                <div
                  key={thread.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition"
                >
                  {/* Thread Summary Header */}
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${priorityBadge.bg}`}>
                          {priorityBadge.label}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Initié par <strong>{thread.authorName}</strong> ({thread.authorOrg})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onExtractThreadToReport(thread)}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                          title="Transférer les conclusions de ce fil dans le rapport mensuel CPI"
                        >
                          <FileText className="w-3 h-3 text-indigo-600" />
                          <span>📋 Verser au Rapport Mensuel</span>
                        </button>
                      </div>
                    </div>

                    <h3
                      onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition flex items-center justify-between"
                    >
                      <span>{thread.title}</span>
                      <span className="text-xs text-slate-400 font-normal ml-2">
                        {isExpanded ? '▲ Réduire' : `▼ ${thread.comments.length} avis d'experts`}
                      </span>
                    </h3>

                    <p className="text-slate-700 text-xs sm:text-sm mt-2 leading-relaxed">
                      {thread.description}
                    </p>
                  </div>

                  {/* Comments & Dialogue Section */}
                  {isExpanded && (
                    <div className="bg-slate-50/80 border-t border-slate-100 p-5 sm:p-6 space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        <span>Avis et interventions des partenaires ({thread.comments.length})</span>
                      </h4>

                      <div className="space-y-3">
                        {thread.comments.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">Aucune intervention pour le moment. Soyez le premier à contribuer.</p>
                        ) : (
                          thread.comments.map(c => (
                            <div
                              key={c.id}
                              className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5 text-xs sm:text-sm"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                                <div className="flex items-center gap-2">
                                  <strong className="text-slate-900 font-bold">{c.authorName}</strong>
                                  <span className="text-slate-500">• {c.authorRole} ({c.organization})</span>
                                </div>
                                <span className="text-slate-400 text-2xs">{c.timestamp}</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">{c.content}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add comment input */}
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={replyAuthorName}
                            onChange={(e) => setReplyAuthorName(e.target.value)}
                            placeholder="Votre nom & titre..."
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={replyOrg}
                            onChange={(e) => setReplyOrg(e.target.value)}
                            placeholder="Organisation (ex: BPLP, Pêcheur, MCVT, AGL)..."
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={replyContent[thread.id] || ''}
                            onChange={(e) => setReplyContent(prev => ({ ...prev, [thread.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendComment(thread.id);
                            }}
                            placeholder="Écrire une observation ou un visa de conformité..."
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-teal-500"
                          />
                          <button
                            onClick={() => handleSendComment(thread.id)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Publier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ECOSYSTEME DES PARTENAIRES */}
      {activeTab === 'ecosystem' && (
        <div className="space-y-6">
          {/* Official Recognition Card */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Partenaire Officiel Étatique
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ministère du Cadre de Vie et des Transports (MCVT)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Reconnaissance formelle par la <strong>Lettre N° 878/MCVT/DC/CTR/SP-c du 07 Juillet 2026</strong>. 
                  {NGO_INFO.name} est le partenaire opérationnel de terrain pour la mise en œuvre des engagements marins, 
                  la vulgarisation des Aires Marines Protégées (créées par le Conseil des Ministres du 5 Janvier 2022), 
                  et la surveillance des côtes.
                </p>
                <div className="text-xs text-slate-500 pt-1">
                  • Distinction reçue : <em>Trophée « Femme modèle dans la protection de l'environnement » JIF 2022</em>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Police BPLP */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Police Républicaine &amp; BPLP</h4>
                  <p className="text-xs text-slate-500">Brigade de Protection du Littoral et des Plages</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opérations conjointes de nuit pour contrer les braconniers armés sur les plages de Togbin et Avlékété. 
                Sécurisation des nids et encadrement des lâchers de tortues.
              </p>
            </div>

            {/* AGL & Bénin Terminal */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">AGL &amp; Bénin Terminal</h4>
                  <p className="text-xs text-slate-500">Mécénat RSE Maritime</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Financement de la rénovation de l'écloserie modèle de Togbin Plage : clôture sécurisée, 
                bacs d'observation et aménagement du site d'accueil des visiteurs.
              </p>
            </div>

            {/* SOGEA SATOM & Consortium */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">SOGEA SATOM (Consortiums)</h4>
                  <p className="text-xs text-slate-500">Partenaire historique d'infrastructure écologique</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Appui à la construction de trois écloseries sur le littoral (Consortium Nature Tropicale - AMSHARTE - Action Plus) 
                et restauration participative des mangroves (Consortium ANA - Action Plus - AMSHARTE).
              </p>
            </div>

            {/* Maison de la Société Civile (MdSC) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Maison de la Société Civile (MdSC)</h4>
                  <p className="text-xs text-slate-500">Enregistrement historique du site</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enregistrement officiel du site des tortues de Togbin le <strong>26 Août 2026 à 18h30 par M. Gabin AZOMAN</strong>. 
                Appui institutionnel et renforcement des capacités des organisations communautaires.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEFIS DE TERRAIN ET BESOINS LOGISTIQUES */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Défis Opérationnels Réels d'AMSHARTE sur le Littoral :</strong>
              <p className="text-amber-800 text-xs mt-0.5">
                Ces points critiques sont recensés directement par les éco-gardes et le DE SONON Tchéhouéa pour orienter les 
                appuis des partenaires techniques et financiers (PTF).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NGO_INFO.fieldChallenges.map((challenge, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3 hover:border-teal-300 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 border border-teal-100">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {challenge}
                  </p>
                  <span className="text-2xs text-slate-400">
                    Priorité de résolution • Inclus dans la passerelle budgétaire Dolibarr / Sheets
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMMUNAUTES & LOCALISATION */}
      {activeTab === 'communities' && (
        <div className="space-y-6">
          {/* Map Location Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Site des Tortues Marines de Togbin Fandji
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Coordonnées GPS précises : 6°21'04.9"N 2°21'08.0"E • Commune d'Abomey-Calavi / Cotonou
                  </p>
                </div>
              </div>

              <a
                href={NGO_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ouvrir sur Google Maps</span>
              </a>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
              <p>
                <strong>Accès au site :</strong> Situé sur le cordon littoral de Togbin Fandji, immédiatement accessible par la route des pêches 
                entre Cotonou et Ouidah. L'écloserie modèle protégée accueille les pontes vulnérables et les séances de sensibilisation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-2xs uppercase font-bold">Latitude décimale</span>
                  <span className="font-mono font-bold text-slate-800">6.3513657° N</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-2xs uppercase font-bold">Longitude décimale</span>
                  <span className="font-mono font-bold text-slate-800">2.352215° E</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-2xs uppercase font-bold">Numéros d'alerte</span>
                  <span className="font-bold text-emerald-700">01 95 35 08 62 / 01 65 40 87 84</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels Connection Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  WA
                </div>
                <div>
                  <h4 className="font-bold text-base">Groupe WhatsApp Communautaire</h4>
                  <p className="text-xs text-emerald-200">Signalements rapides &amp; alertes nids</p>
                </div>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Connecte les chefs de pêche, les mareyeuses, les éco-gardes et les riverains pour signaler 
                immédiatement une tortue prise dans un filet ou une ponte en danger.
              </p>
              <a
                href={NGO_INFO.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                <span>Rejoindre le Groupe WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Facebook */}
            <div className="bg-blue-900 text-white p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                  f
                </div>
                <div>
                  <h4 className="font-bold text-base">Page Facebook Officielle</h4>
                  <p className="text-xs text-blue-200">Partage avec le grand public et la diaspora</p>
                </div>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed">
                Vidéos des lâchers en mer, reportages des patrouilles nocturnes, célébrations de l'initiative « Ayi Dji Ni Min » 
                et communiqués officiels.
              </p>
              <a
                href={NGO_INFO.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                <span>Visiter la Page Facebook</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Discussion Thread */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Ouvrir un nouveau sujet de concertation</h3>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre du sujet *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Organisation du démaillage sans mise à mort pour la flotte d'Avlékété"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thématique *</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as StakeholderForumThread['category'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="tortues">Tortues Marines &amp; Nids</option>
                    <option value="pecheurs_filets">Pêcheurs &amp; Réparation Filets</option>
                    <option value="securite_bplp">Sécurité BPLP &amp; Police</option>
                    <option value="financement_ptf">Mécénat &amp; Bailleurs PTF</option>
                    <option value="amp_politiques">Aires Marines Protégées (MCVT)</option>
                    <option value="communaute">Communauté &amp; Salubrité</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Degré de priorité</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as StakeholderForumThread['priority'])}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="haute">Priorité Haute</option>
                    <option value="urgente">Urgence de Terrain</option>
                    <option value="moyenne">Concertation Normale</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Votre Nom</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rôle</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Organisme</label>
                  <input
                    type="text"
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description &amp; Enjeux *</label>
                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Exposez clairement la situation constatée sur le terrain, les parties prenantes concernées et les propositions concrètes..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold"
                >
                  Créer le sujet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
