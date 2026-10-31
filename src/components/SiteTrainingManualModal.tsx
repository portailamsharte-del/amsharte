import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Upload, 
  AlertTriangle, 
  FileText, 
  Bot, 
  Share2, 
  Phone, 
  Users,
  ChevronRight,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { NGO_INFO } from '../data/initialData';
import { downloadFile } from '../utils/helpers';

interface SiteTrainingManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SiteTrainingManualModal({ isOpen, onClose }: SiteTrainingManualModalProps) {
  const [activeModule, setActiveModule] = useState<number>(1);

  if (!isOpen) return null;

  const modules = [
    {
      id: 1,
      title: "1. Découverte, En-tête & Identité Héraldique",
      icon: ShieldCheck,
      summary: "Comprendre l'architecture du portail, le logo officiel avec le « E » d'Environnemental et les liens d'urgence."
    },
    {
      id: 2,
      title: "2. Fil d'Actualité & Importation de Photos/Vidéos",
      icon: Upload,
      summary: "Publier une action de terrain, importer photos/vidéos depuis son ordinateur ou le dossier local 'C:\\Users\\USER\\Documents\\Amshart\\Réception\\Données de la File d'actualité'."
    },
    {
      id: 3,
      title: "3. Dépôt de Rapport de Terrain (Tous les Membres)",
      icon: FileText,
      summary: "Comment chacun des 33 membres d'AMSHARTE (éco-gardes, pépiniéristes, sentinelles) peut soumettre son rapport sans barrière."
    },
    {
      id: 4,
      title: "4. Guichet d'Alerte Tortue & Mobilisation Automatique",
      icon: AlertTriangle,
      summary: "Signalement d'une tortue ou d'un nid à Togbin et diffusion instantanée de l'alerte à tous les acteurs."
    },
    {
      id: 5,
      title: "5. Espace de Travail Exécutif & Traçabilité (Qui a fait quoi ?)",
      icon: Users,
      summary: "Connexion sécurisée par code, inscription des cadres et journal d'audit chronologique infalsifiable."
    },
    {
      id: 6,
      title: "6. Assistant IA du CPI (Henri D. FATCHINA)",
      icon: Bot,
      summary: "Exploiter l'intelligence artificielle pour rédiger la synthèse mensuelle, monter des requêtes PTF et communiquer."
    },
    {
      id: 7,
      title: "7. Délégation de Maintenance au Chargé de Communication",
      icon: Share2,
      summary: "Partager les droits de gestion des médias, de collecte visuelle et de mise à jour du site avec la cellule média."
    },
    {
      id: 8,
      title: "8. Configuration des Numéros d'Urgence & Coordonnées",
      icon: Phone,
      summary: "Mettre à jour en temps réel les lignes téléphoniques, emails et liens WhatsApp du site directement depuis l'espace de travail."
    }
  ];

