import React, { useState } from 'react';
import { ProjectItem, ProjectCategory } from '../types';
import { 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Target, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Layers, 
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';
import { formatFCFA } from '../utils/helpers';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onToggleMilestone
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');

  const filteredProjects = projects.filter(p => 
    selectedCategory === 'all' || p.category === selectedCategory
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Opérations de Terrain
            </span>
            <span className="text-xs text-slate-500">• {projects.length} Programmes Actifs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Programmes Opérationnels : Tortues Marines, Mangroves &amp; Éducation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Suivi des objectifs, des jalons critiques, du budget consommé et des indicateurs d'impact écologique.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'Tous les projets' },
            { id: 'tortues', label: '🐢 Tortues' },
            { id: 'mangroves', label: '🌿 Mangroves' },
            { id: 'education', label: '🎓 Formation' },
            { id: 'ptf', label: '🤝 PTF' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Selector List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredProjects.map((project) => {
            const isSelected = project.id === selectedProjectId;
            const budgetRatio = Math.round((project.budgetDepenseFCFA / project.budgetTotalFCFA) * 100);

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-300 shadow-xs ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                        {project.code}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                        {project.category === 'tortues' ? 'Tortues' : project.category === 'mangroves' ? 'Mangroves' : 'Institutionnel'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">
                      {project.title}
                    </h3>
                  </div>

                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                    {project.progressPercentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {project.location}
                  </span>
                  <span className="font-medium text-slate-700">
                    Budget : {formatFCFA(project.budgetTotalFCFA)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Project Detailed View */}
        <div className="lg:col-span-7">
          {selectedProject ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="space-y-2 pb-5 border-b border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    {selectedProject.code}
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Période : {selectedProject.startDate} au {selectedProject.endDate}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedProject.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedProject.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span>Responsable Opérationnel : <strong>{selectedProject.leader}</strong></span>
                  <span>•</span>
                  <span>Localisation : <strong>{selectedProject.location}</strong></span>
                </div>
              </div>

              {/* Financial Dashboard Component (Dolibarr Integration) */}
              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-purple-950 uppercase tracking-wider font-bold">
                    Suivi Financier &amp; Consommation Budgétaire (Dolibarr ERP)
                  </strong>
                  <span className="text-purple-800 font-semibold text-[11px]">
                    Taux d'engagement : {Math.round((selectedProject.budgetDepenseFCFA / selectedProject.budgetTotalFCFA) * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-purple-200/80">
                    <span className="text-slate-500 block text-[11px]">Budget Total Alloué :</span>
                    <strong className="text-slate-900 text-sm font-bold">{formatFCFA(selectedProject.budgetTotalFCFA)}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-purple-200/80">
                    <span className="text-slate-500 block text-[11px]">Dépenses Réalisées / Justifiées :</span>
                    <strong className="text-purple-900 text-sm font-bold">{formatFCFA(selectedProject.budgetDepenseFCFA)}</strong>
                  </div>
                </div>
              </div>

              {/* Key Quantitative Indicators */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Indicateurs Clés de Rendement Écologique
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.keyIndicators.map((ind, i) => {
                    const pct = Math.min(100, Math.round((ind.current / ind.target) * 100));
                    return (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 font-medium truncate">{ind.label}</span>
                          <span className="font-bold text-slate-900">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                        <div className="text-[11px] text-slate-500 flex justify-between">
                          <span>Réalisé : <strong>{ind.current} {ind.unit}</strong></span>
                          <span>Cible : {ind.target} {ind.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Jalons Opérationnels &amp; Chronogramme
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Cliquez sur une case pour cocher un jalon terminé
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedProject.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      onClick={() => onToggleMilestone(selectedProject.id, milestone.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition cursor-pointer ${
                        milestone.done 
                          ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          milestone.done 
                            ? 'bg-emerald-600 border-emerald-600 text-white' 
                            : 'border-slate-300 bg-white'
                        }`}>
                          {milestone.done && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${milestone.done ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {milestone.title}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Responsable : {milestone.responsible}
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0 font-medium">
                        <Calendar className="w-3 h-3" />
                        <span>{milestone.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              Sélectionnez un projet pour afficher sa fiche complète.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
