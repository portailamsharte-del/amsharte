import React, { useState } from 'react';
import { FieldActionPost, ActionCategory } from '../types';
import { FieldVideoPlayer } from './FieldVideoPlayer';
import { FieldCorridorAnimation } from './FieldCorridorAnimation';
import { FieldPhotoGallery } from './FieldPhotoGallery';
import { 
  Shield, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  Ruler, 
  Scale, 
  Egg, 
  Heart, 
  Share2, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Waves, 
  AlertCircle,
  Video,
  Eye,
  Filter,
  Search,
  Camera,
  Compass,
  Award,
  Sparkles,
  RotateCw,
  X,
  UploadCloud,
  PlaySquare,
  FolderOpen,
  FileVideo,
  Image as ImageIcon,
  FileUp
} from 'lucide-react';

interface FieldNewsfeedProps {
  actions: FieldActionPost[];
  onAddAction: (action: FieldActionPost) => void;
  onUpdateAction?: (action: FieldActionPost) => void;
  onExtractToReport: (action: FieldActionPost) => void;
  onGoToForum?: () => void;
  onLogAudit?: (authorName: string, authorRole: string, actionType: any, details: string) => void;
  estConnecte?: boolean; // vrai seulement pour un membre connecté (Supabase) : donne accès aux outils internes
}

