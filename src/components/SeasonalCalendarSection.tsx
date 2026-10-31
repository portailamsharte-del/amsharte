import React, { useState } from 'react';
import { SeasonalCalendarItem } from '../types';
import { SEASONAL_CALENDAR_ITEMS } from '../data/initialData';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, Compass, Waves, Leaf, Fish, Shield } from 'lucide-react';

export const SeasonalCalendarSection: React.FC = () => {
  const [items] = useState<SeasonalCalendarItem[]>(SEASONAL_CALENDAR_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Toutes les Saisons' },
    { id: 'tortues', label: 'Pontes & Lâchers' },
    { id: 'mangroves', label: 'Mangroves' },
    { id: 'peche', label: 'Pêche & Repos' },
    { id: 'citoyennete', label: 'Ayi Dji Ni Min' }
  ];

  const filteredItems = items.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div id="seasonal-calendar-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Rythmes Biologiques &amp; Côtiers</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Calendrier Écologique Annuel du Littoral Béninois
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Suivi scientifique des cycles naturels : saison de ponte des tortues marines, lâchers d'écloserie à Togbin, reboisement des palétuviers et repos biologique de la pêche.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Timeline Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isOngoing = item.status === 'en_cours';
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-5 transition shadow-xs ${
                isOngoing
                  ? 'border-emerald-300 ring-1 ring-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded-lg">
                      {item.monthRange}
                    </span>

                    {isOngoing ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Saison en cours d'activité
                      </span>
                    ) : item.status === 'a_venir' ? (
                      <span className="bg-blue-50 text-blue-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-blue-200">
                        Prochaine saison
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                        Période achevée
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-800 mb-1.5">
                      Actions opérationnelles déployées :
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {item.fieldActions.map((action, i) => (
                        <div key={i} className="text-[11px] text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200/80 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:w-72 bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 shrink-0">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Consigne aux Acteurs</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    {item.stakeholderAlert}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
