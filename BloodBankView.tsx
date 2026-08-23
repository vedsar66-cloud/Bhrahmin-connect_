import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HeartPulse, 
  Heart, 
  Phone, 
  MessageCircle, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck,
  Send,
  Building2
} from 'lucide-react';
import { BloodDonor, BloodGroup, BloodRequest } from '../types';
import { SkeletonDonorCard } from './SkeletonLoader';
import { useAuth } from './useAuth';

interface BloodBankViewProps {
  donors: BloodDonor[];
  bloodRequests: BloodRequest[];
  isLoading: boolean;
  onOpenSOS: () => void;
  onRegisterDonor: () => void;
}

export const BloodBankView: React.FC<BloodBankViewProps> = ({
  donors,
  bloodRequests,
  isLoading,
  onOpenSOS,
  onRegisterDonor,
}) => {
  const { t, i18n } = useTranslation();
  const { profile, updateProfile } = useAuth();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const bloodGroupsList: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (selectedGroup !== 'all' && d.bloodGroup !== selectedGroup) return false;
      if (cityFilter !== 'all' && !d.currentCity.includes(cityFilter)) return false;
      return true;
    });
  }, [donors, selectedGroup, cityFilter]);

  const toggleMyDonorStatus = async () => {
    if (!profile) return;
    const newStatus = !profile.isDonor;
    await updateProfile({ isDonor: newStatus });
    if (newStatus) {
      onRegisterDonor();
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* 1. Header with Crimson Theme */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-white text-red-600 rounded-xl shadow-md font-bold">
                <HeartPulse className="w-5 h-5 fill-current" />
              </span>
              <h2 className="text-lg font-black tracking-tight">
                {t('blood.title')}
              </h2>
            </div>
            <p className="text-xs text-red-100 max-w-xs">
              {t('blood.subtitle')}
            </p>
          </div>

          <button
            id="blood-sos-trigger-btn"
            onClick={onOpenSOS}
            className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-red-50 text-red-700 font-extrabold text-xs rounded-2xl shadow-xl transition active:scale-95 border-2 border-red-200 urgent-pulse"
          >
            <Heart className="w-5 h-5 fill-current animate-pulse text-red-600" />
            <span className="mt-1 text-[11px]">SOS Alert</span>
          </button>
        </div>

        {/* Quick Donor Switch for Current User */}
        {profile && (
          <div className="mt-4 pt-3 border-t border-red-500/50 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-red-100">{t('blood.donorStatus')}:</span>
              <span className="font-bold text-white">
                {profile.isDonor ? t('blood.available') : t('blood.notAvailable')}
              </span>
            </div>
            <button
              id="toggle-my-donor-status-btn"
              onClick={toggleMyDonorStatus}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition shadow-sm ${
                profile.isDonor
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {profile.isDonor ? '✓ Active Donor' : '+ Register Me'}
            </button>
          </div>
        )}
      </div>

      {/* 2. Active Urgent Blood SOS Requests */}
      {bloodRequests.filter((r) => !r.isFulfilled).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 px-1 text-red-800 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
            <span>{t('blood.urgentRequests')}</span>
          </div>

          {bloodRequests.filter((r) => !r.isFulfilled).map((req) => (
            <div
              key={req.id}
              id={`blood-req-${req.id}`}
              className="bg-white rounded-3xl p-4 border-2 border-red-400 shadow-md flex flex-col space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                    <span className="text-base leading-none">{req.bloodGroup}</span>
                    <span className="text-[8px] font-normal leading-none mt-0.5">{req.unitsRequired} Units</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {req.patientName}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{req.hospitalName}, {req.city}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2 py-1 bg-red-100 text-red-800 text-[10px] font-extrabold rounded-lg">
                  CRITICAL
                </span>
              </div>

              {req.reason && (
                <p className="text-xs text-slate-600 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
                  {req.reason}
                </p>
              )}

              {/* Coordinator Contact & Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <a
                  id={`sos-req-call-${req.id}`}
                  href={`tel:${req.contactPhone}`}
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('blood.callContact')}</span>
                </a>

                <a
                  id={`sos-req-wa-${req.id}`}
                  href={`https://wa.me/${req.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Jay Shree Krishna, I saw your urgent blood request for ${req.patientName} (${req.bloodGroup}) on Samaj Setu. I am ready to help.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Blood Group Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
            {t('blood.filterByGroup')}
          </span>
          <span className="text-xs text-slate-500">
            {filteredDonors.length} {t('blood.donorsFound')}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            id="blood-group-all"
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedGroup === 'all'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t('common.all')}
          </button>

          {bloodGroupsList.map((bg) => (
            <button
              key={bg}
              id={`blood-group-btn-${bg.replace('+', 'pos').replace('-', 'neg')}`}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition ${
                selectedGroup === bg
                  ? 'bg-red-600 text-white shadow-sm scale-105'
                  : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Donors List */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonDonorCard />
          <SkeletonDonorCard />
          <SkeletonDonorCard />
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
          <Heart className="w-10 h-10 text-red-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">{t('blood.noDonors')}</h3>
          <button
            onClick={() => setSelectedGroup('all')}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow"
          >
            Show All Donors
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDonors.map((donor) => {
            const phoneNum = donor.phone.replace(/[^0-9+]/g, '');
            const waNum = donor.whatsapp.replace(/[^0-9]/g, '');
            const waText = encodeURIComponent(
              `Jay Shree Krishna ${donor.fullName}, connecting via Samaj Setu Emergency Blood Bank.`
            );

            return (
              <div
                key={donor.id}
                id={`donor-card-${donor.id}`}
                className="bg-white rounded-3xl p-4 border border-red-100 hover:border-red-300 shadow-sm hover:shadow-md transition flex flex-col space-y-3"
              >
                {/* Donor Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex flex-col items-center justify-center font-black shadow-md flex-shrink-0">
                      <span className="text-sm leading-none">{donor.bloodGroup}</span>
                      <Heart className="w-2.5 h-2.5 fill-current mt-0.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {i18n.language === 'gu' && donor.fullNameGu ? donor.fullNameGu : donor.fullName}
                        </h4>
                        {donor.isEmergencyReady && (
                          <span className="p-0.5 bg-emerald-100 text-emerald-700 rounded-full" title="24x7 Ready">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-500 flex-shrink-0" />
                        <span className="truncate">{donor.currentCity} • વતન: {donor.nativeVillage.split(' ')[0]}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center space-x-0.5 text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{donor.donationCount} {t('blood.donationsDone')}</span>
                        </span>
                        {donor.lastDonationDate && (
                          <span className="flex items-center space-x-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{donor.lastDonationDate}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-200">
                    Ready
                  </span>
                </div>

                {/* CRITICAL ACTION BUTTONS: Call & WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <a
                    id={`call-donor-btn-${donor.id}`}
                    href={`tel:${phoneNum}`}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('directory.call')}</span>
                  </a>

                  <a
                    id={`whatsapp-donor-btn-${donor.id}`}
                    href={`https://wa.me/${waNum}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{t('directory.whatsapp')}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