export const FieldNewsfeed: React.FC<FieldNewsfeedProps> = ({
  actions,
  onAddAction,
  onUpdateAction,
  onExtractToReport,
  onGoToForum,
  onLogAudit,
  estConnecte = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [extractedPosts, setExtractedPosts] = useState<Record<string, boolean>>({});

  // Media replacement modal state
  const [mediaToReplace, setMediaToReplace] = useState<FieldActionPost | null>(null);
  const [replaceTitle, setReplaceTitle] = useState('');
  const [replaceVideoUrl, setReplaceVideoUrl] = useState('');
  const [replaceCaption, setReplaceCaption] = useState('');
  const [replaceAuthor, setReplaceAuthor] = useState('');
  const [replaceSuccessMsg, setReplaceSuccessMsg] = useState('');
  const [replaceUploadedPreview, setReplaceUploadedPreview] = useState<string | null>(null);
  const [replaceUploadedType, setReplaceUploadedType] = useState<'video' | 'image' | null>(null);

  // New action form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ActionCategory>('sauvetage_tortue');
  const [newLocation, setNewLocation] = useState('Plage de Togbin Fandji');
  const [newAuthorName, setNewAuthorName] = useState('Patrouilleur Sentinelle');
  const [newAuthorRole, setNewAuthorRole] = useState('Éco-garde bénévole');
  const [newTagId, setNewTagId] = useState('');
  const [newSpecies, setNewSpecies] = useState('Tortue Olivâtre (Lepidochelys olivacea)');
  const [newLengthCm, setNewLengthCm] = useState('');
  const [newWidthCm, setNewWidthCm] = useState('');
  const [newWeightKg, setNewWeightKg] = useState('');
  const [newEggsCount, setNewEggsCount] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newHasVideo, setNewHasVideo] = useState(false);
  const [newVideoCaption, setNewVideoCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVerifiedBy, setNewVerifiedBy] = useState('');
  const [newUploadedMediaPreview, setNewUploadedMediaPreview] = useState<string | null>(null);
  const [newUploadedMediaType, setNewUploadedMediaType] = useState<'video' | 'image' | null>(null);
  const [newUploadedFileName, setNewUploadedFileName] = useState<string>('');

  const LOCAL_MEDIA_FOLDER = "C:\\Users\\USER\\Documents\\Amshart\\Réception\\Données de la File d'actualité";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isReplacement = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const url = URL.createObjectURL(file);

    if (isReplacement) {
      setReplaceUploadedPreview(url);
      setReplaceUploadedType(isVideo ? 'video' : isImage ? 'image' : null);
      setReplaceVideoUrl(url);
    } else {
      setNewUploadedFileName(file.name);
      setNewUploadedMediaPreview(url);
      setNewUploadedMediaType(isVideo ? 'video' : isImage ? 'image' : null);
      if (isVideo) {
        setNewHasVideo(true);
        setNewVideoUrl(url);
      }
    }
  };

  const handleToggleLike = (id: string) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExtract = (action: FieldActionPost) => {
    setExtractedPosts(prev => ({ ...prev, [action.id]: true }));
    onExtractToReport(action);
    if (onLogAudit) {
      onLogAudit(
        "Chargé de Programmes (CPI)",
        "Coordination",
        "validation_rapport",
        `Extraction de l'action "${action.title}" vers la consolidation mensuelle des rapports`
      );
    }
  };

  const handleOpenReplaceModal = (action: FieldActionPost) => {
    setMediaToReplace(action);
    setReplaceTitle(action.title);
    setReplaceVideoUrl(action.videoUrl || '');
    setReplaceCaption(action.videoCaption || '');
    setReplaceAuthor(action.authorName);
    setReplaceUploadedPreview(null);
    setReplaceUploadedType(null);
    setReplaceSuccessMsg('');
  };

  const handleSaveMediaReplacement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!mediaToReplace) return;

    const finalMediaUrl = replaceUploadedPreview || replaceVideoUrl.trim() || undefined;
    const isImage = replaceUploadedType === 'image';
    const isVideo = replaceUploadedType === 'video' || Boolean(replaceVideoUrl.trim());

    const updatedAction: FieldActionPost = {
      ...mediaToReplace,
      title: replaceTitle.trim() || mediaToReplace.title,
      isAnimated: false, // If replaced, remove simulated animation
      hasVideo: isImage ? false : (isVideo ? Boolean(finalMediaUrl) : mediaToReplace.hasVideo),
      videoUrl: isImage ? undefined : (isVideo ? finalMediaUrl : mediaToReplace.videoUrl),
      imageUrls: isImage && finalMediaUrl ? [finalMediaUrl] : (isVideo ? undefined : mediaToReplace.imageUrls),
      videoCaption: replaceCaption.trim() || mediaToReplace.videoCaption,
      authorName: replaceAuthor.trim() || mediaToReplace.authorName,
      isExampleMedia: false, // User replaced the example!
      examplePlaceholderLabel: undefined
    };

    if (onUpdateAction) {
      onUpdateAction(updatedAction);
    } else {
      onAddAction(updatedAction);
    }

    if (onLogAudit) {
      onLogAudit(
        replaceAuthor.trim() || "Chargé de Communication",
        "Cellule Médias & Visibilité",
        "media_import",
        `Remplacement du média pour "${updatedAction.title}" (Source: ${replaceUploadedPreview ? 'Fichier importé' : 'Lien multimédia'})`
      );
    }

    setReplaceSuccessMsg('Média mis à jour et enregistré avec succès dans le fil d\'actualité !');
    setTimeout(() => {
      setMediaToReplace(null);
      setReplaceSuccessMsg('');
    }, 1200);
  };

  const handleSubmitNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const newPost: FieldActionPost = {
      id: `action-${Date.now()}`,
      title: newTitle.trim(),
      date: dateStr,
      time: timeStr,
      location: newLocation.trim() || 'Plage de Togbin',
      category: newCategory,
      authorName: newAuthorName.trim() || 'Éco-garde Togbin',
      authorRole: newAuthorRole.trim() || 'Patrouilleur de terrain',
      tagId: newTagId.trim() || undefined,
      species: newSpecies.trim() || undefined,
      measurements: {
        lengthCarapaceCm: newLengthCm ? parseFloat(newLengthCm) : undefined,
        widthCarapaceCm: newWidthCm ? parseFloat(newWidthCm) : undefined,
        weightKg: newWeightKg ? parseFloat(newWeightKg) : undefined,
        eggsCount: newEggsCount ? parseInt(newEggsCount) : undefined
      },
      content: newContent.trim(),
      hasVideo: newHasVideo || Boolean(newUploadedMediaType === 'video'),
      videoUrl: newVideoUrl || (newUploadedMediaType === 'video' ? newUploadedMediaPreview || undefined : undefined),
      videoCaption: newVideoCaption || (newUploadedFileName ? `Vidéo importée : ${newUploadedFileName}` : undefined),
      imageUrls: newUploadedMediaType === 'image' && newUploadedMediaPreview ? [newUploadedMediaPreview] : undefined,
      verifiedBy: newVerifiedBy.trim() || undefined,
      visaValidatedAt: newVerifiedBy.trim() ? new Date().toISOString().split('T')[0] : undefined,
      likes: 1,
      stakeholderCommentsCount: 0,
      extractedIntoReport: false
    };

    onAddAction(newPost);

    if (onLogAudit) {
      onLogAudit(
        newAuthorName.trim() || "Patrouilleur Sentinelle",
        newAuthorRole.trim() || "Éco-garde bénévole",
        "media_import",
        `Publication d'une nouvelle action "${newTitle}" (${newLocation}) avec média attaché`
      );
    }

    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewTagId('');
    setNewLengthCm('');
    setNewWidthCm('');
    setNewWeightKg('');
    setNewEggsCount('');
    setNewUploadedMediaPreview(null);
    setNewUploadedMediaType(null);
    setNewUploadedFileName('');
  };

  const filteredActions = actions.filter(act => {
    const matchesCategory = 
      selectedCategory === 'all' 
        ? true 
        : selectedCategory === 'videos_animations'
        ? (act.hasVideo || act.isAnimated)
        : selectedCategory === 'photos_terrain'
        ? Boolean(act.imageUrls && act.imageUrls.length > 0)
        : act.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q ||
      act.title.toLowerCase().includes(q) ||
      act.content.toLowerCase().includes(q) ||
      (act.tagId && act.tagId.toLowerCase().includes(q)) ||
      act.location.toLowerCase().includes(q) ||
      act.authorName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (category: ActionCategory) => {
    switch (category) {
      case 'action_conjointe_bplp':
        return { label: 'Police BPLP & Sécurité', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'baguage_constante':
        return { label: 'Baguage & Constantes', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'ecloserie_oeufs':
        return { label: 'Écloserie & Nids', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'lacher_mer':
        return { label: 'Lâcher en Mer', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' };
      case 'sauvetage_tortue':
        return { label: 'Sauvetage / Échouage', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'sensibilisation_pecheurs':
        return { label: 'Pêcheurs & Filets', color: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'salubrite_ayi_dji_ni_min':
        return { label: 'Ayi Dji Ni Min (Salubrité)', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      default:
        return { label: 'Action de terrain', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Action CTA & Stakeholder connection */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Actions de terrain • Plage de Togbin Fandji (6°21'04.9"N)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Fil d'Actualité des Actions de Terrain
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-5">
            Suivi des patrouilles nocturnes, baguage des tortues marines (<span className="text-emerald-300 font-semibold font-mono">BJ 2872, BJ 2871</span>), 
            opérations conjointes avec la Brigade de Protection du Littoral et des Plages (<span className="text-blue-300 font-semibold">Police BPLP</span>), 
            transferts en écloserie et lâchers avec les populations locales.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {estConnecte && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier une action de terrain</span>
            </button>
            )}
            {onGoToForum && (
              <button
                onClick={onGoToForum}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                <Shield className="w-4 h-4 text-blue-300" />
                <span>Accéder au Forum Tortues &amp; Parties Prenantes</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden md:block">
          <Waves className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par bague (ex: BJ 2872), lieu, acteur, police..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-medium">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Toutes ({actions.length})
          </button>
          
          <button
            onClick={() => setSelectedCategory('videos_animations')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'videos_animations'
                ? 'bg-cyan-600 text-white font-bold shadow-xs'
                : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-cyan-600" />
            <span>🎥 Vidéos &amp; Animations ({actions.filter(a => a.hasVideo || a.isAnimated).length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('photos_terrain')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'photos_terrain'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>📷 Photos de terrain ({actions.filter(a => Boolean(a.imageUrls && a.imageUrls.length > 0)).length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('action_conjointe_bplp')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'action_conjointe_bplp'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Police BPLP
          </button>
          <button
            onClick={() => setSelectedCategory('baguage_constante')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'baguage_constante'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Baguage (BJ)
          </button>
          <button
            onClick={() => setSelectedCategory('ecloserie_oeufs')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'ecloserie_oeufs'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Écloserie &amp; Nids
          </button>
          <button
            onClick={() => setSelectedCategory('lacher_mer')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'lacher_mer'
                ? 'bg-cyan-600 text-white font-semibold'
                : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100'
            }`}
          >
            Lâchers en Mer
          </button>
          <button
            onClick={() => setSelectedCategory('sensibilisation_pecheurs')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'sensibilisation_pecheurs'
                ? 'bg-teal-600 text-white font-semibold'
                : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
            }`}
          >
            Pêcheurs &amp; Filets
          </button>
          <button
            onClick={() => setSelectedCategory('salubrite_ayi_dji_ni_min')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'salubrite_ayi_dji_ni_min'
                ? 'bg-orange-600 text-white font-semibold'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            Ayi Dji Ni Min
          </button>
        </div>
      </div>

      {/* Feed list */}
      <div className="space-y-5">
        {filteredActions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 text-slate-500">
            <Filter className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">Aucune action trouvée avec ces critères</p>
            <p className="text-xs text-slate-400 mt-1">Modifiez vos filtres ou effectuez une autre recherche.</p>
          </div>
        ) : (
          filteredActions.map((action) => {
            const badge = getCategoryBadge(action.category);
            const isLiked = likedPosts[action.id];
            const isExtracted = extractedPosts[action.id] || action.extractedIntoReport;

            return (
              <article
                key={action.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
                        {action.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {action.authorName}
                          </h4>
                          <span className="text-xs text-slate-500">• {action.authorRole}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <MapPin className="w-3 h-3" />
                            {action.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {action.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {action.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {action.tagId && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold bg-slate-900 text-amber-400 font-mono shadow-xs">
                          <Tag className="w-3 h-3 text-amber-400" />
                          Bague {action.tagId}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2 mb-2 leading-snug">
                    {action.title}
                  </h3>

                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    {action.content}
                  </p>
                </div>

                {/* Biometric Measurements & Indicators Bar */}
                {(action.measurements || action.species || action.tagId) && (
                  <div className="bg-slate-50/80 px-5 sm:px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-700 font-medium">
                    {action.species && (
                      <div className="flex items-center gap-1.5">
                        <Waves className="w-3.5 h-3.5 text-cyan-600" />
                        <span className="text-slate-500">Espèce :</span>
                        <span className="font-semibold text-slate-900">{action.species}</span>
                      </div>
                    )}

                    {action.measurements?.lengthCarapaceCm && (
                      <div className="flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-slate-500">Carapace :</span>
                        <span className="font-semibold text-slate-900">
                          {action.measurements.lengthCarapaceCm} cm
                          {action.measurements.widthCarapaceCm ? ` × ${action.measurements.widthCarapaceCm} cm` : ''}
                        </span>
                      </div>
                    )}

                    {action.measurements?.weightKg && (
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-slate-500">Poids :</span>
                        <span className="font-semibold text-slate-900">~{action.measurements.weightKg} kg</span>
                      </div>
                    )}

                    {action.measurements?.eggsCount && (
                      <div className="flex items-center gap-1.5">
                        <Egg className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-slate-500">Ponte :</span>
                        <span className="font-bold text-amber-700">{action.measurements.eggsCount} œufs protégés</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Media representation (photos / video / animation) */}
                {action.isAnimated ? (
                  <FieldCorridorAnimation 
                    isExample={action.isExampleMedia ?? true}
                    onReplace={estConnecte ? () => handleOpenReplaceModal(action) : undefined}
                  />
                ) : (
                  <div className="space-y-4">
                    {/* Video Player if available */}
                    {action.hasVideo && (
                      <FieldVideoPlayer 
                        title={action.title}
                        caption={action.videoCaption || action.content}
                        location={action.location}
                        duration={action.videoDuration || "02:14"}
                        videoUrl={action.videoUrl}
                        isExample={action.isExampleMedia ?? true}
                        onReplace={estConnecte ? () => handleOpenReplaceModal(action) : undefined}
                      />
                    )}

                    {/* Photo Gallery if available */}
                    {action.imageUrls && action.imageUrls.length > 0 && (
                      <div className={action.hasVideo ? "border-t border-slate-100 pt-3" : ""}>
                        {action.hasVideo && (
                          <div className="px-4 sm:px-6 pb-2 flex items-center justify-between">
                            <span className="text-2xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Camera className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Photographies de Terrain ({action.imageUrls.length})</span>
                            </span>
                            <span className="text-2xs text-slate-400">Constat visuel haute résolution</span>
                          </div>
                        )}
                        <FieldPhotoGallery
                          images={action.imageUrls}
                          title={action.title}
                          location={action.location}
                          isExample={action.isExampleMedia ?? false}
                          onReplace={estConnecte ? () => handleOpenReplaceModal(action) : undefined}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Verification & Extraction Footer */}
                <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                  {action.verifiedBy && action.visaValidatedAt ? (
                    <div className="flex items-center gap-2 text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Visa de conformité : <strong className="text-slate-700">{action.verifiedBy}</strong></span>
                    </div>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    {/* Like button */}
                    <button
                      onClick={() => handleToggleLike(action.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                        isLiked 
                          ? 'bg-rose-50 text-rose-600 border-rose-200 font-semibold' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{action.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    {/* Bouton d'extraction vers le rapport mensuel : réservé aux membres connectés */}
                    {estConnecte && (
                    <button
                      onClick={() => handleExtract(action)}
                      disabled={isExtracted}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs ${
                        isExtracted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                      title="Injecte cette action de terrain dans le rapport mensuel du CPI pour la consolidation J+10"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isExtracted ? '✓ Intégré au Rapport CPI' : '📋 Puiser pour le Rapport Mensuel'}</span>
                    </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal: New Action Posting (Authorized Actors) */}
      {estConnecte && showAddModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 shrink-0 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Mise en ligne d'une action de terrain
                  </h3>
                  <p className="text-xs text-slate-500">
                    Espace réservé aux éco-gardes, patrouilleurs et coordination AMSHARTE
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewAction} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre de l'action *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex : Baguage d'une femelle adulte et sécurisation de 115 œufs à Togbin"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie d'action *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ActionCategory)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="sauvetage_tortue">Sauvetage de tortue marine</option>
                    <option value="baguage_constante">Baguage &amp; Prise de constantes</option>
                    <option value="action_conjointe_bplp">Action conjointe avec Police BPLP</option>
                    <option value="ecloserie_oeufs">Transfert d'œufs en écloserie</option>
                    <option value="lacher_mer">Lâcher en mer océanique</option>
                    <option value="sensibilisation_pecheurs">Sensibilisation pêcheurs / démaillage</option>
                    <option value="salubrite_ayi_dji_ni_min">Ayi Dji Ni Min (Salubrité plage)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lieu / Secteur *</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ex : Plage de Togbin Fandji (Secteur Écloserie)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom du rapporteur *</label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="Ex : Prénom NOM / Éco-garde"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rôle statutaire</label>
                  <input
                    type="text"
                    value={newAuthorRole}
                    onChange={(e) => setNewAuthorRole(e.target.value)}
                    placeholder="Ex : Chargé Programme Tortues / Éco-garde"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Specific biological fields */}
              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-3">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Données Biométriques &amp; Marquage (Optionnel)</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-600 text-xs mb-1">N° Bague métal</label>
                    <input
                      type="text"
                      value={newTagId}
                      onChange={(e) => setNewTagId(e.target.value)}
                      placeholder="Ex : BJ 2873"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-md font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs mb-1">Carapace (cm)</label>
                    <input
                      type="number"
                      value={newLengthCm}
                      onChange={(e) => setNewLengthCm(e.target.value)}
                      placeholder="Ex : 78"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs mb-1">Poids approx. (kg)</label>
                    <input
                      type="number"
                      value={newWeightKg}
                      onChange={(e) => setNewWeightKg(e.target.value)}
                      placeholder="Ex : 45"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-md text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-xs mb-1">Nombre d'œufs</label>
                    <input
                      type="number"
                      value={newEggsCount}
                      onChange={(e) => setNewEggsCount(e.target.value)}
                      placeholder="Ex : 120"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 rounded-md text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Import Média (Image ou Vidéo) */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Joindre une Vidéo ou une Image de Terrain</span>
                  </label>
                  <span className="text-2xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    MP4, WebM, JPG, PNG
                  </span>
                </div>

                {/* Local Folder Shortcut Banner */}
                <div className="bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-lg text-2xs text-emerald-950 flex items-start gap-2">
                  <FolderOpen className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="leading-tight">
                    <strong>Dossier ressources local :</strong>
                    <div className="font-mono text-emerald-800 break-all mt-0.5 select-all">
                      {LOCAL_MEDIA_FOLDER}
                    </div>
                  </div>
                </div>

                {/* Upload Input */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto flex-1 cursor-pointer border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white p-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                    <FileUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">
                      {newUploadedFileName ? `Fichier : ${newUploadedFileName}` : "Importer depuis votre appareil / dossier"}
                    </span>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                  </label>

                  <div className="text-2xs text-slate-400 font-bold">OU</div>

                  <div className="w-full sm:w-1/2">
                    <input
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => {
                        setNewVideoUrl(e.target.value);
                        if (e.target.value) setNewHasVideo(true);
                      }}
                      placeholder="Lien URL vidéo externe (optionnel)"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Preview if uploaded */}
                {newUploadedMediaPreview && (
                  <div className="p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-emerald-950">
                        {newUploadedMediaType === 'video' ? (
                          <FileVideo className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold truncate max-w-xs">{newUploadedFileName || 'Média sélectionné'}</span>
                        <span className="bg-emerald-200 text-emerald-900 text-2xs font-bold px-2 py-0.5 rounded-full">
                          Prêt pour publication
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNewUploadedMediaPreview(null);
                          setNewUploadedMediaType(null);
                          setNewUploadedFileName('');
                        }}
                        className="text-2xs text-rose-600 hover:text-rose-800 font-bold bg-white px-2 py-1 rounded border border-rose-200 cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>

                    {/* Video or Image Preview */}
                    {newUploadedMediaType === 'video' ? (
                      <div className="rounded-lg overflow-hidden bg-slate-900 max-h-40 flex items-center justify-center">
                        <video src={newUploadedMediaPreview} controls className="max-h-36 w-full object-contain" />
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden bg-slate-900 max-h-40 flex items-center justify-center">
                        <img src={newUploadedMediaPreview} alt="Aperçu" className="max-h-36 w-full object-contain" />
                      </div>
                    )}

                    <div className="p-2 bg-white rounded-lg border border-emerald-200 flex items-center justify-between">
                      <span className="text-2xs text-emerald-800 font-medium">
                        ✓ Média rattaché avec succès à cette fiche d'action
                      </span>
                      <span className="text-2xs font-bold text-emerald-700">
                        Prêt pour publication
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description détaillée de l'action *</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Circonstances de l'observation, comportement de l'animal, présence des forces de l'ordre ou des pêcheurs, conditions de remise à l'eau ou de mise en incubation..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visa officiel de conformité <span className="font-normal text-slate-500">(à remplir seulement si la validation a réellement eu lieu ; sinon laisser vide)</span></label>
                <input
                  type="text"
                  value={newVerifiedBy}
                  onChange={(e) => setNewVerifiedBy(e.target.value)}
                  placeholder="Nom de la personne ou de l'institution qui a réellement validé"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="shrink-0 bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between gap-3 sticky bottom-0 z-20 shadow-lg">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-2 hover:shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Publier dans le fil d'actualité</span>
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      {/* MODAL: REMPLACER LA VIDÉO OU L'ANIMATION */}
      {mediaToReplace && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-teal-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Remplacer la Vidéo ou Photo d'Illustration
                  </h3>
                  <p className="text-2xs text-cyan-200">
                    Injectez votre vraie vidéo de terrain (MP4, YouTube, WhatsApp, Photo HD)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMediaToReplace(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMediaReplacement} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {replaceSuccessMsg && (
                  <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{replaceSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Titre de la vidéo / action de terrain *
                  </label>
                  <input
                    type="text"
                    required
                    value={replaceTitle}
                    onChange={(e) => setReplaceTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white font-medium"
                    placeholder="Ex : Lâcher de 85 bébés tortues à Togbin Fandji"
                  />
                </div>

                {/* Import Fichier Local & Référence */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-cyan-600" />
                      <span>Importer votre vidéo ou photo depuis le disque</span>
                    </label>
                    <span className="text-2xs font-semibold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                      MP4, WebM, JPG, PNG
                    </span>
                  </div>

                  <div className="bg-cyan-50/80 border border-cyan-200/80 p-2.5 rounded-lg text-2xs text-cyan-950 flex items-start gap-2">
                    <FolderOpen className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <span className="font-bold">Dossier récepteur local : </span>
                      <div className="font-mono text-cyan-800 break-all select-all font-semibold mt-0.5">
                        {LOCAL_MEDIA_FOLDER}
                      </div>
                    </div>
                  </div>

                  <label className="w-full cursor-pointer border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-white p-3 rounded-xl text-center transition-colors flex items-center justify-center gap-2">
                    <UploadCloud className="w-5 h-5 text-cyan-600" />
                    <span className="text-xs font-bold text-slate-700">
                      {replaceUploadedPreview ? "Changer le fichier vidéo ou photo sélectionné" : "Sélectionner le fichier vidéo (MP4) ou photo"}
                    </span>
                    <input
                      type="file"
                      accept="video/*,image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>

                  {/* Contextual Box that appears right after upload with DIRECT FINALIZATION BUTTON */}
                  {replaceUploadedPreview && (
                    <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-xl space-y-3 shadow-sm animate-in fade-in zoom-in-95 duration-150">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-950">
                              Fichier multimédia chargé en mémoire
                            </div>
                            <div className="text-2xs text-emerald-700">
                              Format : {replaceUploadedType === 'video' ? 'Vidéo locale (MP4/WebM)' : 'Image de terrain'} • Prêt à enregistrer
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setReplaceUploadedPreview(null);
                            setReplaceUploadedType(null);
                            setReplaceVideoUrl('');
                          }}
                          className="text-2xs font-bold text-rose-600 hover:text-rose-800 bg-white px-2 py-1 rounded border border-rose-200 cursor-pointer"
                        >
                          Supprimer
                        </button>
                      </div>

                      {/* Video or Image Preview */}
                      {replaceUploadedType === 'video' ? (
                        <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-emerald-300 max-h-44 flex items-center justify-center">
                          <video 
                            src={replaceUploadedPreview} 
                            controls 
                            className="w-full max-h-40 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative rounded-lg overflow-hidden bg-slate-900 border border-emerald-300 max-h-44 flex items-center justify-center">
                          <img 
                            src={replaceUploadedPreview} 
                            alt="Aperçu" 
                            className="w-full max-h-40 object-contain"
                          />
                        </div>
                      )}

                      {/* CRITICAL: DIRECT FINALIZATION BUTTON INSIDE THE CONTEXT MENU */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveMediaReplacement()}
                          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400/60 transform active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                          <span>✅ VALIDER ET ENREGISTRER CE MÉDIA MAINTENANT</span>
                        </button>
                        <p className="text-[11px] text-center text-emerald-800 font-medium mt-1.5">
                          ✓ Enregistre la vidéo immédiatement dans le fil d'actualité sans défilement nécessaire
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    OU Lien Vidéo (YouTube, Vimeo, MP4 direct, ou lien Drive / WhatsApp)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={replaceVideoUrl}
                      onChange={(e) => setReplaceVideoUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                      placeholder="https://... (ou coller le lien de votre vidéo de patrouille)"
                    />
                    <Video className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    💡 Si vous laissez ce champ vide, le lecteur simulé restera actif avec votre titre et légende personnalisés.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Légende explicative de l'observation
                  </label>
                  <textarea
                    rows={3}
                    value={replaceCaption}
                    onChange={(e) => setReplaceCaption(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                    placeholder="Précisez le lieu (Togbin), l'heure, le nombre d'individus ou les forces en présence..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Auteur / Observateur ou Sentinelle
                  </label>
                  <input
                    type="text"
                    value={replaceAuthor}
                    onChange={(e) => setReplaceAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                    placeholder="Ex : Patrouille conjointe Éco-gardes AMSHARTE & BPLP"
                  />
                </div>
              </div>

              {/* STICKY FOOTER: ALWAYS VISIBLE ON SCREEN IN BOTH VIEWPORTS */}
              <div className="shrink-0 bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between gap-3 sticky bottom-0 z-20 shadow-lg">
                <button
                  type="button"
                  onClick={() => setMediaToReplace(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold cursor-pointer transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-md cursor-pointer transition flex items-center gap-2 hover:shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>
                    {replaceUploadedType === 'image' 
                      ? '✅ Enregistrer et Finaliser la Photo' 
                      : replaceUploadedType === 'video' 
                      ? '✅ Enregistrer et Finaliser la Vidéo' 
                      : '✅ Enregistrer et Finaliser le Média'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
