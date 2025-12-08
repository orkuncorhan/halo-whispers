// DOSYA: app/profile/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { HaloSideNav, HaloBottomNav } from "../components/HaloNav";
import { useColorMode } from "../context/ColorModeContext";
import { useLanguage } from "../context/LanguageContext";

/* --------- Yardımcı fonksiyonlar --------- */

function moodLabel(mood: number) {
  if (mood <= 25) return "Soft Ember";
  if (mood <= 50) return "Gentle Glow";
  if (mood <= 75) return "Steady Radiance";
  return "Bright Halo";
}

function moodGradient(mood: number) {
  if (mood <= 25) {
    return "radial-gradient(circle at top, #FEF2F2 0%, #FEE2E2 35%, #F9FAFB 100%)";
  }
  if (mood <= 50) {
    return "radial-gradient(circle at top, #EFF6FF 0%, #E0F2FE 40%, #F9FAFB 100%)";
  }
  if (mood <= 75) {
    return "radial-gradient(circle at top, #FEFCE8 0%, #FEF3C7 40%, #FFFBEB 100%)";
  }
  return "radial-gradient(circle at top, #FFF7ED 0%, #FED7AA 45%, #FFFBEB 100%)";
}

export default function ProfilePage() {
  const { username, mood, haloHistory, whispers } = useTheme();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { language } = useLanguage();
  const isTR = language === "tr";

  // Supabase'ten gelen kullanıcı profili
  const { displayName: profileDisplayName, username: backendUsername } =
    useUser();

  // Ekranda gösterilecek isim öncelik sırası:
  // 1) profiles.display_name
  // 2) profiles.username
  // 3) ThemeContext içindeki (eski) username
  // 4) Varsayılan isim
  const displayName =
    profileDisplayName || backendUsername || username || "Halo Walker";

  const userWhispers = whispers.filter((w) => w.isUserPost);
  const whispersCount = userWhispers.length;
  const totalHopes = userWhispers.reduce(
    (sum, w) => sum + (typeof w.hop === "number" ? w.hop : 0),
    0
  );

  const lastHalo = haloHistory[haloHistory.length - 1];
  const lastMoodValue =
    typeof lastHalo?.value === "number" ? lastHalo.value : mood;

  return (
    <>
      {/* Profil spesifik halo ve cam efektleri */}
      <style jsx global>{`
        .profile-halo-shell {
          position: relative;
          width: 220px;
          height: 220px;
          border-radius: 999px;
        }

        .profile-halo-rays {
          position: absolute;
          inset: -40%;
          margin: auto;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(254, 249, 195, 0.25) 8%,
            transparent 18%,
            rgba(253, 224, 171, 0.22) 26%,
            transparent 40%,
            rgba(254, 249, 195, 0.2) 55%,
            transparent 100%
          );
          filter: blur(20px);
          opacity: 0.85;
          animation: profileRays 26s linear infinite;
        }

        .profile-halo-core {
          position: absolute;
          inset: 12%;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            #ffffff 0%,
            #fff7e6 45%,
            rgba(255, 248, 220, 0.5) 72%,
            rgba(255, 248, 220, 0.05) 100%
          );
          box-shadow:
            0 0 40px rgba(251, 191, 36, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .profile-halo-ring {
          position: absolute;
          inset: 8%;
          border-radius: 999px;
          border: 2px solid rgba(255, 241, 210, 0.7);
          box-shadow:
            0 0 28px 6px rgba(251, 191, 36, 0.5),
            inset 0 0 22px rgba(255, 255, 255, 0.9);
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.18) 40%,
            rgba(255, 255, 255, 0.05) 100%
          );
          backdrop-filter: blur(6px);
          animation: profilePulse 5.6s ease-in-out infinite;
        }

        .profile-avatar-orb {
          position: absolute;
          inset: 26%;
          border-radius: 999px;
          background: radial-gradient(
            circle at 30% 20%,
            #ffffff 0%,
            #fee9c7 35%,
            #f97316 110%
          );
          box-shadow:
            0 18px 55px rgba(148, 163, 184, 0.65),
            0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        @keyframes profileRays {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes profilePulse {
          0% {
            transform: scale(0.98);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.02);
            opacity: 1;
          }
          100% {
            transform: scale(0.98);
            opacity: 0.9;
          }
        }
      `}</style>

      <main
        className={
          "min-h-screen w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6 transition-colors " +
          (isDark
            ? "bg-[#020617] text-slate-100"
            : "bg-[radial-gradient(circle_at_top,_#fdfbff,_#e3f2ff)] text-slate-900")
        }
      >
        <div className="relative mx-auto flex w-full max-w-6xl gap-6">
          {/* Sol navigation (desktop) */}
          <HaloSideNav />

          {/* Sağ ana içerik */}
          <div className="flex flex-1 flex-col gap-4 rounded-[2.5rem] bg-white/80 p-4 shadow-[0_28px_110px_rgba(15,23,42,0.20)] backdrop-blur-2xl lg:flex-row lg:p-6">
            <main className="flex-1 lg:pl-6">
              {/* Üst breadcrumb benzeri satır */}
              <div className="mb-6 flex items-center gap-4 text-sm text-slate-500">
                <Link href="/feed" className="hover:text-slate-900 transition">
                  {isTR ? "Akış" : "Stream"}
                </Link>
                <span className="h-4 w-px bg-slate-200" />
                <Link
                  href="/notifications"
                  className="hover:text-slate-900 transition"
                >
                  {isTR ? "Sinyaller" : "Signals"}
                </Link>
                <span className="h-4 w-px bg-slate-200" />
                <span className="font-medium text-slate-900">
                  {isTR ? "Profil" : "Profile"}
                </span>
              </div>

              {/* ÜST BLOK: Avatar + Halo + İsim */}
              <section className="flex flex-col items-center gap-6 rounded-[2.2rem] bg-white/75 px-4 py-6 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-6 sm:py-8">
                <div className="profile-halo-shell">
                  <div className="profile-halo-rays" />
                  <div className="profile-halo-core" />
                  <div className="profile-halo-ring" />
                  <div className="profile-avatar-orb" />
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium tracking-[0.18em] text-slate-400">
                    HALO WALKER
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                    {displayName}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500">
                    {isTR
                      ? "Kelimelerini ışık halkasına dönüştüren sessiz ortak."
                      : "A quiet ally that turns your words into a ring of light."}
                  </p>
                </div>

                {/* İstatistikler */}
                <div className="mt-4 flex w-full max-w-md flex-wrap items-center justify-center gap-4 text-center text-xs text-slate-500">
                  <div className="min-w-[90px]">
                    <p className="text-[0.75rem] font-medium text-slate-700 dark:text-slate-200">
                      {isTR ? "Fısıltılar" : "Whispers"}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900">
                      {whispersCount}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-200/80" />
                  <div className="min-w-[90px]">
                    <p className="text-[0.75rem] font-medium text-slate-700 dark:text-slate-200">
                      {isTR ? "Toplam Hope" : "Total hope"}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900">
                      {totalHopes}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-slate-200/80 hidden sm:block" />
                  <div className="min-w-[110px] sm:block">
                    <p className="text-[0.75rem] font-medium text-slate-700 dark:text-slate-200">
                      {isTR ? "Halo Günleri" : "Halo days"}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold text-slate-900">
                      {haloHistory.length}
                    </p>
                  </div>
                </div>
              </section>

              {/* ALT BLOK: Mood + Halo History + Son Fısıltılar */}
              <section className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                {/* SOL: Mood kartı + Son fısıltılar */}
                <div className="space-y-4">
                  {/* Mood kartı */}
                  <div
                    className="rounded-[1.9rem] border border-white/70 bg-white/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-5"
                    style={{ background: moodGradient(lastMoodValue) }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[0.7rem] font-medium tracking-[0.16em] text-slate-500/80">
                          TODAY’S HALO
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {moodLabel(lastMoodValue)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600/90">
                          {isTR
                            ? `Bugünkü halon ${lastMoodValue} seviyesinde. Sistem, parlamayı zorlamadan, hâlihazırdaki ışığını nazikçe tutuyor.`
                            : `Your halo is at level ${lastMoodValue} today. The system gently holds your current light without forcing you to shine.`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-right">
                        <span className="text-[0.65rem] text-slate-500">
                          Mood
                        </span>
                        <span className="text-xl font-semibold text-slate-900">
                          {lastMoodValue}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Son fısıltılar */}
                  <div className="rounded-[1.7rem] border border-slate-100/80 bg-white/80 p-4 shadow-[0_16px_55px_rgba(15,23,42,0.05)] backdrop-blur-2xl sm:p-5">
                    <p className="text-[0.7rem] font-medium tracking-[0.16em] text-slate-500/80">
                      {isTR ? "SON FISILTILARIN" : "RECENT WHISPERS"}
                    </p>

                    {userWhispers.length === 0 ? (
                      <p className="mt-3 text-xs text-slate-500">
                        Henüz hiçbir şey fısıldamadın. İlk cümleni yazdığında,
                        burası küçük bir arşive dönüşecek.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {userWhispers.slice(0, 4).map((w) => (
                          <div
                            key={w.id}
                            className="rounded-2xl bg-slate-50/80 px-3 py-2 text-xs text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
                          >
                            <p className="line-clamp-3">{w.content}</p>
                            <div className="mt-1 flex items-center justify-between text-[0.65rem] text-slate-400">
                              <span>{w.time || "Just now"}</span>
                              <span>{Math.max(0, w.hop)} Hope</span>
                            </div>
                          </div>
                        ))}

                        {userWhispers.length > 4 && (
                          <div className="pt-2">
                            <Link
                              href="/feed"
                              className="inline-flex items-center gap-1 rounded-full bg-slate-900/95 px-3 py-1.5 text-[0.7rem] font-medium text-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.45)] hover:bg-slate-900"
                            >
                              Stream’e dön
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* SAĞ: Halo History mini paneli */}
                <div className="rounded-[1.9rem] border border-slate-100/80 bg-white/80 p-4 shadow-[0_16px_55px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-5">
                  <p className="text-[0.7rem] font-medium tracking-[0.16em] text-slate-500/80">
                    HALO HISTORY
                  </p>

                  {haloHistory.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-500">
                      {isTR
                        ? "Henüz kaydedilmiş bir halo yok. Mood seçtikçe burada küçük bir ışık günlüğü oluşacak."
                        : "No halo has been recorded yet. As you pick your mood, a small journal of light will appear here."}
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2 text-xs text-slate-600">
                      {haloHistory.slice(-7).map((h, idx) => (
                        <div
                          key={`${h.name}-${idx}`}
                          className="flex items-center gap-3"
                        >
                          <div className="h-6 w-6 rounded-full bg-slate-100/90">
                            <div
                              className="h-full w-full rounded-full"
                              style={{
                                background: moodGradient(h.value),
                                boxShadow:
                                  "0 0 10px rgba(148,163,184,0.35), 0 0 0 1px rgba(255,255,255,0.9)",
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-[0.75rem] font-medium text-slate-800">
                              {h.name}
                            </p>
                            <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500"
                                style={{
                                  width: `${Math.max(
                                    4,
                                    Math.min(100, h.value)
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-[0.75rem] text-slate-500">
                            {h.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        </div>
      </main>

      {/* Mobil alt navigasyon */}
      <HaloBottomNav />
    </>
  );
}
