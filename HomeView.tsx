import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  HeartPulse, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Phone, 
  MessageCircle, 
  AlertCircle,
  Building2,
  Share2,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab, Announcement, BloodRequest } from '../types';
import { useAuth } from '../hooks/useAuth';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSOS: () => void;
  announcements: Announcement[];
  bloodRequests: BloodRequest[];
  stats: {
    membersCount: number;
    donorsCount: number;
    businessesCount: number;
    helpedCount: number;
  };
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  onOpenSOS,
  announcements,
  bloodRequests,
  stats,
}) => {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();

  const activeBloodRequests = bloodRequests.filter((r) => !r.isFulfilled);

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-300">
      
      {/* 1. Welcome Greeting Header Banner */}
      <div className="bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative mandalas/circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-orange-500/15 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('home.welcome')}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {profile ? (i18n.language === 'gu' && profile.fullNameGu ? profile.fullNameGu : profile.fullName) : 'સમાજ પરિવાર'}
            </h2>
            <p className="text-xs text-blue-200 font-normal max-w-xs">
              {profile ? `${profile.gotra} • ${profile.nativeVillage}` : t('home.welcomeSub')}
            </p>
          </div>

          {/* User Avatar with verified ring */}
          <div className="relative flex-shrink-0">
            <img
              src={
                profile?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt="Profile"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-orange-400 shadow-md"
            />
            <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-white border-2 border-[#1E3A8A]">
              <ShieldCheck className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 2. Quick Community Stats Grid */}
        <div className="grid grid-cols-4 gap-2 pt-5 mt-5 border-t border-blue-800/80 text-center">
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-extrabold text-white">{stats.membersCount}</div>
            <div className="text-[10px] text-blue-200 font-medium leading-tight">{t('home.statsMembers')}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-extrabold text-red-300">{stats.donorsCount}</div>
            <div className="text-[10px] text-blue-200 font-medium leading-tight">{t('home.statsDonors')}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-extrabold text-amber-300">{stats.businessesCount}</div>
            <div className="text-[10px] text-blue-200 font-medium leading-tight">{t('home.statsBusinesses')}</div>
          </div>
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
            <div className="text-base sm:text-lg font-extrabold text-emerald-300">{stats.helpedCount}+</div>
            <div className="text-[10px] text-blue-200 font-medium leading-tight">{t('home.statsHelped')}</div>
          </div>
        </div>
      </div>

      {/* 3. URGENT BLOOD ALERTS BANNER (If any active requests) */}
      {activeBloodRequests.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-red-700">
              <span className="p-1 bg-red-600 text-white rounded-lg animate-pulse">
                <HeartPulse className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">
                {t('blood.urgentRequests')}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('blood')}
              className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center space-x-1"
            >
              <span>{t('home.viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {activeBloodRequests.slice(0, 1).map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-3 border border-red-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center font-black flex-shrink-0 shadow-sm">
                    <span className="text-sm leading-none">{req.bloodGroup}</span>
                    <span className="text-[8px] font-normal leading-none mt-0.5">{req.unitsRequired} Units</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>Patient: {req.patientName}</span>
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded">SOS</span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center space-x-1 mt-0.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{req.hospitalName}, {req.city}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <a
                    id={`home-blood-call-${req.id}`}
                    href={`tel:${req.contactPhone}`}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 py-1.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('directory.call')}</span>
                  </a>
                  <a
                    id={`home-blood-wa-${req.id}`}
                    href={`https://wa.me/${req.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Jay Shree Krishna, regarding blood requirement for ${req.patientName} (${req.bloodGroup})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-1 py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. THREE LARGE VISUALLY DISTINCT ACTION CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
            {t('home.quickActions')}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          
          {/* Card 1: Family Directory */}
          <div
            id="home-action-directory-card"
            onClick={() => setActiveTab('directory')}
            className="group relative bg-white hover:bg-blue-50/50 p-4 sm:p-5 rounded-3xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-blue-700 text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {t('home.directoryCardTitle')}
                  </h4>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {stats.membersCount}+
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 max-w-sm">
                  {t('home.directoryCardDesc')}
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#1E3A8A] text-slate-500 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Emergency Blood Bank */}
          <div
            id="home-action-blood-card"
            onClick={() => setActiveTab('blood')}
            className="group relative bg-gradient-to-r from-red-50 to-rose-50/70 p-4 sm:p-5 rounded-3xl border border-red-200 hover:border-red-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-red-950 group-hover:text-red-700 transition-colors">
                    {t('home.bloodCardTitle')}
                  </h4>
                  <span className="text-[10px] bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded-full">
                    24x7
                  </span>
                </div>
                <p className="text-xs text-red-800/80 line-clamp-2 max-w-sm">
                  {t('home.bloodCardDesc')}
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-red-100 group-hover:bg-red-600 text-red-600 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Samaj Business Network */}
          <div
            id="home-action-business-card"
            onClick={() => setActiveTab('business')}
            className="group relative bg-white hover:bg-orange-50/50 p-4 sm:p-5 rounded-3xl border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-950 transition-colors">
                    {t('home.businessCardTitle')}
                  </h4>
                  <span className="text-[10px] bg-orange-100 text-orange-900 font-bold px-2 py-0.5 rounded-full">
                    Discounts
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 max-w-sm">
                  {t('home.businessCardDesc')}
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-orange-500 text-slate-500 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0 ml-2">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* 5. SAMAJ NOTICE BOARD & ANNOUNCEMENTS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">
              {t('home.announcements')}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
            >
              {ann.imageUrl && (
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={ann.imageUrl}
                    alt={ann.title}
                    className="w-full h-full object-cover"
                  />
                  {ann.isUrgent && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-600 text-white text-[10px] font-extrabold rounded-lg shadow-md uppercase">
                      Urgent Notice
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-lg">
                    {ann.date}
                  </span>
                </div>
              )}

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {i18n.language === 'gu' ? ann.titleGu : ann.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {i18n.language === 'gu' ? ann.descriptionGu : ann.description}
                </p>

                {ann.location && (
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-medium pt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span>{ann.location}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-[11px] text-slate-400">
                  <span>By {ann.organizer}</span>
                  <button
                    onClick={() => {
                      const shareText = encodeURIComponent(
                        `*${ann.title}*\n${ann.date}\n${ann.location || ''}\n${ann.description}`
                      );
                      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
                    }}
                    className="flex items-center space-x-1 text-[#25D366] font-bold hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