  const handleDownloadFullManual = () => {
    const text = `========================================================================================
MANUEL OFFICIEL DE FORMATION À L'UTILISATION DU PORTAIL DIGITAL AMSHARTE
République du Bénin — Commune d'Abomey-Calavi / Cotonou (Togbin Plage)
Organisation : ${NGO_INFO.name}
Attestation Loi 2025-19 N° ${NGO_INFO.legalCompliance.certificateNo}
Partenaire MCVT Lettre N° 878/MCVT/DC/CTR/SP-c
========================================================================================

PREAMBULE
Ce guide méthodique est conçu pour former l'ensemble des 33 acteurs de l'ONG AMSHARTE :
Direction Exécutive, Chargé de Programmes (CPI), Cellule Communication & Médias,
Chefs de patrouilles, Éco-gardes, Points Focaux départementaux et Pêcheurs sentinelles.

----------------------------------------------------------------------------------------
MODULE 1 : IDENTITE & NAVIGATION DIRECTE
----------------------------------------------------------------------------------------
1. Dénomination officielle : 
   "AMSHARTE - Amis du Monde pour la Sauvegarde de l'Hygiène, de la Santé Sécurité au Travail en Milieu Rural Artisanal et Environnemental"
2. Le Logo Officiel :
   Comprend la tortue marine, le rameau de mangrove et les mains fraternelles.
   La lettre « E » majuscule est mise en relief pour marquer la dimension « Environnementale »
   acquise après 22 ans d'histoire (2004-2026).
3. Navigation Instantanée :
   Chaque clic sur un onglet ou bouton d'action amène directement le regard sur la section ciblée
   avec défilement fluide sans rechargement de page.

----------------------------------------------------------------------------------------
MODULE 2 : FIL D'ACTUALITE & IMPORTATION DE CONTENUS VISUELS
----------------------------------------------------------------------------------------
1. Rôle du Fil d'Actualité :
   Permettre aux agents de terrain de documenter en quasi-direct les patrouilles de nuit,
   les baguages de tortues, les lâchers d'émergents et les reboisements de mangroves.
2. Procédure d'Importation :
   - Cliquer sur « Publier une action de terrain » ou « Remplacer ce média ».
   - Glisser-déposer un fichier image (.jpg, .png) ou vidéo (.mp4, .webm).
   - Dossier local de référence sur le poste de travail :
     C:\\Users\\USER\\Documents\\Amshart\\Réception\\Données de la File d'actualité
   - Le système accepte les téléversements directs avec prévisualisation immédiate.

----------------------------------------------------------------------------------------
MODULE 3 : DEPOT DE RAPPORT OUVERT A TOUS LES MEMBRES
----------------------------------------------------------------------------------------
1. Principe d'Inclusion Totale :
   Tous les membres d'AMSHARTE peuvent déposer leur rapport sans aucune restriction.
2. Comment déposer son rapport :
   - Cliquer sur le bouton « Déposer un Rapport de Terrain » (disponible sur l'en-tête et l'accueil).
   - Renseigner le nom, la fonction (ex: Éco-garde, Sentinelle pêcheur, Pépiniériste), le lieu.
   - Saisir les activités, les chiffres clés (tortues observées, nids protégés, œufs placés).
   - Mentionner les difficultés et les besoins financiers éventuels.
   - Le rapport est aussitôt numéroté et transmis au Chargé de Programmes par Intérim (CPI).

----------------------------------------------------------------------------------------
MODULE 4 : GUICHET D'ALERTE TORTUE & MOBILISATION AUTOMATIQUE
----------------------------------------------------------------------------------------
1. Quand alerter :
   Dès qu'une tortue est piégée dans un filet dérivant, blessée, ou aperçue en ponte nocturne à Togbin.
2. Mobilisation automatique :
   - Dès la soumission, une alerte sonore et visuelle est émise dans l'application.
   - Un lien direct WhatsApp pré-rempli permet d'avertir la brigade d'intervention.
   - Les 5 acteurs clés reçoivent la notification pour déploiement immédiat.

----------------------------------------------------------------------------------------
MODULE 5 : ESPACE DE TRAVAIL EXECUTIF & TRAÇABILITE TOTALE
----------------------------------------------------------------------------------------
1. Accès sécurisé :
   L'Espace de Travail de la Direction Exécutive requiert une inscription préalable
   ou la saisie d'un code confidentiel (Directeur Exécutif, CPI, Trésorière, Com).
2. Traçabilité (Qui a écrit quoi et quand ?) :
   Chaque action (visa d'un rapport, mise à jour d'un projet, modification de coordonnées)
   génère une écriture inaltérable dans le « Journal d'Audit » horodaté.

----------------------------------------------------------------------------------------
MODULE 6 : ASSISTANCE INTELLIGENCE ARTIFICIELLE POUR LE CPI
----------------------------------------------------------------------------------------
1. Accès :
   Disponible dans l'Espace de Travail sous l'onglet « Assistant IA du CPI ».
2. Fonctionnalités IA :
   - Génération de la Synthèse Mensuelle Globale des activités de terrain.
   - Rédaction assistée de requêtes de financement et notes conceptuelles (UE, PNUD/FEM, Ambassades).
   - Analyse des pontes et corrélation des observations de la BPLP et des pêcheurs.

----------------------------------------------------------------------------------------
MODULE 7 : DELEGATION AU CHARGE DE COMMUNICATION
----------------------------------------------------------------------------------------
Le CPI peut activer la délégation vers le Chargé de Communication, Visibilité & Médias :
- Collecte et intégration des photos et vidéos.
- Modération du Fil d'actualité.
- Mise à jour de la Médiathèque & Photothèque.

----------------------------------------------------------------------------------------
MODULE 8 : CONFIGURATION DES NUMEROS D'URGENCE
----------------------------------------------------------------------------------------
Les coordonnées téléphoniques et liens d'urgence du site sont modifiables en direct
dans le panneau « Paramètres du Site » de l'Espace de Travail pour garantir
que les numéros restent toujours opérationnels.

========================================================================================
Document rédigé par la Direction Exécutive & le CPI — ONG AMSHARTE
Pour toute assistance : amshart150504@yahoo.fr / (+229) 01 95 35 08 62
========================================================================================`;

    downloadFile(text, 'AMSHARTE_Manuel_Formation_Utilisation_Site.txt');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-5 sm:p-6 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 mb-1">
                <span>Guide Méthodologique &amp; Opérationnel</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black">
                Manuel de Formation à l'Utilisation du Site AMSHARTE
              </h2>
              <p className="text-xs text-slate-300">
                Guide pas-à-pas pour les 33 membres, patrouilleurs, CPI et Direction Exécutive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullManual}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs transition-colors"
              title="Télécharger le manuel complet en fichier texte"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger le Guide (.txt)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Layout: Sidebar of modules + Main module content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Module navigation list */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-3 overflow-y-auto space-y-1.5 shrink-0">
            <div className="text-2xs font-extrabold uppercase tracking-wider text-slate-500 px-2 py-1">
              Modules de Formation
            </div>
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'hover:bg-slate-200/70 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-bold">{m.title}</div>
                    <div className={`text-2xs line-clamp-1 mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {m.summary}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active module detailed content */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm leading-relaxed">
            {activeModule === 1 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 1</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Découverte, En-tête &amp; Identité Héraldique
                  </h3>
                </div>
                <p>
                  Bienvenue sur le portail officiel d'<strong>AMSHARTE</strong>. Ce site a été conçu pour allier <strong>visibilité publique</strong>, <strong>mobilisation communautaire de terrain</strong> et <strong>coordination rigoureuse</strong>.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Règle d'or : Nom officiel &amp; Logo</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Le sigle s'écrit <strong>AMSHARTE</strong> avec un <strong>E majuscule</strong> pour <em>Environnemental</em>. Les couleurs officielles sont le <strong>vert émeraude</strong> (mangroves), le <strong>bleu océan</strong> (tortues et littoral atlantique) et l'<strong>or</strong> (solidarité des Amis du Monde).
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Points clés d'utilisation :</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                    <li>Chaque bouton affiche directement la section concernée sans temps mort.</li>
                    <li>L'en-tête permet de basculer instantanément entre le <strong>Site Public</strong>, le <strong>Dépôt de Rapport</strong> et l'<strong>Espace de Travail</strong>.</li>
                    <li>Tous les numéros d'urgence affichés sont cliquables pour lancer un appel téléphonique direct ou un chat WhatsApp.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeModule === 2 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 2</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Fil d'Actualité &amp; Importation de Photos / Vidéos
                  </h3>
                </div>
                <p>
                  Le <strong>Fil d'actualité de terrain</strong> est le cœur battant du site. Il permet de publier les comptes-rendus de patrouille, de baguage et de lâcher de bébés tortues avec photos et vidéos.
                </p>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-amber-950 flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-amber-700" />
                    <span>Dossier local de réception des médias</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Sur votre ordinateur, vos vidéos et photos sont stockées dans le dossier :<br />
                    <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono text-2xs select-all">
                      C:\Users\USER\Documents\Amshart\Réception\Données de la File d'actualité
                    </code><br />
                    Pour importer un média, cliquez sur <strong>« Choisir un fichier »</strong> ou glissez-déposez directement votre fichier vidéo (.mp4) ou image (.jpg, .png).
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Procédure de publication :</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-xs">
                    <li>Accédez au <strong>Fil d'actualité</strong> depuis le menu.</li>
                    <li>Cliquez sur <strong>« + Publier une action de terrain »</strong>.</li>
                    <li>Sélectionnez la catégorie (ex: Patrouille conjointe BPLP, Baguage, Écloserie).</li>
                    <li>Ajoutez vos photos ou vidéos via le bouton d'importation de fichier.</li>
                    <li>Validez : la publication apparaît instantanément avec son lecteur vidéo intégré.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeModule === 3 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 3</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Dépôt de Rapport Ouvert à TOUS les Membres
                  </h3>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-1">
                  <div className="font-bold text-emerald-950">Principe de participation démocratique :</div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Le dépôt de rapport n'est pas réservé à quelques-uns. Chacun des <strong>33 membres</strong> de l'organisation (éco-gardes nocturnes, pépiniéristes de mangrove, sentinelles villageoises, points focaux) a le pouvoir et le devoir de consigner ses missions sur le site.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Comment déposer un rapport :</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-xs">
                    <li>Cliquez sur le bouton <strong>« 📝 Déposer un Rapport de Terrain »</strong> dans l'en-tête ou sur la page d'accueil.</li>
                    <li>Renseignez votre nom, votre fonction et le secteur concerné (ex: Togbin Fandji, Djègbadji).</li>
                    <li>Décrivez les activités accomplies, les observations écologiques et les difficultés rencontrées.</li>
                    <li>Indiquez les résultats quantitatifs (nids sécurisés, œufs transférés, participants).</li>
                    <li>Cliquez sur <strong>« Transmettre à la Coordination »</strong> : votre rapport est instantanément enregistré avec une référence officielle.</li>
                  </ol>
                </div>
              </div>
            )}

            {activeModule === 4 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 4</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Guichet d'Alerte Tortue &amp; Mobilisation Automatique
                  </h3>
                </div>
                <p>
                  Ce guichet permet à tout riverain, pêcheur artisan ou touriste de signaler une tortue en détresse ou un nid d'œufs sur la plage.
                </p>
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Mobilisation automatique immédiate</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    Dès qu'une alerte est soumise, le système déclenche un signal sonore, prévient l'ensemble des acteurs connectés et génère le lien WhatsApp pré-rempli pour notifier la patrouille de nuit et la Police BPLP.
                  </p>
                </div>
              </div>
            )}

            {activeModule === 5 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 5</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Espace de Travail Exécutif &amp; Traçabilité (Qui a écrit quoi ?)
                  </h3>
                </div>
                <p>
                  L'Espace de Travail est dédié à la <strong>Direction Exécutive</strong> et aux responsables de pôles. L'accès est protégé par un <strong>code confidentiel</strong> suite à une inscription.
                </p>
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Journal d'Audit et Traçabilité :</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Toute action réalisée dans l'Espace de Travail (validation d'un rapport, mise à jour d'un jalon de projet, modification des contacts d'urgence) est <strong>automatiquement horodatée et archivée</strong> avec le nom et le rôle de l'auteur. Le Directeur Exécutif et le CPI peuvent ainsi savoir avec certitude qui a écrit quoi et quand.
                  </p>
                </div>
              </div>
            )}

            {activeModule === 6 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 6</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Assistant IA du CPI (Henri Doudédji FATCHINA)
                  </h3>
                </div>
                <p>
                  Le CPI dispose d'un module d'<strong>Intelligence Artificielle (Gemini)</strong> pour décupler sa productivité et soutenir la coordination :
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 text-xs">
                  <li><strong>Synthèse Mensuelle Automatisée :</strong> L'IA lit l'ensemble des rapports déposés par les patrouilleurs et formule une synthèse claire prête à être visée par le Directeur Exécutif.</li>
                  <li><strong>Rédaction de Requêtes PTF :</strong> Formulation de notes conceptuelles pour l'Union Européenne, le PNUD/FEM et les ministères.</li>
                  <li><strong>Communiqués de Presse :</strong> Élaboration de fiches d'alerte et de sensibilisation pour les médias béninois.</li>
                </ul>
              </div>
            )}

            {activeModule === 7 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 7</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Délégation de Maintenance au Chargé de Communication
                  </h3>
                </div>
                <p>
                  Le CPI peut déléguer ou partager la prérogative de maintenance du site avec le <strong>Chargé de Communication, Visibilité &amp; Médias</strong>.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cette délégation permet au chargé de communication de collecter les visuels, d'alimenter la médiathèque et de publier directement les reportages vidéo de terrain, allégeant ainsi la charge du CPI.
                </p>
              </div>
            )}

            {activeModule === 8 && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Module 8</span>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
                    Configuration des Numéros d'Urgence &amp; Coordonnées
                  </h3>
                </div>
                <p>
                  Les numéros d'appel et d'urgence sont administrables en direct dans l'onglet <strong>« Paramètres du Site »</strong> de l'Espace de Travail.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dès qu'un numéro est modifié (permanence, Police BPLP, DE), il est aussitôt mis à jour sur tout le portail, dans le guichet d'alerte et dans les liens d'appel direct.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-2xs text-slate-500">
            Document officiel de formation interne • {NGO_INFO.name}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFullManual}
              className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Fermer le Manuel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
