// DOSYA: app/profile/[username]/page.tsx
"use client";

import React, { useState, use } from "react";
import { motion } from "framer-motion";
// DÜZELTME 1: İki kat yukarı çıkıyoruz (../../)
import { useTheme } from "../../context/ThemeContext";
import Link from "next/link";
import { ArrowLeft, Star, Share2, UserPlus, Check, Home, Bell, User, MessageCircle } from "lucide-react";

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // useTheme'i güvenli şekilde çekiyoruz
  const themeContext = useTheme();
  const theme = themeContext ? themeContext.getThemeColors() : { bg: "bg-gray-50", halo: "bg-gray-200", accent: "text-gray-800" };
  
  const resolvedParams = use(params);
  const username = resolvedParams.username; 

  const userProfile = {
    name: username.charAt(0).toUpperCase() + username.slice(1).replace("_", " "), 
    bio: "Gökyüzüne notlar bırakıyorum. 🌙✨",
    haloColor: "bg-rose-100", 
    haloGlow: "shadow-[0_0_60px_rgba(255,182,193,0.6)]",
    stats: { whispers: 42, hope: 890, following: 150 }
  };

  const userWhispers = [
    { id: 1, content: "Bazen sadece durup derin bir nefes almak, dünyayı yavaşlatmaya yeter.", time: "2h ago", hop: 45 },
    { id: 2, content: "Kendine nazik ol, sen de bir bahçesin ve bazen dinlenmeye ihtiyacın var.", time: "1d ago", hop: 120 },
    { id: 3, content: "Bugün birine kapıyı tuttum, teşekkür ettiğindeki gülümsemesi paha biçilemezdi.", time: "3d ago", hop: 85 },
  ];

  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg} pb-24 md:pb-0`}>
      
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-tr opacity-40 transition-all duration-1000 ${theme.gradient}`} />

      <div className="relative z-10 max-w-2xl mx-auto pt-10 px-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/feed" className="p-3 rounded-full bg-white/50 hover:bg-white transition-all shadow-sm text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <span className="text-sm font-bold tracking-widest uppercase text-gray-400">Profile View</span>
        </div>

        {/* KULLANICI KARTI */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[40px] shadow-xl overflow-hidden mb-10"
        >
          <div className={`h-32 w-full opacity-60 ${userProfile.haloColor}`} />

          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
              <div className={`w-32 h-32 rounded-full border-4 border-white flex items-center justify-center ${userProfile.haloColor} ${userProfile.haloGlow}`}>
                 <div className="w-28 h-28 bg-white/40 rounded-full backdrop-blur-sm" />
              </div>
              
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
                  isFollowing 
                  ? "bg-white text-gray-600 border border-gray-200" 
                  : "bg-[#2D3436] text-white hover:scale-105"
                }`}
              >
                {isFollowing ? <><Check size={16}/> Following</> : <><UserPlus size={16}/> Follow</>}
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-serif font-bold text-gray-800">{userProfile.name}</h1>
              <p className="text-sm font-bold text-gray-400">@{username}</p>
              <p className="text-gray-600 leading-relaxed font-light max-w-md pt-2">
                {userProfile.bio}
              </p>
            </div>

            <div className="flex gap-8 mt-6 border-t border-gray-200/50 pt-6 text-center sm:text-left">
              <div>
                <span className="block text-xl font-bold text-gray-800">{userProfile.stats.whispers}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Whispers</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-gray-800">{userProfile.stats.hope}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Hope</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-gray-800">{userProfile.stats.following}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Following</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KULLANICININ FISILTILARI */}
        <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6 pl-2">Recent Whispers</h3>
        
        <div className="space-y-4">
          {/* DÜZELTME 2: (whisper: any) diyerek TypeScript'i susturduk */}
          {userWhispers.map((whisper: any) => (
            <motion.div 
              key={whisper.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/40 hover:bg-white/60 border border-white/60 rounded-[24px] transition-colors shadow-sm cursor-pointer group"
            >
              <p className="text-gray-700 leading-relaxed mb-4 font-light text-lg">
                {whisper.content}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400 font-medium">{whisper.time}</span>
                <div className="flex gap-4 text-gray-400">
                   <div className="flex items-center gap-1 group-hover:text-yellow-500 transition-colors">
                     <Star size={16} /> <span className="text-xs">{whisper.hop}</span>
                   </div>
                   <div className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                     <Share2 size={16} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MOBİL ALT MENÜ */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-2 flex justify-around items-center z-50 pb-6">
        <Link href="/feed" className="p-3 rounded-full hover:bg-gray-100 transition-colors"><Home size={26} className="text-gray-400" /></Link>
        <Link href="/notifications" className="p-3 rounded-full hover:bg-gray-100 transition-colors relative"><Bell size={26} className="text-gray-400" /></Link>
        <Link href="/profile" className="p-3 rounded-full hover:bg-gray-100 transition-colors"><User size={26} className="text-gray-400" /></Link>
      </div>

    </div>
  );
}