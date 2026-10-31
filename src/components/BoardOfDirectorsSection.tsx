import React, { useState } from 'react';
import { 
  Award, 
  Landmark, 
  Scale, 
  ShieldCheck, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  BookOpen, 
  UserCheck, 
  FileText,
  ChevronRight,
  Sparkles,
  Search,
  Building2,
  Filter,
  X
} from 'lucide-react';
import { BoardMember } from '../types';
import { BOARD_MEMBERS, NGO_INFO } from '../data/initialData';
import { downloadFile } from '../utils/helpers';

interface BoardOfDirectorsSectionProps {
  onNavigateTab?: (tab: string) => void;
  compactMode?: boolean;
}

export const BoardOfDirectorsSection: React.FC<BoardOfDirectorsSectionProps> = ({
  onNavigateTab,
  compactMode = false
}) => {
  const [selectedCollege, setSelectedCollege] = useState<'all' | 'presidence_tresorerie' | 'scientifique_environnement' | 'communautaire_riverain'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  // Filtered members
  const filteredMembers = BOARD_MEMBERS.filter(member => {
    const matchesCollege = selectedCollege === 'all' || member.college === selectedCollege;
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.collegeLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollege && matchesSearch;
  });

  const president = BOARD_MEMBERS.find(m => m.isPresident) || BOARD_MEMBERS[0];

  const handleDownloadBoardSheet = () => {
    const lines = [
      "================================================================================",
      "             RÉPUBLIQUE DU BÉNIN — MINISTÈRE DE L'INTÉRIEUR (MISP)              ",
      "                 ORGANISATION NON GOUVERNEMENTALE AMSHARTE                     ",
      "     CONSEIL D'ADMINISTRATION — REGISTRE OFFICIEL STATUTAIRE (LOI 2025-19)     ",
      "================================================================================",
      `Dénomination : ${NGO_INFO.name}`,
      `Siège Social : ${NGO_INFO.headquarters}`,
      `Agrément & Attestation MISP : N° ${NGO_INFO.legalCompliance.certificateNo}`,
      `Mandat Statutaire en cours : 2024 - 2028 (Durée : 4 ans renouvelable)`,
      `Présidence du Conseil d'Administration : ${president.name}`,
      "--------------------------------------------------------------------------------",
      "",
      "COMPOSITION OFFICIELLE DES MEMBRES DU CONSEIL D'ADMINISTRATION :",
      ""
    ];

    BOARD_MEMBERS.forEach((m, idx) => {
      lines.push(`${idx + 1}. ${m.name.toUpperCase()}`);
      lines.push(`   • Titre / Rôle : ${m.role}`);
      lines.push(`   • Collège Statutaire : ${m.collegeLabel}`);
      lines.push(`   • Période de Mandat : ${m.mandatePeriod}`);
      lines.push(`   • Numéro Personnel d'Identification (NPI) : ${m.npiNumber || 'Conforme MISP'}`);
      lines.push(`   • Contact : ${m.contactEmail || 'N/A'} | ${m.contactPhone || 'N/A'}`);
      lines.push(`   • Biographie Officielle :`);
      lines.push(`     ${m.bio}`);
      lines.push(`   • Prérogatives & Responsabilités Statutaires :`);
      m.responsibilities.forEach(resp => lines.push(`     - ${resp}`));
      lines.push(`   • Qualifications : ${m.qualifications.join(' | ')}`);
      lines.push("--------------------------------------------------------------------------------");
    });

    lines.push("");
    lines.push("Certifié conforme aux délibérations souveraines de l'Assemblée Générale et");
    lines.push("aux statuts déposés au Ministère de l'Intérieur et de la Sécurité Publique.");
    lines.push(`Fait à Cotonou, le ${new Date().toLocaleDateString('fr-FR')}`);
    lines.push(`Pour le Conseil d'Administration : Mme Philomène AKPODJI, Présidente.`);

    downloadFile(
      lines.join("\n"),
      "AMSHARTE_Composition_Officielle_Conseil_Administration_2024_2028.txt",
      "text/plain"
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <Landmark className="w-3.5 h-3.5 text-indigo-300" />
              <span>Organe Suprême de Délibération &amp; Surveillance</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conformité Loi N° 2025-19 (MISP Bénin)</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              Mandat 2024 - 2028 (4 ans renouvelable)
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                Conseil d'Administration présidé par Mme Philomène AKPODJI
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Le Conseil d'Administration constitue l'instance souveraine d'orientation stratégique, de tutelle morale et d'approbation budgétaire de l'ONG <strong>AMSHARTE</strong>. Il veille à la stricte application des statuts associatifs, garantit la transparence des comptes et mandate la Direction Exécutive pour les opérations de terrain.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDownloadBoardSheet}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                title="Télécharger la fiche officielle des administrateurs"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Exporter Fiche CA (Loi 2025-19)</span>
              </button>

              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab('webmastering-docs')}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Délibérations &amp; PVs</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <div className="text-indigo-300 font-bold text-2xs uppercase">Présidence du CA</div>
              <div className="text-white font-black text-sm mt-0.5 truncate">{president.name}</div>
              <div className="text-slate-400 text-2xs">Présidente du Conseil d'Administration</div>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <div className="text-indigo-300 font-bold text-2xs uppercase">Nombre d'Administrateurs</div>
              <div className="text-white font-black text-sm mt-0.5">6 Membres Élus</div>
              <div className="text-slate-400 text-2xs">3 Collèges représentatifs</div>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <div className="text-indigo-300 font-bold text-2xs uppercase">Fréquence des Sessions</div>
              <div className="text-white font-black text-sm mt-0.5">Semestrielle + Extraord.</div>
              <div className="text-slate-400 text-2xs">Quitus annuel &amp; Budgets</div>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <div className="text-indigo-300 font-bold text-2xs uppercase">Tutelle Ministérielle</div>
              <div className="text-white font-black text-sm mt-0.5 truncate">MCVT &amp; MISP Bénin</div>
              <div className="text-slate-400 text-2xs">Attestation N° {NGO_INFO.legalCompliance.certificateNo}</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOCUS SPOTLIGHT ON LA PRÉSIDENTE DU CA : MME PHILOMÈNE AKPODJI */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border-2 border-indigo-200 shadow-md">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          {/* Photo & Identity */}
          <div className="flex flex-col items-center text-center space-y-3 shrink-0 mx-auto lg:mx-0">
            <div className="relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-4 border-indigo-600/30 shadow-xl bg-slate-100">
                <img 
                  src={president.photo} 
                  alt={president.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white" title="Présidente du Conseil d'Administration">
                <Award className="w-5 h-5" />
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                Présidente du CA
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                {president.name}
              </h3>
              <p className="text-xs font-semibold text-indigo-700">
                {president.role}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 w-full text-xs">
              <a 
                href={`mailto:${president.contactEmail}`}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 transition font-semibold"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>{president.contactEmail}</span>
              </a>
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 text-2xs">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Liaison : {president.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Detailed Narrative & Biography */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  Profil &amp; Biographie de la Présidente
                </span>
                <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Garantie Institutionnelle, Rigueur Budgétaire et Vision Statutaire
                </h4>
              </div>

              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                {president.npiNumber}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {president.bio}
            </p>

            {/* Key Prerogatives Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {president.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-indigo-100 text-xs shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium leading-snug">{resp}</span>
                </div>
              ))}
            </div>

            {/* Qualifications and Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100/80">
              <div className="flex flex-wrap items-center gap-2 text-2xs text-slate-600">
                <span className="font-bold text-slate-900">Qualifications :</span>
                {president.qualifications.map((q, i) => (
                  <span key={i} className="px-2 py-0.5 bg-indigo-100/60 text-indigo-900 rounded-md font-medium">
                    {q}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(president)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span>Voir la Fiche Complète</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR FOR ALL BOARD MEMBERS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* College Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCollege('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCollege === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Tous les Administrateurs ({BOARD_MEMBERS.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedCollege('presidence_tresorerie')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCollege === 'presidence_tresorerie'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              1. Présidence (2)
            </button>

            <button
              type="button"
              onClick={() => setSelectedCollege('scientifique_environnement')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCollege === 'scientifique_environnement'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              2. Scientifique &amp; Écologie (2)
            </button>

            <button
              type="button"
              onClick={() => setSelectedCollege('communautaire_riverain')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCollege === 'communautaire_riverain'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              3. Communautaire &amp; Éco-gardes (2)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher nom, rôle, bio..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* GRID OF ADMINISTRATORS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredMembers.map((member) => {
            const isPres = member.isPresident;
            const collegeColor = 
              member.college === 'presidence_tresorerie' 
                ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                : member.college === 'scientifique_environnement'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : 'bg-amber-100 text-amber-900 border-amber-200';

            return (
              <div 
                key={member.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 bg-white shadow-xs hover:shadow-md ${
                  isPres ? 'border-indigo-300 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Header: Photo + Name + College badge */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-xs bg-slate-100"
                      />
                      {isPres && (
                        <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-lg shadow-xs" title="Présidente du Conseil">
                          <Award className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${collegeColor}`}>
                          {member.collegeLabel.replace('Collège ', '')}
                        </span>
                        {isPres && (
                          <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                            Présidente
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {member.name}
                      </h4>

                      <p className="text-xs text-indigo-700 font-semibold leading-tight line-clamp-2">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Mandate & NPI */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-150">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{member.mandatePeriod.split(' ')[0]} - {member.mandatePeriod.split(' ')[2]}</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-600">{member.npiNumber}</span>
                  </div>

                  {/* Biography Excerpt */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Qualifications */}
                  <div className="space-y-1 pt-1 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700">Expertise Clé :</div>
                    <div className="text-2xs text-slate-600 flex flex-wrap gap-1">
                      {member.qualifications.slice(0, 2).map((q, i) => (
                        <span key={i} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 truncate max-w-full">
                          • {q}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-2xs text-slate-500 truncate">
                    {member.contactEmail && (
                      <a 
                        href={`mailto:${member.contactEmail}`} 
                        className="hover:text-indigo-600 transition flex items-center gap-1"
                        title={member.contactEmail}
                      >
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{member.contactEmail.split('@')[0]}</span>
                      </a>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Consulter Bio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DETAILED BIO & ATTRIBUTIONS */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="sticky top-0 bg-white/95 backdrop-blur-xs p-5 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Fiche Officielle de l'Administrateur</h3>
                  <p className="text-2xs text-slate-500">Registre du Conseil d'Administration (Loi N° 2025-19)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Member Presentation Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <img 
                  src={selectedMember.photo} 
                  alt={selectedMember.name} 
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm shrink-0"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-2xs font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                      {selectedMember.collegeLabel}
                    </span>
                    <span className="text-2xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {selectedMember.npiNumber}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-900">
                    {selectedMember.name}
                  </h4>
                  <p className="text-xs font-bold text-indigo-800">
                    {selectedMember.role}
                  </p>
                  <p className="text-2xs text-slate-500">
                    Mandat : {selectedMember.mandatePeriod}
                  </p>
                </div>
              </div>

              {/* Full Bio */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Biographie &amp; Parcours Professionnel</span>
                </h5>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedMember.bio}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prérogatives &amp; Responsabilités au Conseil</span>
                </h5>
                <div className="space-y-1.5">
                  {selectedMember.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-white rounded-xl border border-slate-200 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                      <span className="text-slate-800">{resp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Titres, Diplômes &amp; Qualifications</span>
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.qualifications.map((qual, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-medium">
                      {qual}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contacts */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-center sm:text-left">
                  <div className="text-indigo-300 font-bold">Ligne Officielle du Conseil d'Administration</div>
                  <div className="text-slate-300 text-2xs mt-0.5">Pour solliciter une audience ou adresser une communication officielle</div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedMember.contactEmail && (
                    <a
                      href={`mailto:${selectedMember.contactEmail}`}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{selectedMember.contactEmail}</span>
                    </a>
                  )}
                  {selectedMember.contactPhone && (
                    <div className="px-3 py-1.5 bg-slate-800 text-slate-200 rounded-xl text-xs font-mono flex items-center gap-1.5 border border-slate-700">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{selectedMember.contactPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Fermer la Fiche
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
