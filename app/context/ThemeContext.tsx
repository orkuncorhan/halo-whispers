// DOSYA: app/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface ThemeContextType {
  mood: number;
  setMood: (mood: number) => void;
  username: string;
  setUsername: (name: string) => void;
  getThemeColors: () => {
    name: string;
    bg: string;
    gradient: string;
    halo: string;
    accent: string;
    button: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMood] = useState(50);
  const [username, setUsername] = useState("Halo Walker");

  const getThemeColors = () => {
    if (mood < 30) return {
      name: "Heavy",
      bg: "bg-[#F0F4F8]",
      gradient: "from-blue-50 to-slate-100",
      halo: "bg-blue-200",
      accent: "text-blue-600",
      button: "bg-blue-600"
    };
    if (mood > 70) return {
      name: "Radiant",
      bg: "bg-[#FFF0F5]",
      gradient: "from-rose-50 to-pink-50",
      halo: "bg-rose-200",
      accent: "text-rose-500",
      button: "bg-rose-500"
    };
    return {
      name: "Calm",
      bg: "bg-[#FFF9F0]",
      gradient: "from-amber-50 to-orange-50",
      halo: "bg-amber-100",
      accent: "text-amber-600",
      button: "bg-[#2D3436]"
    };
  };

  return (
    <ThemeContext.Provider value={{ mood, setMood, username, setUsername, getThemeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}