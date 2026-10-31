import React from 'react';
import { 
  ProjectItem, 
  MonthlyReport, 
  TechnicalFinancialPartner, 
  PostJobDescription 
} from '../types';
import { 
  AlertCircle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  Users, 
  FolderTree, 
  ShieldCheck, 
  ArrowUpRight, 
  PlusCircle, 
  AlertTriangle,
  FileCheck2,
  Database,
  Landmark
} from 'lucide-react';
import { formatFCFA, getReportingDeadlinesInfo } from '../utils/helpers';
import { NGO_INFO } from '../data/initialData';
import { BoardOfDirectorsSection } from './BoardOfDirectorsSection';

interface IntranetDashboardProps {
  projects: ProjectItem[];
  reports: MonthlyReport[];
  partners: TechnicalFinancialPartner[];
  posts: PostJobDescription[];
  onNavigateTab: (tab: string) => void;
  onOpenNewReportModal: () => void;
}

export const IntranetDashboard: React.FC<IntranetDashboardProps> = ({
  projects,
  reports,
  partners,
  posts,
  onNavigateTab,
  onOpenNewReportModal
}) => {
  const deadlines = getReportingDeadlinesInfo();

  // KPIs
  const totalCommittedBudget = projects.reduce((sum, p) => sum + p.budgetTotalFCFA, 0);
  const totalSpentBudget = projects.reduce((sum, p) => sum + p.budgetDepenseFCFA, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'en_cours').length;
  const pendingReportsCount = reports.filter(r => r.status === 'soumis_cpi' || r.status === 'brouillon').length;
  const activePartnersCount = partners.filter(ptf => ptf.status === 'Partenaire Actif').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Alert on Reporting Deadlines (Cahier de Charge Rule) */}
      <div className="bg-gradient-to-r from-amber-50 via-amber-100/70 to-emerald-50 border border-amber-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Règle d'Or du Cahier de Charge (CPI Henri D. FATCHINA)
                </h3>
                <span className="bg-amber-500/20 text-amber-900 text-xs px-2 py-0.5 rounded font-semibold">
                  Contrôle &amp; Ponctualité
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1 max-w-2xl leading-relaxed">
                « Élabore les rapports d'activité mensuels <strong>au plus tard 10 jours après le mois échu (J+10)</strong>, et le rapport annuel <strong>au plus tard le 1er février</strong> de l'année nouvelle, en consolidant les contributions des chargés et des points focaux. »
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full md:w-auto">
            <div className="bg-white/90 px-3.5 py-2 rounded-xl border border-amber-300/80 text-center shadow-2xs">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Échéance Mensuelle J+10</div>
              <div className="text-xs font-bold text-slate-800">
                Mois échu : {deadlines.previousMonthName}
              </div>
              <div className={`text-[11px] font-bold ${deadlines.isMonthlyOverdue ? 'text-rose-600' : 'text-emerald-700'}`}>
                {deadlines.isMonthlyOverdue ? 'Échéance le 10 (Vérifier visa DE)' : `Reste ${deadlines.daysDiffMonthly} jours`}
              </div>
            </div>

            <div className="bg-white/90 px-3.5 py-2 rounded-xl border border-amber-300/80 text-center shadow-2xs">
              <div className="text-[10px] text-slate-500 font-medium uppercase">Rapport Annuel {deadlines.annualYearTarget - 1}</div>
              <div className="text-xs font-bold text-slate-800">1er Février {deadlines.annualYearTarget}</div>
              <div className="text-[11px] font-bold text-emerald-700">Dans {deadlines.daysDiffAnnual} jours</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Projects */}
        <div 
          onClick={() => onNavigateTab('projets')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Programmes de Terrain</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              🌱
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">{activeProjectsCount} Actifs</div>
            <div className="text-xs text-slate-500">Tortues marines &amp; Mangroves</div>
          </div>
          <div className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
            <span>Voir l'avancement détaillé</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Monthly Reports Status */}
        <div 
          onClick={() => onNavigateTab('rapports-mensuels')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rapports &amp; Suivi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">{reports.length} Enregistrés</div>
            <div className="text-xs text-emerald-600 font-medium">100% Soumis dans les délais J+10</div>
          </div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <span>Consulter les synthèses et visas DE</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Budget Executed / Dolibarr */}
        <div 
          onClick={() => onNavigateTab('passerelle')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Global Projets</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-xl font-black text-slate-900 truncate">{formatFCFA(totalCommittedBudget)}</div>
            <div className="text-xs text-slate-500">
              Engagé : {formatFCFA(totalSpentBudget)} ({Math.round((totalSpentBudget / totalCommittedBudget) * 100)}%)
            </div>
          </div>
          <div className="text-[11px] font-medium text-purple-600 flex items-center gap-1">
            <span>Synchronisé avec Dolibarr ERP</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Filled Posts & Governance */}
        <div 
          onClick={() => onNavigateTab('cahiers-charges')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Équipe &amp; Postes</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-2xl font-black text-slate-900">{posts.length} Postes Clés</div>
            <div className="text-xs text-slate-500">CPI, DE, Chargés &amp; Points Focaux</div>
          </div>
          <div className="text-[11px] font-medium text-teal-600 flex items-center gap-1">
            <span>Cahiers de charge &amp; Notes de service</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview & Key Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Operational Projects Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Avancement des Programmes Opérationnels
                </h3>
                <p className="text-xs text-slate-500">
                  Supervision directe du CPI Henri Doudédji FATCHINA &amp; validation DE
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('projets')}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Gérer tous les jalons</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          {proj.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Responsable : <span className="font-medium text-slate-700">{proj.leader}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded self-start sm:self-auto">
                      {proj.progressPercentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${proj.progressPercentage}%` }}
                    ></div>
                  </div>

                  {/* Indicators strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {proj.keyIndicators.slice(0, 3).map((ind, i) => (
                      <div key={i} className="bg-white px-2.5 py-1.5 rounded-md border border-slate-200 text-[11px]">
                        <span className="text-slate-500 truncate block">{ind.label}</span>
                        <strong className="text-slate-800 font-bold">{ind.current}</strong>
                        <span className="text-slate-400"> / {ind.target} {ind.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={onOpenNewReportModal}
              className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Saisir un Rapport</span>
            </button>

            <button
              onClick={() => onNavigateTab('cahiers-charges')}
              className="p-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Fiche CPI</span>
            </button>

            <button
              onClick={() => onNavigateTab('passerelle')}
              className="p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <FolderTree className="w-4 h-4" />
              <span>Google Drive</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('section-conseil-administration');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Landmark className="w-4 h-4" />
              <span>Conseil d'Administration</span>
            </button>
          </div>
        </div>

        {/* Col 3: Key Roles & Signatures Status */}
        <div className="space-y-4">
          {/* CPI Specific Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-2 py-0.5 rounded">
                Poste Clé en Exercice
              </span>
              <span className="text-xs text-emerald-200">Bénévole avec forfait</span>
            </div>

            <div>
              <div className="text-xs text-emerald-300">Chargé de Programmes par Intérim (CPi)</div>
              <h4 className="text-lg font-bold text-white mt-0.5">Henri Doudédji FATCHINA</h4>
              <div className="text-xs text-emerald-200/80 mt-1">
                Supérieur hiérarchique : <strong>SONON Tchéhouéa (DE)</strong>
              </div>
            </div>

            <div className="space-y-2 text-xs text-emerald-100/90 border-t border-emerald-800/80 pt-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supervision opérationnelle des projets</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rapports mensuels (J+10) &amp; Annuel (1er Fév)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Contenu technique des dossiers PTF</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Intérim du DE pour actes courants</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('cahiers-charges')}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition cursor-pointer"
            >
              Afficher le Cahier de Charge Complet
            </button>
          </div>

          {/* PTF Deadlines Snapshot */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Prochaines Échéances PTF / Bailleurs
              </h4>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                {partners.length} Dossiers
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {partners.slice(0, 3).map((ptf) => (
                <div key={ptf.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-800 truncate font-semibold">{ptf.name}</strong>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 rounded">
                      {ptf.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Livrable : {ptf.nextDeliverableTitle}
                  </div>
                  <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>À remettre le : {ptf.nextDeliverableDate}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('ptf')}
              className="w-full text-center text-xs text-blue-600 font-semibold hover:underline pt-1 block cursor-pointer"
            >
              Gérer toutes les conventions PTF &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Official Section: Conseil d'Administration présidé par Philomène AKPODJI */}
      <div id="section-conseil-administration" className="pt-6 border-t border-slate-200">
        <BoardOfDirectorsSection onNavigateTab={onNavigateTab} />
      </div>
    </div>
  );
};
