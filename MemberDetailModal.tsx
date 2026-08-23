import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Phone, MessageCircle, MapPin, Building, Heart, ShieldCheck, Users, Briefcase } from 'lucide-react';
import { DirectoryMember } from '../types';

interface MemberDetailModalProps {
  member: DirectoryMember | null;
  onClose: () => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!member) return null;

  const phoneNum = member.phone.replace(/[^0-9+]/g, '');
  const waNum = member.whatsapp.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Jay Shree Krishna ${member.fullName}, connecting with you via Samaj Setu Community App.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Header Card */}
        <div className="relative bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] p-6 text-white text-center">
          <button
            id="close-member-detail-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative inline-block mx-auto mb-2">
            <img
              src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={member.fullName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/90 shadow-md mx-auto"
            />
            {member.isVerified && (
              <span className="absolute bottom-0 right-0 p-1 bg-emerald-500 rounded-full text-white border-2 border-white shadow">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-white">
            {i18n.language === 'gu' && member.fullNameGu ? member.fullNameGu : member.fullName}
          </h3>
          <p className="text-xs text-blue-200">
            {member.occupation}
          </p>

          <div className="flex items-center justify-center space-x-2 mt-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {member.gotra}
            </span>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
              <Heart className="w-2.5 h-2.5 fill-current" />
              <span>{member.bloodGroup}</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Key Facts */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                {t('directory.nativeVillage')}
              </span>
              <span className="font-semibold text-slate-800 flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <span>{member.nativeVillage}</span>
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                {t('directory.currentCity')}
              </span>
              <span className="font-semibold text-slate-800 flex items-center space-x-1 mt-0.5">
                <Building className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>{member.currentCity}</span>
              </span>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700">About & Background</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {member.bio}
              </p>
            </div>
          )}

          {/* Family Members Tree */}
          {member.familyMembers && member.familyMembers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-orange-600" />
                  <span>{t('directory.familyMembers')} ({member.familyMembers.length + 1})</span>
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                {member.familyMembers.map((fam) => (
                  <div key={fam.id} className="p-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{fam.name}</div>
                      <div className="text-[10px] text-slate-500">{fam.relation} {fam.age ? `• ${fam.age} yrs` : ''}</div>
                    </div>
                    {fam.bloodGroup && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg">
                        {fam.bloodGroup}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          {member.address && (
            <div className="text-xs text-slate-600">
              <span className="text-slate-400 text-[10px] uppercase font-bold block mb-0.5">Address</span>
              <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">{member.address}</p>
            </div>
          )}
        </div>

        {/* CRITICAL ACTION BUTTONS: Call & WhatsApp */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
          <a
            id={`detail-call-btn-${member.id}`}
            href={`tel:${phoneNum}`}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 active:scale-95 text-white font-bold text-xs shadow-md transition"
          >
            <Phone className="w-4 h-4" />
            <span>{t('directory.call')}</span>
          </a>

          <a
            id={`detail-whatsapp-btn-${member.id}`}
            href={`https://wa.me/${waNum}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-md transition"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>{t('directory.whatsapp')}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
