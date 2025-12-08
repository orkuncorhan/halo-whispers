// DOSYA: app/context/UserContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

type UserContextValue = {
  userId: string | null;
  email: string | null;
  username: string | null;
  displayName: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  // Sadece frontendi güncellemek için – DB update'i settings sayfasında zaten yapıyoruz
  setUsername: (name: string | null) => void;
  // İstediğimiz zaman profili Supabase'ten yeniden çekmek için
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Supabase'ten kullanıcı + profil çek
  const loadUser = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setUserId(null);
        setEmail(null);
        setUsernameState(null);
        setDisplayName(null);
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? null);

      // profiles tablosundan username / display_name çek
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, display_name")
        .eq("id", user.id)
        .maybeSingle();

      const uname = profileData?.username ?? null;
      const dname = profileData?.display_name ?? null;

      setUsernameState(uname);
      setDisplayName(dname);
      setIsLoggedIn(true);
    } finally {
      setIsLoading(false);
    }
  };

  // İlk yüklemede kullanıcıyı çek
  useEffect(() => {
    loadUser();

    // Auth state değişince (login / logout / signup) yeniden oku
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUserId(null);
        setEmail(null);
        setUsernameState(null);
        setDisplayName(null);
        setIsLoggedIn(false);
      } else {
        // Session varsa kullanıcıyı/profili tekrar getir
        loadUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dışarıya verdiğimiz setUsername sadece state'i güncelliyor.
  // DB güncellemesi settings/page.tsx içinde zaten upsert ile yapılıyor.
  const setUsername = (name: string | null) => {
    setUsernameState(name);
  };

  const value: UserContextValue = {
    userId,
    email,
    username,
    displayName,
    isLoggedIn,
    isLoading,
    setUsername,
    refreshUser: loadUser,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}