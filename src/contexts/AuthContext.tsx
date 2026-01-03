import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  maternalStage: 'pre-pregnancy' | 'pregnancy' | 'postpartum' | null;
  pregnancyWeek: number | null;
  riskLevel: 'low' | 'medium' | 'high';
  age: number | null;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'age' | 'pregnancyWeek' | 'riskLevel' | 'maternalStage'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string, email: string) => {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      email: email,
      name: data.name || '',
      maternalStage: null as 'pre-pregnancy' | 'pregnancy' | 'postpartum' | null, // Not in DB schema, use pregnancy_week to infer
      pregnancyWeek: data.pregnancy_week,
      riskLevel: (data.risk_level || 'low') as 'low' | 'medium' | 'high',
      age: data.age,
      createdAt: new Date(data.created_at),
    };
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id, session.user.email || '');
            if (profile) {
              // Infer maternalStage from pregnancyWeek
              if (profile.pregnancyWeek && profile.pregnancyWeek > 0) {
                profile.maternalStage = 'pregnancy';
              }
              setUser(profile);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id, session.user.email || '').then(profile => {
          if (profile) {
            // Infer maternalStage from pregnancyWeek
            if (profile.pregnancyWeek && profile.pregnancyWeek > 0) {
              profile.maternalStage = 'pregnancy';
            }
            setUser(profile);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: name,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists' };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'age' | 'pregnancyWeek' | 'riskLevel' | 'maternalStage'>>) => {
    if (!session?.user) return;

    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.pregnancyWeek !== undefined) dbUpdates.pregnancy_week = updates.pregnancyWeek;
    if (updates.riskLevel !== undefined) dbUpdates.risk_level = updates.riskLevel;

    if (Object.keys(dbUpdates).length > 0) {
      const { error } = await supabase
        .from('users_profile')
        .update(dbUpdates)
        .eq('id', session.user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }
    }

    // Update local user state (including maternalStage which is frontend-only)
    if (user) {
      setUser({
        ...user,
        ...updates,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
