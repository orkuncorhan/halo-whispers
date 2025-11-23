"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// DİKKAT: Eğer bu dosya 'app/mood/page.tsx' içindeyse import yolu "../context/ThemeContext" olmalı.
// Eğer 'app/page.tsx' içindeyse "./context/ThemeContext" olmalı.
// Garanti olması için @ alias'ı kullanıyoruz:
import { useTheme } from "@/app/context/ThemeContext"; 

export default function HaloWhispersMood() {
  const { mood, setMood } = useTheme(); // Global hafızadan veriyi çek
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    // Nötr (Hope)
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
    <div className={`relative w-full h-screen overflow-hidden font-sans flex items-center justify-center transition-colors duration-1000 ${theme.bg}`}>
      
      {/* --- ARKA PLAN DOKUSU --- */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-lines.png")' }}></div>

      {/* --- ANA CAM KART --- */}
      <div className="relative z-10 w-[90%] max-w-5xl h-[600px] bg-white/40 backdrop-blur-xl border border-white/80 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] flex overflow-hidden ring-1 ring-white/50">
        
        {/* SOL TARAFI: HALE */}
        <div className="w-5/12 h-full flex items-center justify-center relative border-r border-white/30 overflow-hidden bg-white/10">
           
           {/* 1. KATMAN: Glow */}
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className={`absolute w-[500px] h-[500px] rounded-full blur-[80px] bg-gradient-radial transition-colors duration-1000 ${theme.glow}`}
           />

           {/* 2. KATMAN: Rays */}
           <motion.div
             animate={{ rotate: 360 }}
             transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             className="absolute w-[400px] h-[400px] opacity-70"
           >
              <div className={`w-full h-full bg-gradient-conic blur-[40px] transition-colors duration-1000 ${theme.ray}`} 
                   style={{ background: `conic-gradient(from 0deg, transparent 0deg, currentColor 20deg, transparent 120deg, currentColor 160deg, transparent 360deg)` }} />
           </motion.div>

           {/* 3. KATMAN: Core */}
           <motion.div
             animate={{ scale: [1, 1.05, 1] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className={`relative w-[220px] h-[220px] rounded-full blur-[30px] shadow-[0_0_60px_rgba(255,255,255,0.6)] transition-colors duration-1000 ${theme.core}`}
           />

           {/* 4. KATMAN: Flare */}
           <div className="absolute w-[120px] h-[120px] bg-white rounded-full blur-[20px] mix-blend-overlay opacity-90"></div>

        </div>

        {/* SAĞ TARAFI: İÇERİK */}
        <div className="w-7/12 h-full flex flex-col justify-center px-20 space-y-12">
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold tracking-[0.3em] text-gray-400 uppercase">Welcome Space</h4>
            <h1 className="text-6xl font-serif text-gray-800 tracking-tight">Halo Whispers</h1>
            <p className="text-gray-500 text-base font-light leading-relaxed">
              İçindeki sesi, iyilikle yankılanan bir frekansa ayarla.
            </p>
          </div>

          {/* --- SLIDER --- */}
          <div className="space-y-6">
            <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-gray-400">
              <span>Mood</span>
              <span className={`transition-colors duration-300 ${theme.text}`}>
                {theme.status}
              </span>
            </div>

            <div className="relative w-full h-10 flex items-center group">
              <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-gray-800 transition-all duration-100 ease-out" 
                   style={{ width: `${mood}%` }}
                 />
              </div>

              <input 
                type="range" 
                min="0" 
                max="100" 
                value={mood} 
                onChange={(e) => setMood(parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-30"
              />

              <div 
                className="absolute h-6 w-6 bg-white border border-gray-100 shadow-md rounded-full pointer-events-none z-20 transition-all duration-100 ease-out flex items-center justify-center"
                style={{ 
                  left: `${mood}%`,
                  transform: 'translateX(-50%)' 
                }}
              >
                <div className="w-2 h-2 bg-gray-800 rounded-full opacity-30"></div>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
              <span>Heavy</span>
              <span>Neutral</span>
              <span>Light</span>
            </div>
          </div>

      {/* --- NAVİGASYON BUTONU --- */}
          {/* Artık direkt Feed'e değil, önce kimlik oluşturmaya (Login) gidiyoruz */}
          <Link href="/login" className="w-full block">
            <button className="w-full py-5 bg-[#2D3436] text-white rounded-2xl text-sm font-medium tracking-wider shadow-xl hover:bg-black hover:scale-[1.02] transition-all duration-300">
              Enter the Stream
            </button>
          </Link>

        </div>
      </div>
    </div>
  );
}