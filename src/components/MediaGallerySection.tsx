import React, { useState } from 'react';
import { GalleryMediaItem } from '../types';
import { INITIAL_GALLERY_ITEMS } from '../data/initialData';
import { Camera, MapPin, Calendar, User, Tag, Maximize2, Shield, Heart, ExternalLink } from 'lucide-react';

export const MediaGallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryMediaItem[]>(INITIAL_GALLERY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryMediaItem | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les Photos' },
    { id: 'tortues', label: 'Tortues & Biométrie' },
    { id: 'ecloserie', label: 'Écloserie Togbin' },
    { id: 'patrouille', label: 'Police BPLP & Nuit' },
    { id: 'mangroves', label: 'Mangroves Lagunaires' },
    { id: 'communaute', label: 'Éco-citoyenneté' },
  ];

  const filteredItems = items.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div id="media-gallery-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              <Camera className="w-4 h-4 text-teal-600" />
              <span>Galerie Visuelle de Terrain</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Photothèque &amp; Témoignages du Littoral de Togbin
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Immersion dans les missions d'AMSHARTE : sauvegarde des chéloniens marins, écloserie de Togbin Fandji, patrouilles de nuit avec la Police BPLP et restauration de la mangrove.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => (
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
        </div>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer"
                 onClick={() => setActiveItem(item)}>
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3.5">
                <span className="text-xs text-white flex items-center gap-1.5 font-medium">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Agrandir la photo
                </span>
              </div>

              {item.badgeTag && (
                <div className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {item.badgeTag}
                </div>
              )}
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span>{item.date}</span>
                  <span className="text-slate-400 truncate max-w-[140px]">📸 {item.photographer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-white">{activeItem.title}</h3>
                {activeItem.badgeTag && (
                  <span className="text-xs font-mono bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/40">
                    {activeItem.badgeTag}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                <div>
                  <span className="block text-[10px] text-slate-500">Lieu</span>
                  <span className="text-slate-200">{activeItem.location}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">Coordonnées GPS</span>
                  <span className="text-emerald-400 font-mono">{activeItem.gpsCoordinates || '6°21\'04.9"N 2°21\'08.0"E'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500">Prise de vue</span>
                  <span className="text-slate-200">{activeItem.date} ({activeItem.photographer})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
