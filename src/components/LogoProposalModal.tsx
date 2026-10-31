import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Sparkles, 
  Leaf, 
  Waves, 
  ShieldCheck, 
  Check, 
  Layers, 
  Palette, 
  Compass, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { NGO_INFO } from '../data/initialData';
import { AuthenticLogo } from './AuthenticLogo';
import amsharteLogoE from '../assets/images/amsharte_logo_e_1789477234328.jpg';
import amsharteLogoOriginal from '../assets/images/amsharte_logo_1789404489263.jpg';

interface LogoProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLogoVariant: 'authentic_asr' | 'heraldic_e' | 'monogram_e' | 'heritage_asre';
  onSelectVariant: (variant: 'authentic_asr' | 'heraldic_e' | 'monogram_e' | 'heritage_asre') => void;
}

export function LogoProposalModal({
  isOpen,
  onClose,
  activeLogoVariant,
  onSelectVariant
}: LogoProposalModalProps) {
  const [activeTab, setActiveTab] = useState<'propositions' | 'symbolique' | 'charte'>('propositions');

  if (!isOpen) return null;

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-black uppercase tracking-wider bg-emerald-500/25 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 mb-1">
                <span>Identité Visuelle &amp; Héraldique 2026</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Propositions de Logo Officiel ONG AMSHARTE
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Avec intégration sacrée du « E » pour Environnemental &amp; Sauvegarde Côtière
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('propositions')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'propositions'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3 Propositions de Logo (avec le « E »)</span>
          </button>
          <button
            onClick={() => setActiveTab('symbolique')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'symbolique'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Signification des Symboles &amp; Couleurs</span>
          </button>
          <button
            onClick={() => setActiveTab('charte')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'charte'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Codes Couleurs &amp; Usages</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'propositions' && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <Leaf className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <strong className="text-emerald-900 font-bold">
                    Respect des symboles historiques, des couleurs héraldiques et du « E » :
                  </strong>
                  <p className="leading-relaxed">
                    Le logo authentique officiel <strong>ASR</strong> symbolise les trois piliers fondateurs de l'ONG (Assainissement, Solidarité, Ruralité) complété par sa dimension <strong>Environnementale</strong> (protection des tortues marines à Togbin Plage, mangroves et lagunes).
                  </p>
                </div>
              </div>

              {/* VEDETTE: LOGO AUTHENTIQUE OFFICIEL TRANSMIS PAR L'ONG */}
              <div className={`rounded-3xl border-2 p-5 sm:p-6 transition-all ${
                activeLogoVariant === 'authentic_asr'
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/70 via-white to-amber-50/40 shadow-lg ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm w-full md:w-auto shrink-0">
                    <AuthenticLogo size="lg" className="w-52 h-28" />
                    <span className="text-[10px] font-mono text-slate-500 mt-2">
                      Fichier Vectoriel SVG Natif • Haute Définition
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 text-left">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-white uppercase tracking-wider bg-emerald-700 px-3 py-1 rounded-full shadow-xs">
                        Logo Authentique Officiel
                      </span>
                      {activeLogoVariant === 'authentic_asr' && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Actuellement affiché sur le site
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      L'Emblème Historique ASR (ONG AMSHARTE)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      L'emblème authentique officiel : la trilogie <strong>A (Vert écologie / assainissement)</strong>, <strong>S (Orange solidarité)</strong> et <strong>R (Rouge résilience rurale)</strong>, unis par la <strong>barre d'union transversale</strong> et dynamisés par le <strong>flambeau/balai de salubrité à rayons rouges</strong>.
                    </p>

                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => onSelectVariant('authentic_asr')}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                          activeLogoVariant === 'authentic_asr'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-900 text-white hover:bg-emerald-600'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{activeLogoVariant === 'authentic_asr' ? 'Logo Officiel Appliqué' : 'Activer ce Logo Officiel'}</span>
                      </button>

                      <a
                        href={`${import.meta.env.BASE_URL}amsharte_authentic_logo.svg`}
                        download="AMSHARTE_Logo_Authentique.svg"
                        className="py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger le SVG Vectoriel</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of alternative proposals */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Déclinaisons &amp; Formats Complémentaires (Sceau Circulaire, Monogramme, Blason) :
                </h4>
              </div>

              {/* Grid of the 3 proposals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* PROPOSITION 1 */}
                <div className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all ${
                  activeLogoVariant === 'heraldic_e'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                        Proposition N°1
                      </span>
                      {activeLogoVariant === 'heraldic_e' && (
                        <span className="inline-flex items-center gap-1 text-2xs font-black text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Actif
                        </span>
                      )}
                    </div>

                    <div className="aspect-square rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-inner group">
                      <img 
                        src={amsharteLogoE} 
                        alt="Proposition 1 Logo AMSHARTE avec E" 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        Sceau Éco-Environnemental &amp; Tortue
                      </h4>
                      <p className="text-2xs text-slate-600 mt-1 leading-snug">
                        Emblème circulaire unifiant la Tortue marine de Togbin, le balai/soleil d'hygiène rurale et la feuille protectrice incarnant le « E ».
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectVariant('heraldic_e')}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeLogoVariant === 'heraldic_e'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{activeLogoVariant === 'heraldic_e' ? 'Logo Sélectionné' : 'Appliquer ce logo'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(amsharteLogoE, 'AMSHARTE_Logo_Proposition_1_E.jpg')}
                      className="w-full py-1.5 px-3 rounded-lg text-2xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Télécharger HD</span>
                    </button>
                  </div>
                </div>

                {/* PROPOSITION 2 */}
                <div className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all ${
                  activeLogoVariant === 'monogram_e'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-blue-700 uppercase tracking-wider bg-blue-100 px-2 py-0.5 rounded-full">
                        Proposition N°2
                      </span>
                      {activeLogoVariant === 'monogram_e' && (
                        <span className="inline-flex items-center gap-1 text-2xs font-black text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Actif
                        </span>
                      )}
                    </div>

                    {/* Styled Dynamic Monogram Badge */}
                    <div className="aspect-square rounded-xl bg-slate-900 border border-slate-700 p-4 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-cyan-950/40" />
                      <div className="relative z-10 flex items-center justify-center gap-1 font-black text-2xl tracking-tighter">
                        <span className="text-emerald-400 font-extrabold text-3xl">A</span>
                        <span className="text-white font-extrabold text-3xl">S</span>
                        <span className="text-red-500 font-extrabold text-3xl relative inline-block">
                          R
                          <span className="absolute -top-2 right-0 text-xs">🧹</span>
                        </span>
                        <span className="text-emerald-400 font-extrabold text-3xl relative inline-block">
                          E
                          <span className="absolute -bottom-1 -right-1 text-xs">🍃</span>
                        </span>
                      </div>
                      <div className="relative z-10 mt-2 text-[10px] font-black text-cyan-300 uppercase tracking-wider">
                        ASR-E • AMSHARTE
                      </div>
                      <div className="relative z-10 text-[8px] text-slate-400 font-medium mt-0.5">
                        Santé-Sécurité • Salubrité • Écologie
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        Monogramme Typographique ASR-E
                      </h4>
                      <p className="text-2xs text-slate-600 mt-1 leading-snug">
                        Reprise directe du sigle ASR des en-têtes officiels avec l'adjonction distincte du « E » vert serti d'une feuille pour l'écologie côtière.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectVariant('monogram_e')}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeLogoVariant === 'monogram_e'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{activeLogoVariant === 'monogram_e' ? 'Logo Sélectionné' : 'Appliquer ce logo'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Le monogramme vectoriel SVG est généré et intégré en haute fidélité.")}
                      className="w-full py-1.5 px-3 rounded-lg text-2xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Format Vectoriel SVG</span>
                    </button>
                  </div>
                </div>

                {/* PROPOSITION 3 */}
                <div className={`rounded-2xl border-2 p-4 flex flex-col justify-between transition-all ${
                  activeLogoVariant === 'heritage_asre'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xs font-extrabold text-amber-700 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
                        Proposition N°3
                      </span>
                      {activeLogoVariant === 'heritage_asre' && (
                        <span className="inline-flex items-center gap-1 text-2xs font-black text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" /> Actif
                        </span>
                      )}
                    </div>

                    <div className="aspect-square rounded-xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden shadow-inner group">
                      <img 
                        src={amsharteLogoOriginal} 
                        alt="Proposition 3 Logo AMSHARTE Héritage" 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div>
                      <h4 className="font-black text-slate-900 text-sm">
                        Sceau Héritage Institutionnel (2004-2026)
                      </h4>
                      <p className="text-2xs text-slate-600 mt-1 leading-snug">
                        Le blason fondateur avec ruban d'or, couronne de laurier et texte d'agrément officiel au Ministère du Travail et MCVT.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectVariant('heritage_asre')}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeLogoVariant === 'heritage_asre'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{activeLogoVariant === 'heritage_asre' ? 'Logo Sélectionné' : 'Appliquer ce logo'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(amsharteLogoOriginal, 'AMSHARTE_Logo_Heritage.jpg')}
                      className="w-full py-1.5 px-3 rounded-lg text-2xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Télécharger HD</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'symbolique' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Authentic Logo Breakdown */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 border border-slate-800">
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-800 pb-4">
                  <div className="bg-white rounded-xl p-2 shrink-0">
                    <AuthenticLogo size="sm" className="w-24 h-13" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      Analyse Héraldique du Logo Authentique ASR
                    </h3>
                    <p className="text-xs text-slate-300">
                      Les éléments fondateurs tels que conçus dans les statuts de l'ONG AMSHARTE
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>Lettre A (Verte) : Assainissement &amp; Écologie</span>
                    </div>
                    <p className="text-slate-300 text-2xs leading-relaxed">
                      L'agriculture saine, la salubrité rurale, la protection des mangroves et des tortues marines sur le littoral de Togbin.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>Lettre S (Orange) : Solidarité Communautaire</span>
                    </div>
                    <p className="text-slate-300 text-2xs leading-relaxed">
                      L'énergie humaine, la chaleur fraternelle et l'engagement collectif des communautés rurales et des pêcheurs artisans.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                    <div className="font-bold text-red-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span>Lettre R (Rouge) : Ruralité &amp; Résilience</span>
                    </div>
                    <p className="text-slate-300 text-2xs leading-relaxed">
                      La lutte active contre la pauvreté, le courage des éco-gardes et la persévérance historique depuis 2004 (22 ans d'action).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                      <span>Barre Noire Transversale : Ligne d'Éthique</span>
                    </div>
                    <p className="text-slate-300 text-2xs leading-relaxed">
                      Le lien d'union solide traversant les trois piliers ASR, symbolisant la rigueur statutaire et la gouvernance collégiale.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 sm:col-span-2">
                    <div className="font-bold text-red-300 flex items-center gap-1.5">
                      <span className="text-sm">✨</span>
                      <span>Le Flambeau / Balai à Rayons : Rayonnement &amp; Salubrité</span>
                    </div>
                    <p className="text-slate-300 text-2xs leading-relaxed">
                      Le manche noir oblique se terminant par un faisceau d'étincelles rouges représente l'action de balayage et de salubrité publique (campagnes d'hygiène), tout en agissant comme un phare guidant les actions vers l'avenir.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <div className="font-extrabold text-emerald-950 text-base flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  <span>La place du « E » pour « Environnemental »</span>
                </div>
                <p className="text-emerald-900 leading-relaxed text-xs">
                  À l'origine en 2004, le sigle était <strong>AMSHART</strong> (Amis du Monde pour la Santé, l'Hygiène et la Réflexion sur le Travail). Face à l'urgence climatique et à la sauvegarde des tortues marines menacées d'extinction sur la plage de Togbin, le bureau exécutif a solennellement étendu l'acronyme en <strong>AMSHARTE</strong>. La lettre <strong>« E »</strong> symbolise la résilience écologique des côtes béninoises, la replantation des mangroves lagunaires et la biodiversité océanique.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-lg">🐢</span>
                    <span>La Tortue Marine (Lepidochelys &amp; Dermochelys)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Emblème du programme Togbin Plage : sauvetage des femelles en ponte nocturne, sécurisation des œufs en écloserie et réinsertion dans l'océan Atlantique.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-lg">🧹</span>
                    <span>Le Balai &amp; L'Outil Artisanal (Salubrité)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inspiré des opérations <em>« Ayi Dji Ni Min »</em> : propreté des plages, hygiène des campements de pêcheurs et santé-sécurité des artisans au travail.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-lg">🌊</span>
                    <span>Les Ondes Marines (Golfe de Guinée)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Corridor maritime vital reliant les frayères de ponte de Togbin aux eaux territoriales du Bénin, sous surveillance avec la Police BPLP.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-lg">🤝</span>
                    <span>« Amis du Monde » (Fraternité Universelle)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Solidarité citoyenne entre les 33 membres, les 9 pionniers de 2004, le monde académique (UAC / FSS Pr FAYOMI) et les partenaires internationaux.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'charte' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="font-bold text-slate-900">Palette du Logo Authentique Fondateur (ASR) :</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#357A38] text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#357A38</div>
                  <div className="font-bold text-xs">Vert Forêt / A</div>
                  <div className="text-2xs text-emerald-100">Assainissement &amp; Nature</div>
                </div>

                <div className="p-3 bg-[#EB8333] text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#EB8333</div>
                  <div className="font-bold text-xs">Ocre Solaire / S</div>
                  <div className="text-2xs text-amber-100">Solidarité Communautaire</div>
                </div>

                <div className="p-3 bg-[#DE3426] text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#DE3426</div>
                  <div className="font-bold text-xs">Rouge Corail / R</div>
                  <div className="text-2xs text-red-100">Ruralité &amp; Résilience</div>
                </div>

                <div className="p-3 bg-[#0A0A0A] text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#0A0A0A</div>
                  <div className="font-bold text-xs">Noir Profond</div>
                  <div className="text-2xs text-slate-300">Barre d'Union &amp; ONG AMSHARTE</div>
                </div>
              </div>

              <div className="font-bold text-slate-900 pt-2">Nuancier Complémentaire pour Déclinaisons &amp; Documents :</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-emerald-600 text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#059669</div>
                  <div className="font-bold text-xs">Vert Émeraude</div>
                  <div className="text-2xs text-emerald-100">Environnement, Mangrove &amp; E</div>
                </div>

                <div className="p-3 bg-sky-600 text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#0284C7</div>
                  <div className="font-bold text-xs">Bleu Atlantique</div>
                  <div className="text-2xs text-sky-100">Océan, Tortues &amp; Plage de Togbin</div>
                </div>

                <div className="p-3 bg-amber-500 text-slate-950 rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#F59E0B</div>
                  <div className="font-bold text-xs">Or &amp; Ambre Solaire</div>
                  <div className="text-2xs text-amber-950 font-semibold">Hygiène, Salubrité &amp; Balai</div>
                </div>

                <div className="p-3 bg-red-600 text-white rounded-xl space-y-1">
                  <div className="font-mono font-black text-sm">#DC2626</div>
                  <div className="font-bold text-xs">Rouge Alerte</div>
                  <div className="text-2xs text-red-100">Santé-Sécurité &amp; Urgences chéloniens</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-4">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Conformité Juridique et Mention Obligatoire :</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-mono">
                  ONG AMSHARTE • Enregistrement officiel N° {NGO_INFO.legalCompliance.certificateNo} (Conformité Loi 2025-19 en République du Bénin).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-2xs text-slate-500 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approuvé Direction Exécutive &amp; CPI Henri D. FATCHINA</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition shadow-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
