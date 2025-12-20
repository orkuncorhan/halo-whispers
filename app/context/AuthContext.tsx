"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getMyProfile, isProfileComplete, type Profile } from "@/lib/profile";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileChecked, setProfileChecked] = useState(false);

  const fetchProfile = useCallback(
    async (activeSession: Session | null) => {
      if (!activeSession?.user) {
        setProfile(null);
        setProfileChecked(true);
        return;
      }

      const data = await getMyProfile(supabase);
      setProfile(data);
      setProfileChecked(true);
    },
    [supabase]
  );

  const loadSession = useCallback(async () => {
    setLoading(true);
    const {
      data: { session: nextSession },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase session fetch error:", error);
    }
    setSession(nextSession ?? null);
    setUser(nextSession?.user ?? null);
    setLoading(false);
    setProfileChecked(false);
    if (nextSession?.user) {
      fetchProfile(nextSession);
    } else {
      setProfile(null);
      setProfileChecked(true);
    }
  }, [fetchProfile, supabase]);

  useEffect(() => {
    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setProfileChecked(false);
      if (!nextSession) {
        setProfile(null);
        setProfileChecked(true);
        router.replace("/login");
      } else {
        fetchProfile(nextSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, loadSession, router, supabase]);

  useEffect(() => {
    if (loading || !profileChecked) return;

    if (!session) {
      if (pathname !== "/login") {
        router.replace("/login");
      }
      return;
    }

    if (!isProfileComplete(profile) && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [loading, pathname, profile, profileChecked, router, session]);

  const value: AuthContextValue = {
    session,
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
