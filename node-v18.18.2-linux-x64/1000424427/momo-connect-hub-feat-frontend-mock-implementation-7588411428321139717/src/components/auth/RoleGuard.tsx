import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
// import { useUserProfile } from '@/hooks/useUserProfile'; // This hook would need to be created

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('user' | 'creator' | 'admin')[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  // const { userProfile, isLoading } = useUserProfile(user?.id); // Placeholder for fetching user profile with role
  const isLoading = true; // Placeholder
  const userProfile = { role: 'user' }; // Placeholder

  if (isLoading) {
    // You can return a loading spinner here
    return <div>Loading...</div>;
  }

  if (!userProfile || !allowedRoles.includes(userProfile.role as any)) {
    // Redirect to an unauthorized page or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
