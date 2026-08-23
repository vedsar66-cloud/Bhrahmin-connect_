import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, BloodGroup } from '../types';
import { getSupabase, getSupabaseConfig } from './lib/supabase';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, pass: string, profileData: Partial<UserProfile>) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInAsGuest: () => void;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_PROFILE: UserProfile = {
  id: 'usr-demo-001',
  email: 'harshil.joshi@example.com',
  fullName: 'Harshil J. Joshi',
  fullNameGu: 'હર્ષિલ જે. જોષી',
  gotra: 'Kashyap (કશ્યપ)',
  nativeVillage: 'Gondal (ગોંડલ)',
  currentCity: 'Ahmedabad (અમદાવાદ)',
  bloodGroup: 'O+',
  phone: '+919876543210',
  whatsapp: '+919876543210',
  occupation: 'Software Engineer & Community Lead',
  bio: 'Active member of Saurashtra Samaj. Keen on youth digital empowerment.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  isDonor: true,
  lastDonationDate: '2025-11-15',
  isVerified: true,
  role: 'admin',
  familyMembers: [
    { id: 'f-1', name: 'Jayantbhai Joshi', relation: 'Father (પિતા)', age: 62, bloodGroup: 'O+' },
    { id: 'f-2', name: 'Bhavnaben Joshi', relation: 'Mother (માતા)', age: 58, bloodGroup: 'B+' },
    { id: 'f-3', name: 'Pooja Joshi', relation: 'Wife (પત્ની)', age: 29, bloodGroup: 'A+' },
  ],
  privacy: {
    showPhone: true,
    showWhatsapp: true,
    allowDirectContact: true,
  },
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isConfigured } = getSupabaseConfig();

  useEffect(() => {
    // Check saved session
    const initAuth = async () => {
      setIsLoading(true);
      const supabase = getSupabase();

      if (supabase && isConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            // Fetch profile from supabase
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (data && !error) {
              setProfile({
                id: data.id,
                email: data.email || session.user.email || '',
                fullName: data.full_name,
                fullNameGu: data.full_name_gu,
                gotra: data.gotra,
                nativeVillage: data.native_village,
                currentCity: data.current_city,
                bloodGroup: data.blood_group as BloodGroup,
                phone: data.phone || '',
                whatsapp: data.whatsapp || '',
                occupation: data.occupation || '',
                bio: data.bio || '',
                avatarUrl: data.avatar_url,
                isDonor: data.is_donor ?? false,
                lastDonationDate: data.last_donation_date,
                isVerified: data.is_verified ?? false,
                role: data.role || 'member',
                familyMembers: data.family_members || [],
                privacy: data.privacy || { showPhone: true, showWhatsapp: true, allowDirectContact: true },
                createdAt: data.created_at || new Date().toISOString(),
              });
            }
          }
        } catch (e) {
          console.warn('Error fetching Supabase session:', e);
        }
      } else {
        // Local mode
        const savedProfile = localStorage.getItem('samaj_current_profile');
        if (savedProfile) {
          try {
            const parsed = JSON.parse(savedProfile);
            setProfile(parsed);
            setUser({ id: parsed.id, email: parsed.email });
          } catch (e) {}
        } else {
          // Default to demo user so preview is immediately fully functional and rich
          setProfile(DEMO_USER_PROFILE);
          setUser({ id: DEMO_USER_PROFILE.id, email: DEMO_USER_PROFILE.email });
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [isConfigured]);

  const signInWithEmail = async (email: string, pass: string) => {
    const supabase = getSupabase();
    if (supabase && isConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { error: error.message };
      if (data.user) {
        setUser(data.user);
        // fetch profile
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (prof) {
          setProfile({
            id: prof.id,
            email: prof.email,
            fullName: prof.full_name,
            gotra: prof.gotra,
            nativeVillage: prof.native_village,
            currentCity: prof.current_city,
            bloodGroup: prof.blood_group,
            phone: prof.phone,
            whatsapp: prof.whatsapp,
            occupation: prof.occupation,
            avatarUrl: prof.avatar_url,
            isDonor: prof.is_donor,
            isVerified: prof.is_verified,
            familyMembers: prof.family_members || [],
            privacy: prof.privacy || { showPhone: true, showWhatsapp: true, allowDirectContact: true },
            createdAt: prof.created_at,
          });
        }
      }
      return {};
    } else {
      // Local demo mode
      const mockUser = {
        ...DEMO_USER_PROFILE,
        email,
        fullName: email.split('@')[0],
      };
      setProfile(mockUser);
      setUser({ id: mockUser.id, email });
      localStorage.setItem('samaj_current_profile', JSON.stringify(mockUser));
      return {};
    }
  };

  const signUpWithEmail = async (email: string, pass: string, profileData: Partial<UserProfile>) => {
    const supabase = getSupabase();
    if (supabase && isConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: profileData.fullName,
            gotra: profileData.gotra,
          },
        },
      });
      if (error) return { error: error.message };

      if (data.user) {
        const newProf: UserProfile = {
          id: data.user.id,
          email,
          fullName: profileData.fullName || '',
          fullNameGu: profileData.fullNameGu,
          gotra: profileData.gotra || 'Kashyap (કશ્યપ)',
          nativeVillage: profileData.nativeVillage || 'Rajkot (રાજકોટ)',
          currentCity: profileData.currentCity || 'Ahmedabad (અમદાવાદ)',
          bloodGroup: (profileData.bloodGroup as BloodGroup) || 'O+',
          phone: profileData.phone || '',
          whatsapp: profileData.whatsapp || profileData.phone || '',
          occupation: profileData.occupation || '',
          avatarUrl: profileData.avatarUrl,
          isDonor: profileData.isDonor ?? false,
          isVerified: false,
          role: 'member',
          familyMembers: profileData.familyMembers || [],
          privacy: { showPhone: true, showWhatsapp: true, allowDirectContact: true },
          createdAt: new Date().toISOString(),
        };

        await supabase.from('profiles').insert({
          id: newProf.id,
          full_name: newProf.fullName,
          full_name_gu: newProf.fullNameGu,
          email: newProf.email,
          gotra: newProf.gotra,
          native_village: newProf.nativeVillage,
          current_city: newProf.currentCity,
          blood_group: newProf.bloodGroup,
          phone: newProf.phone,
          whatsapp: newProf.whatsapp,
          occupation: newProf.occupation,
          avatar_url: newProf.avatarUrl,
          is_donor: newProf.isDonor,
          is_verified: false,
          privacy: newProf.privacy,
        });

        setUser(data.user);
        setProfile(newProf);
      }
      return {};
    } else {
      const newProf: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullName: profileData.fullName || 'Samaj Member',
        fullNameGu: profileData.fullNameGu,
        gotra: profileData.gotra || 'Kashyap (કશ્યપ)',
        nativeVillage: profileData.nativeVillage || 'Rajkot (રાજકોટ)',
        currentCity: profileData.currentCity || 'Ahmedabad (અમદાવાદ)',
        bloodGroup: (profileData.bloodGroup as BloodGroup) || 'O+',
        phone: profileData.phone || '+919876543210',
        whatsapp: profileData.whatsapp || '+919876543210',
        occupation: profileData.occupation || 'Business',
        avatarUrl: profileData.avatarUrl,
        isDonor: profileData.isDonor ?? false,
        isVerified: true,
        role: 'member',
        familyMembers: profileData.familyMembers || [],
        privacy: { showPhone: true, showWhatsapp: true, allowDirectContact: true },
        createdAt: new Date().toISOString(),
      };
      setProfile(newProf);
      setUser({ id: newProf.id, email });
      localStorage.setItem('samaj_current_profile', JSON.stringify(newProf));
      return {};
    }
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabase();
    if (supabase && isConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) return { error: error.message };
      return {};
    } else {
      // In local mode, simulate instant Google sign-in
      const googleUser: UserProfile = {
        ...DEMO_USER_PROFILE,
        id: `usr-google-${Date.now()}`,
        email: 'member.google@gmail.com',
        fullName: 'Bhavna K. Mehta',
        fullNameGu: 'ભાવના કે. મહેતા',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      };
      setProfile(googleUser);
      setUser({ id: googleUser.id, email: googleUser.email });
      localStorage.setItem('samaj_current_profile', JSON.stringify(googleUser));
      return {};
    }
  };

  const signInAsGuest = () => {
    setProfile(DEMO_USER_PROFILE);
    setUser({ id: DEMO_USER_PROFILE.id, email: DEMO_USER_PROFILE.email });
    localStorage.setItem('samaj_current_profile', JSON.stringify(DEMO_USER_PROFILE));
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase && isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('samaj_current_profile');
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return { success: false, error: 'Not authenticated' };

    const updated = { ...profile, ...data };
    setProfile(updated);
    localStorage.setItem('samaj_current_profile', JSON.stringify(updated));

    const supabase = getSupabase();
    if (supabase && isConfigured && user) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.fullName,
            full_name_gu: updated.fullNameGu,
            gotra: updated.gotra,
            native_village: updated.nativeVillage,
            current_city: updated.currentCity,
            blood_group: updated.bloodGroup,
            phone: updated.phone,
            whatsapp: updated.whatsapp,
            occupation: updated.occupation,
            bio: updated.bio,
            avatar_url: updated.avatarUrl,
            is_donor: updated.isDonor,
            privacy: updated.privacy,
            family_members: updated.familyMembers,
          })
          .eq('id', user.id);
      } catch (e: any) {
        console.warn('Supabase profile update warning:', e);
      }
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
