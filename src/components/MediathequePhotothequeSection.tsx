import React, { useState } from 'react';
import { OfficialDocumentsSection } from './OfficialDocumentsSection';
import { MediaGallerySection } from './MediaGallerySection';
import { SeasonalCalendarSection } from './SeasonalCalendarSection';
import { 
  FolderArchive, 
  FileText, 
  Camera, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  Waves,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { NGO_INFO } from '../data/initialData';
import { OfficialDocument } from '../types';

interface MediathequePhotothequeSectionProps {
  documents?: OfficialDocument[];
  onGoToWebmastering?: () => void;
}

export const MediathequePhotothequeSection: React.FC<MediathequePhotothequeSectionProps> = ({
  documents,
  onGoToWebmastering
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mediatheque' | 'phototheque'>('mediatheque');
  const [mediathequeSubView, setMediathequeSubView] = useState<'documents' | 'calendrier'>('documents');

  return (
    <div id="mediatheque-phototheque-section" className="space-y-6">
      {/* Consolidated Master Header with the 2 Sub-Buttons */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-md border border-teal-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-2">
              <FolderArchive className="w-4 h-4 text-emerald-400" />
              <span>Centre de Ressources Documentaires &amp; Visuelles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Médiathèque &amp; Photothèque
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
              Consultez l'ensemble des actes officiels de {NGO_INFO.name} (reconnaissance étatique MCVT, conformité Loi 2025-19, protocoles d'écloserie) et parcourez la photothèque de nos actions sur la plage de Togbin.
            </p>
          </div>

          {/* THE 2 SUB-BUTTONS MANDATED BY THE USER */}
          <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-teal-700/50 flex items-center shrink-0 self-start lg:self-auto shadow-inner">
            <button
              onClick={() => setActiveSubTab('mediatheque')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'mediatheque'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>1. Médiathèque</span>
              <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded-full text-slate-300 font-mono">
                Actes &amp; Guides
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('phototheque')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === 'phototheque'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-950/50'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Camera className="w-4 h-4 text-cyan-300" />
              <span>2. Photothèque</span>
              <span className="text-[10px] bg-slate-800/80 px-1.5 py-0.5 rounded-full text-slate-300 font-mono">
                Terrain Togbin
              </span>
            </button>
          </div>
        </div>

        {/* Informative Sub-bar inside Médiathèque to seamlessly view documents or biological calendar */}
        {activeSubTab === 'mediatheque' && (
          <div className="mt-5 pt-4 border-t border-teal-800/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Vue documentaire :</span>
              <button
                onClick={() => setMediathequeSubView('documents')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  mediathequeSubView === 'documents'
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                📄 Actes d'État &amp; Protocoles d'Écloserie
              </button>
              <button
                onClick={() => setMediathequeSubView('calendrier')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 ${
                  mediathequeSubView === 'calendrier'
                    ? 'bg-emerald-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendrier Biologique des Pontes</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-2xs sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Conformité Loi 2025-19 &amp; Partenariat MCVT Lettre 878</span>
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: MEDIATHEQUE CONTENT */}
      {activeSubTab === 'mediatheque' && (
        <div>
          {mediathequeSubView === 'documents' ? (
            <OfficialDocumentsSection documents={documents} onGoToWebmastering={onGoToWebmastering} />
          ) : (
            <SeasonalCalendarSection />
          )}
        </div>
      )}

      {/* SUB-TAB 2: PHOTOTHEQUE CONTENT */}
      {activeSubTab === 'phototheque' && (
        <MediaGallerySection />
      )}
    </div>
  );
};
