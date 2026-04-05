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

/** Map a Supabase auth user to our User type */
function mapSupabaseUser(supabaseUser: any, profile?: CfoProfile | null): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    display_name: supabaseUser.user_metadata?.full_name ?? supabaseUser.email ?? 'ユーザー',
    preferred_currency: 'JPY',
    preferred_locale: 'ja',
    plan: 'free',
    appearance_mode: 'system',
    cfo_name: profile?.cfoName ?? 'マネーの番人',
    goal_asset: profile?.goalAsset ?? 1000,
    goal_cf: profile?.goalCf ?? 10,
    cfo_chat_count: 0,
    cfo_chat_reset_at: new Date().toISOString(),
    created_at: supabaseUser.created_at ?? new Date().toISOString(),
  };
}

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
          // Real session — remove any guest user
          await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_USER);
          setUser(mapSupabaseUser(newSession.user, cfoProfileState));
        } else {
          // No Supabase session — fall back to guest if stored
          const guestRaw = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_USER);
          setUser(guestRaw ? JSON.parse(guestRaw) : null);
        }
        setIsLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!initialSession) setIsLoading(false);
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

  const signInWithApple = useCallback(async () => {
    // TODO: implement with expo-apple-authentication
    // const credential = await AppleAuthentication.signInAsync({...});
    // const { data, error } = await supabase.auth.signInWithIdToken({
    //   provider: 'apple',
    //   token: credential.identityToken,
    // });
    throw new Error('Apple Sign In は近日実装予定です');
  }, []);

  const signInWithGoogle = useCallback(async () => {
    // TODO: implement with expo-auth-session
    // const result = await Google.signInAsync({...});
    // const { data, error } = await supabase.auth.signInWithIdToken({
    //   provider: 'google',
    //   token: result.idToken,
    // });
    throw new Error('Google Sign In は近日実装予定です');
  }, []);

  const signInAsGuest = useCallback(async () => {
    const guest: User = {
      id: `guest_${Date.now()}`,
      email: '',
      display_name: 'ゲスト',
      preferred_currency: 'JPY',
      preferred_locale: 'ja',
      plan: 'free',
      appearance_mode: 'system',
      cfo_name: cfoProfileState?.cfoName ?? 'マネーの番人',
      goal_asset: cfoProfileState?.goalAsset ?? 1000,
      goal_cf: cfoProfileState?.goalCf ?? 10,
      cfo_chat_count: 0,
      cfo_chat_reset_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setUser(guest);
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_USER, JSON.stringify(guest));
  }, [cfoProfileState]);

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
