import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building, 
  Phone, 
  MessageCircle, 
  UserPlus, 
  ShieldCheck, 
  Heart, 
  Users, 
  X,
  ChevronRight
} from 'lucide-react';
import { DirectoryMember, BloodGroup } from '../types';
import { GOTRAS_LIST, VILLAGES_LIST } from './lib/mockData';
import { SkeletonMemberCard } from '../components/SkeletonLoader';

interface DirectoryViewProps {
  members: DirectoryMember[];
  isLoading: boolean;
  onSelectMember: (member: DirectoryMember) => void;
  onOpenAddMember: () => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  members,
  isLoading,
  onSelectMember,
  onOpenAddMember,
}) => {
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGotra, setSelectedGotra] = useState<string>('all');
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedBlood, setSelectedBlood] = useState<string>('all');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = m.fullName.toLowerCase().includes(query) || (m.fullNameGu && m.fullNameGu.includes(query));
        const matchesGotra = m.gotra.toLowerCase().includes(query);
        const matchesVillage = m.nativeVillage.toLowerCase().includes(query);
        const matchesCity = m.currentCity.toLowerCase().includes(query);
        const matchesOcc = m.occupation.toLowerCase().includes(query);
        const matchesPhone = m.phone.includes(query);

        if (!matchesName && !matchesGotra && !matchesVillage && !matchesCity && !matchesOcc && !matchesPhone) {
          return false;
        }
      }

      // Gotra filter
      if (selectedGotra !== 'all' && m.gotra !== selectedGotra) {
        return false;
      }

      // Village filter
      if (selectedVillage !== 'all' && m.nativeVillage !== selectedVillage) {
        return false;
      }

      // Blood filter
      if (selectedBlood !== 'all' && m.bloodGroup !== selectedBlood) {
        return false;
      }

      return true;
    });
  }, [members, searchTerm, selectedGotra, selectedVillage, selectedBlood]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGotra('all');
    setSelectedVillage('all');
    setSelectedBlood('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedGotra !== 'all' || selectedVillage !== 'all' || selectedBlood !== 'all';

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Top Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {t('directory.title')}
          </h2>
          <p className="text-xs text-slate-500">
            {filteredMembers.length} {t('directory.membersFound')}
          </p>
        </div>

        <button
          id="open-add-member-modal-btn"
          onClick={onOpenAddMember}
          className="flex items-center space-x-1.5 py-2 px-3.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-md transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('directory.addEntry')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          id="directory-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('directory.searchPlaceholder')}
          className="w-full pl-10 pr-9 py-2.5 bg-white text-xs rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Advanced Filter Chips Bar */}
      <div className="space-y-2">
        {/* Gotra Filter Scrollable Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            id="filter-gotra-all"
            onClick={() => setSelectedGotra('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedGotra === 'all'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t('directory.filterAll')}
          </button>

          {GOTRAS_LIST.slice(0, 6).map((g) => (
            <button
              key={g}
              id={`filter-gotra-${g.split(' ')[0]}`}
              onClick={() => setSelectedGotra(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedGotra === g
                  ? 'bg-orange-600 text-white font-bold shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Village & Blood Group Selectors Row */}
        <div className="grid grid-cols-2 gap-2">
          <select
            id="directory-village-filter"
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white text-xs rounded-xl border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">📍 {t('directory.filterVillage')}: All</option>
            {VILLAGES_LIST.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <select
            id="directory-blood-filter"
            value={selectedBlood}
            onChange={(e) => setSelectedBlood(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-white text-xs rounded-xl border border-slate-200 text-slate-700 font-medium focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">🩸 {t('directory.filterBlood')}: All</option>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-orange-50/80 px-3 py-1.5 rounded-xl border border-orange-200 text-xs text-orange-900">
          <span>Active filters applied</span>
          <button
            onClick={clearFilters}
            className="font-bold underline hover:text-orange-700"
          >
            {t('directory.clearFilters')}
          </button>
        </div>
      )}

      {/* Member Cards List */}
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonMemberCard />
          <SkeletonMemberCard />
          <SkeletonMemberCard />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">{t('directory.noResults')}</h3>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl shadow"
          >
            {t('directory.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMembers.map((member) => {
            const phoneNum = member.phone.replace(/[^0-9+]/g, '');
            const waNum = member.whatsapp.replace(/[^0-9]/g, '');
            const waText = encodeURIComponent(
              `Jay Shree Krishna ${member.fullName}, connecting via Samaj Setu App.`
            );

            return (
              <div
                key={member.id}
                id={`member-card-${member.id}`}
                className="bg-white rounded-3xl p-4 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition flex flex-col space-y-3"
              >
                {/* Header: Avatar, Name, Gotra */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => onSelectMember(member)}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={member.fullName}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-sm"
                      />
                      {member.isVerified && (
                        <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-500 text-white rounded-full border border-white">
                          <ShieldCheck className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {i18n.language === 'gu' && member.fullNameGu ? member.fullNameGu : member.fullName}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {member.occupation}
                      </p>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-900 px-2 py-0.5 rounded-md">
                          {member.gotra}
                        </span>
                        <span className="text-[10px] font-bold bg-red-50 text-red-700 px-1.5 py-0.5 rounded-md flex items-center space-x-0.5">
                          <Heart className="w-2.5 h-2.5 fill-current text-red-500" />
                          <span>{member.bloodGroup}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-300 hover:text-slate-600 pl-2">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Village / City Location */}
                <div
                  className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 cursor-pointer"
                  onClick={() => onSelectMember(member)}
                >
                  <div className="flex items-center space-x-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="truncate">વતન: <strong>{member.nativeVillage.split(' ')[0]}</strong></span>
                  </div>
                  <div className="flex items-center space-x-1 truncate">
                    <Building className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{member.currentCity.split(' ')[0]}</span>
                  </div>
                </div>

                {/* CRITICAL ACTION BUTTONS: Call & WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    id={`call-member-btn-${member.id}`}
                    href={`tel:${phoneNum}`}
                    className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('directory.call')}</span>
                  </a>

                  <a
                    id={`whatsapp-member-btn-${member.id}`}
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
