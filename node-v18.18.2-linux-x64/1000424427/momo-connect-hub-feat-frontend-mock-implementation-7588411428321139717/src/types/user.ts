export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  role: 'user' | 'creator' | 'admin';
  kyc_status: 'pending' | 'approved' | 'rejected';
}

export interface KYCSubmission {
  id: string;
  user_id: string;
  document_type: 'cni';
  document_front_url: string;
  document_back_url: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
