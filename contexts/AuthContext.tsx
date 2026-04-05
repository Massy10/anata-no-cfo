import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import type { User, CfoProfile } from '@/types';
import type { Session } from '@supabase/supabase-js';

type AppearanceMode = 'light' | 'dark' | 'system';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;
  appearanceMode: AppearanceMode;
  cfoProfile: CfoProfile | null;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  setIsOnboarded: (value: boolean) => void;
  setCfoProfile: (profile: CfoProfile) => void;
  setAppearanceMode: (mode: AppearanceMode) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  IS_ONBOARDED: '@anata_cfo_onboarded',
  CFO_PROFILE: '@anata_cfo_profile',
  APPEARANCE: '@anata_cfo_appearance',
  GUEST_USER: '@anata_cfo_guest_user',
} as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardedState, setIsOnboardedState] = useState(false);
  const [cfoProfileState, setCfoProfileState] = useState<CfoProfile | null>(null);
  const [appearanceModeState, setAppearanceModeState] = useState<AppearanceMode>('system');

  // Load persisted state on mount
  useEffect(() => {
    async function loadPersistedState() {
      try {
        const [onboarded, profile, appearance, guestUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.IS_ONBOARDED),
          AsyncStorage.getItem(STORAGE_KEYS.CFO_PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.APPEARANCE),
          AsyncStorage.getItem(STORAGE_KEYS.GUEST_USER),
        ]);
        if (onboarded === 'true') setIsOnboardedState(true);
        if (profile) setCfoProfileState(JSON.parse(profile));
        if (appearance) setAppearanceModeState(appearance as AppearanceMode);
        if (guestUser) setUser(JSON.parse(guestUser));
      } catch {
        // ignore storage errors
      }
    }
    loadPersistedState();
  }, []);

  // Listen for Supabase auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          if (data) {
            setUser(data as User);
          }
        } else {
          const guestUser = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_USER);
          if (!guestUser) {
            setUser(null);
          }
        }
        setIsLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!initialSession) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setIsOnboarded = useCallback((value: boolean) => {
    setIsOnboardedState(value);
    AsyncStorage.setItem(STORAGE_KEYS.IS_ONBOARDED, value ? 'true' : 'false');
  }, []);

  const setCfoProfile = useCallback((profile: CfoProfile) => {
    setCfoProfileState(profile);
    AsyncStorage.setItem(STORAGE_KEYS.CFO_PROFILE, JSON.stringify(profile));
  }, []);

  const setAppearanceMode = useCallback((mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    AsyncStorage.setItem(STORAGE_KEYS.APPEARANCE, mode);
  }, []);

  const signInAsGuest = useCallback(async () => {
    const guest: User = {
      id: `guest_${Date.now()}`,
      email: '',
      display_name: '\u30b2\u30b9\u30c8',
      preferred_currency: 'JPY',
      preferred_locale: 'ja',
      plan: 'free',
      appearance_mode: 'system',
      cfo_name: cfoProfileState?.cfoName ?? '\u30de\u30cd\u30fc\u306e\u756a\u4eba',
      goal_asset: cfoProfileState?.goalAsset ?? 1000,
      goal_cf: cfoProfileState?.goalCf ?? 10,
      cfo_chat_count: 0,
      cfo_chat_reset_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setUser(guest);
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_USER, JSON.stringify(guest));
  }, [cfoProfileState]);

  const signInWithApple = useCallback(async () => {
    // Will be implemented with expo-apple-authentication + Supabase auth.signInWithIdToken
    await signInAsGuest();
  }, [signInAsGuest]);

  const signInWithGoogle = useCallback(async () => {
    // Will be implemented with expo-auth-session + Supabase auth.signInWithIdToken
    await signInAsGuest();
  }, [signInAsGuest]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_USER);
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isOnboarded: isOnboardedState,
        appearanceMode: appearanceModeState,
        cfoProfile: cfoProfileState,
        signInWithApple,
        signInWithGoogle,
        signInAsGuest,
        signOut,
        setIsOnboarded,
        setCfoProfile,
        setAppearanceMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
