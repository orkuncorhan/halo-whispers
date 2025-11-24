// DOSYA: app/not-found.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
// DÜZELTME BURADA: Yan odadaki context'i çağırıyoruz (Relative Path)
import { useTheme } from "./context/ThemeContext";

export default function NotFound() {
  // Varsayılan renkler (Eğer context çalışmazsa)
  let themeBg = "bg-[#F4F6F9]";
  let themeHalo = "bg-gray-200";
  let themeGradient = "from-gray-100 to-white";
  
  try {
    // Context'ten renkleri çekmeye çalışıyoruz
    const { getThemeColors } = useTheme();
    const colors = getThemeColors();
    themeBg = colors.bg;
    themeHalo = colors.halo;
    themeGradient = colors.gradient;
  } catch (e) {
    // Hata olursa varsayılanlar kalır
  }

  return (
    <div className={`h-screen w-full flex flex-col items-center justify-center text-center p-6 transition-colors duration-1000 ${themeBg}`}>
      
      {/* Arkaplan Sisi */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b opacity-40 ${themeGradient}`}>
         <motion.div 
           animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
           transition={{ duration: 8, repeat: Infinity }}
           className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200 rounded-full blur-[100px] opacity-50"
         />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Kaybolmuş Hale Animasyonu */}
        <div className="relative mb-8">
            <motion.div 
              animate={{ scale: [1, 0.9, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`w-32 h-32 rounded-full blur-[40px] ${themeHalo}`}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-serif text-gray-300 font-bold">
                404
            </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 tracking-tight">
          Fısıltı Rüzgara Karıştı...
        </h1>
        
        <p className="text-gray-500 font-light text-sm md:text-base max-w-md mb-10 leading-relaxed">
          Aradığın sayfa ya hiç var olmadı ya da çoktan gökyüzüne yükseldi. 
          Endişelenme, yolunu kaybetmek de yolculuğun bir parçasıdır.
        </p>

        <Link href="/feed">
          <button className="px-8 py-4 bg-[#2D3436] text-white rounded-2xl text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-3 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/>
            <span>Akışa Geri Dön</span>
          </button>
        </Link>

      </div>

      {/* Alt Bilgi */}
      <div className="absolute bottom-10 text-[10px] text-gray-400 uppercase tracking-[0.2em] opacity-60">
        Halo Whispers • Lost in Space
      </div>

    </div>
  );
}