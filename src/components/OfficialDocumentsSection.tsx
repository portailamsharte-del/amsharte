import React, { useState } from 'react';
import { OfficialDocument } from '../types';
import { INITIAL_OFFICIAL_DOCUMENTS, NGO_INFO } from '../data/initialData';
import { FileText, Download, CheckCircle2, Shield, Search, ExternalLink, Calendar, Building, Sparkles } from 'lucide-react';

interface OfficialDocumentsSectionProps {
  documents?: OfficialDocument[];
  onGoToWebmastering?: () => void;
}

export const OfficialDocumentsSection: React.FC<OfficialDocumentsSectionProps> = ({
  documents: propsDocuments,
  onGoToWebmastering
}) => {
  const documents = propsDocuments || INITIAL_OFFICIAL_DOCUMENTS;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<OfficialDocument | null>(null);

  const categories = [
    { id: 'all', label: 'Tous les Documents' },
    { id: 'reconnaissance_etat', label: 'Reconnaissance MCVT' },
    { id: 'juridique', label: 'Juridique & Loi 2025-19' },
    { id: 'protocole_scientifique', label: 'Protocoles Scientifiques' },
    { id: 'guide_terrain', label: 'Guides & Police BPLP' },
    { id: 'partenariat', label: 'Conventions & Pêcheurs' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.keyTerms.some(term => term.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: OfficialDocument) => {
    const content = `================================================================================
RÉPUBLIQUE DU BÉNIN — ${NGO_INFO.name.toUpperCase()} (TOGBIN PLAGE)
${doc.title.toUpperCase()}
Référence : ${doc.referenceNumber}
Date d'émission : ${doc.issueDate}
Émetteur : ${doc.issuedBy}
================================================================================

DÉNOMINATION DE L'ORGANISATION :
Nom officiel : ${NGO_INFO.name}
Origine : AMSHART (Fondée en 2004 avec 9 pionniers suite aux 1ères journées SST CCIB 2003)
Siège : ${NGO_INFO.headquarters}
Téléphones d'urgence : ${NGO_INFO.phones.join(' / ')}
Email officiel : ${NGO_INFO.email}
Site web : ${NGO_INFO.officialWebsite}

--------------------------------------------------------------------------------
OBJET DU DOCUMENT :
--------------------------------------------------------------------------------
${doc.description}

POINTS CLÉS & CONTENU OFFICIEL :
${doc.contentSummary.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

TERMES & RÉFÉRENCES LIÉES :
${doc.keyTerms.join(' | ')}

CADRE LÉGAL & CONFORMITÉ :
- Loi 2025-19 relative aux ONG, Associations et Fondations en République du Bénin
- Attestation d'enregistrement : ${NGO_INFO.legalCompliance.certificateNo}
- Partenariat Étatique : ${NGO_INFO.legalCompliance.mcvtPartnershipLetter}

--------------------------------------------------------------------------------
Document certifié conforme par la Direction Exécutive de l'ONG AMSHARTE
Directeur Exécutif : ${NGO_INFO.executiveDirector}
Présidente du CA : ${NGO_INFO.boardPresident}
Chargé de Programmes par Intérim : ${NGO_INFO.interimProgramManager}
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.downloadFileName.replace('.pdf', '.txt')}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="official-documents-section" className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Médiathèque Institutionnelle &amp; Cadre Légal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Documents Officiels, Agréments &amp; Protocoles d'AMSHARTE
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Consultez et téléchargez les actes d'autorisation, lettres ministérielles de reconnaissance (MCVT), certificats de conformité Loi 2025-19, et protocoles scientifiques de baguage biométrique des tortues de Togbin.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onGoToWebmastering && (
              <button
                onClick={onGoToWebmastering}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700 shadow-xs"
              >
                <span>🛠️ Accéder au Webmastering</span>
              </button>
            )}
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{documents.length} Actes Répertoriés</span>
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher référence, loi, bague..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className={`bg-white rounded-xl border p-4.5 transition shadow-xs flex flex-col justify-between ${
              doc.isFeatured ? 'border-teal-300 ring-1 ring-teal-200/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {doc.referenceNumber}
                </span>
                {doc.isFeatured && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Majeur
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-teal-700 cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}>
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{doc.issuedBy}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Émis le {new Date(doc.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {doc.keyTerms.map((term, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedDoc(doc)}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
              >
                Aperçu
              </button>

              <button
                onClick={() => handleDownload(doc)}
                className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  {selectedDoc.referenceNumber}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedDoc.issuedBy}</p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-800 mb-1">Résumé officiel :</div>
                <p className="leading-relaxed">{selectedDoc.description}</p>
              </div>

              <div>
                <div className="font-bold text-slate-800 mb-1.5">Points de conformité et dispositions :</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  {selectedDoc.contentSummary.map((item, idx) => (
                    <li key={idx} className="leading-relaxed text-slate-600">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <div className="font-bold text-emerald-900 mb-0.5">Authentification Juridique :</div>
                <p className="text-emerald-800 text-[11px]">
                  Document rattaché au dossier officiel de l'ONG AMSHARTE (Loi 2025-19, Attestation N° {NGO_INFO.legalCompliance.certificateNo}).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => handleDownload(selectedDoc)}
                className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger la copie officielle (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
