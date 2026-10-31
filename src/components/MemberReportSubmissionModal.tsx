import React, { useState } from 'react';
import { 
  FileText, 
  X, 
  Send, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  Camera,
  Upload
} from 'lucide-react';
import { MonthlyReport, ProjectCategory } from '../types';
import { NGO_INFO } from '../data/initialData';

interface MemberReportSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: MonthlyReport) => void;
  onLogAudit?: (authorName: string, authorRole: string, details: string) => void;
}

export function MemberReportSubmissionModal({
  isOpen,
  onClose,
  onSubmitReport,
  onLogAudit
}: MemberReportSubmissionModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Éco-garde Patrouilleur');
  const [authorPhone, setAuthorPhone] = useState('');
  const [location, setLocation] = useState('Togbin Fandji Plage');
  const [projectCategory, setProjectCategory] = useState<ProjectCategory>('tortues');
  const [month, setMonth] = useState('Septembre');
  const [year] = useState(2026);
  const [summary, setSummary] = useState('');
  const [activities, setActivities] = useState('');
  const [turtleCount, setTurtleCount] = useState('1');
  const [eggsCount, setEggsCount] = useState('120');
  const [challenges, setChallenges] = useState('');
  const [solutions, setSolutions] = useState('');
  const [financialNeeds, setFinancialNeeds] = useState('35000');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !summary.trim()) return;

    const ref = `RAP-MEMBRE-${Date.now().toString().slice(-4)}`;
    setSubmittedRef(ref);

    const activitiesList = activities
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    if (activitiesList.length === 0) {
      activitiesList.push(summary);
    }

    const newReport: MonthlyReport = {
      id: `rep-member-${Date.now()}`,
      reference: ref,
      month,
      year,
      dateSubmitted: new Date().toISOString().split('T')[0],
      authorName: authorName.trim(),
      authorRole: `${authorRole.trim()} (${authorPhone.trim() || 'AMSHARTE'})`,
      projectCategory,
      status: 'soumis_cpi',
      summary: summary.trim(),
      activitiesCompleted: activitiesList,
      quantitativeResults: [
        { label: "Tortues / nids traités", value: turtleCount || "0" },
        { label: "Œufs placés en écloserie", value: eggsCount || "N/A" },
        { label: "Secteur d'intervention", value: location }
      ],
      challengesFaced: challenges.trim() || "Aucune contrainte majeure signalée.",
      solutionsApplied: solutions.trim() || "Vigilance et ronde continue avec les pêcheurs.",
      nextMonthPlanning: "Continuer les rondes d'écloserie et sensibiliser les équipages de pêche.",
      financialNeedsFCFA: parseInt(financialNeeds, 10) || 0,
      cpiReviewNotes: "Rapport de mission soumis via le guichet direct ouvert aux membres."
    };

    onSubmitReport(newReport);
    if (onLogAudit) {
      onLogAudit(
        authorName.trim(),
        authorRole.trim(),
        `Dépôt du rapport de mission ${ref} (${location}, secteur ${projectCategory})`
      );
    }

    setIsSuccess(true);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setAuthorName('');
    setSummary('');
    setActivities('');
    setChallenges('');
    setSolutions('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 sm:p-6 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 mb-0.5">
                <span>Dépôt Universel de Rapport • 33 Membres</span>
              </div>
              <h3 className="text-base sm:text-lg font-black">
                Verser un Rapport de Terrain à AMSHARTE
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Rapport Transmis avec Succès !</h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Votre rapport porte la référence officielle <strong className="text-emerald-700 font-mono">{submittedRef}</strong>. Il a été transmis au Chargé de Programmes (CPI) et au Directeur Exécutif pour consolidation.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left text-xs text-slate-600 space-y-1">
                <div><strong>Auteur :</strong> {authorName} ({authorRole})</div>
                <div><strong>Secteur :</strong> {location} • {month} {year}</div>
                <div><strong>Statut :</strong> En attente de validation CPI</div>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                Terminer &amp; Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950 text-xs leading-relaxed">
                <strong>Espace ouvert à tous :</strong> Que vous soyez éco-garde, pépiniériste, sentinelle ou point focal départemental, renseignez votre compte-rendu d'intervention pour que vos actions soient valorisées dans le rapport officiel d'AMSHARTE.
              </div>

              {/* Identity grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Votre Nom &amp; Prénom *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Paulin KPADONOU"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Votre Fonction / Rôle *</label>
                  <select
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Éco-garde Patrouilleur">Éco-garde Patrouilleur</option>
                    <option value="Sentinelle Pêcheur Artisan">Sentinelle Pêcheur Artisan</option>
                    <option value="Responsable Pépinière Mangrove">Responsable Pépinière Mangrove</option>
                    <option value="Point Focal Départemental">Point Focal Départemental</option>
                    <option value="Agent Salubrité & SST">Agent Salubrité &amp; SST</option>
                    <option value="Animateur Éco-citoyenneté">Animateur Éco-citoyenneté</option>
                    <option value="Membre Bénévole">Membre Bénévole</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Téléphone / WhatsApp</label>
                  <input
                    type="text"
                    value={authorPhone}
                    onChange={(e) => setAuthorPhone(e.target.value)}
                    placeholder="Ex: (+229) 97 00 00 00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Programme concerné</label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value as ProjectCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="tortues">Tortues Marines &amp; Écloserie</option>
                    <option value="mangroves">Mangroves &amp; Zones humides</option>
                    <option value="education">Salubrité &amp; Santé Sécurité SST</option>
                    <option value="ptf">Partenariats &amp; Communautés</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Lieu de l'activité</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Togbin Fandji, Plage Est"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Mois concerné</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs">Objet / Résumé succinct de la mission *</label>
                <input
                  type="text"
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Ex: Patrouille nocturne conjointe avec la Police BPLP et mise en écloserie d'une ponte"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Activities details */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs">Activités détaillées (une par ligne)</label>
                <textarea
                  rows={3}
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  placeholder="Ex :&#10;- Patrouille de 22h à 03h sur 4 km de plage&#10;- Sauvetage d'une tortue olivâtre piégée dans un filet dormant&#10;- Déplacement de 118 œufs vers l'écloserie sécurisée"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {/* Quantitative results */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-2xs">Nombre de tortues / nids</label>
                  <input
                    type="text"
                    value={turtleCount}
                    onChange={(e) => setTurtleCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-2xs">Œufs en écloserie</label>
                  <input
                    type="text"
                    value={eggsCount}
                    onChange={(e) => setEggsCount(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-2xs">Besoin d'appui financier (FCFA)</label>
                  <input
                    type="number"
                    value={financialNeeds}
                    onChange={(e) => setFinancialNeeds(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white"
                  />
                </div>
              </div>

              {/* Challenges & Solutions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Difficultés rencontrées</label>
                  <textarea
                    rows={2}
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Ex: Manque de torche frontale étanche, pluie battante..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Solutions apportées</label>
                  <textarea
                    rows={2}
                    value={solutions}
                    onChange={(e) => setSolutions(e.target.value)}
                    placeholder="Ex: Entraide avec l'équipe de relais et prêt de matériel du chef de village..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmettre le Rapport à la Coordination</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
