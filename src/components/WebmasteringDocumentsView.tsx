import React, { useState } from 'react';
import { 
  FolderLock, 
  FilePlus, 
  Edit3, 
  Trash2, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building, 
  Tag, 
  UploadCloud, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bot,
  Shield,
  Clock,
  Check,
  X,
  Send,
  Zap,
  Lock,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { OfficialDocument, ExecutiveMember, AiDraftDocument } from '../types';
import { NGO_INFO, INITIAL_AI_DRAFT_DOCUMENTS } from '../data/initialData';

interface WebmasteringDocumentsViewProps {
  documents: OfficialDocument[];
  onAddDocument: (doc: OfficialDocument) => void;
  onUpdateDocument: (doc: OfficialDocument) => void;
  onDeleteDocument: (docId: string) => void;
  currentMember?: ExecutiveMember;
  onNotify?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error', category?: 'document') => void;
  onGoToPublicMediatheque?: () => void;
  onGoToPublicDocs?: () => void;
}

export const WebmasteringDocumentsView: React.FC<WebmasteringDocumentsViewProps> = ({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
  currentMember,
  onNotify,
  onGoToPublicMediatheque,
  onGoToPublicDocs
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<OfficialDocument | null>(null);
  const [previewDoc, setPreviewDoc] = useState<OfficialDocument | null>(null);

  // Sub-navigation: Published Documents vs AI Approval Queue
  const [activeSubView, setActiveSubView] = useState<'published' | 'ai_queue'>('published');

  // AI Queue State (Human-in-the-Loop)
  const [aiDrafts, setAiDrafts] = useState<AiDraftDocument[]>(INITIAL_AI_DRAFT_DOCUMENTS);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiPromptText, setAiPromptText] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiDraftPreview, setAiDraftPreview] = useState<AiDraftDocument | null>(null);
  const [selectedDraftForReview, setSelectedDraftForReview] = useState<AiDraftDocument | null>(null);
  const [aiQueueStatusFilter, setAiQueueStatusFilter] = useState<'all' | 'en_attente_visa' | 'valide_publie' | 'rejete'>('all');
  const [expandedRawDraftIds, setExpandedRawDraftIds] = useState<Record<string, boolean>>({});

  // Access Rights (RBAC) Governance Modal
  const [showAccessRightsModal, setShowAccessRightsModal] = useState<boolean>(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<OfficialDocument['category']>('reconnaissance_etat');
  const [formRef, setFormRef] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formIssuedBy, setFormIssuedBy] = useState('Direction Exécutive AMSHARTE');
  const [formDescription, setFormDescription] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formSummaryPoints, setFormSummaryPoints] = useState<string[]>(['']);
  const [formKeyTerms, setFormKeyTerms] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formVersion, setFormVersion] = useState('v1.0');
  const [formStatus, setFormStatus] = useState<'actif' | 'en_revision' | 'archive'>('actif');
  const [uploadedFileNotice, setUploadedFileNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les Documents' },
    { id: 'reconnaissance_etat', label: 'Reconnaissance MCVT' },
    { id: 'juridique', label: 'Juridique & Loi 2025-19' },
    { id: 'protocole_scientifique', label: 'Protocoles Scientifiques' },
    { id: 'guide_terrain', label: 'Guides & Police BPLP' },
    { id: 'partenariat', label: 'Conventions Partenaires' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      doc.title.toLowerCase().includes(q) ||
      doc.referenceNumber.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.issuedBy.toLowerCase().includes(q) ||
      doc.keyTerms.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleOpenCreateModal = () => {
    setEditingDoc(null);
    setFormTitle('');
    setFormCategory('reconnaissance_etat');
    setFormRef(`AMSHARTE/DOC/2026/${Math.floor(100 + Math.random() * 900)}`);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormIssuedBy('Ministère du Cadre de Vie et des Transports (MCVT)');
    setFormDescription('');
    setFormFileName('AMSHARTE_Nouveau_Document_2026.pdf');
    setFormSummaryPoints(['Point clé 1 relatif au protocole ou à la convention.']);
    setFormKeyTerms('AMSHARTE, Littoral Bénin, Togbin');
    setFormIsFeatured(false);
    setFormVersion('v1.0');
    setFormStatus('actif');
    setUploadedFileNotice(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (doc: OfficialDocument) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormRef(doc.referenceNumber);
    setFormDate(doc.issueDate);
    setFormIssuedBy(doc.issuedBy);
    setFormDescription(doc.description);
    setFormFileName(doc.downloadFileName);
    setFormSummaryPoints(doc.contentSummary.length > 0 ? doc.contentSummary : ['']);
    setFormKeyTerms(doc.keyTerms.join(', '));
    setFormIsFeatured(doc.isFeatured ?? false);
    setFormVersion(doc.version || 'v1.0');
    setFormStatus(doc.status || 'actif');
    setUploadedFileNotice(null);
    setShowModal(true);
  };

  const handleAddSummaryPoint = () => {
    setFormSummaryPoints([...formSummaryPoints, '']);
  };

  const handleRemoveSummaryPoint = (index: number) => {
    if (formSummaryPoints.length > 1) {
      setFormSummaryPoints(formSummaryPoints.filter((_, i) => i !== index));
    }
  };

  const handleSummaryPointChange = (index: number, val: string) => {
    const updated = [...formSummaryPoints];
    updated[index] = val;
    setFormSummaryPoints(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFileName(file.name);
      setUploadedFileNotice(`Fichier « ${file.name} » (${Math.round(file.size / 1024)} Ko) prêt pour association.`);
    }
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const termsArray = formKeyTerms
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const cleanSummaryPoints = formSummaryPoints
      .map(p => p.trim())
      .filter(Boolean);

    if (editingDoc) {
      // Update existing
      const updated: OfficialDocument = {
        ...editingDoc,
        title: formTitle.trim(),
        category: formCategory,
        referenceNumber: formRef.trim(),
        issueDate: formDate,
        issuedBy: formIssuedBy.trim(),
        description: formDescription.trim(),
        downloadFileName: formFileName.trim() || `${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
        contentSummary: cleanSummaryPoints.length > 0 ? cleanSummaryPoints : ['Contenu révisé conforme.'],
        keyTerms: termsArray.length > 0 ? termsArray : ['AMSHARTE'],
        isFeatured: formIsFeatured,
        version: formVersion.trim() || 'v1.1',
        lastUpdated: new Date().toISOString().split('T')[0],
        status: formStatus
      };

      onUpdateDocument(updated);
      if (onNotify) {
        onNotify(
          'Document Mis à Jour',
          `Le document « ${updated.title} » (${updated.referenceNumber}) a été actualisé avec succès.`,
          'success',
          'document'
        );
      }
    } else {
      // Insert new
      const newDoc: OfficialDocument = {
        id: `doc-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        referenceNumber: formRef.trim() || `AMSHARTE/DOC/${Date.now().toString().slice(-4)}`,
        issueDate: formDate,
        issuedBy: formIssuedBy.trim() || 'AMSHARTE Bénin',
        description: formDescription.trim() || 'Document institutionnel de l\'ONG AMSHARTE.',
        downloadFileName: formFileName.trim() || 'Document_AMSHARTE.pdf',
        contentSummary: cleanSummaryPoints.length > 0 ? cleanSummaryPoints : ['Document officiel enregistré.'],
        keyTerms: termsArray.length > 0 ? termsArray : ['AMSHARTE', 'Environnement'],
        isFeatured: formIsFeatured,
        version: formVersion.trim() || 'v1.0',
        lastUpdated: new Date().toISOString().split('T')[0],
        status: formStatus
      };

      onAddDocument(newDoc);
      if (onNotify) {
        onNotify(
          'Nouveau Document Inséré',
          `Le document officiel « ${newDoc.title} » est désormais en ligne dans la médiathèque.`,
          'success',
          'document'
        );
      }
    }

    setShowModal(false);
  };

  const handleDelete = (doc: OfficialDocument) => {
    const confirm = window.confirm(`Êtes-vous certain de vouloir supprimer ou archiver le document « ${doc.title} » ?`);
    if (confirm) {
      onDeleteDocument(doc.id);
      if (onNotify) {
        onNotify(
          'Document Retiré',
          `Le document « ${doc.title} » a été retiré de la médiathèque active.`,
          'info',
          'document'
        );
      }
    }
  };

  // AI Drafting & Structuring Algorithm (Human-in-the-Loop)
  const handleGenerateAiDraft = (sourceText: string) => {
    if (!sourceText.trim()) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const text = sourceText.toLowerCase();
      let category: OfficialDocument['category'] = 'protocole_scientifique';
      let title = "Note Technique de Protection du Littoral";
      let refPrefix = "NOTE-OPER";
      let issuer = "Direction Exécutive AMSHARTE";

      if (text.includes('mcvt') || text.includes('ministère') || text.includes('arrête') || text.includes('décision') || text.includes('dgec')) {
        category = 'reconnaissance_etat';
        title = "Arrêté / Décision de Reconnaissance Ministérielle MCVT";
        refPrefix = "MCVT-DEC";
        issuer = "Ministère du Cadre de Vie et des Transports (MCVT)";
      } else if (text.includes('loi') || text.includes('statut') || text.includes('justice') || text.includes('2025-19') || text.includes('tribunal') || text.includes('décret')) {
        category = 'juridique';
        title = "Dispositions Légales & Conformité Statutaire (Loi 2025-19)";
        refPrefix = "JUR-CONF";
        issuer = "Direction Exécutive & Conseil d'Administration AMSHARTE";
      } else if (text.includes('partenaire') || text.includes('ptf') || text.includes('bailleur') || text.includes('accord') || text.includes('convention') || text.includes('subvention') || text.includes('fem') || text.includes('agl')) {
        category = 'partenariat';
        title = "Protocole d'Accord & Convention Partenaire PTF";
        refPrefix = "CONV-PTF";
        issuer = "Consortium Partenaires & Direction AMSHARTE";
      } else if (text.includes('guide') || text.includes('police') || text.includes('bplp') || text.includes('garde') || text.includes('sécurité') || text.includes('patrouille')) {
        category = 'guide_terrain';
        title = "Guide Opérationnel de Patrouille & Sécurité Plage";
        refPrefix = "GUIDE-TERRAIN";
        issuer = "Cellule Éco-gardes & Police Républicaine (BPLP)";
      } else {
        category = 'protocole_scientifique';
        title = "Protocole Scientifique de Suivi des Chéloniens & Écosystèmes";
        refPrefix = "PROT-SCI";
        issuer = "Cellule Scientifique & CPI Henri D. FATCHINA";
      }

      // If source text starts with a clear title line, adapt it
      const firstLine = sourceText.split('\n')[0].trim();
      if (firstLine.length > 8 && firstLine.length < 110) {
        title = firstLine.replace(/^[0-9\W]+/, '');
      }

      const randomNum = Math.floor(100 + Math.random() * 900);
      const generatedRef = `AMSHARTE/DIR/2026/${refPrefix}-${randomNum}`;
      const today = new Date().toISOString().split('T')[0];

      const proposedDoc: OfficialDocument = {
        id: `doc-ai-${Date.now()}`,
        title: title,
        category: category,
        referenceNumber: generatedRef,
        issueDate: today,
        issuedBy: issuer,
        description: `Synthèse exécutive structurée par l'Assistant IA AMSHARTE : ${sourceText.slice(0, 190)}...`,
        downloadFileName: `AMSHARTE_${refPrefix}_2026_${randomNum}.pdf`,
        contentSummary: [
          "Extraction des directives prioritaires et alignement avec la réglementation environnementale béninoise.",
          "Coordination requise avec les brigades de patrouille de Togbin Fandji et les comités côtiers.",
          "Validation et visa impératif par le Directeur Exécutif ou le CPI avant opposabilité publique.",
          "Archivage numérique au répertoire central Google Drive AMSHARTE sous la cote officielle."
        ],
        keyTerms: ["AMSHARTE", category.toUpperCase(), "Togbin Fandji", "Littoral Bénin", "Loi 2025-19"],
        isFeatured: false,
        version: "v1.0 (Proposé par IA)",
        lastUpdated: today,
        status: "en_revision"
      };

      const newAiDraft: AiDraftDocument = {
        id: `ai-draft-${Date.now()}`,
        rawPromptOrText: sourceText,
        proposedDoc: proposedDoc,
        aiConfidenceScore: Math.floor(92 + Math.random() * 7),
        aiAnalysisNotes: `Classification automatique sous '${category}' effectuée avec succès. L'IA a normalisé la référence (${generatedRef}) et isolé les 4 points cardinaux. La publication est en attente de votre visa humain.`,
        createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        status: 'en_attente_visa',
        preparedBy: 'Assistant IA AMSHARTE v2.5'
      };

      setAiDraftPreview(newAiDraft);
      setAiDrafts(prev => [newAiDraft, ...prev]);
      setIsAiGenerating(false);

      if (onNotify) {
        onNotify(
          'Projet IA Structuré',
          `L'IA a structuré « ${proposedDoc.title} ». La proposition est en attente de votre visa dans la file d'attente.`,
          'info',
          'document'
        );
      }
    }, 700);
  };

  const handleApproveAndPublishAiDraft = (draft: AiDraftDocument) => {
    // 1. Add to active official published documents
    const finalizedDoc: OfficialDocument = {
      ...draft.proposedDoc,
      status: 'actif',
      version: draft.proposedDoc.version?.replace(' (Proposé par IA)', '') || 'v1.0'
    };
    onAddDocument(finalizedDoc);

    // 2. Update draft status in AI queue
    const reviewer = currentMember ? `${currentMember.name} (${currentMember.role})` : 'Henri Doudédji FATCHINA (CPI)';
    setAiDrafts(prev => prev.map(d => d.id === draft.id ? {
      ...d,
      status: 'valide_publie',
      reviewedBy: reviewer,
      validatedAt: new Date().toLocaleDateString('fr-FR')
    } : d));

    if (aiDraftPreview?.id === draft.id) {
      setAiDraftPreview(null);
    }
    setShowAiModal(false);
    setSelectedDraftForReview(null);

    if (onNotify) {
      onNotify(
        'Document Validé & Mis en Ligne',
        `L'acte officiel « ${finalizedDoc.title} » (${finalizedDoc.referenceNumber}) a été approuvé par ${reviewer} et publié dans la médiathèque.`,
        'success',
        'document'
      );
    }
  };

  const handleRejectAiDraft = (draftId: string) => {
    setAiDrafts(prev => prev.map(d => d.id === draftId ? {
      ...d,
      status: 'rejete',
      reviewedBy: currentMember ? currentMember.name : 'Direction',
      reviewNotes: 'Proposition rejetée ou révisée séparément après analyse humaine.'
    } : d));

    if (selectedDraftForReview?.id === draftId) {
      setSelectedDraftForReview(null);
    }

    if (onNotify) {
      onNotify(
        'Proposition IA Rejetée',
        'La proposition d\'acte a été retirée de la file d\'attente de publication.',
        'warning',
        'document'
      );
    }
  };

  const handleEditAiDraftBeforeVisa = (draft: AiDraftDocument) => {
    handleOpenEditModal(draft.proposedDoc);
    setShowAiModal(false);
    setSelectedDraftForReview(null);
  };

  const handleDownload = (doc: OfficialDocument) => {
    const textContent = `================================================================================
RÉPUBLIQUE DU BÉNIN — ONG AMSHARTE (ASR-E BÉNIN)
DOCUMENT OFFICIEL CERTIFIÉ CONFORME
================================================================================
TITRE : ${doc.title.toUpperCase()}
RÉFÉRENCE OFFICIELLE : ${doc.referenceNumber}
CATÉGORIE : ${doc.category.toUpperCase()}
DATE D'ÉMISSION : ${doc.issueDate}
ORGANISME ÉMETTEUR : ${doc.issuedBy}
VERSION : ${doc.version || 'v1.0'} (Dernière révision : ${doc.lastUpdated || doc.issueDate})
STATUT : ${(doc.status || 'actif').toUpperCase()}
FICHIER ATTACHÉ : ${doc.downloadFileName}
--------------------------------------------------------------------------------

1. OBJET & DESCRIPTION OFFICIELLE :
${doc.description}

2. DISPOSITIONS & POINTS CLÉS :
${doc.contentSummary.map((pt, i) => `  ${i + 1}. ${pt}`).join('\n')}

3. MOTS-CLÉS & INDEXATION INSTITUTIONNELLE :
${doc.keyTerms.join(' | ')}

--------------------------------------------------------------------------------
CADRE JURIDIQUE & CONFORMITÉ :
- Régime juridique : Loi N° 2025-19 relative aux ONG en République du Bénin
- Partenaire officiel étatique : Ministère du Cadre de Vie & des Transports (MCVT - Lettre N° 878)
- Sécurisation littorale conjointe : Police Républicaine (Brigade BPLP)
- Siège : Togbin Fandji, Arrondissement de Godomey, Bénin
- Direction Exécutive : SONON Tchéhouéa | Chargé de Programmes : Henri D. FATCHINA
================================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.downloadFileName.endsWith('.pdf') 
      ? doc.downloadFileName.replace('.pdf', '_Certifie_AMSHARTE.txt') 
      : `${doc.downloadFileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify(
        'Document Téléchargé',
        `Le fichier certifié pour « ${doc.title} » a été téléchargé.`,
        'success',
        'document'
      );
    }
  };

  const handleExportAllInventory = () => {
    const headers = ['ID', 'Titre', 'Categorie', 'Reference', 'Date_Emission', 'Emetteur', 'Version', 'Statut', 'Fichier'];
    const rows = documents.map(d => [
      `"${d.id}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      `"${d.referenceNumber}"`,
      `"${d.issueDate}"`,
      `"${d.issuedBy.replace(/"/g, '""')}"`,
      `"${d.version || 'v1.0'}"`,
      `"${d.status || 'actif'}"`,
      `"${d.downloadFileName}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `INVENTAIRE-DOCUMENTS-AMSHARTE-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify(
        'Inventaire Exporté',
        'L\'inventaire complet de tous les documents a été exporté au format CSV.',
        'success',
        'document'
      );
    }
  };

  return (
    <div id="webmastering-documents-view" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-xl border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <FolderLock className="w-3.5 h-3.5" />
              <span>Console d'Administration &amp; Webmastering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gestionnaire des Documents Officiels &amp; Actes Légaux
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Espace webmestre dédié au CPI (Henri D. FATCHINA) et à la Direction. Insérez de nouveaux documents, modifiez les arrêtés ministériels, mettez à jour les protocoles scientifiques et publiez-les directement sur le site public.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>{showTutorial ? 'Masquer le Guide' : 'Guide Webmastering'}</span>
              {showTutorial ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleExportAllInventory}
              className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer shadow-xs"
              title="Télécharger la liste complète des documents au format CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Inventaire (CSV)</span>
            </button>

            <button
              id="btn-delegate-ai"
              onClick={() => {
                setAiPromptText('');
                setAiDraftPreview(null);
                setShowAiModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-purple-950/40"
              title="Déléguer à l'IA la structuration d'un acte officiel avant votre validation humaine"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>🤖 Déléguer à l'IA</span>
            </button>

            <button
              id="btn-insert-new-document"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-950/40"
            >
              <FilePlus className="w-4 h-4" />
              <span>+ Insérer un Document</span>
            </button>
          </div>
        </div>

        {/* Access Rights & Governance Banner (Transparent RBAC) */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-white">Droit d'Accès Webmastering :</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-2xs">
                  {currentMember ? `${currentMember.name} • ${currentMember.role}` : 'Henri Doudédji FATCHINA (CPI)'}
                </span>
                <span className="text-2xs text-emerald-400 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Accès Habilité : Rédaction, Délégation IA &amp; Visa</span>
                </span>
              </div>
              <p className="text-slate-400 text-2xs mt-0.5">
                Conformément à la Loi N° 2025-19 et aux statuts AMSHARTE, l'accès webmestre est strictement réservé au <strong>Chargé de Programmes par Intérim (CPI)</strong> et au <strong>Directeur Exécutif (DE)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAccessRightsModal(true)}
            className="self-start md:self-auto px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 border border-emerald-600/40 text-2xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-emerald-300" />
            <span>Qui a droit au Webmastering ?</span>
          </button>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-800/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-emerald-800/30">
            <span className="text-slate-400 block text-2xs uppercase font-bold">Documents Actifs</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">{documents.length} actes</span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-emerald-800/30">
            <span className="text-slate-400 block text-2xs uppercase font-bold">File d'Attente IA</span>
            <span className="text-xl font-black text-purple-300 mt-0.5 block flex items-center gap-1.5">
              <span>{aiDrafts.filter(d => d.status === 'en_attente_visa').length} projets</span>
              {aiDrafts.filter(d => d.status === 'en_attente_visa').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-emerald-800/30">
            <span className="text-slate-400 block text-2xs uppercase font-bold">Reconnaissances MCVT</span>
            <span className="text-xl font-black text-cyan-400 mt-0.5 block">
              {documents.filter(d => d.category === 'reconnaissance_etat').length} agréments
            </span>
          </div>
          <div className="bg-slate-950/50 p-3 rounded-xl border border-emerald-800/30">
            <span className="text-slate-400 block text-2xs uppercase font-bold">Protocoles &amp; Partenariats</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              {documents.filter(d => d.category === 'protocole_scientifique' || d.category === 'partenariat').length} accords
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs: Published Acts vs AI Queue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('published')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubView === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FolderLock className="w-4 h-4" />
            <span>Répertoire des Actes Publiés</span>
            <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${
              activeSubView === 'published' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-700'
            }`}>
              {documents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubView('ai_queue')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeSubView === 'ai_queue'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>File d'Attente IA (À Valider)</span>
            <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold ${
              aiDrafts.filter(d => d.status === 'en_attente_visa').length > 0
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {aiDrafts.filter(d => d.status === 'en_attente_visa').length} en attente
            </span>
          </button>
        </div>

        <div className="text-2xs text-slate-500 flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Règle : <em>« L'IA propose, l'humain dispose (validation CPI/DE requise) »</em></span>
        </div>
      </div>

      {/* Published Documents Sub-view */}
      {activeSubView === 'published' && (
        <div className="space-y-6">
          {/* 2. Interactive Step-by-Step Tutorial / Guide for Webmastering */}
          {showTutorial && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-5 sm:p-7 shadow-lg space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tutoriel Pratique Webmastering : Comment insérer et modifier les documents
                </h3>
                <p className="text-xs text-slate-500">Guide à destination du Webmestre, du CPI et de l'équipe de coordination</p>
              </div>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
            >
              Fermer ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-2xs">
                1
              </div>
              <h4 className="font-bold text-emerald-950 text-sm">Insérer un Nouveau Document</h4>
              <p className="text-slate-600 leading-relaxed">
                Cliquez sur le bouton vert <strong>« + Insérer un Nouveau Document »</strong>. Renseignez le titre officiel, la référence légale (ex: <em>AMSHARTE/DIR/2026/089</em>), l'organisme émetteur (MCVT, BPLP, MISP), puis attachez votre fichier PDF ou Word.
              </p>
            </div>

            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 space-y-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xs">
                2
              </div>
              <h4 className="font-bold text-blue-950 text-sm">Modifier ou Corriger un Document</h4>
              <p className="text-slate-600 leading-relaxed">
                Sur n'importe quelle fiche ci-dessous, cliquez sur <strong>« ✏️ Modifier »</strong>. Vous pouvez actualiser les dates d'échéance, corriger un point clé, incrémenter la version (ex: passer de <em>v1.0</em> à <em>v1.1</em>) et remplacer le document joint.
              </p>
            </div>

            <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-2xs">
                3
              </div>
              <h4 className="font-bold text-purple-950 text-sm">Synchronisation Immédiate</h4>
              <p className="text-slate-600 leading-relaxed">
                Dès l'enregistrement, le document est immédiatement visible dans la <strong>Médiathèque Publique</strong> de l'ONG (onglet Médiathèque &amp; Photothèque) pour les partenaires techniques, les bailleurs et les citoyens.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span><strong>Astuce :</strong> Cochez l'option <em>« Mettre en avant sur la page d'accueil »</em> pour les décrets majeurs comme la Loi 2025-19 ou la Lettre MCVT 878.</span>
            </div>
            {onGoToPublicDocs && (
              <button
                onClick={onGoToPublicDocs}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Vérifier le rendu sur le site public</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par titre, référence, émetteur..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 4. Document Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-base">Aucun document ne correspond à vos filtres</h4>
            <p className="text-xs text-slate-400">Essayez un autre mot-clé ou insérez un nouveau document officiel.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badges & Meta strip */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                      {doc.referenceNumber}
                    </span>
                    {doc.isFeatured && (
                      <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        ⭐ En Vedette
                      </span>
                    )}
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.version || 'v1.0'}
                    </span>
                  </div>

                  <span className="text-2xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{doc.issueDate}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {doc.title}
                </h3>

                {/* Issuer */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Émetteur : <strong className="text-slate-700">{doc.issuedBy}</strong></span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>

                {/* Key Points Summary */}
                {doc.contentSummary.length > 0 && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                    <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Points Clés &amp; Dispositions :
                    </span>
                    <ul className="space-y-1 text-2xs text-slate-600">
                      {doc.contentSummary.slice(0, 2).map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                      {doc.contentSummary.length > 2 && (
                        <li className="text-slate-400 font-medium pl-4">
                          +{doc.contentSummary.length - 2} autre{doc.contentSummary.length - 2 > 1 ? 's' : ''} point{doc.contentSummary.length - 2 > 1 ? 's' : ''}...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Keywords tags */}
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  {doc.keyTerms.map((term, i) => (
                    <span key={i} className="text-2xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      #{term}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                    title="Prévisualiser le texte complet"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Aperçu</span>
                  </button>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 border border-emerald-200 transition cursor-pointer"
                    title="Télécharger le fichier certifié"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate max-w-[120px]">{doc.downloadFileName}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(doc)}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 border border-blue-200 transition cursor-pointer"
                    title="Modifier ce document"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Archiver / Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
        </div>
      )}

      {/* AI Queue View (Human-in-the-Loop Validation) */}
      {activeSubView === 'ai_queue' && (
        <div className="space-y-5 animate-fade-in">
          {/* Banner explaining the AI workflow & human authority */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-purple-500/30 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Délégation IA Supervisée • Human-in-the-Loop</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  File d'Attente des Propositions Préparées par l'IA
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  L'IA analyse vos comptes-rendus, courriers et arrêtés ministériels, extrait les métadonnées juridiques et propose une fiche certifiée. <strong>Aucun acte n'est rendu public sans le clic de validation formelle (« Valider &amp; Publier ») d'un responsable habilité (CPI / DE).</strong>
                </p>
              </div>

              <button
                onClick={() => {
                  setAiPromptText('');
                  setAiDraftPreview(null);
                  setShowAiModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-2 transition shrink-0 shadow-md shadow-purple-950/50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>+ Soumettre une Note à l'IA</span>
              </button>
            </div>

            {/* 3 Steps Pipeline Visualization */}
            <div className="mt-5 pt-4 border-t border-purple-800/40 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-2xs uppercase">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>Étape 1 : Structuration IA</span>
                </div>
                <p className="text-slate-300 text-2xs leading-normal">
                  Extraction du titre, de la cote de référence, des 4 points cardinaux et des mots-clés de l'acte.
                </p>
              </div>

              <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-2xs uppercase">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Étape 2 : Visa Humain (CPI / DE)</span>
                </div>
                <p className="text-slate-300 text-2xs leading-normal">
                  Revue critique par le webmestre. Possibilité de retoucher le texte ou de rejeter la proposition.
                </p>
              </div>

              <div className="bg-purple-950/50 p-3 rounded-xl border border-purple-500/20 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-2xs uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Étape 3 : Publication Immédiate</span>
                </div>
                <p className="text-slate-300 text-2xs leading-normal">
                  L'acte approuvé bascule instantanément dans la Médiathèque publique de l'ONG avec horodatage d'audit.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Pills for AI Queue */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: `Toutes les propositions (${aiDrafts.length})` },
                { id: 'en_attente_visa', label: `⏳ En Attente de Visa (${aiDrafts.filter(d => d.status === 'en_attente_visa').length})` },
                { id: 'valide_publie', label: `✅ Validés & Publiés (${aiDrafts.filter(d => d.status === 'valide_publie').length})` },
                { id: 'rejete', label: `❌ Rejetés (${aiDrafts.filter(d => d.status === 'rejete').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAiQueueStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    aiQueueStatusFilter === tab.id
                      ? 'bg-purple-700 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-2xs text-slate-400 hidden sm:inline">
              Historique des arbitrages conservé pour traçabilité
            </span>
          </div>

          {/* AI Draft Cards List */}
          <div className="space-y-4">
            {aiDrafts
              .filter(draft => aiQueueStatusFilter === 'all' ? true : draft.status === aiQueueStatusFilter)
              .length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Bot className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-base">Aucune proposition dans cette catégorie</h4>
                <p className="text-xs text-slate-400">
                  Cliquez sur « + Soumettre une Note à l'IA » pour déléguer la préparation d'un nouvel acte.
                </p>
              </div>
            ) : (
              aiDrafts
                .filter(draft => aiQueueStatusFilter === 'all' ? true : draft.status === aiQueueStatusFilter)
                .map(draft => {
                  const isExpanded = !!expandedRawDraftIds[draft.id];
                  return (
                    <div
                      key={draft.id}
                      className={`bg-white rounded-2xl border transition-all p-5 space-y-4 shadow-xs ${
                        draft.status === 'en_attente_visa'
                          ? 'border-amber-300 ring-1 ring-amber-100 hover:shadow-md'
                          : draft.status === 'valide_publie'
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : 'border-slate-200 opacity-70 bg-slate-50'
                      }`}
                    >
                      {/* Top Bar: Status, AI Confidence, Date */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          {draft.status === 'en_attente_visa' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                              <span>En Attente de Visa Humain</span>
                            </span>
                          )}
                          {draft.status === 'valide_publie' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Validé &amp; Mis en Ligne</span>
                            </span>
                          )}
                          {draft.status === 'rejete' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <X className="w-3.5 h-3.5 text-rose-600" />
                              <span>Rejeté</span>
                            </span>
                          )}

                          <span className="text-2xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md font-bold">
                            {draft.proposedDoc.referenceNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-2xs text-slate-500">
                          {draft.aiConfidenceScore && (
                            <div className="flex items-center gap-1.5 bg-purple-50 text-purple-800 px-2.5 py-1 rounded-full border border-purple-200 font-bold">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>Confiance IA : {draft.aiConfidenceScore}%</span>
                            </div>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{draft.createdAt}</span>
                          </span>
                        </div>
                      </div>

                      {/* Main Document Details Proposed */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-2xs font-bold uppercase text-purple-700 tracking-wider">
                              Catégorie suggérée : {draft.proposedDoc.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug mt-0.5">
                              {draft.proposedDoc.title}
                            </h4>
                          </div>

                          <span className="text-2xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold shrink-0">
                            {draft.proposedDoc.issuedBy}
                          </span>
                        </div>

                        {/* AI Analysis Note Box */}
                        {draft.aiAnalysisNotes && (
                          <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 flex items-start gap-2.5">
                            <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="font-bold block text-2xs uppercase text-purple-800">
                                Analyse &amp; Justification de l'Assistant IA :
                              </span>
                              <p className="leading-relaxed text-2xs text-slate-700">{draft.aiAnalysisNotes}</p>
                            </div>
                          </div>
                        )}

                        {/* Summary & Points extracted */}
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            <strong>Objet officiel proposé :</strong> {draft.proposedDoc.description}
                          </p>
                          <div className="space-y-1 pt-1 border-t border-slate-200">
                            <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider block">
                              Points Cardinaux Extraits ({draft.proposedDoc.contentSummary.length}) :
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-2xs text-slate-700">
                              {draft.proposedDoc.contentSummary.map((pt, i) => (
                                <li key={i} className="flex items-start gap-1.5 bg-white p-2 rounded-lg border border-slate-100">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Collapsible Raw Source Text */}
                        <div>
                          <button
                            onClick={() => setExpandedRawDraftIds(prev => ({ ...prev, [draft.id]: !prev[draft.id] }))}
                            className="text-2xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Masquer la note source brute fournie à l\'IA ▲' : 'Afficher la note source brute fournie à l\'IA ▼'}</span>
                          </button>
                          {isExpanded && (
                            <div className="mt-2 p-3 bg-slate-100 rounded-xl font-mono text-2xs text-slate-700 leading-relaxed border border-slate-200 whitespace-pre-wrap">
                              {draft.rawPromptOrText}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions: Visa, Modify, Reject */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-2xs text-slate-500">
                          {draft.status === 'valide_publie' && (
                            <span className="text-emerald-700 font-semibold">
                              ✓ Acte visé par <strong>{draft.reviewedBy || 'Direction'}</strong> le {draft.validatedAt || draft.createdAt}
                            </span>
                          )}
                          {draft.status === 'rejete' && (
                            <span className="text-rose-600 font-semibold">
                              ✕ Non opposable — {draft.reviewNotes || 'Rejeté lors de la revue'}
                            </span>
                          )}
                          {draft.status === 'en_attente_visa' && (
                            <span className="text-amber-800 font-medium">
                              ⚠️ En attente du visa officiel de <strong>{currentMember?.name || 'Henri D. FATCHINA (CPI)'}</strong>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {draft.status === 'en_attente_visa' ? (
                            <>
                              <button
                                onClick={() => handleRejectAiDraft(draft.id)}
                                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                                title="Rejeter la proposition"
                              >
                                ✕ Rejeter
                              </button>

                              <button
                                onClick={() => handleEditAiDraftBeforeVisa(draft)}
                                className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                                title="Modifier le titre, la référence ou les points avant publication"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                                <span>Corriger / Ajuster</span>
                              </button>

                              <button
                                onClick={() => handleApproveAndPublishAiDraft(draft)}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                title="Accorder le visa officiel et publier sur le site web"
                              >
                                <ShieldCheck className="w-4 h-4" />
                                <span>✅ Valider &amp; Publier sur le Site</span>
                              </button>
                            </>
                          ) : draft.status === 'valide_publie' ? (
                            <button
                              onClick={() => {
                                setActiveSubView('published');
                                setSearchTerm(draft.proposedDoc.referenceNumber);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Voir l'acte dans le répertoire officiel</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* 5. Insert / Edit Document Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  {editingDoc ? <Edit3 className="w-5 h-5" /> : <FilePlus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    {editingDoc ? 'Modifier le Document Officiel' : 'Insérer un Nouveau Document Officiel'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingDoc ? `Référence : ${editingDoc.referenceNumber}` : 'Publication immédiate dans la médiathèque AMSHARTE'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveDocument} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Titre Officiel du Document *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex : Arrêté de Reconnaissance Ministérielle MCVT N° 878"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                  />
                </div>

                {/* Category & Reference Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Catégorie Institutionnelle *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as OfficialDocument['category'])}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm"
                    >
                      <option value="reconnaissance_etat">Reconnaissance MCVT / État</option>
                      <option value="juridique">Juridique &amp; Loi 2025-19</option>
                      <option value="protocole_scientifique">Protocole Scientifique &amp; Biométrie</option>
                      <option value="guide_terrain">Guide de Terrain &amp; Sécurité BPLP</option>
                      <option value="partenariat">Convention &amp; Partenariat PTF</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Numéro de Référence Officiel *</label>
                    <input
                      type="text"
                      required
                      value={formRef}
                      onChange={(e) => setFormRef(e.target.value)}
                      placeholder="Ex : N° 878/MCVT/DC/CTR/SP-c"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Issuer, Date & Version */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Organisme Émetteur</label>
                    <input
                      type="text"
                      value={formIssuedBy}
                      onChange={(e) => setFormIssuedBy(e.target.value)}
                      placeholder="Ex : Ministère du Cadre de Vie"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date d'Émission</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Version &amp; Statut</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formVersion}
                        onChange={(e) => setFormVersion(e.target.value)}
                        placeholder="v1.0"
                        className="w-20 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs font-mono text-center"
                      />
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'actif' | 'en_revision' | 'archive')}
                        className="flex-1 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                      >
                        <option value="actif">Actif</option>
                        <option value="en_revision">En Révision</option>
                        <option value="archive">Archivé</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description &amp; Objet du Document *</label>
                  <textarea
                    required
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Synthétisez l'objet légal ou opérationnel du document pour le public et les partenaires..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs leading-relaxed"
                  />
                </div>

                {/* Content Summary Points (Dynamic) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">Points Clés &amp; Dispositions Incluses</label>
                    <button
                      type="button"
                      onClick={handleAddSummaryPoint}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                    >
                      + Ajouter un point
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formSummaryPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-2xs font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleSummaryPointChange(index, e.target.value)}
                          placeholder={`Disposition ou point clé ${index + 1}`}
                          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                        />
                        {formSummaryPoints.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSummaryPoint(index)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Supprimer ce point"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Attachment & Keywords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fichier Joint (PDF, Word, TXT)</label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-3 text-center bg-slate-50 transition cursor-pointer relative">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <UploadCloud className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <span className="text-2xs text-slate-600 font-medium block truncate">
                        {formFileName || 'Cliquer pour joindre un fichier PDF'}
                      </span>
                      <span className="text-3xs text-slate-400">Glisser-déposer ou parcourir</span>
                    </div>
                    {uploadedFileNotice && (
                      <p className="text-2xs text-emerald-700 font-semibold mt-1">✓ {uploadedFileNotice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mots-clés / Indexation (séparés par virgule)</label>
                    <input
                      type="text"
                      value={formKeyTerms}
                      onChange={(e) => setFormKeyTerms(e.target.value)}
                      placeholder="Loi 2025-19, MCVT, Écloserie, Baguage BJ"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
                    />
                    
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured-checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                      />
                      <label htmlFor="featured-checkbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                        Mettre en avant sur le site public (Badge ⭐)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 font-medium text-xs text-slate-700 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingDoc ? 'Enregistrer les Modifications' : 'Insérer & Publier le Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-2xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono">
                  {previewDoc.referenceNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-2xs">
                <div><strong>Émetteur :</strong> {previewDoc.issuedBy}</div>
                <div><strong>Date d'émission :</strong> {previewDoc.issueDate}</div>
                <div><strong>Version :</strong> {previewDoc.version || 'v1.0'}</div>
                <div><strong>Fichier :</strong> {previewDoc.downloadFileName}</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Objet officiel :</h4>
                <p className="bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {previewDoc.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Points clés :</h4>
                <ul className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {previewDoc.contentSummary.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase text-slate-500 mb-1">Indexation &amp; Mots-clés :</h4>
                <div className="flex flex-wrap gap-1">
                  {previewDoc.keyTerms.map((term, i) => (
                    <span key={i} className="text-2xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      #{term}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Fermer
              </button>
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger la Version Certifiée</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. AI Delegate / Structuring Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-purple-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-purple-100 bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/30 border border-purple-400/40 text-purple-200 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                    <span>Assistant IA AMSHARTE : Structuration &amp; Préparation d'Acte</span>
                    <span className="text-2xs bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded-full font-bold">
                      Human-in-the-loop
                    </span>
                  </h3>
                  <p className="text-xs text-purple-200/80">
                    L'IA prépare la fiche réglementaire. Vous gardez la décision souveraine avant toute publication.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setAiDraftPreview(null);
                }}
                className="text-purple-300 hover:text-white p-1.5 rounded-lg hover:bg-purple-800/50 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              {/* Presets to quickly test */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Modèles de test rapide (Cliquez pour charger un exemple) :</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiPromptText(
                      "Arrêté Ministériel MCVT N° 2026/044 du 18 Février 2026 portant classement et sanctuarisation de la zone côtière Togbin-Avlékété pour la ponte exclusive des tortues marines Luth et Olivier. Signé par le Ministre José TONATO. Interdiction stricte de tout engin motorisé à moins de 500m du littoral et mandat officiel accordé à AMSHARTE pour la surveillance conjointe avec la Police Républicaine."
                    )}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50 text-left transition cursor-pointer space-y-1"
                  >
                    <span className="font-bold text-slate-900 block text-2xs">🏛️ Arrêté MCVT Togbin</span>
                    <p className="text-2xs text-slate-500 line-clamp-2">Protection zone côtière &amp; interdiction quads/véhicules</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPromptText(
                      "Protocole Scientifique BPLP / FPA2 N° 2026-09 : Guide standardisé de prélèvement génétique cutané et de biométrie sur tortues Luths vivantes sans anesthésie, avec déploiement nocturne de caméras thermiques. Validé par le CPI Henri Doudédji FATCHINA et le réseau WIDECAST."
                    )}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50 text-left transition cursor-pointer space-y-1"
                  >
                    <span className="font-bold text-slate-900 block text-2xs">🔬 Protocole BPLP / WIDECAST</span>
                    <p className="text-2xs text-slate-500 line-clamp-2">Biométrie et télémétrie nocturne sans traumatisme</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiPromptText(
                      "Accord de Partenariat et Subvention Quadriennale PTF AMSHARTE / Fondation Prince Albert II de Monaco (FPA2) N° 2026/FPA2/012. Octroi d'un fonds de 120 000 EUR pour le déploiement de 18 éco-gardes communautaires et la réfection de la nursery pilote de Grand-Popo. Visa financier requis du DE SONON Tchéhouéa."
                    )}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50/50 text-left transition cursor-pointer space-y-1"
                  >
                    <span className="font-bold text-slate-900 block text-2xs">🤝 Accord Partenaire FPA2</span>
                    <p className="text-2xs text-slate-500 line-clamp-2">Financement 120k€ pour éco-gardes et nursery</p>
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Texte source, note interne, courrier ministériel ou compte-rendu brut *
                </label>
                <textarea
                  rows={4}
                  value={aiPromptText}
                  onChange={(e) => setAiPromptText(e.target.value)}
                  placeholder="Collez ici le texte d'un arrêté, les résolutions d'un atelier ou le résumé d'un protocole que vous souhaitez classifier et transformer en document officiel..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white text-xs sm:text-sm font-sans"
                />
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-between">
                <span className="text-2xs text-slate-500">
                  L'IA catégorise, génère la cote de classement et extrait les 4 points clés.
                </span>
                <button
                  type="button"
                  disabled={!aiPromptText.trim() || isAiGenerating}
                  onClick={handleGenerateAiDraft}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-purple-900/30"
                >
                  {isAiGenerating ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Analyse réglementaire en cours...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Analyser &amp; Structurer par l'IA</span>
                    </>
                  )}
                </button>
              </div>

              {/* Preview Result if generated */}
              {aiDraftPreview && (
                <div className="p-4 bg-purple-50/70 rounded-2xl border-2 border-purple-300 space-y-3 animate-fade-in mt-4">
                  <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-bold text-2xs uppercase">
                        Proposition Générée
                      </span>
                      <span className="font-mono text-2xs text-purple-900 font-bold">
                        {aiDraftPreview.proposedDoc.referenceNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-2xs font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full border border-purple-200">
                      <Sparkles className="w-3 h-3" />
                      <span>Confiance IA : {aiDraftPreview.aiConfidenceScore}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{aiDraftPreview.proposedDoc.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {aiDraftPreview.proposedDoc.description}
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-purple-100 text-2xs space-y-1">
                    <span className="font-bold text-purple-800 uppercase block">Analyse &amp; Justification :</span>
                    <p className="text-slate-600 leading-relaxed">{aiDraftPreview.aiAnalysisNotes}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 text-2xs uppercase block">Points cardinaux identifiés :</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-2xs text-slate-700">
                      {aiDraftPreview.proposedDoc.contentSummary.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1 bg-white p-1.5 rounded-lg border border-purple-100">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Decision actions */}
                  <div className="pt-3 border-t border-purple-200 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Keep in AI Queue for later validation
                        setShowAiModal(false);
                        setActiveSubView('ai_queue');
                        if (onNotify) {
                          onNotify('success', 'Proposition ajoutée à la file d\'attente IA en attente de visa.');
                        }
                      }}
                      className="px-3.5 py-1.5 bg-white hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      📋 Conserver dans la File d'Attente
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAiModal(false);
                          handleEditAiDraftBeforeVisa(aiDraftPreview);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs cursor-pointer"
                      >
                        ✏️ Ajuster dans l'Éditeur
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleApproveAndPublishAiDraft(aiDraftPreview);
                          setShowAiModal(false);
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>✅ Valider &amp; Publier Immédiatement</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-2xs text-slate-500">
                L'IA n'a aucun pouvoir de publication automatique : votre contrôle reste indispensable.
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowAiModal(false);
                  setAiDraftPreview(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 font-medium text-xs text-slate-700 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Access Rights & Governance Modal (Transparency RBAC) */}
      {showAccessRightsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Règles d'Accès au Webmastering &amp; Gouvernance
                  </h3>
                  <p className="text-xs text-slate-500">
                    Conformité avec les Statuts de l'ONG AMSHARTE &amp; la Loi N° 2025-19
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAccessRightsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                <h4 className="font-bold text-sm">À qui revient le droit d'accès au bouton Webmastering ?</h4>
                <p className="text-xs text-emerald-900">
                  En application de l'organigramme institutionnel d'AMSHARTE et des exigences de traçabilité juridique de la <strong>Loi N° 2025-19 relative aux associations et ONG en République du Bénin</strong>, le droit de gestion de la médiathèque officielle est strictement hiérarchisé :
                </p>
              </div>

              {/* Detailed Role Breakdown */}
              <div className="space-y-3">
                {/* CPI */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>Henri Doudédji FATCHINA — Chargé de Programmes par Intérim (CPI)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xs">
                      Webmestre Opérationnel
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600">
                    <strong>Habilitation :</strong> Accès complet au Webmastering. Insertion de documents, modifications des protocoles scientifiques, guides de terrain BPLP, délégation à l'IA pour pré-remplissage et soumission des actes au visa.
                  </p>
                </div>

                {/* DE */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      <span>SONON Tchéhouéa — Directeur Exécutif (DE)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-2xs">
                      Ordonnateur Suprême &amp; Visa Légal
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600">
                    <strong>Habilitation :</strong> Représentant légal devant le MCVT et les PTF. Droit de visa final opposable sur les conventions de financement internationales, suppression définitive d'actes et publication des décrets ministériels.
                  </p>
                </div>

                {/* Équipe Terrain & Bénévoles */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span>Éco-gardes, Bénévoles, Partenaires &amp; Grand Public</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-2xs">
                      Consultation Publique
                    </span>
                  </div>
                  <p className="text-2xs text-slate-600">
                    <strong>Habilitation :</strong> Consultation et téléchargement des versions PDF certifiées dans l'onglet public « Médiathèque &amp; Photothèque ». Aucun droit d'écriture, de modification ou de suppression.
                  </p>
                </div>
              </div>

              {/* Security & Audit notice */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-start gap-2 text-2xs">
                <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Registre d'Audit Immuable :</strong> Chaque ajout, modification ou suppression d'un acte officiel est consigné avec le nom de l'opérateur, son adresse de session et l'empreinte horodatée pour satisfaire aux audits du Ministère du Cadre de Vie (MCVT) et des bailleurs internationaux.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowAccessRightsModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                Compris &amp; Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
