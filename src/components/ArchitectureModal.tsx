import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Server, 
  Globe, 
  Database, 
  ArrowRight, 
  Download, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { NGO_INFO } from '../data/initialData';
import { downloadFile } from '../utils/helpers';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadRoadmap = () => {
    const content = `========================================================================================
GUIDE STRATÉGIQUE D'ÉQUIPEMENT ET D'ORGANISATION — ${NGO_INFO.name.toUpperCase()}
Réalisé pour : Henri Doudédji FATCHINA, Chargé de Programmes par Intérim (CPI)
Sous le visa de : SONON Tchéhouéa, Directeur Exécutif (DE)
Siège : Togbin Fandji, Cotonou, Bénin
========================================================================================

QUESTION POSEE : "Quel outil me permettrait de gérer au mieux cette ONG ?"

RÉPONSE ET RECOMMANDATION OFFICIELLE :
Le modèle d'excellence recommandé pour ${NGO_INFO.name} est le TRIPTYQUE HYBRIDE :

1. GOOGLE WORKSPACE (Gratuit via Google for Nonprofits)
   - Rôle : Coordination de terrain, communication et vitrine web.
   - Google Drive : Dossier racine AMSHARTE avec sous-dossiers stricts par acteur (DE, CPI, Finances, Tortues, Mangroves, etc.).
   - Google Forms : Saisie déconnectée sur smartphone pour les éco-gardes et animateurs lors des patrouilles nocturnes.
   - Google Sheets : Agrégation instantanée sans ressaisie pour alimenter le tableau de bord de coordination du CPI.
   - Google Sites : Site vitrine externe avec tableau de bord public et accès membres.

2. DOLIBARR ERP/CRM (Open-source, auto-hébergé)
   - Rôle : Back-office administratif, conformité légale et financière pour les audits bailleurs.
   - Hébergement : OVH ou Hostinger (coût environ 2 500 à 4 000 FCFA / mois).
   - Modules clés activés : Projets (Tortues, Mangroves), Finances/Comptabilité, Membres & Bénévoles, CRM Bailleurs (PTF), Gestion Électronique des Documents (GED).
   - Aucun coût de licence par utilisateur (utilisateurs illimités).

3. PORTAIL WEB / COCKPIT DE PILOTAGE AMSHARTE (Cette application)
   - Rôle : Unification centrale, respect rigoureux des échéances du cahier de charge (Règle J+10 pour le rapport mensuel, 1er février pour le rapport annuel).
   - Édition automatisée des notes de service officielles et fiches de poste avec signatures.
   - Passerelle d'export CSV pour injecter les données terrain dans Dolibarr.

PLAN D'ACTION IMMÉDIAT EN 4 ÉTAPES :
Étape 1 : Demande d'adhésion à Google for Nonprofits pour obtenir Google Workspace gratuit à vie pour le domaine officiel d'AMSHARTE.
Étape 2 : Souscription d'un hébergement mutualisé ou VPS (OVH ou Hostinger) et installation de Dolibarr en 1 clic.
Étape 3 : Création de l'arborescence Google Drive normalisée fournie dans ce portail.
Étape 4 : Déploiement des formulaires Forms pour les rapports mensuels avec rappel systématique à J+10.

Fait pour servir et valoir ce que de droit.
========================================================================================`;

    downloadFile(content, `Feuille_de_Route_Organisation_AMSHARTE.txt`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Guide Stratégique de Gestion</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              « Quel outil me permettrait de gérer au mieux l'ONG AMSHARTE ? »
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyse comparative et feuille de route technique pour le CPI Henri Doudédji FATCHINA et le DE SONON Tchéhouéa.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg text-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Analysis */}
        <div className="space-y-6 text-xs sm:text-sm text-slate-700">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Le Diagnostic : Pourquoi un outil tout-en-un propriétaire est inadapté ?
            </h4>
            <p className="leading-relaxed text-slate-600">
              Une ONG de conservation marine et lagunaire comme <strong>AMSHARTE</strong> combine des opérations de nuit sur les plages (patrouilles tortues), des pépinières villageoises (mangroves), des réunions avec les pêcheurs, et des audits rigoureux de bailleurs (Union Européenne, FEM/PNUD).
            </p>
            <p className="leading-relaxed text-slate-600">
              Des logiciels SaaS commerciaux (Asana, Salesforce, Monday) coûtent des milliers de dollars par an en licences par utilisateur, ne fonctionnent pas hors-connexion sur la plage de Togbin, et ne gèrent pas la comptabilité associative béninoise.
            </p>
          </div>

          {/* Recommended Trio */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              La Solution Gagnante : Le Triptyque Hybride 100% Maîtrisé
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2">
                <strong className="text-blue-950 block font-bold text-xs">1. Google Workspace</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Coordination &amp; Terrain :</strong> Google Forms sur smartphone pour les patrouilleurs, Google Sheets pour la consolidation sans ressaisie par le CPI, Google Drive partagé et Google Sites pour la vitrine.
                </p>
                <div className="text-[11px] font-semibold text-blue-800">
                  Coût : 0 FCFA (Google for Nonprofits)
                </div>
              </div>

              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2">
                <strong className="text-purple-950 block font-bold text-xs">2. Dolibarr ERP/CRM</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Rigueur &amp; Comptabilité :</strong> Suivi des projets, comptabilité générale, conventions bailleurs (PTF), reçus de forfaits déplacement et archivage certifié.
                </p>
                <div className="text-[11px] font-semibold text-purple-800">
                  Coût : ~3 000 FCFA/mois (Hébergement web)
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                <strong className="text-emerald-950 block font-bold text-xs">3. Portail AMSHARTE</strong>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Cockpit de Coordination :</strong> Alerte automatique J+10 pour le rapport mensuel, 1er février pour le rapport annuel, fiches de poste officielles et exports prêts pour Dolibarr.
                </p>
                <div className="text-[11px] font-semibold text-emerald-800">
                  Déjà opérationnel et inclus
                </div>
              </div>
            </div>
          </div>

          {/* 4 Practical steps */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">
              Feuille de Route pour le Déploiement Immédiat
            </h4>

            <div className="space-y-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block font-semibold text-xs">Activer Google for Nonprofits</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Faites enregistrer l'ONG AMSHARTE sur TechSoup / Google for Nonprofits pour obtenir gratuitement la suite Workspace avec des adresses pro (ex: <code>direction@ongamshart.org</code>).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block font-semibold text-xs">Déployer Dolibarr sur un Hébergeur Fiable</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Prenez un hébergement chez Hostinger ou OVH (avec certificat SSL HTTPS inclus). Activez les modules <em>Projets, Adhérents, Comptabilité, Tiers</em>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block font-semibold text-xs">Mettre en place l'Arborescence Drive Normalisée</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Utilisez le modèle d'arborescence fourni dans l'onglet <em>Google ↔ Dolibarr</em> pour créer les 8 dossiers racines numérotés avec permissions spécifiques.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-slate-900 block font-semibold text-xs">Automatiser la Règle J+10 &amp; 1er Février</strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Utilisez le module Rapports de ce portail pour consolider chaque mois les données avant le 10, et préparer le grand rapport annuel avant le 1er février.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleDownloadRoadmap}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger la Feuille de Route Complète (TXT)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Fermer le Guide
          </button>
        </div>
      </div>
    </div>
  );
};
