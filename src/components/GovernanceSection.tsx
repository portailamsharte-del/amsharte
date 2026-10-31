import React, { useState } from 'react';
import { 
  Landmark, 
  ShieldCheck, 
  Users, 
  FileText, 
  Award, 
  Scale, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Calendar, 
  ChevronRight, 
  ExternalLink,
  BookOpen,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { NGO_INFO, BOARD_MEMBERS, INITIAL_JOB_DESCRIPTIONS } from '../data/initialData';
import { OfficialDocument, BoardMember } from '../types';

interface GovernanceSectionProps {
  onGoToMediatheque?: () => void;
  onGoToIntranet?: (tab: string) => void;
  officialDocuments?: OfficialDocument[];
}

export const GovernanceSection: React.FC<GovernanceSectionProps> = ({
  onGoToMediatheque,
  onGoToIntranet,
  officialDocuments = []
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ca_presentation' | 'pyramide_pouvoirs' | 'loi_2025_19' | 'actes_ca'>('ca_presentation');

  // Filter CA documents if present
  const caDocs = officialDocuments.filter(d => 
    d.title.toLowerCase().includes('conseil') || 
    d.title.toLowerCase().includes('loi 2025-19') ||
    d.issuedBy.toLowerCase().includes('conseil') ||
    d.referenceNumber?.includes('CA')
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner: Statutory Governance & Law 2025-19 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-indigo-300" />
              <span>Organe Délibérant &amp; Surveillance Suprême</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conformité Loi N° 2025-19 (MISP Bénin)</span>
            </span>
            <span className="text-xs text-slate-300">22 ans d'existence (2004 - 2026)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Conseil d'Administration de l'ONG AMSHARTE
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed max-w-3xl">
            Présidé par <strong>Mme Philomène AKPODJI</strong>, le Conseil d'Administration constitue l'instance souveraine d'orientation stratégique, de surveillance morale et d'approbation budgétaire de l'Organisation Non Gouvernementale <strong>AMSHARTE (Amis du Monde pour la Sauvegarde de l'Hygiène, de la Santé Sécurité au Travail en Milieu Rural Artisanal et Environnemental)</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="text-indigo-300 font-bold">Présidente du CA :</span>
              <span className="text-white font-semibold">{NGO_INFO.boardPresident}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="text-indigo-300 font-bold">Directeur Exécutif :</span>
              <span className="text-white font-semibold">{NGO_INFO.executiveDirector}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="text-indigo-300 font-bold">Chargé de Programmes (CPI) :</span>
              <span className="text-white font-semibold">{NGO_INFO.interimProgramManager}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('ca_presentation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'ca_presentation'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>La Présidence &amp; Composition du CA</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pyramide_pouvoirs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pyramide_pouvoirs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Organigramme (CA / DE / CPI / chargés)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('loi_2025_19')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'loi_2025_19'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Règles Loi N° 2025-19 &amp; Contrôle</span>
        </button>

        <button
          onClick={() => setActiveSubTab('actes_ca')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'actes_ca'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Délibérations &amp; PV Officiels ({caDocs.length})</span>
        </button>
      </div>

      {/* 1. SUB-TAB: PRÉSIDENCE & COMPOSITION */}
      {activeSubTab === 'ca_presentation' && (
        <div className="space-y-6">
          {/* Card: Focus on Mme Philomène AKPODJI */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-indigo-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 border-indigo-100 shadow-lg bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                    alt="Mme AKPODJI Philomène"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-md" title="Présidence du Conseil d'Administration">
                  <Award className="w-5 h-5" />
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Mme Philomène AKPODJI
                </h3>
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  Présidente du Conseil d'Administration
                </p>
                <span className="inline-block mt-1 text-2xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Mandat Statutaire Électif
                </span>
              </div>

              <div className="w-full pt-2 flex flex-col gap-1.5 text-xs text-slate-600">
                <a
                  href="mailto:ca@amsharte.org"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-900 border border-slate-200 transition font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ca@amsharte.org</span>
                </a>
                <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-2xs">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Liaison CA : (+229) 01 66 03 29 13</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  Rôle Statutaire &amp; Prérogatives Suprêmes
                </span>
                <h4 className="text-xl font-bold text-slate-900 mt-1">
                  Garantie Institutionnelle, Éthique &amp; Rigueur Budgétaire
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                En qualité de Présidente du Conseil d'Administration (PCA), <strong>Mme Philomène AKPODJI</strong> incarne l'autorité souveraine de l'ONG entre deux Assemblées Générales. Elle veille à ce que toutes les actions conduites sur le littoral (écloserie de Togbin, protection des tortues marines, reboisement de mangroves) soient strictement alignées avec l'objet social associatif, les statuts rénovés et les exigences de la <strong>Loi N° 2025-19</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Orientation &amp; Stratégie</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-relaxed">
                    Fixe les priorités pluriannuelles, valide les partenariats d'envergure avec le MCVT, l'Union Européenne et la FPA2 Monaco.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Surveillance Financière</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-relaxed">
                    Examine la concordance des pièces comptables (Dolibarr &amp; Google Drive) et certifie les comptes d'emploi des fonds micro-projets.
                  </p>
                </div>

                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>Quitus &amp; Contrôle Exécutif</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-relaxed">
                    Accorde le quitus de gestion morale et financière à la Direction Exécutive (SONON Tchéhouéa) et mandate le CPI.
                  </p>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Légitimité Communautaire</span>
                  </div>
                  <p className="text-2xs text-slate-600 leading-relaxed">
                    Maintient le dialogue direct avec les comités villageois, dignitaires locaux et coopératives de pêcheurs de Togbin et Grand-Popo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Composition of the Board */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Composition des Collèges du Conseil d'Administration</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Une gouvernance collégiale représentative des experts de l'environnement, des universitaires et des riverains côtiers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* College 1 */}
              <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 space-y-2">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span>1. Collège de la Présidence</span>
                </div>
                <p className="text-slate-600 text-2xs leading-relaxed">
                  Piloté par <strong>Mme Philomène AKPODJI</strong>. Veille à la régularité des comptes, à la supervision des audits légaux et aux relations officielles avec les ministères de tutelle (MCVT, MISP).
                </p>
                <div className="pt-2 text-2xs font-bold text-indigo-700">
                  • 2 Sièges Délibératifs
                </div>
              </div>

              {/* College 2 */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-2">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span>2. Collège Scientifique &amp; Écologique</span>
                </div>
                <p className="text-slate-600 text-2xs leading-relaxed">
                  Regroupe des biologistes marins et experts de la biodiversité ouest-africaine (réseau WIDECAST). Valide la rigueur méthodologique des protocoles de baguage, télémétrie et restauration des mangroves.
                </p>
                <div className="pt-2 text-2xs font-bold text-emerald-700">
                  • 3 Sièges Consultatifs &amp; Délibératifs
                </div>
              </div>

              {/* College 3 */}
              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/30 space-y-2">
                <div className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span>3. Collège Communautaire &amp; Éco-gardes</span>
                </div>
                <p className="text-slate-600 text-2xs leading-relaxed">
                  Représentants des pêcheurs artisans de Togbin Fandji, mareyeuses et délégués des éco-gardes. Garantit que les projets de conservation protègent les moyens d'existence des populations locales.
                </p>
                <div className="pt-2 text-2xs font-bold text-amber-700">
                  • 3 Sièges Communautaires
                </div>
              </div>
            </div>

            {/* Galerie Nominative des 6 Administrateurs du Conseil */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span>Membres Titulaires du Conseil d'Administration (Mandat 2024 - 2028)</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Registre certifié conforme déposé au Ministère de l'Intérieur et de la Sécurité Publique (Loi 2025-19)
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-200 self-start sm:self-auto">
                  Présidé par Philomène AKPODJI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {BOARD_MEMBERS.map((admin) => (
                  <div 
                    key={admin.id} 
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 transition shadow-2xs hover:shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={admin.photo} 
                          alt={admin.name} 
                          className="w-13 h-13 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 block w-fit truncate">
                            {admin.collegeLabel}
                          </span>
                          <h5 className="font-bold text-sm text-slate-900 truncate mt-0.5">
                            {admin.name}
                          </h5>
                          <p className="text-xs text-indigo-700 font-semibold truncate">
                            {admin.role}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {admin.bio}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-500">
                      <span className="font-mono">{admin.npiNumber}</span>
                      <span className="font-semibold text-indigo-600">{admin.mandatePeriod.split(' ')[0]} - {admin.mandatePeriod.split(' ')[2]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: ORGANIGRAMME (CA / DE / CPI / chargés) — d'après le document « Cahiers de charge » */}
      {activeSubTab === 'pyramide_pouvoirs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Organigramme de l'ONG
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Comment s'articulent le Conseil d'Administration, la Direction Exécutive, le CPI et les chargés ?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Le Conseil d'Administration gouverne, le Directeur Exécutif dirige et représente l'ONG, le CPI coordonne les programmes et consolide les rapports, et chaque chargé rend compte au Directeur Exécutif.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 to-indigo-950 text-white border-2 border-indigo-500 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-black text-xs text-indigo-200">
                      NIV 1
                    </span>
                    <div>
                      <div className="text-xs uppercase font-bold text-indigo-300">Organe de Gouvernance</div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        Conseil d'Administration (CA) — Présidé par Mme Philomène AKPODJI
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-2xs font-bold border border-indigo-400/30">
                    Gouvernance &amp; Contrôle
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-indigo-100">
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Rôle :</strong>
                    <p className="text-2xs text-indigo-200/90 leading-relaxed">
                      Organe de gouvernance de l'ONG. Ses attributions précises sont fixées par les Statuts et le Règlement Intérieur, conformément à la Loi 2025-19.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Relation avec le DE :</strong>
                    <p className="text-2xs text-indigo-200/90 leading-relaxed">
                      Le Directeur Exécutif lui rend compte de la marche générale de l'ONG. La Présidente du CA signe la fiche de poste du DE.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Information du CA :</strong>
                    <p className="text-2xs text-indigo-200/90 leading-relaxed">
                      Le CA reçoit copie (ampliation) des cahiers de charge de l'équipe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    Le DE rend compte au PCA
                  </div>
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-900 text-white border-2 border-blue-400 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-blue-500/30 border border-blue-400/50 flex items-center justify-center font-black text-xs text-blue-200">
                      NIV 2
                    </span>
                    <div>
                      <div className="text-xs uppercase font-bold text-blue-300">Organe Exécutif</div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        Direction Exécutive (DE) — SONON Tchéhouéa
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-200 text-2xs font-bold border border-blue-400/30">
                    Direction, Arbitrage &amp; Représentation
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-blue-100">
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Attributions :</strong>
                    <p className="text-2xs text-blue-200/90 leading-relaxed">
                      Définit la vision stratégique, arbitre par écrit les questions de compétences, valide et signe les cahiers de charge, actes de nomination, budgets et conventions préparés par l'équipe.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Représentation :</strong>
                    <p className="text-2xs text-blue-200/90 leading-relaxed">
                      Assure la représentation officielle de l'ONG et la recherche de financement de haut niveau, en s'appuyant sur le CPI et le Chargé à la mobilisation des PTF.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Supérieur hiérarchique :</strong>
                    <p className="text-2xs text-blue-200/90 leading-relaxed">
                      Les fiches de poste de l'équipe (finances, site web, communication, juridique, relations extérieures, PTF, programmes, presse) le désignent comme supérieur hiérarchique direct.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    Coordination des programmes &amp; règle J+10
                  </div>
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-emerald-900 text-white border-2 border-emerald-500 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center font-black text-xs text-emerald-200">
                      NIV 3
                    </span>
                    <div>
                      <div className="text-xs uppercase font-bold text-emerald-300">Coordination des Programmes — Deuxième niveau par la fonction</div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        Chargé de Programmes par Intérim (CPI) — Henri Doudédji FATCHINA
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-2xs font-bold border border-emerald-400/30">
                    Coordination • Rapportage J+10
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-100">
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Attributions :</strong>
                    <p className="text-2xs text-emerald-200/90 leading-relaxed">
                      Gère les programmes et projets, assure la planification et le suivi-évaluation, élabore le contenu technique des projets destinés aux partenaires, coordonne animateurs, points focaux et collaborateurs.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Rapports :</strong>
                    <p className="text-2xs text-emerald-200/90 leading-relaxed">
                      Consolide les contributions des chargés et des points focaux : rapport mensuel au plus tard 10 jours après le mois échu, rapport annuel au plus tard le 1er février. Il les soumet au DE pour validation.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-white block text-2xs uppercase">Intérim du DE :</strong>
                    <p className="text-2xs text-emerald-200/90 leading-relaxed">
                      Assure l'intérim du DE pour les actes de gestion courante. Les engagements financiers ou juridiques majeurs restent soumis à une délégation expresse du DE.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                  <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    Chargés rattachés au DE
                  </div>
                  <div className="w-0.5 h-6 bg-slate-300"></div>
                </div>
              </div>

              {/* Chargés rattachés directement au DE (d'après les fiches de poste) */}
              <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-300 shadow-xs">
                <div className="border-b border-slate-200 pb-3">
                  <div className="text-xs uppercase font-bold text-slate-500">Équipe rattachée au Directeur Exécutif</div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">Chargés et collaborateurs</h4>
                  <p className="text-2xs text-slate-500 mt-0.5">
                    Chaque chargé rend compte au DE. Les chargés « Santé des Tortues » et « Mangroves » travaillent en coordination opérationnelle avec le CPI, à qui ils remettent leur rapport mensuel sous 5 jours.
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INITIAL_JOB_DESCRIPTIONS.filter((j) => !['post-pca', 'post-de', 'post-cpi'].includes(j.id)).map((j) => (
                    <div key={j.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-slate-900 leading-snug">{j.title}</div>
                      <div className="text-2xs text-slate-600">
                        {j.incumbentName === 'À désigner' ? <em>Poste à pourvoir</em> : j.incumbentName}
                      </div>
                      {j.reportsTo.includes('coordination opérationnelle') && (
                        <div className="text-2xs font-semibold text-emerald-700">Coordination opérationnelle avec le CPI</div>
                      )}
                      {j.reportsTo.includes('Chargé à la Communication') && (
                        <div className="text-2xs font-semibold text-indigo-700">En lien avec le Chargé à la Communication</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB: LOI 2025-19 & CONFORMITÉ */}
      {activeSubTab === 'loi_2025_19' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  Certificat MISP N° PSO1509-260421-nhdJTH
                </span>
                <span className="text-xs text-slate-500">• 22 ans de régularité</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Conformité Légale du Conseil d'Administration avec la Loi N° 2025-19
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                La Loi N° 2025-19 adoptée par l'Assemblée Nationale du Bénin impose aux ONG des obligations strictes de gouvernance, de transparence et d'identification biométrique des administrateurs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <span>Enregistrement Biométrique des Administrateurs</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tous les membres du Conseil d'Administration, y compris la Présidente <strong>Mme Philomène AKPODJI</strong>, sont enregistrés avec leur Numéro Personnel d'Identification (NPI) et casier judiciaire au registre national tenu par le Ministère de l'Intérieur (MISP).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <span>Dépôt Annuel des Procès-Verbaux &amp; Comptes</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Le CA a l'obligation légale de tenir au moins une session ordinaire annuelle pour l'examen des comptes et le renouvellement des mandats. Les PV certifiés sont transmis au greffe du tribunal et au MCVT.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <span>Traçabilité Intégrale des Fonds Internationaux</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chaque subvention accordée par les Partenaires Techniques et Financiers (PTF) doit faire l'objet d'un visa préalable du CA et d'une déclaration auprès de la Cellule Nationale de Traitement des Informations Financières (CENTIF).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span>Protection Sociale des Travailleurs de Terrain</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conformément au nouveau code, l'ONG assure la déclaration CNSS du personnel cadre et dote tous les éco-gardes bénévoles d'Équipements de Protection Individuelle (EPI) pour les patrouilles nocturnes.
                </p>
              </div>
            </div>

            {/* Official Legal Seal */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Attestation d'Enregistrement Définitive</h4>
                  <p className="text-2xs text-emerald-800">
                    Dossier N° MISP/DC/SGM/DAIC/SA-2026 • Attestation N° PSO1509-260421-nhdJTH
                  </p>
                </div>
              </div>
              <button
                onClick={onGoToMediatheque}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Consulter l'Attestation dans la Médiathèque</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUB-TAB: DÉLIBÉRATIONS & ACTES DU CA */}
      {activeSubTab === 'actes_ca' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Registre des Délibérations &amp; Procès-Verbaux du CA</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actes officiels promulgués par la Présidente Mme Philomène AKPODJI et le Conseil d'Administration.
                </p>
              </div>

              <button
                onClick={onGoToMediatheque}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Accéder à la Médiathèque Complète</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Featured CA Act */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-2xs uppercase">
                  Acte Fondateur Délibératif 2026
                </span>
                <span className="font-mono text-xs font-bold text-indigo-900">
                  PV-AMSHARTE-CA-2026-01
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Procès-Verbal de Session Ordinaire du Conseil d'Administration — Session Annuelle 2026
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Délibérations souveraines du Conseil d'Administration réuni sous la présidence de <strong>Mme Philomène AKPODJI</strong>. Approbation du rapport d'activités, quitus financier à la Direction Exécutive, reconduction du mandat de coordination de terrain et mandatement officiel pour la gestion de l'écloserie de Togbin Plage.
                </p>
              </div>

              <div className="pt-2 border-t border-indigo-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-2xs text-slate-500">
                  <span>Signataire : <strong>Mme Philomène AKPODJI (PCA)</strong></span>
                  <span>•</span>
                  <span>Date : <strong>10 Février 2026</strong></span>
                  <span>•</span>
                  <span>Statut : <strong>Exécutoire &amp; Enregistré</strong></span>
                </div>

                <button
                  onClick={onGoToMediatheque}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Consulter le Texte Intégral (PDF Certifié)</span>
                </button>
              </div>
            </div>

            {/* Quick Links to Other Governance Acts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition space-y-2">
                <div className="flex items-center justify-between text-2xs text-slate-500">
                  <span className="font-mono font-bold text-indigo-700">PSO1509-260421</span>
                  <span>Avril 2026</span>
                </div>
                <h5 className="font-bold text-slate-900 text-xs">
                  Attestation de Conformité Juridique — Loi N° 2025-19
                </h5>
                <p className="text-2xs text-slate-500 line-clamp-2">
                  Délivrée par le Ministère de l'Intérieur attestant de la régularité des statuts et du CA.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition space-y-2">
                <div className="flex items-center justify-between text-2xs text-slate-500">
                  <span className="font-mono font-bold text-indigo-700">N° 878/MCVT</span>
                  <span>Juillet 2026</span>
                </div>
                <h5 className="font-bold text-slate-900 text-xs">
                  Lettre de Reconnaissance &amp; Partenariat Officiel MCVT
                </h5>
                <p className="text-2xs text-slate-500 line-clamp-2">
                  Validation du mandat officiel d'AMSHARTE pour la cogestion du littoral avec l'État béninois.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct link to Intranet Espace CA */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-900">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-sm text-white">Espace Numérique Sécurisé du Conseil d'Administration</h4>
          </div>
          <p className="text-xs text-indigo-200/80 max-w-2xl">
            La Présidente du CA et les administrateurs disposent d'un accès réservé (identifiant <code className="bg-indigo-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">CA-2026-PRES</code>) pour le contrôle des états comptables Google Drive, les rapprochements bancaires et le suivi des missions.
          </p>
        </div>

        <button
          onClick={() => onGoToIntranet ? onGoToIntranet('espace-travail') : null}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shrink-0 transition cursor-pointer shadow-md shadow-indigo-950"
        >
          <span>Accès Espace Délibérant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
