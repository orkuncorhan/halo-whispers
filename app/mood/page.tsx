// DOSYA: app/mood/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Yönlendirme motoru
// Relative path
import { useTheme } from "../context/ThemeContext";

export default function HaloWhispersMood() {
  // 'username' bilgisini de çekiyoruz ki kontrol edelim
  const { mood, setMood, username } = useTheme(); 
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- AKILLI GEÇİŞ FONKSİYONU ---
  const handleEnter = () => {
    // Eğer hafızada zaten bir isim varsa, Login'i atla, direkt Feed'e git
    if (username && username !== "Halo Walker") {
      router.push("/feed");
    } else {
      // İsim yoksa (ilk geliş), isim sormaya (Login) git
      router.push("/login");
    }
  };

  // RENK MANTIĞI
  const getColors = (val: number) => {
    if (val < 30) return {
      bg: "bg-[#F0F4F8]",
      core: "bg-blue-200",
      glow: "from-blue-300/60 via-indigo-200/40 to-transparent",
      ray: "from-blue-400/30 via-transparent to-transparent",
      text: "text-slate-600",
      status: "Heavy"
    };
    if (val > 70) return {
      bg: "bg-[#FFF0F5]",
      core: "bg-rose-200",
      glow: "from-rose-300/60 via-pink-200/40 to-transparent",
      ray: "from-rose-400/30 via-transparent to-transparent",
      text: "text-rose-500",
      status: "Radiant"
    };
    return {
      bg: "bg-[#FFF9F0]",
      core: "bg-amber-100",
      glow: "from-amber-200/60 via-orange-100/40 to-transparent",
      ray: "from-amber-300/30 via-transparent to-transparent",
      text: "text-amber-600",
      status: "Calm"
    };
  };

  const theme = getColors(mood);

  if (!mounted) return <div className="w-full h-screen bg-white" />;

  return (
    <div className={`relative w-full min-h-screen overflow-hidden font-sans flex items-center justify-center transition-colors duration-1000 ${theme.bg} p-4`}>
      
      {/* Arkaplan Dokusu */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-lines.png")' }}></div>

      {/* --- ANA CAM KART --- */}
      <div className="relative z-10 w-full max-w-5xl h-auto md:h-[600px] bg-white/40 backdrop-blur-xl border border-white/80 rounded-[32px] md:rounded-[48px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden ring-1 ring-white/50">
        
        {/* --- SOL TARAFI: HALE --- */}
        <div className="w-full h-64 md:w-5/12 md:h-full flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/30 overflow-hidden bg-white/10 flex-shrink-0">
           
           {/* Hale Animasyonları */}
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className={`absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full blur-[60px] md:blur-[80px] bg-gradient-radial transition-colors duration-1000 ${theme.glow}`}
           />
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] opacity-70"
           >
              <div className={`w-full h-full bg-gradient-conic blur-[40px] transition-colors duration-1000 ${theme.ray}`} 
                   style={{ background: `conic-gradient(from 0deg, transparent 0deg, currentColor 20deg, transparent 120deg, currentColor 160deg, transparent 360deg)` }} />
           </motion.div>
           <motion.div
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className={`relative w-[150px] h-[150px] md:w-[220px] md:h-[220px] rounded-full blur-[20px] md:blur-[30px] shadow-[0_0_60px_rgba(255,255,255,0.6)] transition-colors duration-1000 ${theme.core}`}
           />
           <div className="absolute w-[80px] h-[80px] md:w-[120px] md:h-[120px] bg-white rounded-full blur-[15px] md:blur-[20px] mix-blend-overlay opacity-90"></div>
        </div>

        {/* --- SAĞ TARAFI: İÇERİK --- */}
        <div className="w-full md:w-7/12 h-full flex flex-col justify-center px-8 py-10 md:px-20 md:py-0 space-y-8 md:space-y-12">
          
          <div className="space-y-3 md:space-y-4 text-center md:text-left">
            <h4 className="text-[10px] font-extrabold tracking-[0.3em] text-gray-400 uppercase">Welcome Space</h4>
            <h1 className="text-4xl md:text-6xl font-serif text-gray-800 tracking-tight">Halo Whispers</h1>
            <p className="text-gray-500 text-sm font-light leading-relaxed">
              İçindeki sesi, iyilikle yankılanan bir frekansa ayarla.
            </p>
          </div>

          {/* Slider */}
          <div className="space-y-6">
            <div className="flex justify-between text-[10px] md:text-[11px] font-bold tracking-widest uppercase text-gray-400">
              <span>Mood</span>
              <span className={`transition-colors duration-300 ${theme.text}`}>
                {theme.status}
              </span>
            </div>

            <div className="relative w-full h-8 md:h-10 flex items-center group">
              <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gray-800 transition-all duration-100 ease-out" 
                   style={{ width: `${mood}%` }}
                 />
              </div>
              <input 
                type="range" min="0" max="100" value={mood} 
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-30"
              />
              <div 
                className="absolute h-5 w-5 md:h-6 md:w-6 bg-white border border-gray-100 shadow-md rounded-full pointer-events-none z-20 transition-all duration-100 ease-out flex items-center justify-center"
                style={{ left: `${mood}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 rounded-full opacity-30"></div>
              </div>
            </div>

            <div className="flex justify-between text-[9px] md:text-[10px] text-gray-400 font-medium">
              <span>Heavy</span>
              <span>Neutral</span>
              <span>Light</span>
            </div>
          </div>

          {/* BUTON (DEĞİŞEN KISIM) */}
          {/* Artık Link değil, Button. Tıklayınca kontrol edip yönlendiriyor. */}
          <button 
            onClick={handleEnter}
            className="w-full py-4 md:py-5 bg-[#2D3436] text-white rounded-2xl text-xs md:text-sm font-medium tracking-wider shadow-xl hover:bg-black hover:scale-[1.02] transition-all duration-300"
          >
            Enter the Stream
          </button>

        </div>
      </div>
    </div>
  );
}