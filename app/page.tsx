// DOSYA: app/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="relative w-full h-screen bg-[#FDFBF7] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Arkaplan Efekti: Çok hafif, hareketli bir sis */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-100 blur-[120px]"
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-amber-50 blur-[120px]"
        />
      </div>

      {/* İçerik */}
      <div className="z-10 flex flex-col items-center text-center space-y-8 px-6">
        
        {/* Logo / Başlık Animasyonu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="w-16 h-16 mb-6 mx-auto rounded-full bg-gradient-to-tr from-amber-100 to-white border border-white shadow-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full blur-md"></div>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-[#2D3436] tracking-tight mb-4">
            Halo Whispers
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide max-w-md mx-auto">
            Whisper kindness, gather hope.
          </p>
        </motion.div>

        {/* Buton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <Link href="/mood">
            <button className="group relative px-8 py-4 bg-transparent border border-gray-300 text-gray-600 rounded-full overflow-hidden transition-all hover:border-gray-400 hover:text-gray-800 hover:shadow-lg">
              <span className="relative z-10 text-sm font-bold tracking-widest uppercase">Get Started</span>
              <div className="absolute inset-0 bg-white/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </Link>
        </motion.div>

      </div>

      <div className="absolute bottom-10 text-[10px] text-gray-400 tracking-widest uppercase opacity-60">
        A Safe Space for Goodness
      </div>

    </div>
  );
}