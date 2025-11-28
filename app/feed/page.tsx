// DOSYA: app/feed/page.tsx
"use client";

import React, { useState } from "react";
import { useTheme, WhisperType } from "../context/ThemeContext";
import { HaloSideNav, HaloBottomNav } from "../components/HaloNav";

/* --------- The Spark / Echo / Beam ikonları --------- */

/** Spark – dört köşeli umut yıldızı */
const SparkIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="hope-icon"
    aria-hidden="true"
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

/** Echo – su damlası / baloncuk tipi konuşma balonu */
const EchoIcon: React.FC<{ active?: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className={active ? "echo-icon active" : "echo-icon"}
    aria-hidden="true"
  >
    <path d="M12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 13.48 3.36 14.89 4 16.14L3 21L7.86 20C9.11 20.64 10.52 21 12 21Z" />
  </svg>
);

/** Beam – ışık huzmesi / gönderme oku */
const BeamIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" className="beam-icon" aria-hidden="true">
    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" />
  </svg>
);

/* ---------------------------------------------------------- */

function WhisperComposer({
  text,
  setText,
  onSend,
  hasText,
}: {
  text: string;
  setText: (value: string) => void;
  onSend: () => void;
  hasText: boolean;
}) {
  return (
    <section className="mb-6 sm:mb-8">
      <div
        className="relative overflow-hidden rounded-[2.3rem] border border-white/80 bg-white/80 shadow-[0_26px_90px_rgba(15,23,42,0.18)] backdrop-blur-2xl"
        style={{
          background:
            "radial-gradient(circle at top, #FFFFFF 0%, #F3F4FF 38%, #E5E9F5 100%)",
        }}
      >
        {/* Halo alanı */}
        <div className="relative flex justify-center pt-8 sm:pt-9">
          <div
            className="composer-halo-shell"
            data-active={hasText ? "true" : "false"}
          >
            <div className="composer-halo-rays" />
            <div className="composer-halo-core" />
            <div className="composer-halo-ring" />
          </div>
        </div>

        {/* Metin ve alan */}
        <div className="px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
          <div className="text-center">
            <p className="text-[0.7rem] font-medium tracking-[0.16em] text-slate-500/80">
              WRITE A WHISPER
            </p>
            <h2 className="mt-1 text-sm font-semibold tracking-tight text-slate-900 sm:text-base">
              Bugün evrene ne fısıldamak istersin?
            </h2>
            <p className="mt-1 text-[0.75rem] text-slate-500">
              Cümlelerin, şehir gürültüsünü bastırmak için değil; içine ince bir
              ışık halkası bırakmak için akıyor.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:mt-5 sm:flex-row sm:items-end">
            <div className="flex-1 rounded-[1.6rem] bg-white/90 px-3 py-2.5 shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:px-4 sm:py-3">
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nazikçe, sakince, sadece ihtiyacı olanların duyacağı kadar fısılda..."
                className="w-full resize-none border-none bg-transparent text-[0.85rem] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:text-[0.9rem]"
              />
            </div>

            <div className="flex justify-end sm:ml-2 sm:flex-none">
              <button
                type="button"
                onClick={onSend}
                disabled={!hasText}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-[0.8rem] font-medium shadow-[0_16px_40px_rgba(15,23,42,0.55)] transition-all ${
                  hasText
                    ? "bg-slate-900/95 text-slate-50 hover:bg-slate-900"
                    : "cursor-default bg-slate-900/30 text-slate-200"
                }`}
              >
                Fısılda
              </button>
            </div>
          </div>

          <p className="mt-2 text-[0.7rem] text-slate-400">
            Halo alanımız nazik tutuluyor; kırıcı, aşağılayıcı ya da şiddet dili
            içeren cümleler filtrelenir.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function FeedPage() {
  const {
    username,
    whispers,
    addWhisper,
    toggleLike,
    filterToxic,
    addComment,
  } = useTheme();
  const [text, setText] = useState("");

  const handleSendWhisper = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const check = filterToxic(trimmed);
    if (!check.ok) {
      alert(
        `Halo alanı nazik tutuluyor. Lütfen şu kelimeyi kaldır: "${check.word}".`
      );
      return;
    }

    addWhisper(trimmed);
    setText("");
  };

  const remaining = 280 - text.length;
  const displayName = username || "orkun";
  const hasText = text.trim().length > 0;

  // Hangi fısıltının yorum paneli açık?
  const [openCommentsFor, setOpenCommentsFor] = useState<number | null>(null);

  // Her fısıltı için taslak yorum metni
  const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>(
    {}
  );

  // Beam (paylaş) için kısa süreli animasyon durumu
  const [sharedId, setSharedId] = useState<number | null>(null);

  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const visibleWhispers = showOnlyMine
    ? whispers.filter((w) => w.isUserPost)
    : whispers;

  const [expandedWhisper, setExpandedWhisper] = useState<WhisperType | null>(
    null
  );

  const MAX_PREVIEW_CHARS = 260;

  const handleShareWhisper = async (w: WhisperType) => {
    // Animasyon: beam ışığı her durumda çalışsın
    setSharedId(w.id);
    setTimeout(() => {
      setSharedId((prev) => (prev === w.id ? null : prev));
    }, 550);

    // Güvenlik: sadece client tarafında çalışsın
    if (typeof window === "undefined") return;

    const shareUrl = `${window.location.origin}/?whisper=${w.id}`;
    const shareText = `"${w.content}" — @${w.username} • Halo Whispers`;

    try {
      // 1) Web Share API destekliyse (mobil tarayıcılar, Safari, Chrome vb.)
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: "Halo Whispers",
          text: shareText,
          url: shareUrl,
        });
      }
      // 2) Destek yoksa: linki panoya kopyala
      else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        alert(
          "Bağlantı panoya kopyalandı. Dilediğin yere yapıştırıp paylaşabilirsin."
        );
      } else {
        alert(
          "Bu tarayıcı doğrudan paylaşımı desteklemiyor. Bağlantıyı adres çubuğundan kopyalayabilirsin."
        );
      }
    } catch (err) {
      // Kullanıcı sheet’i iptal ederse buraya düşer; sessizce yok sayıyoruz.
      console.debug("Paylaşım iptal edildi veya hata:", err);
    }
  };

  return (
    <>
      {/* Spark / Echo / Beam için global CSS */}
      <style jsx global>{`
        /* --- THE SPARK: ikonun temel hali --- */
        .hope-icon {
          width: 22px;
          height: 22px;
          fill: transparent;
          stroke: #a1a1aa;
          stroke-width: 1.5px;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .hope-icon:hover {
          stroke: #ffd700;
          transform: scale(1.08);
        }

        /* --- KAPSAYICI BUTON --- */
        .hope-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          overflow: visible; /* patlama dışarı taşabilsin */
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        /* --- IŞIK PATLAMASI: gizli conic-gradient halo --- */
        .hope-btn::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 200%;
          height: 200%;
          border-radius: 50%;
          z-index: -1;
          opacity: 0;

          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255, 215, 0, 0.8) 10%,
            transparent 20%,
            rgba(244, 196, 48, 0.6) 30%,
            transparent 40%,
            rgba(255, 215, 0, 0.8) 60%,
            transparent 100%
          );
          filter: blur(4px);
        }

        /* --- AKTİF DURUM: ikon + patlama --- */
        .hope-btn.active .hope-icon {
          fill: #f4c430; /* kehribar / bal */
          stroke: #f4c430;
          filter: drop-shadow(0 0 6px rgba(244, 196, 48, 0.6));
          animation: iconBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            forwards;
        }

        .hope-btn.active::before {
          animation: lightBurst 0.6s ease-out forwards;
        }

        /* --- İKONUN BÜZÜLÜP PATLAMASI --- */
        @keyframes iconBounce {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(0.6); /* enerji toplama */
          }
          60% {
            transform: scale(1.3); /* patlama */
          }
          100% {
            transform: scale(1); /* yerine oturma */
          }
        }

        /* --- CONIC GRADIENT IŞIK PATLAMASI --- */
        @keyframes lightBurst {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -50%) scale(0.2) rotate(10deg);
            opacity: 1;
          }
          60% {
            transform: translate(-50%, -50%) scale(2.5) rotate(45deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(3.5) rotate(90deg);
            opacity: 0;
          }
        }

        /* THE ECHO – yorum balonu */
        .echo-icon {
          width: 22px;
          height: 22px;
          fill: transparent;
          stroke: #a1a1aa;
          stroke-width: 1.5px;
          transition: all 0.4s ease;
        }

        .echo-icon.active {
          stroke: #bfdbfe;
          fill: rgba(191, 219, 254, 0.3);
          filter: drop-shadow(0 0 5px rgba(191, 219, 254, 0.5));
          transform: translateY(-2px);
        }

        /* --- THE BEAM: ışık huzmesi paylaş butonu --- */

        .beam-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: visible; /* ışık dışarı taşsın */
        }

        /* Arkadaki ışık izi */
        .beam-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          margin: auto;
          width: 140%;
          height: 140%;
          border-radius: 999px;
          opacity: 0;
          pointer-events: none;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.75) 40%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(4px);
          transform: translate(0, 0) scale(0.5);
        }

        .beam-icon {
          width: 22px;
          height: 22px;
          fill: transparent;
          stroke: #a1a1aa;
          stroke-width: 1.5px;
          transition: all 0.25s ease;
        }

        .beam-btn:hover .beam-icon {
          stroke: #cbd5f5;
        }

        /* Tıklama anı: ışık gönderiliyor */
        .beam-btn.shared .beam-icon {
          stroke: #ffffff;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.85));
          animation: beamPulse 0.5s ease-out;
        }

        .beam-btn.shared::before {
          opacity: 1;
          animation: beamShoot 0.5s ease-out forwards;
        }

        @keyframes beamShoot {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6) rotate(0deg);
          }
          40% {
            opacity: 1;
            transform: translate(4px, -4px) scale(0.9) rotate(8deg);
          }
          100% {
            opacity: 0;
            transform: translate(12px, -12px) scale(1.1) rotate(15deg);
          }
        }

        @keyframes beamPulse {
          0% {
            transform: scale(1);
          }
          40% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        /* --- WHISPER COMPOSER HALO --- */

        .composer-halo-shell {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 999px;
        }

        .composer-halo-rays {
          position: absolute;
          inset: -45%;
          margin: auto;
          border-radius: 999px;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(191, 219, 254, 0.4) 12%,
            transparent 24%,
            rgba(251, 191, 36, 0.3) 38%,
            transparent 52%,
            rgba(191, 219, 254, 0.4) 68%,
            transparent 100%
          );
          filter: blur(18px);
          opacity: 0.7;
          animation: composerRays 26s linear infinite;
        }

        .composer-halo-core {
          position: absolute;
          inset: 16%;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            #ffffff 0%,
            #fef9c3 45%,
            rgba(254, 249, 195, 0.4) 75%,
            rgba(254, 249, 195, 0.05) 100%
          );
          box-shadow:
            0 0 40px rgba(252, 211, 77, 0.55),
            0 0 0 1px rgba(255, 255, 255, 0.9);
        }

        .composer-halo-ring {
          position: absolute;
          inset: 10%;
          border-radius: 999px;
          border: 2px solid rgba(255, 243, 210, 0.75);
          box-shadow:
            0 0 26px 6px rgba(252, 211, 77, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.9);
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.22) 38%,
            rgba(255, 255, 255, 0.06) 100%
          );
          backdrop-filter: blur(6px);
          animation: composerPulse 6s ease-in-out infinite;
        }

        /* Yazı yazılmaya başlandığında halonun parlamasını artır */
        .composer-halo-shell[data-active="true"] .composer-halo-ring {
          animation-duration: 3.2s;
          box-shadow:
            0 0 32px 10px rgba(252, 211, 77, 0.75),
            inset 0 0 24px rgba(255, 255, 255, 1);
        }

        @keyframes composerRays {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes composerPulse {
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

        /* --- WHISPER CARD: Divine Material Shell --- */

        .whisper-card {
          position: relative;
          margin-bottom: 1rem;
          padding: 1rem 1.1rem 0.85rem;
          border-radius: 1.7rem;

          /* Glass / layer */
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.94),
            rgba(249, 250, 255, 0.9)
          );
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            0 18px 55px rgba(15, 23, 42, 0.12),
            0 0 0 1px rgba(148, 163, 184, 0.08);
          backdrop-filter: blur(18px);

          overflow: hidden;
        }

        /* Particle glow katmanı – çok hafif */
        .whisper-card::before {
          content: "";
          position: absolute;
          inset: -30%;
          opacity: 0;
          background:
            radial-gradient(
              circle at top left,
              rgba(248, 250, 252, 0.95) 0%,
              transparent 45%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(254, 243, 199, 0.5) 0%,
              transparent 55%
            );
          pointer-events: none;
          transition: opacity 320ms ease-out, transform 320ms ease-out;
          transform: scale(0.96);
        }

        .whisper-card:hover::before {
          opacity: 1;
          transform: scale(1);
        }

        .whisper-card + .whisper-card {
          margin-top: 0.65rem;
        }

        /* HEADER */

        .whisper-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.35rem;
        }

        .whisper-author {
          font-size: 0.8rem;
          font-weight: 600;
          color: #0f172a; /* slate-900 */
        }

        .whisper-dot {
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.8);
        }

        .whisper-time {
          font-size: 0.7rem;
          color: #9ca3af; /* slate-400/500 */
        }

        .whisper-hop {
          font-size: 0.7rem;
          font-weight: 500;
          color: #f59e0b; /* amber-500 */
        }

        /* BODY */

        .whisper-card-body {
          padding-top: 0.2rem;
          padding-bottom: 0.4rem;
        }

        .whisper-text {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #111827; /* slate-900 */
          white-space: pre-wrap;
        }

        /* ACTIONS */

        .whisper-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.35rem;
          padding-top: 0.35rem;
          border-top: 1px solid rgba(226, 232, 240, 0.9);
        }

        .whisper-actions-right {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Zaten hope-btn / echo-icon / beam-icon için CSS’in var.
           Burada sadece hizalamayı netleştirmek için bir tık ayar: */

        .hope-btn,
        .echo-btn,
        .beam-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* YORUM PANELİ */

        .whisper-comments-panel {
          margin-top: 0.45rem;
          padding: 0.6rem 0.8rem 0.75rem;
          border-radius: 1.2rem;
          background: rgba(248, 250, 252, 0.95);
          border: 1px solid rgba(241, 245, 249, 1);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
        }

        /* Kartların giriş animasyonu */
        .whisper-card {
          animation: whisperCardEnter 520ms ease-out;
          transform-origin: center;
        }

        @keyframes whisperCardEnter {
          0% {
            opacity: 0;
            transform: translateY(6px) scale(0.99);
          }
          60% {
            opacity: 1;
            transform: translateY(0px) scale(1.005);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        /* Hover’da çok hafif yükselme (zıplamayan, kaymayan) */
        .whisper-card:hover {
          transform: translateY(-2px);
          box-shadow:
            0 22px 60px rgba(15, 23, 42, 0.18),
            0 0 0 1px rgba(148, 163, 184, 0.1);
        }

        .whisper-text--clamped {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .whisper-readmore {
          margin-top: 0.35rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: #334155; /* slate-700 */
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          position: relative;
        }

        .whisper-readmore::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -1px;
          width: 100%;
          height: 1px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(148, 163, 184, 0.6),
            rgba(251, 191, 36, 0.6)
          );
          opacity: 0.7;
        }

        .whisper-readmore:hover {
          color: #0f172a;
        }

        .whisper-readmore:hover::after {
          opacity: 1;
        }

        .whisper-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: radial-gradient(
            circle at center,
            rgba(248, 250, 252, 0.6),
            rgba(15, 23, 42, 0.55)
          );
          backdrop-filter: blur(18px);
        }

        .whisper-modal-card {
          width: 100%;
          max-width: 540px;
          max-height: min(540px, 80vh);
          border-radius: 1.8rem;
          padding: 1.1rem 1.2rem 1.2rem;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.96),
            rgba(248, 250, 252, 0.98)
          );
          box-shadow:
            0 26px 90px rgba(15, 23, 42, 0.45),
            0 0 0 1px rgba(148, 163, 184, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.95);
          display: flex;
          flex-direction: column;
          animation: whisperModalIn 320ms ease-out;
        }

        @keyframes whisperModalIn {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }

        .whisper-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding-bottom: 0.45rem;
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
        }

        .whisper-modal-body {
          margin-top: 0.6rem;
          padding-right: 0.2rem;
          overflow-y: auto;
        }

        .whisper-modal-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #020617; /* slate-950 */
          white-space: pre-wrap;
        }

        .whisper-modal-close {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          color: #0f172a;
          background: rgba(241, 245, 249, 0.9);
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
          transition: background 180ms ease-out, transform 160ms ease-out;
        }

        .whisper-modal-close:hover {
          background: rgba(226, 232, 240, 1);
          transform: translateY(-1px);
        }

        .whisper-modal-close:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
      `}</style>

      <div
        className="min-h-screen w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6"
        style={{
          background:
            "radial-gradient(circle at top, #FFFFFF 0%, #F3F4FA 45%, #E9EDF7 100%)",
        }}
      >
        <div className="relative mx-auto flex w-full max-w-6xl gap-6">
          <HaloSideNav />

          <div className="flex flex-1 flex-col gap-4 rounded-[2.5rem] bg-white/80 p-4 shadow-[0_28px_110px_rgba(15,23,42,0.20)] backdrop-blur-2xl lg:flex-row lg:p-6">
            {/* ORTA SÜTUN – STREAM */}
            <main className="flex-1 border-r border-slate-100/80 pr-0 lg:pr-6">
              {/* Başlık */}
              <header className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                  Stream
                </h1>
              </header>

              <WhisperComposer
                text={text}
                setText={setText}
                onSend={handleSendWhisper}
                hasText={hasText}
              />

              {/* WHISPER LİSTESİ */}
              <section className="space-y-3">
                <div className="mb-3 flex items-center justify-between gap-3 text-[0.8rem] text-slate-500">
                  <span>
                    {showOnlyMine
                      ? "Şu an sadece kendi fısıltıların akıyor."
                      : "Şu an herkesin fısıltıları akıyor."}
                  </span>

                  <div className="inline-flex items-center rounded-full bg-slate-100/70 p-1 text-[0.75rem]">
                    <button
                      type="button"
                      onClick={() => setShowOnlyMine(false)}
                      className={`rounded-full px-3 py-1 ${
                        !showOnlyMine
                          ? "bg-white text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.25)]"
                          : "text-slate-500"
                      }`}
                    >
                      All whispers
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowOnlyMine(true)}
                      className={`rounded-full px-3 py-1 ${
                        showOnlyMine
                          ? "bg-slate-900 text-slate-50 shadow-[0_8px_18px_rgba(15,23,42,0.45)]"
                          : "text-slate-500"
                      }`}
                    >
                      Only mine
                    </button>
                  </div>
                </div>

                {visibleWhispers.length === 0 ? (
                  <p className="mt-6 text-center text-xs text-slate-500">
                    Şu an burada hiç fısıltı yok. İlk cümleni yazdığında, bu
                    alan da ışıkla dolacak.
                  </p>
                ) : (
                  visibleWhispers.map((w) => {
                    const hasComments = (w.comments ?? []).length > 0;
                    const isCommentsOpen = openCommentsFor === w.id;
                    const commentDraft = commentDrafts[w.id] ?? "";

                    return (
                      <article key={w.id} className="whisper-card">
                        <div className="whisper-card-header mb-1 flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            {/* Mini avatar */}
                            <div className="relative h-7 w-7 rounded-full bg-transparent">
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background:
                                    "radial-gradient(circle, #FFFFFF 0%, #FFF1BF 45%, rgba(255,241,191,0.08) 80%)",
                                  boxShadow:
                                    "0 0 12px rgba(251,191,36,0.45), 0 0 0 1px rgba(255,255,255,0.9)",
                                }}
                              />
                            </div>
                            <span className="whisper-author font-medium text-slate-800">
                              @{displayName}
                            </span>
                            <span className="whisper-dot">·</span>
                            <span className="whisper-time text-[0.7rem] text-slate-400">
                              {w.time || "Just now"}
                            </span>
                          </div>
                          <div className="whisper-hop text-[0.7rem] text-slate-500">
                            {Math.max(0, w.hop)} Hope
                          </div>
                        </div>

                        <div className="whisper-card-body">
                          {w.content.length > MAX_PREVIEW_CHARS ? (
                            <>
                              <p className="whisper-text whisper-text--clamped text-sm text-slate-800">
                                {w.content}
                              </p>
                              <button
                                type="button"
                                className="whisper-readmore"
                                onClick={() => setExpandedWhisper(w)}
                              >
                                Devamını oku
                              </button>
                            </>
                          ) : (
                            <p className="whisper-text text-sm text-slate-800">
                              {w.content}
                            </p>
                          )}
                        </div>

                        {/* ACTION BAR: Echo · Beam · Spark */}
                        <div className="whisper-card-actions mt-3 flex items-center text-[0.8rem] text-slate-400">
                          <div className="flex-1" />
                          <div className="whisper-actions-right flex items-center gap-4">
                            {/* Echo (yorum) */}
                            <button
                              type="button"
                              onClick={() =>
                                setOpenCommentsFor((prev) =>
                                  prev === w.id ? null : w.id
                                )
                              }
                              className="inline-flex items-center gap-1 hover:text-slate-500"
                            >
                              <EchoIcon active={hasComments || isCommentsOpen} />
                              {(w.comments ?? []).length > 0 && (
                                <span>{(w.comments ?? []).length}</span>
                              )}
                            </button>

                            {/* Beam (paylaş) */}
                            <button
                              type="button"
                              onClick={() => handleShareWhisper(w)}
                              className={`beam-btn inline-flex items-center gap-1 ${
                                sharedId === w.id ? "shared" : ""
                              }`}
                            >
                              <BeamIcon />
                            </button>

                            {/* Hope / Spark */}
                            <button
                              type="button"
                              onClick={() => toggleLike(w.id)}
                              className={`hope-btn inline-flex items-center gap-1 ${
                                w.isLiked ? "active text-amber-500" : ""
                              }`}
                            >
                              <SparkIcon />
                              <span>{Math.max(0, w.hop)}</span>
                            </button>
                          </div>
                        </div>

                        {isCommentsOpen && (
                          <div className="whisper-comments-panel mt-3 rounded-2xl bg-slate-50/80 px-3 py-3 text-[0.8rem] text-slate-600">
                            {/* Mevcut yorumlar */}
                            {(w.comments ?? []).length > 0 && (
                              <div className="mb-2 space-y-2">
                                {(w.comments ?? []).map((c) => (
                                  <div key={c.id} className="flex gap-2">
                                    <div className="mt-1 h-6 w-6 flex-none rounded-full bg-slate-100">
                                      {/* minik halo efekti */}
                                      <div
                                        className="h-full w-full rounded-full"
                                        style={{
                                          background:
                                            "radial-gradient(circle, #FFFFFF 0%, #E5ECFF 50%, rgba(226,232,255,0.1) 80%)",
                                          boxShadow:
                                            "0 0 6px rgba(148,163,184,0.45), 0 0 0 1px rgba(255,255,255,0.9)",
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-[0.75rem] font-medium text-slate-800">
                                          @{c.username}
                                        </span>
                                        <span className="text-[0.7rem] text-slate-400">
                                          {c.time}
                                        </span>
                                      </div>
                                      <p className="mt-0.5 text-[0.8rem] text-slate-700">
                                        {c.content}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Yeni yorum alanı */}
                            <div className="flex items-end gap-2">
                              <div className="flex-1 rounded-2xl bg-white/80 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                                <textarea
                                  rows={1}
                                  value={commentDraft}
                                  onChange={(e) =>
                                    setCommentDrafts((prev) => ({
                                      ...prev,
                                      [w.id]: e.target.value,
                                    }))
                                  }
                                  placeholder="Nazik bir yankı bırak..."
                                  className="h-10 w-full resize-none border-none bg-transparent text-[0.8rem] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const trimmed = commentDraft.trim();
                                  if (!trimmed) return;

                                  const check = filterToxic(trimmed);
                                  if (!check.ok) {
                                    alert(
                                      `Halo alanı nazik tutuluyor. Lütfen şu kelimeyi kaldır: "${check.word}".`
                                    );
                                    return;
                                  }

                                  addComment(w.id, trimmed);
                                  setCommentDrafts((prev) => ({
                                    ...prev,
                                    [w.id]: "",
                                  }));
                                }}
                                className="inline-flex h-9 items-center rounded-full bg-slate-900/95 px-3 text-[0.75rem] font-medium text-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.55)] hover:bg-slate-900"
                              >
                                Yankıla
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })
                )}

                {whispers.length === 0 && (
                  <p className="text-xs text-slate-400">
                    İlk fısıltını yazdığında burada parlayacak.
                  </p>
                )}
              </section>

              {expandedWhisper && (
                <div
                  className="whisper-modal-backdrop"
                  onClick={() => setExpandedWhisper(null)}
                >
                  <div
                    className="whisper-modal-card"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="whisper-modal-header">
                      <div className="flex flex-col">
                        <span className="whisper-author">
                          {expandedWhisper.username}
                        </span>
                        <span className="whisper-time">
                          {expandedWhisper.time || "Just now"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="whisper-modal-close"
                        onClick={() => setExpandedWhisper(null)}
                      >
                        Kapat
                      </button>
                    </div>

                    <div className="whisper-modal-body">
                      <p className="whisper-modal-text">
                        {expandedWhisper.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* SAĞ SÜTUN – PARLAYAN HALELER */}
            <aside className="mt-4 w-full lg:mt-0 lg:w-72">
              <div className="rounded-3xl bg-white/85 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <p className="text-[0.75rem] font-medium tracking-[0.12em] text-slate-400">
                  PARLAYAN HALELER
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">#Gülümse</p>
                    <p className="text-[0.75rem] text-slate-400">2.4k Hopes</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      #KendineİyiBak
                    </p>
                    <p className="text-[0.75rem] text-slate-400">1.8k Hopes</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      #SabahKahvesi
                    </p>
                    <p className="text-[0.75rem] text-slate-400">900 Hopes</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <HaloBottomNav />
      </div>
    </>
  );
}
