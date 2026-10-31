import React, { useState } from 'react';
import { NGO_INFO } from '../data/initialData';
import { Sparkles, ShieldCheck, Heart, Globe, Award, Info, ChevronRight } from 'lucide-react';

export const AcronymExplainerCard: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const letters = [
    { letter: 'A', word: 'Amis', sub: 'Solidarité & Fraternité', color: 'from-amber-500 to-amber-600', textColor: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    { letter: 'M', word: 'du Monde', sub: 'Ouverture & Coopération', color: 'from-blue-500 to-blue-600', textColor: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { letter: 'S', word: 'pour la Sauvegarde', sub: 'Protection des Vies & Milieux', color: 'from-emerald-500 to-emerald-600', textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { letter: 'H', word: "de l'Hygiène", sub: 'Salubrité & Propreté des Plages', color: 'from-cyan-500 to-cyan-600', textColor: 'text-cyan-700', bg: 'bg-cyan-50', border: 'border-cyan-200' },
    { letter: 'A', word: 'de la Santé', sub: 'Santé & Sécurité au Travail (SST)', color: 'from-rose-500 to-rose-600', textColor: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
    { letter: 'R', word: 'en Milieu Rural', sub: 'Terroirs & Agriculteurs', color: 'from-amber-600 to-amber-700', textColor: 'text-amber-800', bg: 'bg-amber-100', border: 'border-amber-300' },
    { letter: 'T', word: 'Artisanal', sub: 'Pêcheurs & Artisans Locaux', color: 'from-indigo-500 to-indigo-600', textColor: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { letter: 'E', word: 'et Environnemental', sub: 'Océan, Tortues & Mangroves', color: 'from-emerald-600 to-teal-700', textColor: 'text-emerald-800', bg: 'bg-emerald-100', border: 'border-emerald-300' },
  ];

  return (
    <div id="acronym-explainer-card" className="bg-white rounded-2xl border border-teal-200 shadow-md overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 text-white p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Rectificatif &amp; Dénomination Officielle</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {NGO_INFO.legalCompliance.certificateNo}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
          AMSHARTE = <span className="text-emerald-400 font-extrabold">« Amis du Monde »</span>
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl font-light">
          La véritable définition du sigle est <strong className="text-white font-semibold">« Amis du Monde »</strong> (et non « Action »). 
          Cette dénomination consacre la vision originelle de solidarité humaine et de sauvegarde planétaire des 9 pionniers fondateurs de 2004.
        </p>
      </div>

      {/* Interactive Letter breakdown */}
      <div className="p-5 sm:p-7 space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span>Décomposition lettre par lettre du sigle officiel :</span>
            <span className="text-teal-700 text-[11px] font-normal">Cliquez sur une lettre pour voir le détail</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-2.5">
            {letters.map((item, idx) => {
              const isSelected = selectedLetter === item.letter + idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedLetter(isSelected ? null : item.letter + idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${item.bg} ${item.border} ${
                    isSelected ? 'ring-2 ring-teal-500 shadow-md scale-105' : 'hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">{item.letter}</span>
                    <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${item.textColor} leading-tight`}>{item.word}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 22 Years Trajectory: From AMSHART to AMSHARTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-1.5">
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs font-mono">2004</span>
              <span>AMSHART (Sigle Originel)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Amis du Monde pour la Santé, l'Hygiène et la Réflexion sur le Travail</strong>. 
              Née suite aux 1ères journées scientifiques de Santé et Sécurité au Travail (SST) à la CCIB de Cotonou avec feu le Professeur Benjamin FAYOMI et neuf (09) pionniers, pour combler le vide en prévention chez les artisans et travailleurs ruraux.
            </p>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1.5">
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-xs font-mono">Dénomination Officielle</span>
              <span>AMSHARTE</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              <strong>{NGO_INFO.fullName}</strong>. 
              Sauvegarde de l'hygiène publique et de la santé sécurité au travail, élargie à la conservation de la biodiversité marine, à la protection des tortues marines sur la plage de Togbin et à la restauration des mangroves lagunaires.
            </p>
          </div>
        </div>

        {/* Full Title Banner */}
        <div className="bg-teal-900 text-white p-4 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-[11px] text-teal-300 font-semibold uppercase tracking-wider">
              Titre Officiel Inclus dans les Registres Publics (MISP &amp; MCVT)
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              {NGO_INFO.fullName}
            </div>
          </div>
          <div className="shrink-0 hidden sm:block">
            <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg text-xs font-medium text-emerald-300 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Loi 2025-19
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
