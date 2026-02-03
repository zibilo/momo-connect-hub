export type UserRole = 'user' | 'creator' | 'admin';

export type KYCStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  role: UserRole;
  kyc_status: KYCStatus;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  location?: string;
  social_links?: {
    twitter?: string;
    telegram?: string;
    whatsapp?: string;
  };
  preferences?: {
    notifications: boolean;
    email_updates: boolean;
    language: string;
  };
}

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: 'passport' | 'national_id' | 'driver_license';
  document_url: string;
  selfie_url?: string;
  status: KYCStatus;
  rejection_reason?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  display_name: string;
  description?: string;
  avatar_url?: string;
  total_tickets: number;
  total_sales: number;
  success_rate: number;
  rating: number;
  is_featured: boolean;
  created_at: string;
}
