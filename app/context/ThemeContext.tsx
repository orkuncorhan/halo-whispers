// DOSYA: app/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Fısıltı Tipi (GÜNCELLENDİ: isLiked eklendi)
export interface WhisperType {
  id: number;
  username: string;
  time: string;
  content: string;
  hop: number;
  color: string;
  isUserPost?: boolean;
  isLiked?: boolean; // Kullanıcı bunu beğendi mi?
}

interface ThemeContextType {
  mood: number;
  setMood: (mood: number) => void;
  username: string | null;
  setUsername: (name: string) => void;
  haloHistory: { name: string; value: number }[];
  logout: () => void;
  getThemeColors: () => any;
  whispers: WhisperType[];
  addWhisper: (text: string, themeColor: string) => void;
  toggleLike: (id: number) => void; // YENİ FONKSİYON
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMoodState] = useState(50);
  const [username, setUsernameState] = useState<string | null>(null);
  
  const initialWhispers: WhisperType[] = [
    { id: 1, username: "elara_sky", time: "2m", content: "Bugün metroda tanımadığım biri gülümsedi, bütün günüm aydınlandı.", hop: 24, color: "bg-amber-100", isLiked: false },
    { id: 2, username: "deniz_mavi", time: "1h", content: "Sokaktaki kediler için su koymayı unutmayın. Küçük bir kap, büyük bir hayat.", hop: 156, color: "bg-blue-100", isLiked: false },
  ];

  const [whispers, setWhispers] = useState<WhisperType[]>(initialWhispers);

  const [haloHistory, setHaloHistory] = useState([
    { name: 'Mon', value: 40 }, { name: 'Tue', value: 35 }, { name: 'Wed', value: 60 },
    { name: 'Thu', value: 50 }, { name: 'Fri', value: 75 }, { name: 'Sat', value: 80 },
    { name: 'Sun', value: 50 },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("halo_username");
      const savedMood = localStorage.getItem("halo_mood");
      const savedWhispers = localStorage.getItem("halo_whispers");

      if (savedName) setUsernameState(savedName);
      if (savedMood) setMoodState(parseInt(savedMood));
      if (savedWhispers) setWhispers(JSON.parse(savedWhispers));
    }
  }, []);

  const setMood = (newMood: number) => {
    setMoodState(newMood);
    if (typeof window !== "undefined") localStorage.setItem("halo_mood", newMood.toString());
  };

  const setUsername = (name: string) => {
    setUsernameState(name);
    if (typeof window !== "undefined") localStorage.setItem("halo_username", name);
  };

  const addWhisper = (text: string, themeColor: string) => {
    const newWhisper: WhisperType = {
      id: Date.now(),
      username: username || "Halo Walker",
      time: "Just now",
      content: text,
      hop: 0,
      color: themeColor,
      isUserPost: true,
      isLiked: false,
    };
    setWhispers((prev) => {
      const updated = [newWhisper, ...prev];
      if (typeof window !== "undefined") localStorage.setItem("halo_whispers", JSON.stringify(updated));
      return updated;
    });
  };

  // --- YENİ: LIKE (HOP) İŞLEVİ ---
  const toggleLike = (id: number) => {
    setWhispers(prev => {
      const updated = prev.map(w => {
        if (w.id === id) {
          // Eğer zaten beğenildiyse azalt (-1), beğenilmediyse artır (+1)
          const isLiked = !!w.isLiked;
          return {
            ...w,
            isLiked: !isLiked,
            hop: isLiked ? w.hop - 1 : w.hop + 1
          };
        }
        return w;
      });
      if (typeof window !== "undefined") localStorage.setItem("halo_whispers", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUsernameState(null);
    setMoodState(50);
    setWhispers(initialWhispers);
    if (typeof window !== "undefined") localStorage.clear();
  };

  const getThemeColors = () => {
    if (mood < 30) return { name: "Heavy", bg: "bg-[#F0F4F8]", gradient: "from-blue-50 to-slate-100", halo: "bg-blue-200", accent: "text-blue-600", button: "bg-blue-600" };
    if (mood > 70) return { name: "Radiant", bg: "bg-[#FFF0F5]", gradient: "from-rose-50 to-pink-50", halo: "bg-rose-200", accent: "text-rose-500", button: "bg-rose-500" };
    return { name: "Calm", bg: "bg-[#FFF9F0]", gradient: "from-amber-50 to-orange-50", halo: "bg-amber-100", accent: "text-amber-600", button: "bg-[#2D3436]" };
  };

  return (
    <ThemeContext.Provider value={{ mood, setMood, username, setUsername, haloHistory, logout, getThemeColors, whispers, addWhisper, toggleLike }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}