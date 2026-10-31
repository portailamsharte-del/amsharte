import React, { useState } from 'react';
import { MonthlyReport, ProjectCategory } from '../types';
import { NGO_INFO } from '../data/initialData';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  PlusCircle, 
  Printer, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle,
  FileCheck,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { formatFCFA, formatDateFrench, downloadFile, getReportingDeadlinesInfo } from '../utils/helpers';
import { downloadReportPrintableDocument, openReportPdfPrintWindow } from '../utils/reportPdfExport';

interface MonthlyReportsViewProps {
  reports: MonthlyReport[];
  onAddReport: (newReport: MonthlyReport) => void;
  onUpdateReportStatus: (reportId: string, newStatus: MonthlyReport['status'], notes?: string) => void;
  onNotify?: (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error', category?: 'rapport') => void;
}

export const MonthlyReportsView: React.FC<MonthlyReportsViewProps> = ({
  reports,
  onAddReport,
  onUpdateReportStatus,
  onNotify
}) => {
  const deadlines = getReportingDeadlinesInfo();
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(reports[0] || null);
  const [showNewReportModal, setShowNewReportModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Form State for new report submission (mimicking Google Forms)
  const [formMonth, setFormMonth] = useState<string>('Septembre');
  const [formYear, setFormYear] = useState<number>(2026);
  const [formAuthor, setFormAuthor] = useState<string>('Henri Doudédji FATCHINA');
  const [formRole, setFormRole] = useState<string>('Chargé de Programmes par Intérim (CPI)');
  const [formCategory, setFormCategory] = useState<ProjectCategory>('gouvernance');
  const [formSummary, setFormSummary] = useState<string>('');
  const [formActivity1, setFormActivity1] = useState<string>('');
  const [formActivity2, setFormActivity2] = useState<string>('');
  const [formResultMetric, setFormResultMetric] = useState<string>('');
  const [formResultValue, setFormResultValue] = useState<string>('');
  const [formChallenges, setFormChallenges] = useState<string>('');
  const [formSolutions, setFormSolutions] = useState<string>('');
  const [formNextPlan, setFormNextPlan] = useState<string>('');
  const [formBudgetNeeded, setFormBudgetNeeded] = useState<number>(500000);

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchMonth = filterMonth === 'all' || r.month.toLowerCase() === filterMonth.toLowerCase();
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchMonth && matchStatus;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSummary) return;

    const newReport: MonthlyReport = {
      id: `rep-${Date.now()}`,
      reference: `RAP-MENS-${formYear}-${formMonth.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      month: formMonth,
      year: formYear,
      authorName: formAuthor,
      authorRole: formRole,
      projectCategory: formCategory,
      dateSubmitted: new Date().toISOString().split('T')[0],
      status: 'soumis_cpi',
      summary: formSummary,
      activitiesCompleted: [
        formActivity1,
        formActivity2
      ].filter(Boolean),
      quantitativeResults: formResultMetric && formResultValue ? [
        { label: formResultMetric, value: formResultValue }
      ] : [
        { label: "Activités de terrain réalisées", value: "100% exécutées" }
      ],
      challengesFaced: formChallenges || "Aucune contrainte majeure observée sur le terrain.",
      solutionsApplied: formSolutions || "Mesures d'anticipation habituelles.",
      nextMonthPlanning: formNextPlan || "Poursuite du plan de travail opérationnel.",
      financialNeedsFCFA: Number(formBudgetNeeded) || 0
    };

    onAddReport(newReport);
    setSelectedReport(newReport);
    setShowNewReportModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['Reference', 'Mois', 'Annee', 'Auteur', 'Role', 'Date_Soumission', 'Statut', 'Synthese', 'Budget_Requis_FCFA'];
    const rows = reports.map(r => [
      `"${r.reference}"`,
      `"${r.month}"`,
      r.year,
      `"${r.authorName}"`,
      `"${r.authorRole}"`,
      `"${r.dateSubmitted}"`,
      `"${r.status}"`,
      `"${r.summary.replace(/"/g, '""')}"`,
      r.financialNeedsFCFA
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
    downloadFile(csvContent, `AMSHARTE_Rapports_Mensuels_Export.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Reporting Rules & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              Dispositif de Rapportage J+10
            </span>
            <span className="text-xs text-slate-500">• Consolidation CPI / Visa DE</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Rapports Mensuels d'Activité &amp; Échéancier
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Collecte terrain (Google Forms) &rarr; Consolidation par le CPI (Henri D. FATCHINA) &rarr; Visa du Directeur Exécutif (SONON Tchéhouéa).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowNewReportModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nouveau Rapport (Formulaire)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sheets / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 font-medium">Filtrer par :</span>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden font-medium"
          >
            <option value="all">Tous les mois</option>
            <option value="Août">Août 2026</option>
            <option value="Juillet">Juillet 2026</option>
            <option value="Juin">Juin 2026</option>
            <option value="Mai">Mai 2026</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden font-medium"
          >
            <option value="all">Tous les statuts</option>
            <option value="soumis_cpi">Soumis au CPI (À valider)</option>
            <option value="valide_cpi">Validé par CPI (Attente Visa DE)</option>
            <option value="vise_de">Visé par le DE (Approuvé)</option>
          </select>
        </div>

        <div className="text-slate-500">
          Affichage de <strong>{filteredReports.length}</strong> rapport(s)
        </div>
      </div>

      {/* Main Grid: List on Left, Selected Report View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List Column */}
        <div className="lg:col-span-4 space-y-2">
          {filteredReports.map((rep) => {
            const isSelected = selectedReport?.id === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 shadow-xs'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {rep.month} {rep.year}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rep.status === 'vise_de'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rep.status === 'valide_cpi'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rep.status === 'vise_de' ? '✓ Visé par le DE' : rep.status === 'valide_cpi' ? '✓ Validé par CPI' : 'En attente CPI'}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {rep.authorName}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {rep.authorRole}
                </div>

                <div className="text-[11px] text-slate-600 line-clamp-2 italic">
                  « {rep.summary} »
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Soumis le : {rep.dateSubmitted}</span>
                  <span className="font-semibold text-slate-600">Réf : {rep.reference}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Detail Column */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {selectedReport.reference}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Mois échu : {selectedReport.month} {selectedReport.year}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">
                    Rapport d'Activité Mensuel — {selectedReport.authorRole}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Auteur : <strong>{selectedReport.authorName}</strong> • Date d'enregistrement : {selectedReport.dateSubmitted}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      downloadReportPrintableDocument(selectedReport);
                      if (onNotify) {
                        onNotify(
                          'Rapport Exporté en PDF',
                          `Le rapport ${selectedReport.month} ${selectedReport.year} (${selectedReport.reference}) a été exporté en format officiel pour les partenaires.`,
                          'success',
                          'rapport'
                        );
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="Générer et télécharger le document officiel PDF / Imprimable"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exporter PDF (PTF)</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer border border-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Aperçu Impression</span>
                  </button>
                </div>
              </div>

              {/* Status & Validation Workflow Bar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Circuit de Validation Officiel AMSHARTE
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {/* Step 1: Soumission terrain */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="text-[10px] text-slate-500 font-semibold">1. REMONTÉE TERRAIN</div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reçu dans les délais</span>
                    </div>
                    <div className="text-[11px] text-slate-500">Par {selectedReport.authorName}</div>
                  </div>

                  {/* Step 2: Validation CPI */}
                  <div className={`p-3 rounded-lg border space-y-1 ${
                    selectedReport.status === 'valide_cpi' || selectedReport.status === 'vise_de'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}>
                    <div className="text-[10px] text-slate-500 font-semibold">2. CONSOLIDATION &amp; VISA CPI</div>
                    <div className="flex items-center gap-1.5 font-bold">
                      {selectedReport.status === 'valide_cpi' || selectedReport.status === 'vise_de' ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Validé par CPI</span>
                        </span>
                      ) : (
                        <span className="text-amber-800 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>En attente examen CPI</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">Henri D. FATCHINA</div>
                  </div>

                  {/* Step 3: Visa Final DE */}
                  <div className={`p-3 rounded-lg border space-y-1 ${
                    selectedReport.status === 'vise_de'
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="text-[10px] text-slate-500 font-semibold">3. VISA FINAL &amp; ARCHIVAGE DE</div>
                    <div className="flex items-center gap-1.5 font-bold">
                      {selectedReport.status === 'vise_de' ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Visé &amp; Ordonnancé</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>En attente visa DE</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">SONON Tchéhouéa</div>
                  </div>
                </div>

                {/* CPI and DE action buttons */}
                <div className="pt-2 flex flex-wrap gap-2 justify-end">
                  {selectedReport.status === 'soumis_cpi' && (
                    <button
                      onClick={() => onUpdateReportStatus(selectedReport.id, 'valide_cpi', 'Rapport vérifié et consolidé avec succès par le CPI.')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Valider en tant que CPI (Henri D. FATCHINA)</span>
                    </button>
                  )}

                  {selectedReport.status === 'valide_cpi' && (
                    <button
                      onClick={() => onUpdateReportStatus(selectedReport.id, 'vise_de', 'Vu et approuvé pour ordonnancement et diffusion. — SONON Tchéhouéa, DE')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Apposer le Visa Officiel du Directeur Exécutif (DE)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Core Content */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">
                    1. Synthèse Générale des Réalisations
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedReport.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">
                    2. Activités Clés Réalisées dans le Mois
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedReport.activitiesCompleted.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-800">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">
                    3. Indicateurs &amp; Données Chiffrées
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedReport.quantitativeResults.map((q, idx) => (
                      <div key={idx} className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/80">
                        <div className="text-[11px] text-slate-600">{q.label}</div>
                        <div className="text-sm font-bold text-blue-950 mt-0.5">{q.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                    <strong className="text-amber-950 text-xs block uppercase">Difficultés Rencontrées</strong>
                    <p className="text-xs text-amber-900 leading-relaxed">{selectedReport.challengesFaced}</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                    <strong className="text-emerald-950 text-xs block uppercase">Solutions Appliquées</strong>
                    <p className="text-xs text-emerald-900 leading-relaxed">{selectedReport.solutionsApplied}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-slate-900 uppercase">
                      4. Perspectives &amp; Prévisions Financières
                    </strong>
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Besoin estimé : {formatFCFA(selectedReport.financialNeedsFCFA)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{selectedReport.nextMonthPlanning}</p>
                </div>

                {/* Visas and notes */}
                {selectedReport.deVisaNotes && (
                  <div className="p-4 bg-emerald-950 text-emerald-100 rounded-xl space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Mention Officielle de Visa de la Direction Exécutive :
                    </div>
                    <p className="text-xs italic font-serif leading-relaxed">
                      « {selectedReport.deVisaNotes} »
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              Sélectionnez un rapport dans la colonne de gauche pour afficher son contenu officiel.
            </div>
          )}
        </div>
      </div>

      {/* New Report Form Modal (mimicking Google Forms -> Sheets integration) */}
      {showNewReportModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold uppercase text-emerald-700">Collecte Google Forms &rarr; Sheets</div>
                <h3 className="text-base font-bold text-slate-900">Saisir un Nouveau Rapport Mensuel</h3>
              </div>
              <button
                onClick={() => setShowNewReportModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Mois échu</label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Janvier">Janvier</option>
                    <option value="Février">Février</option>
                    <option value="Mars">Mars</option>
                    <option value="Avril">Avril</option>
                    <option value="Mai">Mai</option>
                    <option value="Juin">Juin</option>
                    <option value="Juillet">Juillet</option>
                    <option value="Août">Août</option>
                    <option value="Septembre">Septembre</option>
                    <option value="Octobre">Octobre</option>
                    <option value="Novembre">Novembre</option>
                    <option value="Décembre">Décembre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Année</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Programme / Pôle</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  >
                    <option value="gouvernance">Coordination CPI &amp; Gouvernance</option>
                    <option value="tortues">Programme Tortues Marines</option>
                    <option value="mangroves">Programme Mangroves</option>
                    <option value="education">Formation &amp; Éco-gardes</option>
                    <option value="ptf">Mobilisation PTF</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nom du Rédacteur</label>
                  <input
                    type="text"
                    required
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Titre / Rôle du Rédacteur</label>
                  <input
                    type="text"
                    required
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Résumé synthétique des activités du mois</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Bilan global des patrouilles, plantations ou réunions..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-medium">Activités majeures exécutées</label>
                <input
                  type="text"
                  placeholder="Activité 1 : Ex : 18 patrouilles nocturnes effectuées sur Togbin..."
                  value={formActivity1}
                  onChange={(e) => setFormActivity1(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="Activité 2 : Ex : Rempotage de 5 000 propagules en pépinière..."
                  value={formActivity2}
                  onChange={(e) => setFormActivity2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Indicateur chiffré (Libellé)</label>
                  <input
                    type="text"
                    placeholder="Ex : Nids protégés en écloserie"
                    value={formResultMetric}
                    onChange={(e) => setFormResultMetric(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Valeur réalisée</label>
                  <input
                    type="text"
                    placeholder="Ex : 12 nids sécurisés"
                    value={formResultValue}
                    onChange={(e) => setFormResultValue(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Difficultés rencontrées</label>
                  <textarea
                    rows={2}
                    placeholder="Ex : Problème de matériel ou intempéries..."
                    value={formChallenges}
                    onChange={(e) => setFormChallenges(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Solutions appliquées</label>
                  <textarea
                    rows={2}
                    placeholder="Mesures prises..."
                    value={formSolutions}
                    onChange={(e) => setFormSolutions(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Perspectives pour le mois suivant</label>
                  <input
                    type="text"
                    placeholder="Priorités du mois prochain..."
                    value={formNextPlan}
                    onChange={(e) => setFormNextPlan(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Estimation des besoins financiers (FCFA)</label>
                  <input
                    type="number"
                    value={formBudgetNeeded}
                    onChange={(e) => setFormBudgetNeeded(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewReportModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                >
                  Enregistrer &amp; Soumettre au CPI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Print Modal */}
      {showPrintModal && selectedReport && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                Format d'Édition Officiel du Rapport Mensuel
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 border border-slate-300 bg-white rounded-lg space-y-5 text-xs text-slate-800">
              <div className="text-center border-b pb-3 space-y-1">
                <div className="font-extrabold text-sm tracking-wide">{NGO_INFO.name}</div>
                <div className="text-[10px] text-slate-500">{NGO_INFO.postalAddress} — Tél : {NGO_INFO.phones[0]}</div>
                <div className="text-xs font-bold text-slate-900 underline mt-2">
                  RAPPORT D'ACTIVITÉ MENSUEL — MOIS DE {selectedReport.month.toUpperCase()} {selectedReport.year}
                </div>
                <div className="text-[11px] text-slate-600">
                  Réf : {selectedReport.reference} • Date de soumission : {selectedReport.dateSubmitted}
                </div>
              </div>

              <div>
                <strong>Auteur :</strong> {selectedReport.authorName} ({selectedReport.authorRole})
              </div>

              <div>
                <strong>1. Synthèse des activités :</strong>
                <p className="mt-1 leading-relaxed">{selectedReport.summary}</p>
              </div>

              <div>
                <strong>2. Détail des réalisations :</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {selectedReport.activitiesCompleted.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>3. Résultats et indicateurs :</strong>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {selectedReport.quantitativeResults.map((r, i) => (
                    <div key={i} className="p-2 border rounded bg-slate-50">
                      <div>{r.label}</div>
                      <div className="font-bold">{r.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex justify-between px-6 text-center">
                <div className="space-y-8">
                  <div>Visa du Chargé de Programmes (CPi)</div>
                  <div className="font-bold underline">Henri Doudédji FATCHINA</div>
                </div>
                <div className="space-y-8">
                  <div>Visa du Directeur Exécutif (DE)</div>
                  <div className="font-bold underline">SONON Tchéhouéa</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <div className="text-2xs text-slate-500">
                Format conforme République du Bénin • Norme Loi 2025-19 &amp; Convention Partenaires PTF
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-slate-700"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    downloadReportPrintableDocument(selectedReport);
                    if (onNotify) {
                      onNotify(
                        'Document PDF Généré',
                        `Le fichier officiel pour « ${selectedReport.reference} » a été téléchargé avec succès.`,
                        'success',
                        'rapport'
                      );
                    }
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger Fichier PDF</span>
                </button>
                <button
                  onClick={() => {
                    openReportPdfPrintWindow(selectedReport);
                    if (onNotify) {
                      onNotify(
                        'Impression A4 Lancée',
                        `La fenêtre d'impression A4 pour le rapport ${selectedReport.reference} est ouverte.`,
                        'info',
                        'rapport'
                      );
                    }
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Fenêtre Impression A4 (Ctrl+P)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
