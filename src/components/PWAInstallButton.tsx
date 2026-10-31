import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle, X, ExternalLink } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showGenericGuide, setShowGenericGuide] = useState(false);

  // If already installed and running standalone, hide the button
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
        App Installée
      </span>
    );
  }

  // Chromium / Android / Desktop flow with beforeinstallprompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95 ${className}`}
        title="Installer l'application sur votre appareil"
      >
        <Download className="w-4 h-4 text-emerald-100" />
        <span>Installer l'App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs sm:text-sm font-semibold transition-all ${className}`}
          title="Installer sur iPhone ou iPad"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Installer sur iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    A
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Installer AMSHARTE</h3>
                    <p className="text-xs text-slate-500">Pour iPhone et iPad (Safari)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-sm text-slate-600">
                <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <p>
                    Ouvrez le lien dans <strong>Safari</strong>, puis appuyez sur l'icône <strong>Partager</strong> en bas de l'écran (le carré avec une flèche vers le haut).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <p>
                    Faites défiler le menu vers le bas et sélectionnez <strong>« Sur l'écran d'accueil »</strong> (ou <em>Add to Home Screen</em>).
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <p>
                    Appuyez sur <strong>Ajouter</strong> en haut à droite. L'icône officielle <strong>AMSHARTE</strong> apparaît sur votre écran d'accueil et s'ouvre directement en plein écran !
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers when beforeinstallprompt is pending or not triggered
  return (
    <>
      <button
        onClick={() => setShowGenericGuide(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs sm:text-sm font-medium transition ${className}`}
        title="Guide d'installation sur mobile ou ordinateur"
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installer l'App</span>
      </button>

      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg">
                  A
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Installer AMSHARTE</h3>
                  <p className="text-xs text-slate-500">Accès direct sans navigateur</p>
                </div>
              </div>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-1">📱 Sur Android (Chrome) :</h4>
                <p>Cliquez sur les <strong>trois points verticaux (⋮)</strong> en haut à droite du navigateur, puis sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-1">🍎 Sur iPhone / iPad (Safari) :</h4>
                <p>Appuyez sur le bouton <strong>Partager</strong> en bas, puis choisissez <strong>« Sur l'écran d'accueil »</strong>.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-1">💻 Sur Ordinateur (Chrome/Edge) :</h4>
                <p>Cliquez sur l'icône d'installation dans la barre d'adresse tout à droite (icône d'écran ou « Installer »).</p>
              </div>
            </div>

            <button
              onClick={() => setShowGenericGuide(false)}
              className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
