import React from 'react';
import { NGO_INFO } from '../data/initialData';
import { 
  Globe, 
  Clock, 
  Bell,
  LogIn,
  LogOut
} from 'lucide-react';
import { getReportingDeadlinesInfo } from '../utils/helpers';
import { ExecutiveMember } from '../types';
import { AuthenticLogo } from './AuthenticLogo';
import { peutVoirOnglet } from '../lib/droits';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: 'public' | 'intranet';
  setCurrentView: (view: 'public' | 'intranet') => void;
  intranetTab: string;
  setIntranetTab: (tab: string) => void;
  onOpenArchitectureModal?: () => void;
  currentMember?: ExecutiveMember;
  onOpenTrainingManual?: () => void;
  onOpenWorkspaceAuth?: () => void;
  onOpenMemberReportModal?: () => void;
  logoVariant?: 'authentic_asr' | 'heraldic_e' | 'monogram_e' | 'heritage_asre';
  onOpenLogoModal?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  estConnecte?: boolean;
  roleCle?: string;
  onDeconnexion?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  intranetTab,
  setIntranetTab,
  currentMember,
  onOpenWorkspaceAuth,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  estConnecte = false,
  roleCle,
  onDeconnexion
}) => {
  const deadlines = getReportingDeadlinesInfo();

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 relative">
        {/* Centered Brand, Logo & Full Definition */}
        <div className="flex flex-col items-center justify-center text-center gap-2">
          {/* Authentic Logo Box */}
          <div 
            className="bg-white rounded-2xl p-1.5 shadow-md border-2 border-emerald-400/80 inline-flex items-center justify-center cursor-pointer hover:scale-105 transition shrink-0"
            onClick={() => setCurrentView('public')}
            title="ONG AMSHARTE — Accueil du Site Officiel"
          >
            <div className="h-12 px-2 flex items-center justify-center">
              <AuthenticLogo size="sm" className="w-24 h-11" />
            </div>
          </div>

          <div className="space-y-1 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                AMSHARTE
              </h1>
              <span className="text-emerald-300 font-bold text-xs uppercase px-2.5 py-0.5 bg-emerald-950/90 border border-emerald-400/50 rounded-full tracking-wider shadow-xs">
                Site Officiel
              </span>
            </div>

            {/* Définition d'AMSHARTE centrée */}
            <p className="text-xs sm:text-sm text-emerald-300 font-semibold tracking-wide leading-snug">
              {NGO_INFO.fullName}
            </p>

            <p className="text-2xs sm:text-xs text-slate-300 font-normal leading-normal">
              Conservation marine &amp; lagunaire • Sauvegarde des tortues marines à Togbin Plage • Surveillance BPLP • Écloserie communautaire
            </p>

            {/* Mobile PWA Install Chip */}
            <div className="sm:hidden pt-1 flex justify-center">
              <PWAInstallButton className="text-[11px] py-1 px-3" />
            </div>
          </div>
        </div>

        {/* Top-Right: Intranet quick link & Notifications & PWA Install */}
        <div className="absolute right-4 top-3 flex items-center gap-2">
          {/* In-app PWA install button */}
          <PWAInstallButton className="hidden sm:inline-flex" />

          {/* Connexion / Déconnexion des membres (Supabase) */}
          {estConnecte ? (
            <button
              onClick={onDeconnexion}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border border-slate-700/60"
              title={`Connecté : ${currentMember?.name || ''} — cliquer pour se déconnecter`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          ) : (
            <button
              onClick={onOpenWorkspaceAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              title="Connexion ou inscription des membres AMSHARTE"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Espace membres</span>
            </button>
          )}

          {currentView === 'intranet' && (
            <button
              onClick={() => setCurrentView('public')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              title="Revenir au site public vitrine d'AMSHARTE"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Site Public</span>
            </button>
          )}

          {/* Notification Center Trigger */}
          {onOpenNotifications && (
            <button
              id="btn-open-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer shadow-xs"
              title="Centre de Notifications (Alertes, Exports PDF, Documents)"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Intranet Secondary Navigation bar when in Intranet view */}
      {currentView === 'intranet' && (
        <div className="bg-slate-800/95 border-t border-slate-700/60 px-4 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {[
                { id: 'espace-travail', label: 'Espace Direction Exécutive', icon: '👥' },
                { id: 'conseil-administration', label: 'Espace Conseil d\'Administration', icon: '🏛️' },
                { id: 'projets', label: 'Projets (Tortues & Mangroves)', icon: '🌱' },
                { id: 'ptf', label: 'Partenaires PTF & Financement', icon: '🤝' },
                { id: 'passerelle', label: 'Google ↔ Dolibarr', icon: '⚡' },
                { id: 'assistant-ia', label: 'Assistant IA (CPI)', icon: '🤖' },
                { id: 'parametres-audit', label: 'Audit & Paramètres', icon: '⚙️' },
              ].filter((tab) => peutVoirOnglet(roleCle, tab.id)).map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => setIntranetTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    intranetTab === tab.id
                      ? 'bg-blue-600 text-white font-semibold shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Status Notice on Reporting Deadlines */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/80 text-[11px]">
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="text-slate-300">
                Échéance Rapport <strong>{deadlines.previousMonthName}</strong> : 
              </span>
              <span className={`font-bold ${deadlines.isMonthlyOverdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                {deadlines.isMonthlyOverdue ? 'Échue le 10' : `Dans ${deadlines.daysDiffMonthly} jours (le 10)`}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
