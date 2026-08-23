import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Briefcase, Tag, Phone, Globe, MapPin, Sparkles } from 'lucide-react';
import { Business, BusinessCategory } from '../types';
import { VILLAGES_LIST } from './lib/mockData';
import { AvatarUpload } from './AvatarUpload';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterBusiness: (biz: Business) => void;
}

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  isOpen,
  onClose,
  onRegisterBusiness,
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [nameGu, setNameGu] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('retail');
  const [ownerName, setOwnerName] = useState('');
  const [nativeVillage, setNativeVillage] = useState<string>(VILLAGES_LIST[0]);
  const [city, setCity] = useState('Ahmedabad (અમદાવાદ)');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('+91');
  const [whatsapp, setWhatsapp] = useState('+91');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionGu, setDescriptionGu] = useState('');
  const [specialOffer, setSpecialOffer] = useState('Special 10% discount for community members');
  const [specialOfferGu, setSpecialOfferGu] = useState('સમાજના સભ્યો માટે વિશેષ ૧૦% ડિસ્કાઉન્ટ');
  const [imageUrl, setImageUrl] = useState('');
  const [estYear, setEstYear] = useState<number>(2020);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBiz: Business = {
      id: `biz-${Date.now()}`,
      name,
      nameGu: nameGu || undefined,
      category,
      ownerName,
      nativeVillage,
      city,
      address,
      phone,
      whatsapp: whatsapp || phone,
      website: website || undefined,
      description,
      descriptionGu: descriptionGu || undefined,
      specialOffer,
      specialOfferGu: specialOfferGu || undefined,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80',
      isVerified: true,
      establishedYear: estYear,
    };

    onRegisterBusiness(newBiz);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {t('business.registerBusiness')}
              </h2>
              <p className="text-xs text-blue-200">
                Showcase your products & services to the whole community
              </p>
            </div>
          </div>
          <button
            id="close-register-biz-btn"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1">
          
          <AvatarUpload
            currentAvatarUrl={imageUrl}
            onAvatarChange={setImageUrl}
            label="Business Banner / Photo (Auto <100KB compression)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Name (English) *
              </label>
              <input
                id="biz-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radhe Textiles"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                વેપારનું નામ (ગુજરાતીમાં)
              </label>
              <input
                id="biz-name-gu-input"
                type="text"
                value={nameGu}
                onChange={(e) => setNameGu(e.target.value)}
                placeholder="દા.ત. રાધે ટેક્સટાઇલ્સ"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                id="biz-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="retail">Retail & Shops</option>
                <option value="services">Services & Consulting</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="food">Food & Catering</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="it">IT & Digital</option>
                <option value="realestate">Real Estate</option>
                <option value="textiles">Textiles & Sarees</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Owner / Founder *
              </label>
              <input
                id="biz-owner-input"
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Owner Name"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Owner Native Village (વતન) *
              </label>
              <select
                id="biz-village-select"
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
                Business City *
              </label>
              <input
                id="biz-city-input"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Surat, Rajkot"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone *
              </label>
              <input
                id="biz-phone-input"
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
                WhatsApp *
              </label>
              <input
                id="biz-whatsapp-input"
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
              Website or Social Link (Optional)
            </label>
            <input
              id="biz-website-input"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://mybusiness.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          {/* Samaj Special Discount Offer */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Samaj Member Exclusive Discount / Offer</span>
            </div>
            <input
              id="biz-offer-input"
              type="text"
              value={specialOffer}
              onChange={(e) => setSpecialOffer(e.target.value)}
              placeholder="e.g. Flat 10% discount on first purchase"
              className="w-full px-3 py-2 text-xs rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Shop / Office Address *
            </label>
            <textarea
              id="biz-address-input"
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full shop / office address"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Products & Services Description *
            </label>
            <textarea
              id="biz-desc-input"
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your business offerings"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <button
            id="submit-register-biz-btn"
            type="submit"
            className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition active:scale-[0.98]"
          >
            {t('business.registerBusiness')}
          </button>
        </form>

      </div>
    </div>
  );
};
