import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  X, 
  ExternalLink,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationToastProps {
  activeToast: AppNotification | null;
  onDismissToast: () => void;
  notifications: AppNotification[];
  isOpenDrawer: boolean;
  onCloseDrawer: () => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  activeToast,
  onDismissToast,
  notifications,
  isOpenDrawer,
  onCloseDrawer,
  onClearAll,
  onMarkAllAsRead,
  onNavigateTab
}) => {
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown for active toast
  useEffect(() => {
    if (!activeToast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const intervalTime = 50;
    const totalDuration = 4500;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev <= step) {
          clearInterval(timer);
          onDismissToast();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeToast, onDismissToast]);

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBgColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-200 bg-white text-emerald-950 shadow-emerald-900/10';
      case 'warning':
        return 'border-amber-200 bg-white text-amber-950 shadow-amber-900/10';
      case 'error':
        return 'border-rose-200 bg-white text-rose-950 shadow-rose-900/10';
      case 'info':
      default:
        return 'border-blue-200 bg-white text-blue-950 shadow-blue-900/10';
    }
  };

  const getProgressBarColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-rose-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <>
      {/* 1. FLOATING TOAST NOTIFICATION (Top-Right on desktop, Top-Center on mobile) */}
      {activeToast && (
        <div 
          id="active-notification-toast"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-slide-in pointer-events-auto shadow-2xl"
          role="alert"
        >
          <div className={`relative overflow-hidden rounded-xl border p-4 shadow-xl ${getBgColor(activeToast.type)}`}>
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-slate-50">
                {getIcon(activeToast.type)}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{activeToast.title}</h4>
                  <span className="text-2xs text-slate-400 ml-2 shrink-0">{activeToast.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {activeToast.message}
                </p>
              </div>
              <button
                onClick={onDismissToast}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition cursor-pointer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Visual countdown progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
              <div 
                className={`h-full transition-all linear duration-75 ${getProgressBarColor(activeToast.type)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. SLIDE-OVER NOTIFICATION DRAWER / CENTER */}
      {isOpenDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div 
            id="notifications-drawer-panel"
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Centre de Notifications</h3>
                  <p className="text-2xs text-slate-500">Alertes, exports PDF, documents &amp; activités terrain</p>
                </div>
              </div>
              <button
                onClick={onCloseDrawer}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Strip */}
            <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {notifications.length} notification{notifications.length > 1 ? 's' : ''} enregistrée{notifications.length > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={onMarkAllAsRead}
                  className="text-slate-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer transition"
                  title="Marquer comme lues"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tout marquer lu</span>
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={onClearAll}
                  className="text-slate-400 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer transition"
                  title="Effacer l'historique"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Bell className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-slate-700 text-sm">Aucune notification en attente</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Toutes les actions importantes (exports PDF, ajout de documents, validation de rapports et synchronisations) s'afficheront ici en temps réel.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      notif.read 
                        ? 'bg-slate-50/70 border-slate-200 text-slate-600' 
                        : 'bg-white border-emerald-300 shadow-xs text-slate-900 ring-1 ring-emerald-500/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notif.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold truncate">{notif.title}</h5>
                          <span className="text-2xs text-slate-400 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        
                        {notif.actionLabel && onNavigateTab && (
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                onCloseDrawer();
                                if (notif.category === 'rapport') onNavigateTab('rapports-mensuels');
                                else if (notif.category === 'document') onNavigateTab('webmastering-docs');
                                else if (notif.category === 'impact') onNavigateTab('espace-travail');
                              }}
                              className="text-2xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>{notif.actionLabel}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-2xs text-slate-500">
              Système de notification automatique • ONG AMSHARTE (ASR-E Bénin)
            </div>
          </div>
        </div>
      )}
    </>
  );
};
