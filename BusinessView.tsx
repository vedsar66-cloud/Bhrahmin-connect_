import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Briefcase, 
  PlusCircle, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Tag,
  Building2
} from 'lucide-react';
import { Business, BusinessCategory } from '../types';
import { SkeletonBusinessCard } from './components/SkeletonLoader';

interface BusinessViewProps {
  businesses: Business[];
  isLoading: boolean;
  onOpenRegisterBusiness: () => void;
}

export const BusinessView: React.FC<BusinessViewProps> = ({
  businesses,
  isLoading,
  onOpenRegisterBusiness,
}) => {
  const { t, i18n } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory>('all');

  const categories: { id: BusinessCategory; label: string }[] = [
    { id: 'all', label: t('business.categories.all') },
    { id: 'retail', label: t('business.categories.retail') },
    { id: 'services', label: t('business.categories.services') },
    { id: 'textiles', label: t('business.categories.textiles') },
    { id: 'manufacturing', label: t('business.categories.manufacturing') },
    { id: 'healthcare', label: t('business.categories.healthcare') },
    { id: 'it', label: t('business.categories.it') },
    { id: 'food', label: t('business.categories.food') },
    { id: 'education', label: t('business.categories.education') },
    { id: 'realestate', label: t('business.categories.realestate') },
    { id: 'other', label: t('business.categories.other') },
  ];

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => {
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(query) || (b.nameGu && b.nameGu.includes(query));
        const matchesOwner = b.ownerName.toLowerCase().includes(query);
        const matchesDesc = b.description.toLowerCase().includes(query) || (b.descriptionGu && b.descriptionGu.includes(query));
        const matchesCity = b.city.toLowerCase().includes(query);
        const matchesVillage = b.nativeVillage.toLowerCase().includes(query);

        if (!matchesName && !matchesOwner && !matchesDesc && !matchesCity && !matchesVillage) {
          return false;
        }
      }

      return true;
    });
  }, [businesses, selectedCategory, searchTerm]);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-300">
      
      {/* Top Header & Register Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {t('business.title')}
          </h2>
          <p className="text-xs text-slate-500">
            {filteredBusinesses.length} {t('home.statsBusinesses')}
          </p>
        </div>

        <button
          id="open-register-biz-modal-btn"
          onClick={onOpenRegisterBusiness}
          className="flex items-center space-x-1.5 py-2 px-3.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-bold text-xs rounded-2xl shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('business.registerBusiness')}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          id="business-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('business.searchPlaceholder')}
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

      {/* Category Filter Horizontal Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`biz-category-btn-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-orange-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Business Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4">
          <SkeletonBusinessCard />
          <SkeletonBusinessCard />
        </div>
      ) : filteredBusinesses.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">{t('business.noBusinesses')}</h3>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl shadow"
          >
            Show All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBusinesses.map((biz) => {
            const phoneNum = biz.phone.replace(/[^0-9+]/g, '');
            const waNum = biz.whatsapp.replace(/[^0-9]/g, '');
            const waText = encodeURIComponent(
              `Jay Shree Krishna ${biz.ownerName}, I saw your business *${biz.name}* on the Samaj Setu platform.`
            );

            return (
              <div
                key={biz.id}
                id={`business-card-${biz.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-md transition flex flex-col"
              >
                {/* Photo & Badge */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={biz.imageUrl || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=80'}
                    alt={biz.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                    {biz.category}
                  </span>
                  {biz.establishedYear && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/90 backdrop-blur-md text-slate-700 text-[10px] font-bold rounded-lg shadow-sm">
                      {t('business.established')} {biz.establishedYear}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">
                          {i18n.language === 'gu' && biz.nameGu ? biz.nameGu : biz.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {t('business.owner')}: <strong className="text-slate-700">{biz.ownerName}</strong> (વતન: {biz.nativeVillage.split(' ')[0]})
                        </p>
                      </div>
                      {biz.isVerified && (
                        <span className="p-1 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0" title="Verified Samaj Business">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {i18n.language === 'gu' && biz.descriptionGu ? biz.descriptionGu : biz.description}
                    </p>

                    {/* Samaj Special Discount Banner */}
                    {biz.specialOffer && (
                      <div className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 flex items-start space-x-2 text-xs text-amber-900 font-semibold shadow-xs">
                        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          {i18n.language === 'gu' && biz.specialOfferGu ? biz.specialOfferGu : biz.specialOffer}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-1 text-[11px] text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{biz.address}, {biz.city}</span>
                    </div>
                  </div>

                  {/* CRITICAL ACTION BUTTONS: Call & WhatsApp (+ Website if available) */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                    <a
                      id={`call-biz-btn-${biz.id}`}
                      href={`tel:${phoneNum}`}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 active:scale-95 text-white font-bold text-xs shadow-sm transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('directory.call')}</span>
                    </a>

                    <a
                      id={`whatsapp-biz-btn-${biz.id}`}
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
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
