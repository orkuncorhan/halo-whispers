// DOSYA: app/mood/page.tsx
"use client";

import React, { ChangeEvent, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";
import { HaloOrb } from "../components/HaloOrb";
import HaloBrandMark from "../components/HaloBrandMark";
import { useLanguage } from "../context/LanguageContext";
import { useColorMode } from "../context/ColorModeContext";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function MoodPage() {
  const router = useRouter();
  const { mood, setMood, confirmMoodForToday } = useTheme();
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isTR = language === "tr";
  const [navError, setNavError] = useState<string | null>(null);

  const moodLabel = mood < 40 ? "Heavy" : mood > 60 ? "Light" : "Neutral";

  // 0–1 arası intensity
  const intensity = mood / 100;
  const ringOpacity = 0.35 + intensity * 0.65; // 0.35–1.0
  const raysOpacity = 0.2 + intensity * 0.8; // 0.2–1.0
  const coreBrightness = 0.85 + intensity * 0.6; // 0.85–1.45

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMood(parseInt(e.target.value, 10));
  };

  const mapSliderToMood = (value: number): "low" | "neutral" | "good" => {
    if (value < 34) return "low";
    if (value < 67) return "neutral";
    return "good";
  };

  const handleSaveMood = useCallback(async () => {
    setNavError(null);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error(userError || "No user");
      return;
    }

    const value = mood;
    const mappedMood = mapSliderToMood(value);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await supabase
      .from("daily_moods")
      .delete()
      .eq("user_id", user.id)
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString());

    const { error: insertError } = await supabase
      .from("daily_moods")
      .insert({
        user_id: user.id,
        mood: mappedMood,
      });

    if (insertError) {
      console.error(insertError);
      return;
    }

    confirmMoodForToday();
    try {
      router.push("/feed");
    } catch (err) {
      console.error("Feed'e yönlendirme hatası:", err);
      setNavError(
        isTR
          ? "Akışa yönlendirme başarısız. Aşağıdaki butonu kullanabilirsin."
          : "Redirect to Feed failed. Please use the button below."
      );
    }
  }, [confirmMoodForToday, isTR, mood, router]);

  return (
    <>
      {/* Halo + slider thumb için TÜM stiller tek bir global block içinde */}
      <style jsx global>{`
        @keyframes rotateRays {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .halo-rays {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255, 238, 200, 0.25) 10%,
            transparent 22%,
            rgba(255, 243, 210, 0.28) 34%,
            transparent 48%,
            rgba(255, 238, 200, 0.25) 60%,
            transparent 78%,
            rgba(255, 243, 210, 0.28) 90%,
            transparent 100%
          );
          filter: blur(34px);
          /* Sadece yavaş dönüş – nefes yok */
          animation: rotateRays 22s linear infinite;
          pointer-events: none;
        }

        .halo-core-glow {
          position: absolute;
          width: 82%;
          height: 82%;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 1) 0%,
            rgba(255, 248, 231, 0.95) 35%,
            rgba(255, 248, 231, 0.45) 65%,
            rgba(255, 248, 231, 0) 90%
          );
          filter: blur(14px);
          pointer-events: none;
        }

        .halo-ring {
          position: relative;
          border-radius: 9999px;
          border: 3px solid rgba(255, 245, 220, 0.9);
          background: rgba(255, 255, 255, 0.22);
          box-shadow:
            0 0 65px 15px rgba(255, 230, 170, 0.55),
            inset 0 0 38px 4px rgba(255, 255, 255, 1);
          backdrop-filter: blur(6px);
          /* Pulse animasyonu kaldırıldı – parlaklığı sadece inline style belirleyecek */
        }

        /* RANGE SLIDER – Apple vari görünüm */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 9999px;
          background: rgba(148, 163, 184, 0.22);
          box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.04);
        }

        input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 9999px;
          background: transparent;
        }

        /* Slider thumb – WEBKIT (Chrome, Safari) */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #0f172a;
          box-shadow:
            0 6px 12px rgba(15, 23, 42, 0.25),
            0 0 0 4px rgba(15, 23, 42, 0.08);
          cursor: pointer;
          margin-top: -7px; /* 18px–4px / 2 = 7 → tam ortalama */
        }

        /* Slider thumb – FIREFOX */
        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #0f172a;
          box-shadow:
            0 6px 12px rgba(15, 23, 42, 0.25),
            0 0 0 4px rgba(15, 23, 42, 0.08);
          cursor: pointer;
        }

        input[type="range"]::-moz-range-track {
          height: 4px;
          border-radius: 9999px;
          background: rgba(148, 163, 184, 0.22);
        }
      `}</style>

      <main
        className={
          "min-h-[100dvh] w-full flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 lg:py-12 transition-colors " +
          (isDark ? "bg-[#020617] text-slate-100" : "bg-[radial-gradient(circle_at_top,_#fdfbff,_#e3f2ff)] text-slate-900")
        }
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-[2.5rem] bg-white/78 p-6 shadow-[0_30px_120px_rgba(15,23,42,0.18)] backdrop-blur-2xl sm:p-8 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
          <div className="flex items-center gap-3 px-2">
            <HaloBrandMark />
            <span className="text-lg font-semibold text-slate-900">Halo</span>
          </div>

          {/* Sol: Halo */}
          <div className="flex w-full justify-center lg:w-1/2">
            <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64 md:h-72 md:w-72">
              <div
                className="halo-rays"
                style={{ opacity: raysOpacity }}
              />
              <div
                className="halo-core-glow"
                style={{
                  filter: `blur(14px) brightness(${coreBrightness})`,
                }}
              />
              <div
                className="halo-ring h-full w-full"
                style={{ opacity: ringOpacity }}
              />
            </div>
          </div>

          {/* Sağ: Metin + slider */}
          <div className="w-full lg:w-1/2">
            <p className="text-[0.8rem] font-medium text-slate-500">
              {isTR ? "Karşılama alanı" : "Welcome space"}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {isTR ? "Bugünkü halon nasıl?" : "How is your halo today?"}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {isTR
                ? "İçindeki sesi, iyilikle yankılanan bir frekansa ayarla. Halo, hislerini yargılamadan dinler; sen sadece kendini olduğun gibi fısılda."
                : "Tune your inner voice to a frequency that echoes with kindness. Halo listens without judgment; just whisper as you are."}
            </p>

            {/* Mood alanı */}
            <div className="mt-7">
              <div className="flex items-center justify-between text-[0.8rem] text-slate-500">
                <span>{isTR ? "Ruh hâli" : "Mood"}</span>
                <span
                  className={
                    moodLabel === "Neutral"
                      ? "text-amber-500 font-medium"
                      : moodLabel === "Light"
                      ? "text-emerald-500 font-medium"
                      : "text-sky-500 font-medium"
                  }
                >
                  {moodLabel}
                </span>
              </div>

              {/* Slider */}
              <div className="mt-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={mood}
                  onChange={handleChange}
                />

                {/* Alt etiketler */}
                <div className="mt-2 flex justify-between text-[0.75rem] text-slate-400">
                  <span>{isTR ? "Ağır" : "Heavy"}</span>
                  <span>{isTR ? "Nötr" : "Neutral"}</span>
                  <span>{isTR ? "Hafif" : "Light"}</span>
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={handleSaveMood}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-900/90 px-6 py-2.5 text-sm font-medium text-slate-50 shadow-[0_20px_50px_rgba(15,23,42,0.40)] hover:bg-slate-900"
              >
                {isTR ? "Akışa geç" : "Go to Feed"}
              </button>

              <Link
                href="/"
                className="text-xs text-slate-500 underline-offset-4 hover:text-slate-700 hover:underline sm:text-[0.8rem]"
              >
                {isTR ? "Geri dön" : "Go back"}
              </Link>
            </div>

            {navError && (
              <div className="mt-3 space-y-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p>{navError}</p>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      router.push("/feed");
                    } catch (err) {
                      console.error("Feed fallback navigation failed:", err);
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.35)] hover:bg-slate-800"
                >
                  {isTR ? "Feed'e git" : "Go to Feed"}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
