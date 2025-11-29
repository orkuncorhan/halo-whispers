// DOSYA: app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "./context/UserContext";
import { useLanguage } from "./context/LanguageContext";
import { useColorMode } from "./context/ColorModeContext";
import HaloBrandMark from "./components/HaloBrandMark";

export default function HomePage() {
  const router = useRouter();
  const { username } = useUser();
  const { language } = useLanguage();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isTR = language === "tr";

  const [showHowHaloWorks, setShowHowHaloWorks] = useState(false);

  const title = isTR
    ? username
      ? `Hoş geldin, ${username}`
      : "Halo Whispers’a hoş geldin"
    : username
    ? `Welcome, ${username}`
    : "Welcome to Halo Whispers";

  return (
    <>
      {/* Işık huzmeleri, halka nefesi ve giriş animasyonları */}
      <style jsx global>{`
        /* --- Giriş animasyonları (GSAP yerine saf CSS) --- */

        @keyframes haloIntro {
          0% {
            opacity: 0;
            transform: scale(0.8) rotate(180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes textIntroUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes navIntroFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .halo-intro {
          opacity: 0;
          transform: scale(0.8) rotate(180deg);
          animation: haloIntro 1.8s ease-out forwards;
          animation-delay: 0s;
        }

        .headline-intro {
          opacity: 0;
          transform: translateY(20px);
          animation: textIntroUp 1s ease-out forwards;
          animation-delay: 1.2s;
        }

        .subtext-intro {
          opacity: 0;
          transform: translateY(20px);
          animation: textIntroUp 1s ease-out forwards;
          animation-delay: 1.4s;
        }

        .nav-intro {
          opacity: 0;
          animation: navIntroFade 0.8s ease-out forwards;
          animation-delay: 1.5s;
        }

        /* --- Halo sürekli animasyonları (eski kodun birebir karşılığı) --- */

        @keyframes rotateRays {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes ringPulse {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          50% {
            transform: scale(1.12);
            opacity: 1;
            filter: brightness(1.25);
          }
          100% {
            transform: scale(1);
            opacity: 0.75;
            filter: brightness(1);
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
          animation:
            rotateRays 22s linear infinite,
            raysPulse 8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes raysPulse {
          0% {
            opacity: 0.5;
            transform: scale(1);
            filter: blur(30px);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.08);
            filter: blur(38px);
          }
          100% {
            opacity: 0.5;
            transform: scale(1);
            filter: blur(30px);
          }
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
          animation: ringPulse 8s ease-in-out infinite;
        }
      `}</style>

      <main
        className={
          "relative min-h-[100dvh] w-full overflow-hidden transition-colors " +
          (isDark
            ? "bg-[#020617] text-slate-100"
            : "bg-[radial-gradient(circle_at_top,_#fdfbff,_#e3f2ff)] text-slate-900")
        }
      >
        <div className="relative z-10 flex min-h-[100dvh] flex-col">
          {/* NAV */}
          <nav className="nav-intro pointer-events-auto flex items-center justify-between px-6 pt-5 text-xs text-slate-600 sm:text-sm">
            <HaloBrandMark />

            <div className="flex items-center gap-4">
              <Link
                href="/feed"
                className="hidden text-slate-500 underline-offset-2 hover:text-slate-700 hover:underline sm:inline"
              >
                {isTR ? "Fısıltıları keşfet" : "Explore whispers"}
              </Link>
              <Link
                href="/mood"
                className="rounded-full bg-slate-900/85 px-4 py-1.5 text-xs font-medium text-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.35)] hover:bg-slate-900"
              >
                {isTR ? "Mood seç" : "Pick mood"}
              </Link>
            </div>
          </nav>

          {/* ANA BLOK */}
          <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-10 sm:pb-20 sm:pt-6">
            {/* Halo */}
            <div className="halo-intro relative mb-10 flex items-center justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center sm:h-72 sm:w-72 md:h-80 md:w-80">
                <div className="halo-rays" />
                <div className="halo-core-glow" />
                <div className="halo-ring h-full w-full" />
              </div>
            </div>

            {/* Metin + CTA */}
            <div className="max-w-xl text-center">
              <h1
                className={
                  "headline-intro mt-10 text-3xl font-semibold tracking-tight text-center md:text-4xl lg:text-5xl " +
                  (isDark
                    ? "text-white"
                    : "text-slate-900 drop-shadow-[0_0_18px_rgba(255,255,255,0.85)]")
                }
              >
                {title}
              </h1>

              <p
                className={
                  "subtext-intro mt-4 max-w-xl mx-auto text-center text-sm leading-relaxed md:text-base " +
                  (isDark
                    ? "text-slate-300"
                    : "text-slate-600 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]")
                }
              >
                {isTR ? (
                  <>
                    Fısıldadığın her söz, halo’nun kalbinde{" "}
                    <span className="font-medium text-amber-600">
                      yumuşak bir ışık
                    </span>{" "}
                    olur. Sen yaz, iyilik kendi yolunu bulur.
                  </>
                ) : (
                  <>
                    Every whisper you leave becomes a{" "}
                    <span className="font-medium text-amber-600">
                      soft light
                    </span>{" "}
                    in Halo’s heart. Write, and kindness will find its way.
                  </>
                )}
              </p>

              <div className="mt-10 flex items-center justify-center gap-6">
                {/* Primary – Başlayalım */}
                <button
                  onClick={() => router.push("/login")}
                  className={`
      rounded-full px-10 py-3
      bg-slate-900 text-slate-50
      shadow-[0_18px_60px_rgba(15,23,42,0.55)]
      hover:bg-slate-800
      transition duration-200
      focus-visible:outline-none
      focus-visible:ring-2 focus-visible:ring-offset-2
      focus-visible:ring-slate-300 dark:focus-visible:ring-slate-500
      ${isDark ? "border border-slate-700/70" : ""}
    `}
                >
                  {isTR ? "Başlayalım" : "Get started"}
                </button>

                {/* Secondary – Halo nasıl çalışıyor? */}
                <button
                  type="button"
                  onClick={() => setShowHowHaloWorks(true)}
                  className={`
      text-sm md:text-base font-medium
      border-b border-transparent
      transition duration-200
      ${
        isDark
          ? "text-slate-300 hover:text-slate-50 hover:border-slate-400/80"
          : "text-slate-500 hover:text-slate-700 hover:border-slate-400/60"
      }
    `}
                >
                  {isTR ? "Halo nasıl çalışıyor?" : "How does Halo work?"}
                </button>
              </div>

              {showHowHaloWorks && (
                <div className="mt-6 inline-block max-w-xl rounded-2xl border border-white/80 bg-white/90 px-4 py-3 text-left text-xs text-slate-600 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:text-[0.8rem]">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {isTR ? "Halo nasıl çalışıyor?" : "How does Halo work?"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowHowHaloWorks(false)}
                      className="text-[0.7rem] text-slate-400 hover:text-slate-700"
                    >
                      {isTR ? "Kapat" : "Close"}
                    </button>
                  </div>
                  <p>
                    {isTR
                      ? "Önce ruh hâlini seçiyorsun; Halo bu tonu temel alarak fısıltılarını sakince karşılıyor. Yazdığın her cümle, ekrandaki ışık halkasında küçük bir titreşim gibi saklanıyor. Hope verdiğinde kıvılcım parlıyor, yorumlar ise sesi yankıya dönüştürüyor."
                      : "First choose your mood; Halo welcomes your whispers in that tone. Each line you write settles as a small vibration in the halo. Sending Hope adds a spark; comments echo the voice."}
                  </p>
                  <p className="mt-2 text-[0.72rem] text-slate-500">
                    {isTR
                      ? "Hazır hissettiğinde Stream’e geçip hem kendi fısıltılarını, hem de başkalarının bıraktığı ışıkları görebilirsin."
                      : "When ready, switch to the Stream to see your whispers and the lights others leave behind."}
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </main>
    </>
  );
}
