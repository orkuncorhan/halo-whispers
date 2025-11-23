// DOSYA: app/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation"; 
import { ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { getThemeColors, setUsername } = useTheme();
  const theme = getThemeColors();
  const router = useRouter();
  
  const [inputName, setInputName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    if (inputName.trim()) {
      setUsername(inputName); 
      router.push("/feed");   
    }
  };

  if (!mounted) return <div className="h-screen w-full bg-white"/>;

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg} flex items-center justify-center px-6`}>
      
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr opacity-50 transition-all duration-1000 ${theme.gradient}`} />
      
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${theme.halo.replace("bg-", "bg-")}`}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12"
      >
        
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <div className={`w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center transition-colors duration-1000 ${theme.halo}`}>
                <Sparkles size={20} className="text-white opacity-80" />
             </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Claim Your Aura</h1>
          <p className="text-gray-500 font-light text-sm">
            Bu dünyada nasıl anılmak istersin?
          </p>
        </div>

        <div className="space-y-6">
          
          <div className="relative group">
            {/* DÜZELTİLEN KISIM BURASI: placeholder artık genel */}
            <input 
              type="text" 
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="halo_walker" 
              className="w-full bg-white/60 border border-white/50 rounded-2xl px-6 py-4 text-lg font-medium text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/80 focus:bg-white/80 transition-all shadow-inner"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold opacity-50 pointer-events-none">@</span>
            <style jsx>{`
              input:not(:placeholder-shown) { padding-left: 2.5rem; }
              input:placeholder-shown + span { display: none; }
            `}</style>
          </div>

          <div className="flex gap-4 opacity-60 hover:opacity-100 transition-opacity">
             <button className="flex-1 py-3 bg-white/50 border border-white rounded-xl text-xs font-bold text-gray-600 hover:bg-white transition-colors">Google</button>
             <button className="flex-1 py-3 bg-white/50 border border-white rounded-xl text-xs font-bold text-gray-600 hover:bg-white transition-colors">Apple</button>
          </div>

          <button 
            onClick={handleLogin}
            disabled={!inputName}
            className={`w-full py-4 mt-4 text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 transition-all ${
              inputName 
              ? "bg-[#2D3436] hover:scale-[1.02] hover:shadow-xl cursor-pointer" 
              : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            <span>Begin Journey</span>
            <ArrowRight size={16} />
          </button>

        </div>

        <p className="text-center text-[10px] text-gray-400 mt-8">
          By entering, you agree to spread kindness & hope.
        </p>

      </motion.div>
    </div>
  );
}