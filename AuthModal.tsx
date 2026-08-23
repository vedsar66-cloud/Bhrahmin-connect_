import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, MapPin, Heart, Shield, Check, Sparkles } from 'lucide-react';
import { useAuth } from './useAuth';
import { GOTRAS_LIST, VILLAGES_LIST } from '../lib/mockData';
import { BloodGroup } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInAsGuest, isConfigured } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gotra, setGotra] = useState<string>(GOTRAS_LIST[0]);
  const [nativeVillage, setNativeVillage] = useState<string>(VILLAGES_LIST[0]);
  const [currentCity, setCurrentCity] = useState('Ahmedabad (અમદાવાદ)');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('+919876543210');
  const [isDonor, setIsDonor] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
        }
      } else {
        const res = await signUpWithEmail(email, password, {
          fullName,
          gotra,
          nativeVillage,
          currentCity,
          bloodGroup,
          phone,
          whatsapp: phone,
          isDonor,
        });
        if (res.error) {
          setError(res.error);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    signInAsGuest();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#172554] p-5 text-white relative">
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center font-bold text-xl text-white shadow">
              સ
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {mode === 'login' ? t('auth.login') : t('auth.signup')}
              </h2>
              <p className="text-xs text-blue-200">
                {t('appTagline')}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-blue-950/60 p-1 mt-4 border border-blue-800/50">
            <button
              id="switch-to-login-tab"
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                mode === 'login' ? 'bg-orange-500 text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              {t('auth.submitLogin')}
            </button>
            <button
              id="switch-to-signup-tab"
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                mode === 'signup' ? 'bg-orange-500 text-white shadow' : 'text-blue-200 hover:text-white'
              }`}
            >
              {t('auth.submitSignup')}
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick Demo Guest Button for Instant Exploration */}
          <button
            id="demo-guest-login-btn"
            type="button"
            onClick={handleGuest}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 hover:border-orange-400 text-orange-950 transition text-left group"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-orange-900 group-hover:text-orange-600">
                  {t('auth.guestLogin')}
                </div>
                <div className="text-[11px] text-orange-700">
                  {t('auth.guestDisclaimer')}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-orange-600 px-2 py-1 bg-white rounded-lg border border-orange-200">
              1-Click
            </span>
          </button>

          {/* Continue with Google Button */}
          <button
            id="google-oauth-btn"
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('auth.continueWithGoogle')}</span>
          </button>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200" />
            <span>{t('auth.orEmail')}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('profile.fullName')} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      id="signup-fullname-input"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Harshil J. Joshi"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('profile.gotra')} *
                    </label>
                    <select
                      id="signup-gotra-select"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      {GOTRAS_LIST.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('profile.bloodGroup')} *
                    </label>
                    <select
                      id="signup-bloodgroup-select"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white font-bold text-red-700"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('profile.nativeVillage')} *
                  </label>
                  <select
                    id="signup-village-select"
                    value={nativeVillage}
                    onChange={(e) => setNativeVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    {VILLAGES_LIST.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('auth.password')} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? t('common.loading') : mode === 'login' ? t('auth.submitLogin') : t('auth.submitSignup')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
