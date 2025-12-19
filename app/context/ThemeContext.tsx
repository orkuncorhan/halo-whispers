// DOSYA: app/context/ThemeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "./UserContext";
// Supabase bağlantısı (Eğer supabase kullanmıyorsak burası hata verebilir, 
// şimdilik MVP için LocalStorage versiyonunu veriyorum ki hata almayasın)

// Fısıltı Tipi (Tüm özellikler burada tanımlı)
export interface WhisperType {
  id: string;
  username: string;
  time: string;
  createdAt?: string;
  content: string;
  mood: string;
  hop: number;          // <-- Bu eksikti, eklendi
  color: string;
  comments: CommentType[];
  isUserPost?: boolean;
  isLiked?: boolean;
  user_id?: string | null;
  authorUsername?: string | null;
  authorDisplayName?: string | null;
}

export interface CommentType {
  id: string;
  username: string;
  content: string;
  time: string;
}

// Tema Renkleri Tipi
export interface ThemeColorsType {
  name: string;         // <-- Bu eksikti, eklendi
  bg: string;
  gradient: string;
  halo: string;
  accent: string;
  button: string;
  card: string;
  cardBorder: string;
  cardSoft: string;
  text: string;
}

interface ThemeContextType {
  mood: number;
  setMood: (mood: number) => void;
  username: string | null;
  setUsername: (name: string) => void;
  haloHistory: { name: string; value: number }[]; // <-- Bu eksikti, eklendi
  logout: () => void;
  getThemeColors: () => ThemeColorsType;
  whispers: WhisperType[];
  addWhisper: (text: string, options?: { id?: string; themeColor?: string }) => void;
  deleteWhisper: (id: string) => void;
  toggleLike: (id: string) => void;
  isMoodSetToday: boolean;
  confirmMoodForToday: () => void;
  addComment: (whisperId: string, text: string) => void;
  deleteComment: (whisperId: string, commentId: string) => void;
  filterToxic: (text: string) => { ok: boolean; word?: string };
  setWhispers: (list: WhisperType[]) => void;
  isContentToxic: (text: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const TOXIC_WORDS = [
  "sik",
  "siktir",
  "aq",
  "amk",
  "yarak",
  "orospu",
  "orospu çocuğu",
  "göt",
  "piç",
  "salak",
  "aptal",
  "gerizekalı",
  "mal",
  "kahpe",
  "ibne",
  "yarrak",
  "fuck",
  "shit",
  "bitch",
  "bok",
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { userId, username: userUsername } = useUser();
  const supabase = createClient();
  const [mood, setMoodState] = useState(50);
  const [username, setUsernameState] = useState<string | null>(null);
  const [isMoodSetToday, setIsMoodSetToday] = useState(false);
  
  // Temiz Başlangıç
  const [whispers, setWhispersState] = useState<WhisperType[]>([]);
  
  // Grafik Başlangıç
  const [haloHistory, setHaloHistory] = useState<{ name: string; value: number }[]>([
    { name: 'Today', value: 50 } 
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("halo_username");
      const savedMood = localStorage.getItem("halo_mood");
      const savedWhispers = localStorage.getItem("halo_whispers");
      const savedHistory = localStorage.getItem("halo_history");
      const lastMoodDate = localStorage.getItem("halo_last_mood_date");

      if (savedName) setUsernameState(savedName);
      if (savedMood) setMoodState(parseInt(savedMood));
      if (savedWhispers) {
        const parsed: WhisperType[] = JSON.parse(savedWhispers);
        // Yeni eklenen alanlar için geriye dönük düzenleme
        setWhispersState(
          parsed.map((w) => ({
            ...w,
            id: w.id ? String(w.id) : crypto.randomUUID(),
            mood: w.mood ? String(w.mood) : "neutral",
            createdAt: w.createdAt ?? new Date().toISOString(),
            hop: typeof w.hop === "number" ? w.hop : 0,
            comments: (w.comments ?? []).map((c: any) => ({
              ...c,
              id: c.id ? String(c.id) : crypto.randomUUID(),
            })),
            isLiked: w.isLiked ?? false,
            isUserPost: w.isUserPost ?? false,
            color: w.color ?? getThemeColors().halo,
            user_id: w.user_id ?? null,
          }))
        );
      }
      if (savedHistory) setHaloHistory(JSON.parse(savedHistory));

      const todayStr = new Date().toLocaleDateString();
      setIsMoodSetToday(lastMoodDate === todayStr);
    }
  }, []);

  const setMood = (newMood: number) => {
    setMoodState(newMood);
  };

  const confirmMoodForToday = () => {
    const todayStr = new Date().toLocaleDateString();
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    
    setIsMoodSetToday(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("halo_mood", mood.toString());
      localStorage.setItem("halo_last_mood_date", todayStr);
    }

    setHaloHistory(prev => {
      const newHistory = [...prev];
      const lastMoodDate = localStorage.getItem("halo_last_mood_date");

      if (newHistory.length === 0 || localStorage.getItem("halo_last_mood_date") !== todayStr) {
         if (newHistory.length >= 7) newHistory.shift(); 
         newHistory.push({ name: dayName, value: mood });
      } else {
         newHistory[newHistory.length - 1] = { name: dayName, value: mood };
      }
      
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

  const addWhisper = (
    text: string,
    options?: { id?: string; themeColor?: string }
  ) => {
    const now = new Date();
    const generatedId = options?.id ?? (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const newWhisper: WhisperType = {
      id: generatedId,
      username: username || "Halo Walker",
      time: now.toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now.toISOString(),
      content: text,
      mood: String(mood),
      hop: 0,
      color: options?.themeColor ?? getThemeColors().halo,
      comments: [],
      isUserPost: true,
      isLiked: false,
      user_id: userId ?? null,
    };
    setWhispersState((prev) => {
      const updated = [newWhisper, ...prev];
      if (typeof window !== "undefined") localStorage.setItem("halo_whispers", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteWhisper = (id: string) => {
    setWhispersState((prev) => {
      const updated = prev.filter(w => w.id !== id);
      if (typeof window !== "undefined") localStorage.setItem("halo_whispers", JSON.stringify(updated));
      return updated;
    });
  };

  const addComment = (whisperId: string, text: string) => {
    if (!userId) {
      alert("Yorum yazmak için önce giriş yapman gerekiyor.");
      return;
    }

    // Aynı id'yi hem local state'te hem Supabase'te kullanacağız
    const newCommentId = crypto.randomUUID();
    const authorName = username || userUsername || "Halo Walker";

    const newComment: CommentType = {
      id: newCommentId,
      username: authorName,
      content: text,
      time: "Just now",
    };

    // Önce UI'da hemen göster (optimistic update)
    setWhispersState((prev) => {
      const updated = prev.map((w) =>
        w.id === whisperId
          ? { ...w, comments: [...(w.comments ?? []), newComment] }
          : w
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("halo_whispers", JSON.stringify(updated));
      }
      return updated;
    });

    // Sonra Supabase'e kaydet (fire-and-forget)
    supabase
      .from("comments")
      .insert({
        id: newCommentId,
        whisper_id: whisperId,
        author_id: userId,
        author_name: authorName,
        content: text,
      })
      .then(({ error }) => {
        if (error) {
          console.error("Supabase comment insert error:", error);
        }
      });
  };

  const deleteComment = (whisperId: string, commentId: string) => {
    // Önce UI'dan kaldır (optimistic update)
    setWhispersState((prev) => {
      const updated = prev.map((w) =>
        w.id === whisperId
          ? {
              ...w,
              comments: (w.comments ?? []).filter((c) => c.id !== commentId),
            }
          : w
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("halo_whispers", JSON.stringify(updated));
      }
      return updated;
    });

    // Sonra Supabase'ten sil
    supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .then(({ error }) => {
        if (error) {
          console.error("Supabase comment delete error:", error);
        }
      });
  };

  const isContentToxic = (text: string): boolean => {
    if (!text) return false;

    const lower = text.toLowerCase();
    return TOXIC_WORDS.some((word) => lower.includes(word));
  };

  const filterToxic = (text: string) => {
    const foundWord = TOXIC_WORDS.find((badWord) => {
      const pattern = new RegExp(`\\b${badWord}\\b`, "i");
      return pattern.test(text);
    });

    return { ok: !foundWord, word: foundWord };
  };

  const toggleLike = (id: string) => {
    setWhispersState((prev) => {
      const updated = prev.map((w) => {
        if (w.id === id) {
          const isLiked = !!w.isLiked;

          // Yeni hop değeri: asla 0'ın altına inmesin
          const newHop = isLiked ? Math.max(0, w.hop - 1) : w.hop + 1;

          return {
            ...w,
            isLiked: !isLiked,
            hop: newHop,
          };
        }
        return w;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("halo_whispers", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = () => {
    setUsernameState(null);
    setMoodState(50);
    setWhispersState([]);
    setHaloHistory([{ name: 'Today', value: 50 }]);
    setIsMoodSetToday(false);
    if (typeof window !== "undefined") localStorage.clear();
  };

  const getThemeColors = (): ThemeColorsType => {
    // Kartlar için ortak glassmorphism tabanı
    const baseCard = {
      // Cam efektli kart
      card:
        "bg-white/20 backdrop-blur-2xl shadow-[0_18px_60px_rgba(15,23,42,0.22)]",
      cardBorder: "border-white/40",
      cardSoft: "bg-white/30",
      // Gözü yormayan, hafif koyu gri metin
      text: "text-slate-800",
    };

    // Artık mood’a göre renk değiştirmiyoruz.
    // Tek bir ulvi / huzurlu temel tema var; mood sadece halenin davranışını etkileyecek.
    return {
      name: "HaloBase",

      // Sayfanın ana arka plan rengi (sabit)
      bg: "bg-[#F4F6FB]",

      // Apple vari soft gradient – çok hafif, göz yormayan
      gradient: "from-slate-50 via-white to-amber-50/30",

      // Halo rengi: beyaz-altın, tanrısal / ulvi his
      // Bunu halo bileşenlerinde background / gradient olarak kullanacağız.
      halo: "from-amber-200/90 via-amber-100/85 to-amber-50/75",

      // Küçük vurgular (icon, link, küçük butonlar)
      accent: "text-amber-500",

      // Ana butonlar: koyu ama sert olmayan, yuvarlak his
      button:
        "bg-slate-900/85 hover:bg-slate-900 text-slate-50 " +
        "shadow-[0_18px_40px_rgba(15,23,42,0.35)]",

      ...baseCard,
    };
  };

  return (
    <ThemeContext.Provider
      value={{
        mood,
        setMood,
        username,
        setUsername,
        haloHistory,
        logout,
        getThemeColors,
        whispers,
        addWhisper,
        deleteWhisper,
        toggleLike,
        isMoodSetToday,
        confirmMoodForToday,
        addComment,
        deleteComment,
        filterToxic,
        isContentToxic,
        setWhispers: (list) => setWhispersState(list),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
