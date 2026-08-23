import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Save, 
  LogOut, 
  Download, 
  Database, 
  Cloud, 
  CheckCircle2, 
  Globe, 
  Sparkles,
  Phone,
  MessageCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GOTRAS_LIST, VILLAGES_LIST } from '../lib/mockData';
import { BloodGroup } from '../types';
import { AvatarUpload } from '../components/AvatarUpload';

interface ProfileViewProps {
  onOpenAuth: () => void;
  deferredPrompt?: any;
  onInstallPWA?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenAuth,
  deferredPrompt,
  onInstallPWA,
}) => {
  const { t, i18n } = useTranslation();
  const { profile, updateProfile, signOut, isConfigured } = useAuth();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [fullNameGu, setFullNameGu] = useState(profile?.fullNameGu || '');
  const [gotra, setGotra] = useState<string>(profile?.gotra || GOTRAS_LIST[0]);
  const [nativeVillage, setNativeVillage] = useState<string>(profile?.nativeVillage || VILLAGES_LIST[0]);
  const [currentCity, setCurrentCity] = useState(profile?.currentCity || 'Ahmedabad (અમદાવાદ)');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(profile?.bloodGroup || 'O+');
  const [phone, setPhone] = useState(profile?.phone || '+919876543210');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '+919876543210');
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [isDonor, setIsDonor] = useState(profile?.isDonor ?? true);
  const [showPhone, setShowPhone] = useState(profile?.privacy?.showPhone ?? true);
  const [showWhatsapp, setShowWhatsapp] = useState(profile?.privacy?.showWhatsapp ?? true);

  const [savedAlert, setSavedAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cloudinary / Supabase dev settings modal
  const [showConfigDetails, setShowConfigDetails] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('samaj_supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('samaj_supabase_key') || '');
  const [cloudName, setCloudName] = useState(localStorage.getItem('samaj_cloudinary_cloud_name') || '');
  const [uploadPreset, setUploadPreset] = useState(localStorage.getItem('samaj_cloudinary_preset') || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    await updateProfile({
      fullName,
      fullNameGu,
      gotra,
      nativeVillage,
      currentCity,
      bloodGroup,
      phone,
      whatsapp,
      occupation,
      bio,
      avatarUrl,
      isDonor,
      privacy: {
        showPhone,
        showWhatsapp,
        allowDirectContact: true,
      },
    });

    setIsSaving(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleSaveConfig = () => {
    if (supabaseUrl) localStorage.setItem('samaj_supabase_url', supabaseUrl);
    if (supabaseKey) localStorage.setItem('samaj_supabase_key', supabaseKey);
    if (cloudName) localStorage.setItem('samaj_cloudinary_cloud_name', cloudName);
    if (uploadPreset) localStorage.setItem('samaj_cloudinary_preset', uploadPreset);
    setShowConfigDetails(false);
    window.location.reload();
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-slate-200 shadow-sm animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          {t('profile.loginPrompt')}
        </h3>
        <button
          id="profile-login-btn"
          onClick={onOpenAuth}
          className="w-full py-3 rounded-2xl bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
        >
          {t('profile.signIn')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Header Profile Badge */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border-2 border-orange-400 shadow-sm"
          />
          <div>
            <h2 className="text-base font-bold text-white leading-tight">
              {i18n.language === 'gu' && fullNameGu ? fullNameGu : fullName}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {gotra} • {nativeVillage}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-semibold rounded">
              Verified Member
            </span>
          </div>
        </div>

        <button
          id="profile-logout-btn"
          onClick={signOut}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition flex flex-col items-center"
          title={t('profile.logout')}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">{t('profile.logout')}</span>
        </button>
      </div>

      {savedAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{t('profile.savedSuccess')}</span>
        </div>
      )}

      {/* Main Profile Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Personal & Family Profile (ઓળખ અને પરિવાર)
        </h3>

        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
          label="Profile Picture (Auto-Compressed to <100KB for Cloudinary/Storage)"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name (English) *
            </label>
            <input
              id="profile-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              પૂરું નામ (ગુજરાતીમાં)
            </label>
            <input
              id="profile-fullname-gu"
              type="text"
              value={fullNameGu}
              onChange={(e) => setFullNameGu(e.target.value)}
              placeholder="દા.ત. હર્ષિલ જે. જોષી"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('profile.gotra')} *
            </label>
            <select
              id="profile-gotra"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {GOTRAS_LIST.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-red-700 mb-1">
              {t('profile.bloodGroup')} *
            </label>
            <select
              id="profile-blood"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full px-2 py-2 text-xs font-bold text-red-700 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('profile.nativeVillage')} *
            </label>
            <select
              id="profile-village"
              value={nativeVillage}
              onChange={(e) => setNativeVillage(e.target.value)}
              className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            >
              {VILLAGES_LIST.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('profile.currentCity')} *
            </label>
            <input
              id="profile-city"
              type="text"
              required
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('profile.phone')} *
            </label>
            <input
              id="profile-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('profile.whatsapp')} *
            </label>
            <input
              id="profile-whatsapp"
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t('profile.occupation')}
          </label>
          <input
            id="profile-occ"
            type="text"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            placeholder="e.g. Software Engineer, Doctor, CA, Diamond Merchant"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {t('profile.bio')}
          </label>
          <textarea
            id="profile-bio"
            rows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short intro about your family, business, or community involvement"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
          />
        </div>

        {/* Privacy Toggles */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="block text-xs font-bold text-slate-800">
            {t('profile.privacySettings')}
          </span>
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>{t('profile.showPhoneInDir')}</span>
            <input
              type="checkbox"
              checked={showPhone}
              onChange={(e) => setShowPhone(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>{t('profile.showWhatsappInDir')}</span>
            <input
              type="checkbox"
              checked={showWhatsapp}
              onChange={(e) => setShowWhatsapp(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span>Active Blood Donor Listing</span>
            <input
              type="checkbox"
              checked={isDonor}
              onChange={(e) => setIsDonor(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded"
            />
          </div>
        </div>

        <button
          id="save-profile-btn"
          type="submit"
          disabled={isSaving}
          className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? t('common.loading') : t('profile.saveChanges')}</span>
        </button>
      </form>

      {/* PWA App Installation Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              {t('profile.pwaInstall')}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t('profile.pwaInstallDesc')}
            </p>
          </div>
        </div>

        <button
          id="install-pwa-profile-btn"
          onClick={onInstallPWA}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>{t('profile.installBtn')}</span>
        </button>
      </div>

      {/* Zero-Cost Cloud Architecture Info & Settings */}
      <div className="bg-slate-50 rounded-3xl p-4 border border-slate-200 space-y-2 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Zero-Cost Cloud Architecture (Supabase & Cloudinary)</span>
          </span>
          <button
            onClick={() => setShowConfigDetails(!showConfigDetails)}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            {showConfigDetails ? 'Hide' : 'Configure'}
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Running on resilient free-tier architecture. Image uploads strictly compressed under 100KB via HTML5 canvas before uploading.
        </p>

        {showConfigDetails && (
          <div className="pt-3 space-y-3 border-t border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Supabase URL (Optional Override)
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Cloudinary Cloud Name
                </label>
                <input
                  type="text"
                  value={cloudName}
                  onChange={(e) => setCloudName(e.target.value)}
                  placeholder="cloud_name"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Upload Preset
                </label>
                <input
                  type="text"
                  value={uploadPreset}
                  onChange={(e) => setUploadPreset(e.target.value)}
                  placeholder="preset_name"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="w-full py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-lg shadow"
            >
              Apply Settings
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
