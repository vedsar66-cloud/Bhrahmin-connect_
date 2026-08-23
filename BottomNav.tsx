import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Users, HeartPulse, Briefcase, UserCircle } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  urgentBloodCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, urgentBloodCount = 2 }) => {
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: t('nav.home'),
      icon: Home,
      elementId: 'tab-home-btn',
    },
    {
      id: 'directory' as ActiveTab,
      label: t('nav.directory'),
      icon: Users,
      elementId: 'tab-directory-btn',
    },
    {
      id: 'blood' as ActiveTab,
      label: t('nav.blood'),
      icon: HeartPulse,
      elementId: 'tab-blood-btn',
      badge: urgentBloodCount > 0 ? urgentBloodCount : undefined,
      isBlood: true,
    },
    {
      id: 'business' as ActiveTab,
      label: t('nav.business'),
      icon: Briefcase,
      elementId: 'tab-business-btn',
    },
    {
      id: 'profile' as ActiveTab,
      label: t('nav.profile'),
      icon: UserCircle,
      elementId: 'tab-profile-btn',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={item.elementId}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 transition-all duration-200 ${
                isActive ? 'text-orange-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Active Tab Top Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-b-full shadow-sm" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-transform duration-200 ${
                    isActive
                      ? item.isBlood
                        ? 'bg-red-50 text-red-600 scale-110'
                        : 'bg-orange-50 text-orange-600 scale-110'
                      : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? item.isBlood
                          ? 'text-red-600 stroke-[2.5]'
                          : 'text-orange-600 stroke-[2.5]'
                        : item.isBlood
                        ? 'text-red-500'
                        : 'text-slate-500'
                    }`}
                  />
                </div>

                {/* Urgent notification badge */}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-red-600 text-white text-[9px] font-extrabold flex items-center justify-center rounded-full px-1 border-2 border-white animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap transition-colors ${
                  isActive ? 'text-[#1E3A8A] font-bold' : 'text-slate-500 font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
