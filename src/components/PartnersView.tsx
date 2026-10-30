import React, { useState } from 'react';
import { TechnicalFinancialPartner } from '../types';
import { 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Download, 
  PlusCircle, 
  Clock, 
  DollarSign, 
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Handshake
} from 'lucide-react';
import { formatFCFA, downloadFile, generateDolibarrPartnersCSV } from '../utils/helpers';

interface PartnersViewProps {
  partners: TechnicalFinancialPartner[];
}

export const PartnersView: React.FC<PartnersViewProps> = ({ partners }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || '');

  const filteredPartners = partners.filter(p => 
    filterType === 'all' || p.status === filterType
  );

  const selectedPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const handleExportDolibarr = () => {
    const csvContent = generateDolibarrPartnersCSV(partners);
    downloadFile(csvContent, `Dolibarr_PTF_Partenaires_Export.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Mobilisation Financière &amp; Bailleurs
            </span>
            <span className="text-xs text-slate-500">• {partners.length} Partenaires Enregistrés</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Partenaires Techniques et Financiers (PTF) &amp; Bailleurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Dossiers techniques (élaborés par le CPI Henri D. FATCHINA), négociation financière (Chargé PTF Sylvain AKPO) et conventions signées (DE SONON Tchéhouéa).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDolibarr}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dolibarr CRM</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'all', label: 'Tous les Partenaires' },
          { id: 'Partenaire Actif', label: '✅ Conventions Actives' },
          { id: 'Convention en négociation', label: '⏳ En Négociation' },
          { id: 'En prospection', label: '🔍 En Prospection' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setFilterType(filter.id)}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer whitespace-nowrap ${
              filterType === filter.id
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Partner list on Left */}
        <div className="lg:col-span-5 space-y-3">
          {filteredPartners.map((ptf) => {
            const isSelected = ptf.id === selectedPartnerId;
            const rate = ptf.conventionBudgetFCFA > 0 
              ? Math.round((ptf.disbursedBudgetFCFA / ptf.conventionBudgetFCFA) * 100) 
              : 0;

            return (
              <div
                key={ptf.id}
                onClick={() => setSelectedPartnerId(ptf.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-300'
                    : 'bg-white border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{ptf.type}</span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{ptf.name}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    ptf.status === 'Partenaire Actif'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ptf.status === 'Convention en négociation'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ptf.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 line-clamp-2">
                  {ptf.conventionTitle}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <span>Convention : <strong>{formatFCFA(ptf.conventionBudgetFCFA)}</strong></span>
                  <span className="font-semibold text-emerald-700">Décaissement : {rate}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Partner Card on Right */}
        <div className="lg:col-span-7">
          {selectedPartner ? (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="space-y-2 pb-5 border-b border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {selectedPartner.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Statut : <strong className="text-slate-900">{selectedPartner.status}</strong>
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {selectedPartner.name}
                </h3>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <strong>Intitulé de la Convention / Requête :</strong>
                  <p className="font-medium text-slate-900">{selectedPartner.conventionTitle}</p>
                  <p className="text-[11px] text-slate-500">Domaine : {selectedPartner.focusArea}</p>
                </div>
              </div>

              {/* Financial Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-slate-500 text-[11px] uppercase tracking-wider">Montant Total de la Convention</span>
                  <div className="text-lg font-black text-emerald-950">
                    {formatFCFA(selectedPartner.conventionBudgetFCFA)}
                  </div>
                  <span className="text-[11px] text-emerald-800">Ordonnancement validé DE</span>
                </div>

                <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-1">
                  <span className="text-slate-500 text-[11px] uppercase tracking-wider">Montant Décaissé &amp; Justifié</span>
                  <div className="text-lg font-black text-purple-950">
                    {formatFCFA(selectedPartner.disbursedBudgetFCFA)}
                  </div>
                  <span className="text-[11px] text-purple-800">Pièces comptables dans Dolibarr</span>
                </div>
              </div>

              {/* Next Deliverable Alert */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Prochaine Échéance Bailleurs &amp; Livrable Technique</span>
                </div>
                <div className="text-slate-800 font-semibold text-sm">
                  {selectedPartner.nextDeliverableTitle}
                </div>
                <div className="text-amber-800 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Date limite impérative : {selectedPartner.nextDeliverableDate}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Rappel : Le contenu technique est rédigé par le CPI (Henri D. FATCHINA) et l'état financier est préparé par la Chargée des Affaires Financières (Daria SONON).
                </p>
              </div>

              {/* Contact & Protocol Info */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Point Focal Institutionnel du Bailleur
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">{selectedPartner.contactPerson}</div>
                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{selectedPartner.contactEmail}</span>
                    </div>
                  </div>

                  <a 
                    href={`mailto:${selectedPartner.contactEmail}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition"
                  >
                    Envoyer un courriel
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
              Sélectionnez un bailleur pour voir les détails de la convention.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
