import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Heart, Bell, ShieldCheck, Download } from 'lucide-react';
import { useAuth } from './useAuth';

interface NavbarProps {
  onOpenSOS: () => void;
  onOpenAuth: () => void;
  deferredPrompt?: any;
  onInstallPWA?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSOS, onOpenAuth, deferredPrompt, onInstallPWA }) => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'gu' ? 'en' : 'gu';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('samaj_language', nextLang);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1E3A8A] text-white shadow-md border-b border-blue-800">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        
        {/* Logo & App Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-inner font-bold text-lg text-white border border-orange-400">
            સ
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-base sm:text-lg tracking-tight leading-tight">
                {t('appName')}
              </h1>
              <span className="bg-orange-500/30 text-orange-200 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-orange-400/40">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-blue-200 font-normal leading-none hidden sm:block">
              {t('appTagline')}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Emergency SOS Quick Button */}
          <button
            id="emergency-sos-header-btn"
            onClick={onOpenSOS}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition-all border border-red-500 urgent-pulse"
            title="Urgent Blood Help"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
            <span className="hidden xs:inline">SOS</span>
          </button>

          {/* Bilingual Language Switcher Toggle */}
          <button
            id="language-toggle-btn"
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 bg-blue-800/80 hover:bg-blue-700/80 active:scale-95 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-blue-700 transition-colors"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-bold tracking-wide">
              {i18n.language === 'gu' ? 'EN' : 'ગુ'}
            </span>
          </button>

          {/* PWA Install Trigger if available */}
          {deferredPrompt && (
            <button
              id="header-pwa-install-btn"
              onClick={onInstallPWA}
              className="p-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs transition"
              title="Install App"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* User Avatar or Login button */}
          {profile ? (
            <div className="flex items-center pl-1">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={profile.fullName}
                className="w-8 h-8 rounded-full object-cover border-2 border-orange-400 shadow-sm"
              />
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={onOpenAuth}
              className="text-xs bg-white text-blue-900 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition"
            >
              {t('profile.signIn')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
