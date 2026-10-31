import React, { useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  Phone, 
  Share2, 
  UserCheck, 
  Save, 
  CheckCircle2, 
  Download, 
  Search, 
  Lock, 
  Eye, 
  Smartphone, 
  Video, 
  AlertTriangle,
  FolderOpen,
  Landmark
} from 'lucide-react';
import { AuditLogEntry, ExecutiveMember, SiteContactSettings, SiteMaintenanceDelegation } from '../types';
import { downloadFile } from '../utils/helpers';
import { BoardOfDirectorsSection } from './BoardOfDirectorsSection';

interface SiteSettingsAndAuditViewProps {
  currentMember: ExecutiveMember;
  contactSettings: SiteContactSettings;
  onUpdateContactSettings: (newSettings: SiteContactSettings) => void;
  auditLogs: AuditLogEntry[];
  delegation: SiteMaintenanceDelegation;
  onUpdateDelegation: (newDelegation: SiteMaintenanceDelegation) => void;
  onAddAuditLog: (authorName: string, authorRole: string, actionType: AuditLogEntry['actionType'], details: string) => void;
}

export function SiteSettingsAndAuditView({
  currentMember,
  contactSettings,
  onUpdateContactSettings,
  auditLogs,
  delegation,
  onUpdateDelegation,
  onAddAuditLog
}: SiteSettingsAndAuditViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'contacts' | 'delegation' | 'conseil_administration'>('audit');
  const [searchAudit, setSearchAudit] = useState('');

  // Contacts Form State
  const [formPhones, setFormPhones] = useState(contactSettings);
  const [saveNotice, setSaveNotice] = useState('');

  // Delegation Form State
  const [delegationState, setDelegationState] = useState(delegation);

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContactSettings(formPhones);
    onAddAuditLog(
      currentMember.name,
      currentMember.role,
      'contact_maj',
      `Mise à jour des numéros d'urgence et coordonnées du site (Permanence: ${formPhones.emergencyPhone1}, DE: ${formPhones.emergencyPhone2})`
    );
    setSaveNotice("Numéros d'urgence et coordonnées du site mis à jour avec succès !");
    setTimeout(() => setSaveNotice(''), 4000);
  };

  const handleToggleDelegation = (key: keyof SiteMaintenanceDelegation['permissions']) => {
    const updated = {
      ...delegationState,
      permissions: {
        ...delegationState.permissions,
        [key]: !delegationState.permissions[key]
      }
    };
    setDelegationState(updated);
    onUpdateDelegation(updated);
    onAddAuditLog(
      currentMember.name,
      currentMember.role,
      'delegation_com',
      `Modification des droits délégués au Chargé de Communication (${key}: ${!delegationState.permissions[key]})`
    );
  };

  const handleToggleFullDelegation = () => {
    const newStatus = !delegationState.delegatedToCom;
    const updated: SiteMaintenanceDelegation = {
      ...delegationState,
      delegatedToCom: newStatus,
      delegatedDate: new Date().toISOString().split('T')[0],
      delegatedBy: `${currentMember.name} (${currentMember.role})`
    };
    setDelegationState(updated);
    onUpdateDelegation(updated);
    onAddAuditLog(
      currentMember.name,
      currentMember.role,
      'delegation_com',
      newStatus
        ? "Activation de la délégation de maintenance du site au Chargé de Communication & Médias"
        : "Suspension de la délégation de maintenance du site au Chargé de Communication & Médias"
    );
  };

  const handleExportAuditLogs = () => {
    const lines = [
      "========================================================================================",
      "REGISTRE CHRONOLOGIQUE D'AUDIT & TRAÇABILITÉ DES ACTIONS — ONG AMSHARTE",
      `Généré le : ${new Date().toLocaleString('fr-FR')}`,
      `Exporté par : ${currentMember.name} (${currentMember.role})`,
      "========================================================================================\n",
      ...auditLogs.map((log, index) => 
        `[#${index + 1}] DATE : ${log.timestamp} | ACTEUR : ${log.authorName} (${log.authorRole})\n` +
        `     TYPE : ${log.actionType.toUpperCase()}\n` +
        `     DÉTAIL : ${log.details}\n` +
        `----------------------------------------------------------------------------------------`
      )
    ];
    downloadFile(lines.join('\n'), `AMSHARTE_Journal_Audit_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const filteredLogs = auditLogs.filter(log => 
    log.authorName.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.authorRole.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.details.toLowerCase().includes(searchAudit.toLowerCase()) ||
    log.actionType.toLowerCase().includes(searchAudit.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-2xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30 mb-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Gouvernance &amp; Sécurité Opérationnelle</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Traçabilité, Paramètres du Site &amp; Délégation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Connecté en tant que <strong className="text-emerald-300">{currentMember.name}</strong> ({currentMember.role})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'audit' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Journal d'Audit ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'contacts' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Numéros d'Urgence</span>
          </button>

          <button
            onClick={() => setActiveSubTab('delegation')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'delegation' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Délégation Communication</span>
          </button>

          <button
            onClick={() => setActiveSubTab('conseil_administration')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'conseil_administration' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Conseil d'Administration</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <span>Registre Inaltérable des Actions (« Qui a écrit quoi et quand ? »)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chaque intervention dans l'espace de travail est consignée pour garantir la transparence totale.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchAudit}
                  onChange={(e) => setSearchAudit(e.target.value)}
                  placeholder="Filtrer par auteur, rôle ou action..."
                  className="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-48 sm:w-64 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={handleExportAuditLogs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter le Registre</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-2.5 px-3 font-bold">Horodatage</th>
                  <th className="py-2.5 px-3 font-bold">Auteur &amp; Rôle</th>
                  <th className="py-2.5 px-3 font-bold">Type d'Action</th>
                  <th className="py-2.5 px-3 font-bold">Détails &amp; Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredLogs.map((log) => {
                  const typeColors: Record<string, string> = {
                    connexion: 'bg-slate-100 text-slate-800',
                    inscription: 'bg-purple-100 text-purple-800',
                    validation_rapport: 'bg-emerald-100 text-emerald-800',
                    maj_projet: 'bg-blue-100 text-blue-800',
                    contact_maj: 'bg-amber-100 text-amber-800',
                    media_import: 'bg-teal-100 text-teal-800',
                    alerte_diffusee: 'bg-rose-100 text-rose-800',
                    delegation_com: 'bg-indigo-100 text-indigo-800',
                    ia_requete: 'bg-cyan-100 text-cyan-800'
                  };

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-2xs whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{log.authorName}</div>
                        <div className="text-2xs text-slate-500">{log.authorRole}</div>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-2xs font-extrabold uppercase ${typeColors[log.actionType] || 'bg-slate-100 text-slate-700'}`}>
                          {log.actionType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-md">
                        {log.details}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: EMERGENCY CONTACTS & SITE CONFIG */}
      {activeSubTab === 'contacts' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-600" />
              <span>Lier et Mettre à Jour les Numéros d'Urgence &amp; Coordonnées</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toute modification enregistrée ici met immédiatement à jour les boutons d'appel direct, les formulaires d'alerte et les mentions légales du portail.
            </p>
          </div>

          {saveNotice && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveNotice}</span>
            </div>
          )}

          <form onSubmit={handleSaveContacts} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Permanence / CPI / Éco-gardes *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formPhones.emergencyPhone1}
                  onChange={(e) => setFormPhones({ ...formPhones, emergencyPhone1: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-2xs text-slate-400">Ligne active 24h/24 pour alertes</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Direction Exécutive (DE) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formPhones.emergencyPhone2}
                  onChange={(e) => setFormPhones({ ...formPhones, emergencyPhone2: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-2xs text-slate-400">SONON Tchéhouéa, DE</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-rose-600" />
                  <span>Liaison Police BPLP / Sécurité Côtière *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formPhones.emergencyPhone3}
                  onChange={(e) => setFormPhones({ ...formPhones, emergencyPhone3: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="text-2xs text-slate-400">Brigade de Protection du Littoral</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs">Email Officiel</label>
                <input
                  type="email"
                  value={formPhones.email}
                  onChange={(e) => setFormPhones({ ...formPhones, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs">Lien Groupe Alerte WhatsApp</label>
                <input
                  type="text"
                  value={formPhones.whatsappCommunityUrl}
                  onChange={(e) => setFormPhones({ ...formPhones, whatsappCommunityUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs">Siège Social &amp; Localisation</label>
              <input
                type="text"
                value={formPhones.headquarters}
                onChange={(e) => setFormPhones({ ...formPhones, headquarters: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <label className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-amber-700" />
                <span>Chemin Local par Défaut pour les Médias (Vidéos / Photos)</span>
              </label>
              <input
                type="text"
                value={formPhones.localMediaFolderHint}
                onChange={(e) => setFormPhones({ ...formPhones, localMediaFolderHint: e.target.value })}
                className="w-full px-3 py-2 border border-amber-300 bg-white rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-2xs text-amber-800">
                Chemin référence sur le poste : utilisé comme suggestion d'import rapide pour l'équipe.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer &amp; Appliquer les Coordonnées</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: DELEGATION TO CHARGÉ COM */}
      {activeSubTab === 'delegation' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <span>Délégation des Prérogatives de Maintenance au Chargé de Communication</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Le Chargé de Programmes (CPI) peut déléguer ou partager la maintenance des visuels et médias avec le Chargé de Communication, Visibilité &amp; Médias.
              </p>
            </div>

            <button
              onClick={handleToggleFullDelegation}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                delegationState.delegatedToCom
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>
                {delegationState.delegatedToCom ? 'Délégation Active (Partagée)' : 'Délégation Inactive'}
              </span>
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Bénéficiaire désigné :</span>
              <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                {delegationState.delegatedPersonName}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Délégué par :</span>
              <span>{delegationState.delegatedBy}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Date d'effet :</span>
              <span>{delegationState.delegatedDate}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
              Périmètre des Prérogatives Déléguées :
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => handleToggleDelegation('manageMedia')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  delegationState.permissions.manageMedia ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <Video className={`w-5 h-5 shrink-0 ${delegationState.permissions.manageMedia ? 'text-emerald-700' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Collecte &amp; Gestion des Visuels</div>
                  <div className="text-2xs text-slate-500 mt-0.5">
                    Droit d'importer les vidéos et photos de terrain, remplacer les médias et administrer la médiathèque.
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleToggleDelegation('manageNewsfeed')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  delegationState.permissions.manageNewsfeed ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <Share2 className={`w-5 h-5 shrink-0 ${delegationState.permissions.manageNewsfeed ? 'text-emerald-700' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Modération du Fil d'Actualité</div>
                  <div className="text-2xs text-slate-500 mt-0.5">
                    Publication directe des reportages d'éco-gardes et coordination avec les pêcheurs.
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleToggleDelegation('updateAlerts')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  delegationState.permissions.updateAlerts ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 shrink-0 ${delegationState.permissions.updateAlerts ? 'text-emerald-700' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Diffusion d'Alertes &amp; Mobilisation</div>
                  <div className="text-2xs text-slate-500 mt-0.5">
                    Envoi instantané des notifications d'urgence sur les canaux WhatsApp et réseaux sociaux.
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handleToggleDelegation('editContacts')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  delegationState.permissions.editContacts ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 opacity-60'
                }`}
              >
                <Phone className={`w-5 h-5 shrink-0 ${delegationState.permissions.editContacts ? 'text-emerald-700' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold text-slate-900">Mise à jour des Contacts d'Urgence</div>
                  <div className="text-2xs text-slate-500 mt-0.5">
                    Actualisation des lignes de permanence en coordination avec les brigades de patrouille.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CONSEIL D'ADMINISTRATION (PRÉSIDÉ PAR PHILOMÈNE AKPODJI) */}
      {activeSubTab === 'conseil_administration' && (
        <div className="space-y-6">
          <BoardOfDirectorsSection />
        </div>
      )}
    </div>
  );
}
