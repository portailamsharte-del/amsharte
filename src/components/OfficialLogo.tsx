import React, { useState } from 'react';
import amsharteLogoUrl from '../assets/images/amsharte_logo_1789404489263.jpg';
import { ShieldCheck, Download, Info, X, Sparkles, Globe2, Leaf, Waves } from 'lucide-react';
import { NGO_OFFICIAL_NAME } from '../types';

interface OfficialLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showDetailsOnClick?: boolean;
  className?: string;
  withTextBadge?: boolean;
}

export function OfficialLogo({ 
  size = 'md', 
  showDetailsOnClick = true, 
  className = '',
  withTextBadge = false 
}: OfficialLogoProps) {
  const [showModal, setShowModal] = useState(false);

  const sizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = amsharteLogoUrl;
    link.download = 'AMSHARTE_Logo_Officiel_Bénin.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div 
        className={`inline-flex items-center gap-3 ${className}`}
        onClick={() => showDetailsOnClick && setShowModal(true)}
        role={showDetailsOnClick ? "button" : undefined}
        title={showDetailsOnClick ? "Cliquer pour voir la symbolique du Logo Officiel AMSHARTE" : undefined}
      >
        <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-emerald-400/80 shadow-md ring-2 ring-emerald-500/20 bg-white shrink-0 group cursor-pointer transition-transform hover:scale-105`}>
          <img 
            src={amsharteLogoUrl} 
            alt="Logo officiel de l'ONG AMSHARTE" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {showDetailsOnClick && (
            <div className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Info className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          )}
        </div>

        {withTextBadge && (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-sm tracking-wide">AMSHARTE</span>
              <span className="text-[9px] font-black bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded font-mono">
                + E
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium line-clamp-1 max-w-[220px]">
              Amis du Monde • Environnement
            </span>
          </div>
        )}
      </div>

      {/* Symbolism & Branding Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg bg-white shrink-0">
                  <img 
                    src={amsharteLogoUrl} 
                    alt="Logo officiel AMSHARTE" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-300" />
                    <span>Emblème Héraldique Officiel</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black">Logo Officiel AMSHARTE</h3>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                    Amis du Monde pour la Sauvegarde de l'Hygiène, SST &amp; Environnement
                  </p>
                </div>
              </div>
            </div>

            {/* Content: Symbolism Explanation */}
            <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700 max-h-[70vh] overflow-y-auto">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Le « E » Fondateur pour « Environnemental »</span>
                </div>
                <p className="text-emerald-950 text-xs leading-relaxed">
                  L'adjonction de la lettre <strong>« E »</strong> au sigle originel AMSHART (2004) consacre l'engagement solennel de l'organisation dans la <strong>préservation des tortues marines de Togbin</strong>, la régénération des <strong>mangroves</strong> et la résilience climatique littorale.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span>Vert Émeraude</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-snug">
                    Mangroves, salubrité rurale, régénération des forêts littorales et agro-écologie.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                    <span>Bleu Océan</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-snug">
                    Océan Atlantique, plage de Togbin, sanctuaire des chéloniens et partenariats côtiers.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Or &amp; Ambre</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-snug">
                    Solidarité des « Amis du Monde », dignité des travailleurs et rayonnement du Bénin.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="font-bold text-slate-900 text-xs">Symboles Héraldiques Intégrés :</div>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li><strong>La Tortue Marine :</strong> Emblème de la ponte nocturne à Togbin et du corridor migratoire atlantique.</li>
                  <li><strong>Le Rameau de Mangrove :</strong> Racine protectrice du cordon lagunaire béninois.</li>
                  <li><strong>Les Mains Protectrices &amp; Le Globe :</strong> Santé Sécurité au Travail (SST) et fraternité universelle.</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-2xs text-slate-500 font-mono">
                Format Officiel HD (PNG / JPG)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger le Logo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
