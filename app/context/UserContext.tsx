"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type UserContextValue = {
  username: string | null;
  setUsername: (name: string | null) => void;
  isLoggedIn: boolean;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const USERNAME_STORAGE_KEY = "halo_username";

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(USERNAME_STORAGE_KEY);
    if (stored) setUsernameState(stored);
    setHydrated(true);
  }, []);

  const setUsername = (name: string | null) => {
    setUsernameState(name);
    if (typeof window === "undefined") return;
    if (name) {
      window.localStorage.setItem(USERNAME_STORAGE_KEY, name);
    } else {
      window.localStorage.removeItem(USERNAME_STORAGE_KEY);
    }
  };

  const value: UserContextValue = {
    username,
    setUsername,
    isLoggedIn: !!username,
  };

  // SSR + hydration arasında flicker olmasın
  if (!hydrated) {
    return null;
  }

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
