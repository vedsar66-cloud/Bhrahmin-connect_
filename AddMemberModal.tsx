import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Phone, MapPin, Heart, Briefcase, Plus, Trash2 } from 'lucide-react';
import { DirectoryMember, BloodGroup, FamilyMember } from '../types';
import { GOTRAS_LIST, VILLAGES_LIST } from '../lib/mockData';
import { AvatarUpload } from './AvatarUpload';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: DirectoryMember) => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAddMember }) => {
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [fullNameGu, setFullNameGu] = useState('');
  const [gotra, setGotra] = useState<string>(GOTRAS_LIST[0]);
  const [nativeVillage, setNativeVillage] = useState<string>(VILLAGES_LIST[0]);
  const [currentCity, setCurrentCity] = useState('Ahmedabad (અમદાવાદ)');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('+91');
  const [whatsapp, setWhatsapp] = useState('+91');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isDonor, setIsDonor] = useState(true);

  // Family members dynamic list
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newFamName, setNewFamName] = useState('');
  const [newFamRel, setNewFamRel] = useState('Spouse (પત્ની/પતિ)');
  const [newFamAge, setNewFamAge] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  const addFamilyMemberItem = () => {
    if (!newFamName.trim()) return;
    setFamilyMembers([
      ...familyMembers,
      {
        id: `fam-${Date.now()}`,
        name: newFamName,
        relation: newFamRel,
        age: newFamAge,
      },
    ]);
    setNewFamName('');
    setNewFamAge(undefined);
  };

  const removeFamilyMemberItem = (id: string) => {
    setFamilyMembers(familyMembers.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMember: DirectoryMember = {
      id: `mem-${Date.now()}`,
      fullName,
      fullNameGu: fullNameGu || undefined,
      gotra,
      nativeVillage,
      currentCity,
      bloodGroup,
      phone,
      whatsapp: whatsapp || phone,
      occupation: occupation || 'Professional',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      familyCount: familyMembers.length + 1,
      isVerified: true,
      isDonor,
      bio,
      address,
      familyMembers,
    };

    onAddMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#1E3A8A] p-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              {t('directory.addEntry')}
            </h2>
            <p className="text-xs text-blue-200">
              Add your family to the Samaj directory
            </p>
          </div>
          <button
            id="close-add-member-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          <AvatarUpload
            currentAvatarUrl={avatarUrl}
            onAvatarChange={setAvatarUrl}
            label="Family Head Photo (Auto <100KB compression)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name (English) *
              </label>
              <input
                id="add-member-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Nileshbhai K. Joshi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                પૂરું નામ (ગુજરાતીમાં)
              </label>
              <input
                id="add-member-fullname-gu"
                type="text"
                value={fullNameGu}
                onChange={(e) => setFullNameGu(e.target.value)}
                placeholder="દા.ત. નીલેશભાઈ કે. જોષી"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('directory.gotra')} *
              </label>
              <select
                id="add-member-gotra"
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {GOTRAS_LIST.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('directory.filterBlood')} *
              </label>
              <select
                id="add-member-blood"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 text-xs font-bold text-red-700 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
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
                {t('directory.nativeVillage')} *
              </label>
              <select
                id="add-member-village"
                value={nativeVillage}
                onChange={(e) => setNativeVillage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {VILLAGES_LIST.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('directory.currentCity')} *
              </label>
              <input
                id="add-member-city"
                type="text"
                required
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                placeholder="Current City"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <input
                id="add-member-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Number *
              </label>
              <input
                id="add-member-whatsapp"
                type="tel"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('directory.occupation')}
            </label>
            <input
              id="add-member-occ"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Chartered Accountant, Textile Business"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          {/* Family Members Sub-section */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <label className="block text-xs font-bold text-slate-800">
              Family Members / પરિવારના સભ્યો
            </label>

            {familyMembers.map((fam) => (
              <div key={fam.id} className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{fam.name}</span>
                  <span className="text-slate-500 text-[10px] ml-1.5">({fam.relation})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFamilyMemberItem(fam.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <div className="grid grid-cols-3 gap-2 pt-1">
              <input
                type="text"
                value={newFamName}
                onChange={(e) => setNewFamName(e.target.value)}
                placeholder="Member name"
                className="col-span-2 px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
              />
              <button
                type="button"
                onClick={addFamilyMemberItem}
                className="px-2 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              id="donor-consent-checkbox"
              type="checkbox"
              checked={isDonor}
              onChange={(e) => setIsDonor(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
            />
            <label htmlFor="donor-consent-checkbox" className="text-xs text-slate-700 font-medium">
              List me as an available blood donor in the Emergency Blood Bank
            </label>
          </div>

          <button
            id="submit-new-member-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition active:scale-[0.98]"
          >
            {t('common.save')}
          </button>
        </form>

      </div>
    </div>
  );
};
