"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toPng } from "html-to-image";
import { useTheme } from "../context/ThemeContext";
import { Share2, Check } from "lucide-react";

// Hafta günleri – ThemeContext'teki dayName ile uyumlu (Mon, Tue...)
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

interface WeekDayMood {
  label: string;
  level: number; // 0–4 arası parlama seviyesi
}

// Slider değerini (0–100) görsel parlama seviyesine çeviriyoruz
const valueToLevel = (value?: number): number => {
  if (value == null) return 0;
  if (value <= 25) return 1; // Heavy
  if (value <= 50) return 2; // Neutral
  if (value <= 75) return 3; // Calm
  return 4; // Bright
};

export function HaloJourneyCard() {
  // mood geçmişi + tema renkleri
  const { haloHistory, getThemeColors } = useTheme();
  const theme = getThemeColors();

  // Kartın DOM referansı (png üretmek için)
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);

  // Hafta günlerini, context'teki haloHistory'den (Mon, Tue...) doldur
  const weekData: WeekDayMood[] = useMemo(() => {
    return DAY_LABELS.map((label) => {
      const entry = haloHistory.find((h) => h.name === label);
      return {
        label,
        level: valueToLevel(entry?.value),
      };
    });
  }, [haloHistory]);

  // Journey kartını png olarak indir
  const handleShareJourney = async () => {
    if (!cardRef.current || isSaving) return;

    try {
      setIsSaving(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = "halo-journey.png";
      link.href = dataUrl;
      link.click();

      setSavedOnce(true);
      setTimeout(() => setSavedOnce(false), 2500);
    } catch (err) {
      console.error("Journey kartı oluşturulamadı", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[32px] p-6 shadow-lg flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
            Your Halo Journey
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This week&apos;s emotional weather.
          </p>
        </div>

        <button
          onClick={handleShareJourney}
          disabled={isSaving}
          className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white/70 hover:bg-white transition-all flex items-center gap-1 disabled:opacity-60"
          type="button"
        >
          {savedOnce ? (
            <>
              <Check size={12} />
              Saved
            </>
          ) : (
            <>
              <Share2 size={12} />
              {isSaving ? "Preparing..." : "Share Journey"}
            </>
          )}
        </button>
      </div>

      <div className="flex justify-between mt-2">
        {weekData.map((day) => (
          <div
            key={day.label}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <motion.div
              className={`rounded-full ${theme.halo} flex items-center justify-center`}
              initial={{ scale: 0.4, opacity: 0.5 }}
              animate={{
                scale: day.level > 0 ? 0.7 + day.level * 0.1 : 0.5,
                opacity: day.level > 0 ? 1 : 0.35,
              }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              style={{
                boxShadow:
                  day.level > 0
                    ? "0 0 30px rgba(255, 204, 102, 0.7)"
                    : "0 0 10px rgba(148, 163, 184, 0.4)",
                width: 40,
                height: 40,
              }}
            >
              <div className="w-3 h-3 rounded-full bg-white/90" />
            </motion.div>
            <span className="text-[10px] text-gray-400 uppercase tracking-[0.18em]">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}