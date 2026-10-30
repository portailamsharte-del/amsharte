import React, { useState } from 'react';
import { Camera, ZoomIn, RotateCw, MapPin, CheckCircle2, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';

interface FieldPhotoGalleryProps {
  images: string[];
  title: string;
  location: string;
  isExample?: boolean;
  onReplace?: () => void;
}

export const FieldPhotoGallery: React.FC<FieldPhotoGalleryProps> = ({
  images,
  title,
  location,
  isExample = false,
  onReplace
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[activePhotoIndex] || images[0];

  return (
    <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-md">
      {/* Top Media Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
            <Camera className="w-3.5 h-3.5" />
          </span>
          <span className="font-bold text-slate-200">
            Photographie de Terrain
          </span>
          {images.length > 1 && (
            <span className="bg-slate-800 text-slate-300 text-2xs px-2 py-0.5 rounded-full">
              {activePhotoIndex + 1} / {images.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onReplace && (
            <button
              onClick={onReplace}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-2xs font-bold rounded-lg border border-amber-400/40 transition cursor-pointer flex items-center gap-1"
              title="Remplacer cette photo par votre propre image"
            >
              <RotateCw className="w-3 h-3" />
              <span>Remplacer la photo</span>
            </button>
          )}

          <button
            onClick={() => setIsZoomOpen(true)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
            title="Agrandir en plein écran"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Photo Container */}
      <div className="relative bg-black flex items-center justify-center min-h-[260px] max-h-[460px] overflow-hidden group">
        <img
          src={currentImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover sm:object-contain max-h-[460px] transition-transform duration-300 group-hover:scale-101"
        />

        {/* Floating badge */}
        <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15 text-2xs flex items-center gap-2 text-white">
          <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="font-medium truncate max-w-[220px]">{location}</span>
          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
        </div>

        {/* Multi-photo navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActivePhotoIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row if multiple photos */}
      {images.length > 1 && (
        <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          {images.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhotoIndex(idx)}
              className={`relative rounded-lg overflow-hidden shrink-0 w-14 h-10 border-2 transition cursor-pointer ${
                activePhotoIndex === idx
                  ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={imgUrl}
                alt={`Miniature ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* FULLSCREEN ZOOM MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in">
          {/* Zoom Header */}
          <div className="flex items-center justify-between text-white p-2">
            <div>
              <h4 className="font-bold text-sm text-slate-200">{title}</h4>
              <p className="text-2xs text-slate-400">{location}</p>
            </div>
            <button
              onClick={() => setIsZoomOpen(false)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Zoom Image */}
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
            <img
              src={currentImage}
              alt={title}
              referrerPolicy="no-referrer"
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
          </div>

          {/* Zoom Footer */}
          <div className="p-2 flex items-center justify-center gap-4 text-xs text-slate-300">
            {images.length > 1 && (
              <span className="bg-slate-800 px-3 py-1 rounded-full text-2xs">
                Photo {activePhotoIndex + 1} sur {images.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
