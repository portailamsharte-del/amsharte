import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shield, Compass, Waves, CheckCircle2 } from 'lucide-react';

interface FieldCorridorAnimationProps {
  onReplace?: () => void;
  isExample?: boolean;
}

export const FieldCorridorAnimation: React.FC<FieldCorridorAnimationProps> = ({
  onReplace,
  isExample = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [step, setStep] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 3000 / speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const stepsInfo = [
    {
      title: "Étape 1 : Émersion Nocturne & Laisse de Mer",
      desc: "La femelle tortue olivâtre quitte les rouleaux atlantiques entre 22h et 04h du matin lors des marées favorables.",
      coords: "6°21'04.9\"N (Rivage océanique)",
      progress: 25
    },
    {
      title: "Étape 2 : Montée vers la Dune & Creusement",
      desc: "Progression lente (45 min) au-dessus de la ligne de marée haute. Excavation méticuleuse du nid à 60 cm de profondeur.",
      coords: "Zone dunaire non submergée",
      progress: 50
    },
    {
      title: "Étape 3 : Ponte & Ponte Vulnérable Détectée",
      desc: "Dépôt de 120 à 150 œufs sphériques. Détection immédiate par la patrouille conjointe Éco-garde & Police BPLP.",
      coords: "Nid identifié & balisé GPS",
      progress: 75
    },
    {
      title: "Étape 4 : Transfert Sécurisé vers l'Écloserie",
      desc: "Conditionnement en seaux aérés avec sable humide et enfouissement réglementaire dans l'écloserie modèle de Togbin.",
      coords: "Écloserie Centrale Togbin Fandji",
      progress: 100
    }
  ];

  return (
    <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-cyan-800/50 shadow-lg mx-5 sm:mx-6 my-4">
      {/* Top Media Bar with Replacement Callout */}
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="w-3.5 h-3.5 text-cyan-400" />
            Animation Pédagogique Interactive • Littoral de Togbin
          </span>
        </div>

        {onReplace && (
          <button
            onClick={onReplace}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>🔄 Remplacer ce média</span>
          </button>
        )}
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950 p-4 sm:p-6 overflow-hidden">
        <svg 
          viewBox="0 0 600 220" 
          className="w-full h-44 sm:h-56 rounded-xl border border-cyan-900/40 bg-slate-950/80 shadow-inner"
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>
            <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <radialGradient id="patrolLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
            </radialGradient>
          </defs>

          {/* Ocean Section (Left) */}
          <rect x="0" y="0" width="160" height="220" fill="url(#oceanGrad)" />
          {/* Ocean Waves */}
          <path 
            d="M 10 30 Q 30 20 50 30 T 90 30 T 130 30" 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            opacity="0.6" 
          />
          <path 
            d="M 20 80 Q 40 70 60 80 T 100 80 T 140 80" 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            opacity="0.5" 
          />
          <path 
            d="M 15 140 Q 35 130 55 140 T 95 140 T 135 140" 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            opacity="0.7" 
          />
          <text x="30" y="200" fill="#38bdf8" fontSize="10" fontWeight="bold">Océan Atlantique</text>

          {/* Shoreline / Surf Line */}
          <line x1="160" y1="0" x2="160" y2="220" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
          <text x="165" y="25" fill="#a5f3fc" fontSize="8" fontWeight="bold">Rivage (Laisse de mer)</text>

          {/* Beach & Dune Sand (Center to Right) */}
          <rect x="160" y="0" width="440" height="220" fill="#0f172a" />

          {/* Nesting Dune Ridge */}
          <path d="M 280 0 L 320 220" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
          <text x="290" y="25" fill="#94a3b8" fontSize="8">Zone de Ponte</text>

          {/* Hatchery Box (Right) */}
          <rect x="470" y="40" width="115" height="140" rx="8" fill="#134e4a" stroke="#10b981" strokeWidth="1.5" />
          <text x="480" y="65" fill="#6ee7b7" fontSize="10" fontWeight="bold">Écloserie Modèle</text>
          <text x="480" y="80" fill="#a7f3d0" fontSize="8">Togbin Fandji</text>
          <rect x="485" y="95" width="40" height="30" rx="3" fill="#042f2e" stroke="#34d399" strokeWidth="1" />
          <text x="495" y="113" fill="#34d399" fontSize="8">Bac N°14</text>
          <rect x="535" y="95" width="40" height="30" rx="3" fill="#042f2e" stroke="#34d399" strokeWidth="1" />
          <text x="545" y="113" fill="#34d399" fontSize="8">Bac N°15</text>
          <text x="482" y="155" fill="#fde68a" fontSize="8" fontWeight="bold">142 Œufs protégés</text>

          {/* Turtle Path Trajectory */}
          <path 
            d="M 120 110 C 180 110, 240 140, 310 130 C 370 120, 420 110, 485 110" 
            fill="none" 
            stroke="#f59e0b" 
            strokeWidth="3" 
            strokeDasharray="6 4" 
            opacity="0.7" 
          />

          {/* Dynamic Turtle Marker Position based on current step */}
          {step === 0 && (
            <g transform="translate(110, 95)">
              <circle cx="15" cy="15" r="16" fill="#10b981" fillOpacity="0.3" />
              <circle cx="15" cy="15" r="10" fill="#059669" />
              <text x="10" y="19" fontSize="14">🐢</text>
              <text x="-15" y="38" fill="#6ee7b7" fontSize="9" fontWeight="bold">Émersion (01h)</text>
            </g>
          )}

          {step === 1 && (
            <g transform="translate(220, 110)">
              <circle cx="15" cy="15" r="18" fill="#eab308" fillOpacity="0.3" />
              <circle cx="15" cy="15" r="11" fill="#ca8a04" />
              <text x="10" y="19" fontSize="14">🐢</text>
              <text x="-10" y="38" fill="#fef08a" fontSize="9" fontWeight="bold">Ascension dune</text>
            </g>
          )}

          {step === 2 && (
            <g transform="translate(300, 110)">
              <circle cx="15" cy="15" r="22" fill="#ef4444" fillOpacity="0.3" />
              <circle cx="15" cy="15" r="12" fill="#dc2626" />
              <text x="10" y="19" fontSize="14">🥚</text>
              <text x="-25" y="40" fill="#fca5a5" fontSize="9" fontWeight="bold">Chambre 60 cm (Ponte)</text>
              {/* BPLP Red light cone */}
              <polygon points="315,70 290,120 340,120" fill="url(#patrolLight)" />
              <text x="270" y="65" fill="#f87171" fontSize="8">Patrouille Police BPLP</text>
            </g>
          )}

          {step === 3 && (
            <g transform="translate(480, 95)">
              <circle cx="15" cy="15" r="20" fill="#10b981" fillOpacity="0.4" />
              <text x="8" y="20" fontSize="16">🛡️</text>
              <text x="-35" y="40" fill="#34d399" fontSize="9" fontWeight="bold">Sécurisé en Écloserie</text>
            </g>
          )}
        </svg>

        {/* Dynamic Controls Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>

            <button
              onClick={() => setStep(0)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition cursor-pointer"
              title="Réinitialiser l'animation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Recommencer</span>
            </button>

            <div className="flex items-center gap-1 ml-2 text-xs text-slate-400">
              <span>Vitesse :</span>
              <button
                onClick={() => setSpeed(1)}
                className={`px-2 py-0.5 rounded text-2xs font-bold ${speed === 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
              >
                1x
              </button>
              <button
                onClick={() => setSpeed(2)}
                className={`px-2 py-0.5 rounded text-2xs font-bold ${speed === 2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
              >
                2x
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-2xs text-cyan-300">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Site de Togbin Fandji (6°21'04.9"N 2°21'08.0"E)</span>
          </div>
        </div>

        {/* Step-by-Step Info Box */}
        <div className="mt-3 bg-slate-900/90 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h5 className="text-xs font-bold text-cyan-400">
              {stepsInfo[step].title}
            </h5>
            <span className="text-[10px] text-slate-400 font-mono">
              Progression : {stepsInfo[step].progress}%
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {stepsInfo[step].desc}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-2xs text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{stepsInfo[step].coords}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
