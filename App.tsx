import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveTab, DirectoryMember, BloodDonor, Business, Announcement, BloodRequest } from './types';
import { 
  INITIAL_DIRECTORY_MEMBERS, 
  INITIAL_BLOOD_DONORS, 
  INITIAL_BUSINESSES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_BLOOD_REQUESTS 
} from './lib/mockData';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { HomeView } from './HomeView';
import { DirectoryView } from './DirectoryView';
import { BloodBankView } from './BloodBankView';
import { BusinessView } from './BusinessView';
import { ProfileView } from './ProfileView';
import { AuthModal } from './AuthModal';
import { EmergencySOSModal } from './EmergencySOSModal';
import { MemberDetailModal } from './MemberDetailModal';
import { AddMemberModal } from './AddMemberModal';
import { RegisterBusinessModal } from './RegisterBusinessModal';
import { PWAInstallBanner } from './PWAInstallBanner';
import { useAuth } from './useAuth';
import { getSupabase } from './lib/supabase';

export default function App() {
  const { t } = useTranslation();
  const { profile, isConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveTab;
    if (tabParam && ['home', 'directory', 'blood', 'business', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  const [members, setMembers] = useState<DirectoryMember[]>(() => {
    const saved = localStorage.getItem('samaj_directory_members');
    return saved ? JSON.parse(saved) : INITIAL_DIRECTORY_MEMBERS;
  });

  const [donors, setDonors] = useState<BloodDonor[]>(() => {
    const saved = localStorage.getItem('samaj_blood_donors');
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_DONORS;
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('samaj_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>(() => {
    const saved = localStorage.getItem('samaj_blood_requests');
    return saved ? JSON.parse(saved) : INITIAL_BLOOD_REQUESTS;
  });

  const [announcements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [isLoading, setIsLoading] = useState(false);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRegisterBizOpen, setIsRegisterBizOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<DirectoryMember | null>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert(
        'To install Samaj Setu on your phone:\n- On Android Chrome: Tap menu ⋮ -> "Install app" or "Add to Home screen"\n- On iPhone Safari: Tap Share ⎙ -> "Add to Home Screen"'
      );
    }
  };

  const handleAddMember = async (newMember: DirectoryMember) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    localStorage.setItem('samaj_directory_members', JSON.stringify(updated));

    if (newMember.isDonor) {
      const newDonor: BloodDonor = {
        id: `donor-${Date.now()}`,
        fullName: newMember.fullName,
        fullNameGu: newMember.fullNameGu,
        bloodGroup: newMember.bloodGroup,
        currentCity: newMember.currentCity,
        nativeVillage: newMember.nativeVillage,
        phone: newMember.phone,
        whatsapp: newMember.whatsapp,
        isAvailable: true,
        donationCount: 1,
        isEmergencyReady: true,
        avatarUrl: newMember.avatarUrl,
      };
      const updatedDonors = [newDonor, ...donors];
      setDonors(updatedDonors);
      localStorage.setItem('samaj_blood_donors', JSON.stringify(updatedDonors));
    }

    const supabase = getSupabase();
    if (supabase && isConfigured) {
      try {
        await supabase.from('directory_members').insert({
          full_name: newMember.fullName,
          full_name_gu: newMember.fullNameGu,
          gotra: newMember.gotra,
          native_village: newMember.nativeVillage,
          current_city: newMember.currentCity,
          blood_group: newMember.bloodGroup,
          phone: newMember.phone,
          whatsapp: newMember.whatsapp,
          occupation: newMember.occupation,
          avatar_url: newMember.avatarUrl,
          family_count: newMember.familyCount,
          is_verified: newMember.isVerified,
          is_donor: newMember.isDonor,
          bio: newMember.bio,
          address: newMember.address,
          family_members: newMember.familyMembers,
        });
      } catch (e) {
        console.warn('Supabase directory insert warning:', e);
      }
    }
  };

  const handleRegisterBusiness = async (newBiz: Business) => {
    const updated = [newBiz, ...businesses];
    setBusinesses(updated);
    localStorage.setItem('samaj_businesses', JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase && isConfigured) {
      try {
        await supabase.from('businesses').insert({
          name: newBiz.name,
          name_gu: newBiz.nameGu,
          category: newBiz.category,
          owner_name: newBiz.ownerName,
          native_village: newBiz.nativeVillage,
          city: newBiz.city,
          address: newBiz.address,
          phone: newBiz.phone,
          whatsapp: newBiz.whatsapp,
          website: newBiz.website,
          description: newBiz.description,
          description_gu: newBiz.descriptionGu,
          special_offer: newBiz.specialOffer,
          special_offer_gu: newBiz.specialOfferGu,
          image_url: newBiz.imageUrl,
          is_verified: newBiz.isVerified,
          established_year: newBiz.establishedYear,
        });
      } catch (e) {
        console.warn('Supabase business insert warning:', e);
      }
    }
  };

  const handleSubmitBloodRequest = async (newReq: BloodRequest) => {
    const updated = [newReq, ...bloodRequests];
    setBloodRequests(updated);
    localStorage.setItem('samaj_blood_requests', JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase && isConfigured) {
      try {
        await supabase.from('blood_requests').insert({
          patient_name: newReq.patientName,
          blood_group: newReq.bloodGroup,
          units_required: newReq.unitsRequired,
          hospital_name: newReq.hospitalName,
          hospital_address: newReq.hospitalAddress,
          city: newReq.city,
          contact_name: newReq.contactName,
          contact_phone: newReq.contactPhone,
          whatsapp: newReq.whatsapp,
          urgency: newReq.urgency,
          reason: newReq.reason,
          is_fulfilled: false,
        });
      } catch (e) {
        console.warn('Supabase blood request insert warning:', e);
      }
    }
  };

  const urgentBloodCount = bloodRequests.filter((r) => !r.isFulfilled).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Navbar
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        deferredPrompt={deferredPrompt}
        onInstallPWA={handleInstallPWA}
      />

      <main className="flex-1 max-w-lg w-full mx-auto p-3 sm:p-4">
        <PWAInstallBanner
          deferredPrompt={deferredPrompt}
          onInstall={handleInstallPWA}
        />

        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onOpenSOS={() => setIsSOSOpen(true)}
            announcements={announcements}
            bloodRequests={bloodRequests}
            stats={{
              membersCount: members.length,
              donorsCount: donors.length,
              businessesCount: businesses.length,
              helpedCount: 148,
            }}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryView
            members={members}
            isLoading={isLoading}
            onSelectMember={(m) => setSelectedMember(m)}
            onOpenAddMember={() => setIsAddMemberOpen(true)}
          />
        )}

        {activeTab === 'blood' && (
          <BloodBankView
            donors={donors}
            bloodRequests={bloodRequests}
            isLoading={isLoading}
            onOpenSOS={() => setIsSOSOpen(true)}
            onRegisterDonor={() => {
              if (profile) {
                const newDonor: BloodDonor = {
                  id: `donor-${Date.now()}`,
                  fullName: profile.fullName,
                  fullNameGu: profile.fullNameGu,
                  bloodGroup: profile.bloodGroup,
                  currentCity: profile.currentCity,
                  nativeVillage: profile.nativeVillage,
                  phone: profile.phone,
                  whatsapp: profile.whatsapp,
                  isAvailable: true,
                  donationCount: 1,
                  isEmergencyReady: true,
                  avatarUrl: profile.avatarUrl,
                };
                setDonors([newDonor, ...donors]);
              }
            }}
          />
        )}

        {activeTab === 'business' && (
          <BusinessView
            businesses={businesses}
            isLoading={isLoading}
            onOpenRegisterBusiness={() => setIsRegisterBizOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            onOpenAuth={() => setIsAuthOpen(true)}
            deferredPrompt={deferredPrompt}
            onInstallPWA={handleInstallPWA}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        urgentBloodCount={urgentBloodCount}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        onSubmitRequest={handleSubmitBloodRequest}
      />

      <MemberDetailModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAddMember={handleAddMember}
      />

      <RegisterBusinessModal
        isOpen={isRegisterBizOpen}
        onClose={() => setIsRegisterBizOpen(false)}
        onRegisterBusiness={handleRegisterBusiness}
      />
    </div>
  );
}
