export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type Gotra = 
  | 'Kashyap (કશ્યપ)'
  | 'Vashistha (વશિષ્ઠ)'
  | 'Bharadwaj (ભારદ્વાજ)'
  | 'Gautam (ગૌતમ)'
  | 'Jamadagni (જમદગ્નિ)'
  | 'Vishwamitra (વિશ્વામિત્ર)'
  | 'Agastya (અગસ્ત્ય)'
  | 'Sandilya (શાંડિલ્ય)'
  | 'Parashar (પરાશર)'
  | 'Kaushik (કૌશિક)'
  | 'Harita (હરિતા)'
  | 'Garg (ગાર્ગ્ય)'
  | 'Atri (અત્રિ)'
  | 'Other (અન્ય)';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
  bloodGroup?: BloodGroup;
  education?: string;
  occupation?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  fullNameGu?: string;
  gotra: Gotra | string;
  nativeVillage: string; // વતન
  currentCity: string;
  bloodGroup: BloodGroup;
  phone: string;
  whatsapp: string;
  occupation: string;
  companyName?: string;
  bio?: string;
  avatarUrl?: string;
  isDonor: boolean;
  lastDonationDate?: string;
  isVerified: boolean;
  role?: 'member' | 'admin' | 'volunteer';
  familyMembers?: FamilyMember[];
  privacy: {
    showPhone: boolean;
    showWhatsapp: boolean;
    allowDirectContact: boolean;
  };
  createdAt: string;
}

export interface DirectoryMember {
  id: string;
  fullName: string;
  fullNameGu?: string;
  gotra: string;
  nativeVillage: string;
  currentCity: string;
  bloodGroup: BloodGroup;
  phone: string;
  whatsapp: string;
  occupation: string;
  avatarUrl?: string;
  familyCount: number;
  isVerified: boolean;
  isDonor: boolean;
  bio?: string;
  address?: string;
  familyMembers?: FamilyMember[];
}

export interface BloodDonor {
  id: string;
  fullName: string;
  fullNameGu?: string;
  bloodGroup: BloodGroup;
  currentCity: string;
  nativeVillage: string;
  phone: string;
  whatsapp: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  donationCount: number;
  isEmergencyReady: boolean;
  avatarUrl?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  contactName: string;
  contactPhone: string;
  whatsapp: string;
  urgency: 'critical' | 'high' | 'moderate';
  reason?: string;
  createdAt: string;
  isFulfilled: boolean;
}

export type BusinessCategory = 
  | 'all'
  | 'retail'
  | 'services'
  | 'manufacturing'
  | 'food'
  | 'healthcare'
  | 'education'
  | 'it'
  | 'realestate'
  | 'textiles'
  | 'other';

export interface Business {
  id: string;
  name: string;
  nameGu?: string;
  category: BusinessCategory;
  ownerName: string;
  nativeVillage: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  website?: string;
  description: string;
  descriptionGu?: string;
  specialOffer?: string; // e.g. "Special 10% discount for community members"
  specialOfferGu?: string;
  imageUrl?: string;
  logoUrl?: string;
  isVerified: boolean;
  establishedYear?: number;
}

export interface Announcement {
  id: string;
  title: string;
  titleGu: string;
  description: string;
  descriptionGu: string;
  date: string;
  location?: string;
  category: 'event' | 'blood_camp' | 'matrimonial' | 'youth' | 'general';
  isUrgent?: boolean;
  imageUrl?: string;
  organizer: string;
}

export type ActiveTab = 'home' | 'directory' | 'blood' | 'business' | 'profile';
