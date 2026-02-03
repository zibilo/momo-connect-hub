import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser, UserRole, KYCStatus } from '@/types/user';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const createAppUser = (userId: string, userEmail?: string, profileData?: Record<string, unknown> | null): AppUser => ({
    id: profileData?.id as string || userId,
    email: userEmail || '',
    full_name: (profileData?.full_name as string) || '',
    phone_number: (profileData?.phone_number as string) || null,
    role: 'user' as UserRole,
    kyc_status: 'pending' as KYCStatus,
    is_verified: false,
    created_at: (profileData?.created_at as string) || new Date().toISOString(),
    updated_at: (profileData?.updated_at as string) || new Date().toISOString(),
  });

  const fetchProfile = async (userId: string, userEmail?: string): Promise<void> => {
    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.warn('Profile fetch timeout - using default');
        setAppUser(createAppUser(userId, userEmail));
        resolve();
      }, 3000);
    });

    const fetchData = async (): Promise<void> => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        setAppUser(createAppUser(userId, userEmail, profileData));
      } catch {
        setAppUser(createAppUser(userId, userEmail));
      }
    };

    await Promise.race([fetchData(), timeout]);
  };

  useEffect(() => {
    let mounted = true;
    
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth timeout - forcing loading to false');
        setLoading(false);
      }
    }, 5000);

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Auth session error:', error);
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Auth init error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id, session.user.email);
        } else {
          setAppUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, appUser, session, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
