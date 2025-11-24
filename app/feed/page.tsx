// DOSYA: app/feed/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, Star, Bell, User, Home, Sparkles } from "lucide-react";
// Import yolunu "../" olarak kullanıyoruz (Relative Path)
import { useTheme, WhisperType } from "../context/ThemeContext"; 
import Link from "next/link"; 

export default function FeedPage() {
  // Global Hafızadan gerekli her şeyi çekiyoruz
  const { getThemeColors, username, whispers, addWhisper } = useTheme(); 
  const theme = getThemeColors();

  const [inputText, setInputText] = useState("");

  // Fısıltı Paylaşma
  const handlePost = () => {
    if (!inputText.trim()) return;
    // Global fonksiyona gönderiyoruz
    addWhisper(inputText, theme.halo);
    setInputText("");
  };

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg}`}>
      
      {/* Arkaplan */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-br opacity-60 transition-all duration-1000 ${theme.gradient}`} />
      
      <div className="relative z-10 max-w-6xl mx-auto flex justify-center">
        
        {/* --- SOL MENÜ --- */}
        <div className="hidden md:flex w-64 flex-col h-screen sticky top-0 pt-10 pr-8 border-r border-gray-200/50">
          <Link href="/feed" className="mb-10 flex items-center gap-3 group cursor-pointer">
             <div className={`w-8 h-8 rounded-full border border-white shadow-sm transition-colors duration-500 ${theme.halo} group-hover:scale-110`}></div>
             <span className="font-serif text-2xl font-bold tracking-tight">Halo</span>
          </Link>
          
          <nav className="space-y-2">
            <Link href="/feed">
                <NavItem icon={<Home size={22}/>} text="Home" active themeColor={theme.accent} />
            </Link>
            
            <Link href="/notifications">
                <NavItem icon={<Bell size={22}/>} text="Notifications" themeColor={theme.accent} />
            </Link>
            
            <Link href="/profile">
              <NavItem icon={<User size={22}/>} text="Profile" themeColor={theme.accent} />
            </Link>
          </nav>

          <button className={`mt-10 w-full py-3 text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-all ${theme.button}`}>
            Whisper
          </button>
        </div>

        {/* --- ORTA AKIŞ --- */}
        <div className="w-full md:w-[600px] min-h-screen border-r border-gray-200/50 bg-white/40 backdrop-blur-xl">
          
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold">Stream</h2>
            <div className={`w-8 h-8 rounded-full transition-colors duration-1000 ${theme.halo}`}></div>
          </div>

          {/* YAZMA ALANI */}
          <div className="p-6 border-b border-gray-100 bg-white/30 transition-colors">
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-full flex-shrink-0 border-2 border-white shadow-sm transition-colors duration-500 ${theme.halo}`} />
              <div className="w-full">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`What's on your mind, ${username || 'friend'}?`} 
                  className="w-full bg-transparent border-none outline-none text-lg placeholder-gray-400 mb-2 resize-none h-24"
                />
                <div className="flex justify-end items-center gap-4">
                  <span className="text-xs text-gray-400 font-medium">{inputText.length}/280</span>
                  <button 
                    onClick={handlePost}
                    disabled={!inputText.trim()}
                    className={`px-6 py-2 text-white font-bold rounded-full text-sm shadow-md disabled:opacity-50 hover:scale-105 transition-all ${theme.button}`}
                  >
                    Fısılda
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AKIŞ LİSTESİ */}
          <div className="pb-20">
            <AnimatePresence>
              {whispers.map((whisper) => (
                // WhisperCard artık tüm yeteneklere sahip
                <WhisperCard key={whisper.id} data={whisper} themeAccent={theme.accent} />
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* --- SAĞ PANEL --- */}
        <div className="hidden lg:block w-80 pl-8 pt-8">
          <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-sm sticky top-8">
            <h3 className="font-bold text-gray-400 text-[10px] tracking-widest uppercase mb-4 flex items-center gap-2">
              <Sparkles size={12}/> Parlayan Haleler
            </h3>
            <div className="space-y-4">
              <TrendItem tag="#Gülümse" count="2.4k Hopes" />
              <TrendItem tag="#KendineİyiBak" count="1.8k Hopes" />
              <TrendItem tag="#SabahKahvesi" count="900 Hopes" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- ALT BİLEŞENLER ---

function NavItem({ icon, text, active = false, themeColor }: any) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${active ? 'bg-white shadow-sm' : 'hover:bg-white/40'}`}>
      <div className={`transition-colors ${active ? themeColor : 'text-gray-400 group-hover:text-gray-600'}`}>{icon}</div>
      <span className={`text-lg font-medium ${active ? 'text-gray-800' : 'text-gray-500 group-hover:text-gray-700'}`}>{text}</span>
    </div>
  )
}

// --- GÜNCELLENEN WHISPER CARD ---
function WhisperCard({ data, themeAccent }: { data: WhisperType, themeAccent: string }) {
  // Global 'toggleLike' fonksiyonunu kullanıyoruz
  const { toggleLike } = useTheme();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="p-6 border-b border-gray-100 hover:bg-white/40 transition-colors cursor-pointer group"
    >
      <div className="flex gap-4">
        {/* Avatar -> Profile Gider */}
        <Link href={`/profile/${data.username}`} onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
           <div className={`w-12 h-12 rounded-full border-2 border-white shadow-sm ${data.color}`}></div>
        </Link>
        
        <div className="w-full">
          {/* İsim -> Profile Gider */}
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${data.username}`} onClick={(e) => e.stopPropagation()}>
                <span className="font-bold text-gray-800 hover:underline decoration-dotted">@{data.username}</span>
            </Link>
            <span className="text-gray-400 text-xs">· {data.time}</span>
          </div>
          
          {/* İçerik -> Detay Sayfasına Gider */}
          <Link href={`/whisper/${data.id}`}>
            <p className="text-gray-600 leading-relaxed mb-3 font-light text-[17px]">
              {data.content}
            </p>
          </Link>

          {/* Etkileşim Butonları */}
          <div className="flex gap-12 text-gray-400">
            {/* LIKE BUTONU */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleLike(data.id); 
              }} 
              className={`flex items-center gap-2 transition-colors group/btn ${data.isLiked ? themeAccent : 'hover:text-yellow-500'}`}
            >
              <div className={`p-2 rounded-full transition-colors ${data.isLiked ? 'bg-yellow-50' : 'group-hover/btn:bg-yellow-50'}`}>
                {/* Beğenildiyse dolu yıldız, değilse boş */}
                <Star size={18} fill={data.isLiked ? "currentColor" : "none"} />
              </div>
              <span className="text-sm font-medium">{data.hop}</span>
            </button>
            
            {/* YORUM BUTONU -> Detaya Gider */}
            <Link href={`/whisper/${data.id}`}>
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group/btn">
                <div className="p-2 rounded-full group-hover/btn:bg-blue-50">
                    <MessageCircle size={18} />
                </div>
                </button>
            </Link>

            <button className="flex items-center gap-2 hover:text-green-500 transition-colors group/btn">
              <div className="p-2 rounded-full group-hover/btn:bg-green-50">
                <Share2 size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TrendItem({ tag, count }: any) {
  return (
    <div className="flex justify-between items-center cursor-pointer group py-2">
      <div>
        <p className="font-bold text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{tag}</p>
        <p className="text-[10px] text-gray-400">{count}</p>
      </div>
    </div>
  )
}