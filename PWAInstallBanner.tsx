import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, X, Smartphone, Sparkles, PlusSquare, Share } from 'lucide-react';

interface PWAInstallBannerProps {
  deferredPrompt: any;
  onInstall: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ deferredPrompt, onInstall }) => {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Check if iOS
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = typeof window !== 'undefined' && (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);

  if (isDismissed || isStandalone) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white p-3 px-4 rounded-2xl shadow-md flex items-center justify-between mx-auto mb-3 max-w-4xl border border-orange-400/40">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white text-orange-600 flex items-center justify-center font-bold text-sm shadow flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold truncate">
              {t('profile.pwaInstall')}
            </div>
            <p className="text-[10px] text-orange-100 truncate">
              Fast, offline-ready & adds icon to Home Screen
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          {deferredPrompt ? (
            <button
              id="pwa-install-banner-action-btn"
              onClick={onInstall}
              className="px-3 py-1.5 bg-white text-orange-700 hover:bg-orange-50 active:scale-95 text-xs font-extrabold rounded-xl shadow transition"
            >
              Install
            </button>
          ) : isIOS ? (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 bg-white text-orange-700 hover:bg-orange-50 text-xs font-extrabold rounded-xl shadow transition"
            >
              How to Install
            </button>
          ) : (
            <button
              onClick={onInstall}
              className="px-3 py-1.5 bg-white text-orange-700 hover:bg-orange-50 text-xs font-extrabold rounded-xl shadow transition"
            >
              Install
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-orange-200 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Install on iPhone / iPad</h3>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start space-x-3 p-2 bg-slate-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                <span>Tap the <strong>Share</strong> icon <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> in Safari bottom toolbar.</span>
              </div>
              <div className="flex items-start space-x-3 p-2 bg-slate-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                <span>Scroll down and select <strong>'Add to Home Screen'</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-slate-600" />.</span>
              </div>
              <div className="flex items-start space-x-3 p-2 bg-slate-50 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                <span>Tap <strong>'Add'</strong> in top right corner. Samaj Setu will appear on your screen!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-orange-600 text-white font-bold text-xs rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
