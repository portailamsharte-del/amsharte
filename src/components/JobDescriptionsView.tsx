import React, { useState } from 'react';
import { PostJobDescription } from '../types';
import { NGO_INFO } from '../data/initialData';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  Download, 
  User, 
  ShieldAlert, 
  Clock, 
  Building, 
  ChevronRight,
  ExternalLink,
  Award,
  Signature
} from 'lucide-react';
import { downloadFile } from '../utils/helpers';

interface JobDescriptionsViewProps {
  posts: PostJobDescription[];
}

export const JobDescriptionsView: React.FC<JobDescriptionsViewProps> = ({ posts }) => {
  const [selectedPostId, setSelectedPostId] = useState<string>('post-cpi');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const selectedPost = posts.find(p => p.id === selectedPostId) || posts[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const content = `===============================================================
ONG AMSHARTE — DIRECTION EXECUTIVE
${NGO_INFO.postalAddress} — Tél : ${NGO_INFO.phones.join(' / ')}
Email : ${NGO_INFO.email} — Site : ${NGO_INFO.officialWebsite}
Siège Opérationnel : ${NGO_INFO.headquarters}
===============================================================

${selectedPost.serviceNoteRef || 'NOTE DE SERVICE'}
OBJET : Cahier de charge officiel — ${selectedPost.title}
CONCERNE : ${selectedPost.incumbentName}
TITRE : ${selectedPost.title}
SUPERIEUR HIERARCHIQUE : ${selectedPost.reportsTo}
FONCTION : ${selectedPost.functionSummary}

ATTRIBUTIONS ET TACHES OFFICIELLES :
${selectedPost.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

STATUT ET INDEMNISATION :
${selectedPost.statusAndCompensation}

Prend effet à compter de la date de sa signature.
Ampliations : PCA, Dossier Personnel, Archives

Fait à Togbin Fandji, le ${selectedPost.signatureDate || '15 Janvier 2026'}

Signature de l'intéressé(e) :          Signature du Directeur Exécutif :
${selectedPost.incumbentName}               SONON Tchéhouéa
===============================================================`;

    downloadFile(content, `Cahier_de_Charge_${selectedPost.code}.txt`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Gouvernance &amp; Organisation
            </span>
            <span className="text-xs text-slate-500">• {posts.length} Postes Pourvus</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Cahiers de Charges &amp; Notes de Service Officielles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cadre de responsabilisation, délégations et fiches de poste de l'équipe de coordination de l'ONG AMSHARTE.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer Note de Service</span>
          </button>
          <button
            onClick={handleDownloadText}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter TXT</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Post Selector on Left, Detailed Official Service Note on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post list tabs */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Liste des Postes Pourvus
          </div>

          <div className="space-y-1.5">
            {posts.map((post) => {
              const isSelected = post.id === selectedPostId;
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {post.code}
                      </span>
                      {post.isInterim && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Intérim
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-bold leading-snug ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {post.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Titulaire : <span className="text-slate-800 font-semibold">{post.incumbentName}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-2 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>

          {/* Quick Info Box on Interim & Delegation */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2 mt-4">
            <strong className="block font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              Délégation &amp; Gestion Courante
            </strong>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              Conformément à la note de service du CPI Henri D. FATCHINA, les actes de gestion courante sont délégués en cas d'absence du DE. Les engagements financiers ou juridiques majeurs restent soumis au visa exprès du Directeur Exécutif.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Official Note de Service Display */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            {/* Official Letterhead Header */}
            <div className="p-6 bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600 pb-4 border-b border-slate-200/80">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm tracking-wide">
                    {NGO_INFO.name} — DIRECTION EXÉCUTIVE
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {NGO_INFO.postalAddress} — Tél : {NGO_INFO.phones[0]}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Email : {NGO_INFO.email}
                  </div>
                </div>

                <div className="text-left sm:text-right font-medium text-[11px]">
                  <div>Togbin Fandji, République du Bénin</div>
                  <div className="text-slate-500 font-mono mt-0.5">
                    {selectedPost.signatureDate || 'Togbin Fandji, le .....................'}
                  </div>
                </div>
              </div>

              {/* Note Reference & Subject */}
              <div className="pt-4 space-y-2">
                <div className="inline-block bg-slate-900 text-white font-mono text-xs px-2.5 py-1 rounded font-bold">
                  {selectedPost.serviceNoteRef || 'Note de service N° ......../......../AMSHARTE/DE'}
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Objet : Cahier de charge — Version révisée et recentrée
                </div>
              </div>
            </div>

            {/* Core Job Sheet Content */}
            <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
              {/* Metadata strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Titulaire Concerné :</span>
                  <strong className="text-slate-900 text-sm font-bold">{selectedPost.incumbentName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Titre du Poste :</span>
                  <strong className="text-blue-900 font-bold">{selectedPost.title}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Supérieur Hiérarchique :</span>
                  <strong className="text-slate-800 font-semibold">{selectedPost.reportsTo}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Département d'Affectation :</span>
                  <strong className="text-slate-800 font-semibold">{selectedPost.department}</strong>
                </div>
              </div>

              {/* Function Summary */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Fonction Principale
                </h4>
                <p className="text-slate-700 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100/80 leading-relaxed text-xs sm:text-sm">
                  {selectedPost.functionSummary}
                </p>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Attributions &amp; Tâches Assignées
                </h4>
                <div className="space-y-2">
                  {selectedPost.tasks.map((task, index) => (
                    <div 
                      key={index} 
                      className="p-3 bg-white hover:bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-3 transition"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                        {task}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status & Compensation */}
              <div className="space-y-1.5 bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-xs">
                <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                  Statut, Dispositions Financières &amp; Déplacements
                </h4>
                <p className="text-amber-900 leading-relaxed">
                  {selectedPost.statusAndCompensation}
                </p>
                <div className="text-[11px] text-amber-800 pt-1 font-medium italic">
                  « Prend effet à partir de la date de sa signature. »
                </div>
              </div>

              {/* Legal Signatures Section */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="text-[11px] text-slate-500 uppercase font-semibold">
                  Ampliations : PCA • Direction Exécutive • Archives
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Signature Titulaire */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-8 text-center">
                    <div className="text-xs font-bold text-slate-700">
                      Signature du {selectedPost.shortTitle}
                    </div>
                    <div className="font-serif italic text-sm text-blue-950 font-bold border-b border-slate-300 pb-1 max-w-[200px] mx-auto">
                      {selectedPost.incumbentName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Lu, approuvé et certifié conforme
                    </div>
                  </div>

                  {/* Signature DE or Sceau Assemblée Générale */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-8 text-center">
                    <div className="text-xs font-bold text-slate-700">
                      {selectedPost.id === 'post-pca' ? "Pour l'Assemblée Générale & Statuts" : "Signature du Directeur Exécutif (DE)"}
                    </div>
                    <div className="font-serif italic text-sm text-emerald-950 font-bold border-b border-slate-300 pb-1 max-w-[200px] mx-auto">
                      {selectedPost.id === 'post-pca' ? "AMSHARTE — Sceau Officiel" : "SONON Tchéhouéa"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {selectedPost.id === 'post-pca' ? "Conformité Loi N° 2025-19 (MISP)" : "Pour visa et ordonnancement légal"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-600" />
                Format d'Impression Officiel Note de Service
              </h3>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 border border-slate-300 bg-white rounded-lg space-y-6 text-xs text-slate-800 font-sans">
              <div className="text-center border-b pb-4 space-y-1">
                <div className="font-black text-sm tracking-wider">{NGO_INFO.name}</div>
                <div className="text-[10px] text-slate-600">{NGO_INFO.fullName}</div>
                <div className="text-[10px]">{NGO_INFO.postalAddress} – Tél : {NGO_INFO.phones.join(' / ')}</div>
                <div className="text-[10px]">E-mail : {NGO_INFO.email} — Site : {NGO_INFO.officialWebsite}</div>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold">{selectedPost.serviceNoteRef || 'Note de service N° ......../......../AMSHARTE/DE'}</span>
                <span>Togbin Fandji, le .............................</span>
              </div>

              <div className="text-center font-bold text-sm underline uppercase">
                Objet : Cahier de charge — Version révisée et recentrée
              </div>

              <div className="space-y-1 text-xs">
                <div><strong>Concerné :</strong> {selectedPost.incumbentName}</div>
                <div><strong>Titre :</strong> {selectedPost.title}</div>
                <div><strong>Supérieur hiérarchique :</strong> {selectedPost.reportsTo}</div>
                <div><strong>Fonction :</strong> {selectedPost.functionSummary}</div>
              </div>

              <div className="space-y-2 text-xs">
                <strong>Tâches :</strong>
                <p className="italic text-slate-600">
                  Sous la responsabilité du Directeur Exécutif (DE), le {selectedPost.title} :
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2">
                  {selectedPost.tasks.map((t, idx) => (
                    <li key={idx} className="leading-relaxed">{t}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border rounded text-xs space-y-1">
                <p>{selectedPost.statusAndCompensation}</p>
                <p className="font-semibold">Prend effet à partir de la date de sa signature.</p>
              </div>

              <div className="pt-8 flex justify-between px-6 text-center">
                <div className="space-y-10">
                  <div>Signature de l'intéressé(e) ({selectedPost.shortTitle})</div>
                  <div className="font-bold underline">{selectedPost.incumbentName}</div>
                </div>
                <div className="space-y-10">
                  <div>{selectedPost.id === 'post-pca' ? "Pour l'Assemblée Générale & Statuts" : "Signature du Directeur Exécutif"}</div>
                  <div className="font-bold underline">{selectedPost.id === 'post-pca' ? "AMSHARTE — Sceau Officiel" : "SONON Tchéhouéa"}</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-4 border-t">
                Ampliations : PCA • Direction Exécutive • Archives
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer vers PDF / Papier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
