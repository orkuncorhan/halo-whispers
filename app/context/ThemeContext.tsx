// DOSYA: app/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WhisperType {
  id: number;
  username: string;
  time: string;
  content: string;
  hop: number;
  color: string;
  isUserPost?: boolean;
  isLiked?: boolean;
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
  deleteWhisper: (id: number) => void;
  toggleLike: (id: number) => void;
  isMoodSetToday: boolean;      // Bugün seçim yapıldı mı?
  confirmMoodForToday: () => void; // Seçimi kilitleme fonksiyonu
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMoodState] = useState(50);
  const [username, setUsernameState] = useState<string | null>(null);
  const [isMoodSetToday, setIsMoodSetToday] = useState(false);
  
  const [whispers, setWhispers] = useState<WhisperType[]>([]);
  
  // Grafik için başlangıç (Boş veya sadece bugün)
  const [haloHistory, setHaloHistory] = useState<{ name: string; value: number }[]>([
    { name: 'Today', value: 50 } 
  ]);

  // --- SİTE AÇILINCA HAFIZAYI OKU ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("halo_username");
      const savedMood = localStorage.getItem("halo_mood");
      const savedWhispers = localStorage.getItem("halo_whispers");
      const savedHistory = localStorage.getItem("halo_history");
      const lastMoodDate = localStorage.getItem("halo_last_mood_date");

      if (savedName) setUsernameState(savedName);
      if (savedMood) setMoodState(parseInt(savedMood));
      if (savedWhispers) setWhispers(JSON.parse(savedWhispers));
      if (savedHistory) setHaloHistory(JSON.parse(savedHistory));

      // TARİH KONTROLÜ:
      // Bugünün tarihi ile son kaydedilen tarih aynı mı?
      const todayStr = new Date().toLocaleDateString();
      if (lastMoodDate === todayStr) {
        setIsMoodSetToday(true); // Evet, bugün zaten seçmiş.
      } else {
        setIsMoodSetToday(false); // Hayır, yeni bir gün (veya ilk kez).
      }
    }
  }, []);

  const setMood = (newMood: number) => {
    setMoodState(newMood);
    // Not: Burada hemen kaydetmiyoruz, kullanıcı "Enter"a basınca kesinleşecek.
  };

  // --- MOOD'U BUGÜNE KİLİTLE VE TARİHE EKLE ---
  const confirmMoodForToday = () => {
    const todayStr = new Date().toLocaleDateString();
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
    
    setIsMoodSetToday(true);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("halo_mood", mood.toString());
      localStorage.setItem("halo_last_mood_date", todayStr); // Tarihi atıyoruz
    }

    // Grafiği Güncelle
    setHaloHistory(prev => {
      const newHistory = [...prev];
      const lastMoodDate = localStorage.getItem("halo_last_mood_date"); // Eskisini kontrol et

      // Eğer bu tamamen yeni bir günse listeye ekle
      // (Eğer bugün daha önce eklediyse, sadece sonuncuyu güncelle)
      // Basit mantık: Eğer son kayıt bugüne ait değilse ekle.
      
      // Not: React state güncellemeleri asenkron olduğu için localstorage'dan kontrol daha güvenli
      // Ama MVP için basitçe: Listeyi güncelle.
      
      // Eğer liste boşsa direkt ekle
      if (newHistory.length === 0) {
         newHistory.push({ name: dayName, value: mood });
      } else {
         // Son elemanı güncelle (Bugün tekrar tekrar değiştirirse diye)
         // Gerçek bir günlük sistemde: Eğer tarih değiştiyse push, değişmediyse update yapılır.
         // MVP için: Her zaman sonuncuyu güncel mood yapıyoruz, yeni gün kontrolünü sayfa açılışında yapıyoruz.
         newHistory[newHistory.length - 1] = { name: dayName, value: mood };
      }
      
      // Listeyi 7 günle sınırla
      if (newHistory.length > 7) newHistory.shift();

      if (typeof window !== "undefined") {
        localStorage.setItem("halo_history", JSON.stringify(newHistory));
      }
      return newHistory;
    });
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

  const deleteWhisper = (id: number) => {
    setWhispers((prev) => {
      const updated = prev.filter(w => w.id !== id);
      if (typeof window !== "undefined") localStorage.setItem("halo_whispers", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLike = (id: number) => {
    setWhispers(prev => {
      const updated = prev.map(w => {
        if (w.id === id) {
          const isLiked = !!w.isLiked;
          return { ...w, isLiked: !isLiked, hop: isLiked ? w.hop - 1 : w.hop + 1 };
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
    setWhispers([]);
    setHaloHistory([{ name: 'Today', value: 50 }]);
    setIsMoodSetToday(false);
    if (typeof window !== "undefined") localStorage.clear();
  };

  const getThemeColors = () => {
    if (mood < 30) return { name: "Heavy", bg: "bg-[#F0F4F8]", gradient: "from-blue-50 to-slate-100", halo: "bg-blue-200", accent: "text-blue-600", button: "bg-blue-600" };
    if (mood > 70) return { name: "Radiant", bg: "bg-[#FFF0F5]", gradient: "from-rose-50 to-pink-50", halo: "bg-rose-200", accent: "text-rose-500", button: "bg-rose-500" };
    return { name: "Calm", bg: "bg-[#FFF9F0]", gradient: "from-amber-50 to-orange-50", halo: "bg-amber-100", accent: "text-amber-600", button: "bg-[#2D3436]" };
  };

  return (
    <ThemeContext.Provider value={{ mood, setMood, username, setUsername, haloHistory, logout, getThemeColors, whispers, addWhisper, deleteWhisper, toggleLike, isMoodSetToday, confirmMoodForToday }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}