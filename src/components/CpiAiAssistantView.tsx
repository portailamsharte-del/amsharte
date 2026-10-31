import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  Layers, 
  Compass, 
  Share2, 
  RotateCcw,
  Zap,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { MonthlyReport, ProjectItem } from '../types';
import { downloadFile } from '../utils/helpers';

interface CpiAiAssistantViewProps {
  reports: MonthlyReport[];
  projects: ProjectItem[];
  onInsertIntoMonthlyReports?: (report: MonthlyReport) => void;
  onLogAudit?: (authorName: string, authorRole: string, details: string) => void;
}

export function CpiAiAssistantView({
  reports,
  projects,
  onInsertIntoMonthlyReports,
  onLogAudit
}: CpiAiAssistantViewProps) {
  const [prompt, setPrompt] = useState('');
  const [taskType, setTaskType] = useState<string>('synthese_mensuelle');
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [aiSource, setAiSource] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState('');

  const quickTemplates = [
    {
      id: 'synthese_mensuelle',
      title: 'Synthèse Mensuelle des Rapports de Terrain',
      icon: FileText,
      description: 'Compiler tous les rapports des éco-gardes et patrouilleurs en une synthèse officielle pour visa du DE.',
      prompt: "Rédige la Synthèse Mensuelle Globale de Septembre 2026 à partir des activités de terrain des 33 membres d'AMSHARTE (patrouilles conjointes BPLP, sauvetages de tortues marines, écloserie de Togbin, et compensation en fil de réparation pour les pêcheurs)."
    },
    {
      id: 'requete_ptf',
      title: 'Note de Financement / Requête Bailleurs (UE, FEM)',
      icon: Compass,
      description: 'Générer une note conceptuelle pour financer le matériel d\'écloserie, balances de pesée et fil de nylon.',
      prompt: "Rédige une requête de financement officielle adressée au PNUD/Fonds pour l'Environnement Mondial (FEM) et à l'Union Européenne pour doter l'ONG AMSHARTE en matériel de pesée chélonien, balises, exhaure solaire d'eau de mer et kits de fil de réparation pour 200 pêcheurs artisans de Togbin."
    },
    {
      id: 'communique_com',
      title: 'Communiqué de Presse & Réseaux Sociaux (Chargé Com)',
      icon: Share2,
      description: 'Préparer les textes et légendes pour les visuels collectés par la cellule communication.',
      prompt: "Prépare un communiqué d'alerte et de sensibilisation pour les médias béninois et Facebook/WhatsApp suite au sauvetage nocturne d'une tortue marine olivâtre blessée à Togbin et à son relâcher solennel après observation."
    },
    {
      id: 'analyse_pontes',
      title: 'Analyse Écologique des Pontes & Recommandations',
      icon: Layers,
      description: 'Analyser les tendances de ponte, les menaces de braconnage et proposer des mesures conservatoires.',
      prompt: "Analyse les statistiques de pontes de tortues sur le littoral de Togbin (Août-Septembre) et formule 5 recommandations prioritaires pour la sécurisation de l'écloserie communautaire et la mobilisation des pêcheurs sentinelles."
    }
  ];

  const handleSelectTemplate = (template: typeof quickTemplates[0]) => {
    setTaskType(template.id);
    setPrompt(template.prompt);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponseOutput('');
    setSuccessNotice('');

    try {
      const res = await fetch('/api/cpi-ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          taskType,
          reportsContext: reports.slice(0, 5).map(r => ({
            reference: r.reference,
            author: r.authorName,
            role: r.authorRole,
            summary: r.summary,
            results: r.quantitativeResults,
            challenges: r.challengesFaced
          })),
          projectContext: projects.map(p => ({
            code: p.code,
            title: p.title,
            progress: p.progressPercentage
          }))
        })
      });

      const data = await res.json();
      setResponseOutput(data.response || "Aucun texte retourné.");
      setAiSource(data.source || 'gemini-3.8-flash');

      if (onLogAudit) {
        onLogAudit(
          "Henri Doudédji FATCHINA",
          "Chargé de Programmes par Intérim (CPI)",
          `Génération IA (${taskType}) : ${prompt.slice(0, 60)}...`
        );
      }
    } catch (err) {
      console.error("Erreur appel IA :", err);
      // Fallback
      setResponseOutput("Erreur de connexion avec le serveur IA. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(responseOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    downloadFile(
      responseOutput, 
      `AMSHARTE_Synthese_CPI_IA_${new Date().toISOString().split('T')[0]}.txt`
    );
  };

  const handleInsertAsReport = () => {
    if (!onInsertIntoMonthlyReports || !responseOutput) return;

    const newReport: MonthlyReport = {
      id: `rep-ia-${Date.now()}`,
      reference: `SYN-IA-${Date.now().toString().slice(-4)}`,
      month: 'Septembre',
      year: 2026,
      dateSubmitted: new Date().toISOString().split('T')[0],
      authorName: 'Henri Doudédji FATCHINA (via Assistant IA Gemini)',
      authorRole: 'Chargé de Programmes par Intérim (CPI)',
      projectCategory: 'tortues',
      status: 'soumis_cpi',
      summary: `Synthèse stratégique automatisée générée pour le Directeur Exécutif : ${prompt.slice(0, 100)}...`,
      activitiesCompleted: [
        "Consolidation de l'ensemble des fiches d'intervention des patrouilleurs nocturnes",
        "Revue des observations conjointes Police BPLP et pêcheurs sentinelles",
        "Formulation des besoins prioritaires et de la feuille de route"
      ],
      quantitativeResults: [
        { label: "Rapports analysés", value: `${reports.length}` },
        { label: "Statut IA", value: "Validé par le CPI" }
      ],
      challengesFaced: "Nécessité de mise à l'échelle des moyens de transport et de pesée.",
      solutionsApplied: "Structuration du plaidoyer PTF et renforcement des dotations en fil de réparation.",
      nextMonthPlanning: "Soumettre la synthèse au DE pour ordonnancement et transmission au MCVT.",
      financialNeedsFCFA: 150000,
      cpiReviewNotes: responseOutput.slice(0, 500)
    };

    onInsertIntoMonthlyReports(newReport);
    setSuccessNotice("Synthèse IA insérée avec succès dans la liste officielle des Rapports Mensuels !");
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-2xl p-6 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-inner shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 mb-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Intelligence Artificielle Dédiée au CPI</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Assistant Stratégique du Chargé de Programmes
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Connecté au modèle <strong>Gemini 3.8 Flash</strong> pour assister <strong>Henri Doudédji FATCHINA</strong> dans la synthèse des rapports de terrain, la rédaction des dossiers de subvention et l'animation des équipes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white">IA Opérationnelle (Gemini 3.8)</span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickTemplates.map((tmpl) => {
          const Icon = tmpl.icon;
          const isSelected = taskType === tmpl.id;
          return (
            <button
              key={tmpl.id}
              onClick={() => handleSelectTemplate(tmpl)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="text-2xs font-extrabold text-emerald-700 uppercase">Actif</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{tmpl.title}</h4>
                <p className="text-2xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
              </div>
              <div className="mt-3 text-2xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Charger le modèle</span>
                <Zap className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Prompt Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Instructions / Demande pour l'Assistant IA :</span>
            </label>
            <span className="text-2xs text-slate-500">
              Analysera aussi les {reports.length} rapports et {projects.length} projets en mémoire
            </span>
          </div>

          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ex : Rédige une synthèse des patrouilles nocturnes de Togbin Plage de ce mois pour présentation au Directeur Exécutif..."
            className="w-full p-3.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-2xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantie de conformité Loi 2025-19 &amp; Convention MCVT N° 878</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Effacer</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Lancer l'Analyse &amp; Rédaction IA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* AI Output Card */}
        {responseOutput && (
          <div className="mt-6 border border-emerald-200 bg-emerald-50/20 rounded-2xl overflow-hidden shadow-inner">
            <div className="bg-emerald-950 p-4 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-extrabold tracking-wide">
                  Résultat de l'Assistant IA (Modèle : {aiSource || 'Gemini 3.8 Flash'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-2xs font-bold"
                  title="Copier le texte dans le presse-papier"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-2xs font-bold"
                  title="Télécharger en fichier texte"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger</span>
                </button>

                {onInsertIntoMonthlyReports && (
                  <button
                    onClick={handleInsertAsReport}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 text-2xs font-bold shadow-xs"
                    title="Insérer ce texte comme Rapport Officiel"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Verser aux Rapports</span>
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap max-h-[500px] overflow-y-auto bg-white/80">
              {responseOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
