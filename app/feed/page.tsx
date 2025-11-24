// DOSYA: app/feed/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Share2, Star, Bell, User, Home, Sparkles, Check, AlertCircle, Trash2 } from "lucide-react";
// Import yolu: Bir üst klasöre çıkıp context'e giriyoruz
import { useTheme, WhisperType } from "../context/ThemeContext"; 
import Link from "next/link"; 

export default function FeedPage() {
  // Global Hafızadan gerekli her şeyi çekiyoruz
  const { getThemeColors, username, whispers, addWhisper, deleteWhisper } = useTheme(); 
  const theme = getThemeColors();

  const [inputText, setInputText] = useState("");
  const [showToxicWarning, setShowToxicWarning] = useState(false);

  // --- AKILLI TROLL FİLTRESİ (Regex Destekli) ---
  // Buraya sadece "bağlamı ne olursa olsun" kötü olan kelimeleri/öbekleri koy.
  // "Ölüm", "Kötü" gibi kelimeler dertleşmek için kullanılabilir, onları yazma.
  const TOXIC_WORDS = [
    // Örnekler (Sen burayı VS Code'da dilediğin gibi doldur)
    "aptal", "gerizekalı", "salak", "mal", "şerefsiz", 
    "nefret ediyorum", "tiksiniyorum", "geber", "allah belanı", 
    "iğrençsin", "lanet olası",
    "mk", "aq", "amk", "oç", "yavşak" 
  ];

  const handlePost = () => {
    if (!inputText.trim()) return;

    // 1. ADIM: AKILLI KONTROL
    // Regex (\b) kullanarak kelimenin "tam eşleşmesini" arıyoruz.
    // Böylece "kazık" kelimesindeki "azı" hecesine takılmaz.
    const isToxic = TOXIC_WORDS.some(badWord => {
      // 'i' bayrağı büyük/küçük harf duyarsız yapar
      const pattern = new RegExp(`\\b${badWord}\\b`, 'i'); 
      return pattern.test(inputText);
    });

    // Eğer kelime yakalanırsa uyarı ver ve durdur
    if (isToxic) {
      setShowToxicWarning(true);
      setTimeout(() => setShowToxicWarning(false), 5000); // 5 sn sonra uyarı gitsin
      return; 
    }

    // 2. ADIM: Temizse Paylaş
    addWhisper(inputText, theme.halo);
    setInputText("");
    setShowToxicWarning(false);
  };

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg} pb-24 md:pb-0`}>
      
      {/* Arkaplan */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-br opacity-60 transition-all duration-1000 ${theme.gradient}`} />
      
      <div className="relative z-10 max-w-6xl mx-auto flex justify-center">
        
        {/* --- SOL MENÜ (PC) --- */}
        <div className="hidden md:flex w-64 flex-col h-screen sticky top-0 pt-10 pr-8 border-r border-gray-200/50">
          <Link href="/feed" className="mb-10 flex items-center gap-3 group cursor-pointer">
             <div className={`w-8 h-8 rounded-full border border-white shadow-sm transition-colors duration-500 ${theme.halo} group-hover:scale-110`}></div>
             <span className="font-serif text-2xl font-bold tracking-tight">Halo</span>
          </Link>
          
          <nav className="space-y-2">
            <Link href="/feed"><NavItem icon={<Home size={22}/>} text="Home" active themeColor={theme.accent} /></Link>
            <Link href="/notifications"><NavItem icon={<Bell size={22}/>} text="Notifications" themeColor={theme.accent} /></Link>
            <Link href="/profile"><NavItem icon={<User size={22}/>} text="Profile" themeColor={theme.accent} /></Link>
          </nav>

          <button className={`mt-10 w-full py-3 text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-all ${theme.button}`}>
            Whisper
          </button>
        </div>

        {/* --- ORTA AKIŞ --- */}
        <div className="w-full md:w-[600px] min-h-screen border-r border-gray-200/50 bg-white/40 backdrop-blur-xl">
          
          {/* Header */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold">Stream</h2>
            {/* Mobilde Profil Linki */}
            <Link href="/profile">
              <div className={`w-8 h-8 rounded-full transition-colors duration-1000 border border-white/50 shadow-sm ${theme.halo}`}></div>
            </Link>
          </div>

          {/* YAZMA ALANI */}
          <div className="p-6 border-b border-gray-100 bg-white/30 transition-colors relative">
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-full flex-shrink-0 border-2 border-white shadow-sm transition-colors duration-500 ${theme.halo}`} />
              <div className="w-full">
                <textarea 
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    if(showToxicWarning) setShowToxicWarning(false); // Yazınca uyarıyı sil
                  }}
                  placeholder={`What's on your mind, ${username || 'friend'}?`} 
                  className="w-full bg-transparent border-none outline-none text-lg placeholder-gray-400 mb-2 resize-none h-24"
                />

                {/* TOKSİK UYARI BALONU */}
                <AnimatePresence>
                  {showToxicWarning && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }} 
                      className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-600 text-sm shadow-sm"
                    >
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Enerjimiz biraz düştü mü?</p>
                        <p className="text-xs opacity-80 mt-1">Halo Whispers sadece iyilik ve umut içindir. Kelimelerini biraz yumuşatmak ister misin?</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
          <div className="pb-4">
            <AnimatePresence>
              {whispers.map((whisper) => (
                <WhisperCard key={whisper.id} data={whisper} themeAccent={theme.accent} />
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* --- SAĞ PANEL (PC) --- */}
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

      {/* --- MOBİL ALT MENÜ --- */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-2 flex justify-around items-center z-50 pb-6">
        <Link href="/feed" className="p-3 rounded-full hover:bg-gray-100 transition-colors"><Home size={26} className={theme.accent} /></Link>
        <Link href="/notifications" className="p-3 rounded-full hover:bg-gray-100 transition-colors relative">
          <Bell size={26} className="text-gray-400" />
          <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full border border-white"></div>
        </Link>
        <Link href="/profile" className="p-3 rounded-full hover:bg-gray-100 transition-colors"><User size={26} className="text-gray-400" /></Link>
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

function WhisperCard({ data, themeAccent }: { data: WhisperType, themeAccent: string }) {
  // Globalden Like ve Delete fonksiyonlarını çekiyoruz
  const { toggleLike, deleteWhisper } = useTheme();
  
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    const url = `${window.location.origin}/whisper/${data.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: `Halo Whispers from @${data.username}`, text: `"${data.content}"`, url: url, }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} layout className="p-6 border-b border-gray-100 hover:bg-white/40 transition-colors cursor-pointer group relative">
      
      {/* --- SİLME BUTONU (Sadece benim fısıltımsa görünür) --- */}
      {data.isUserPost && (
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if(confirm("Bu fısıltıyı rüzgara karıştırmak (silmek) istediğine emin misin?")) deleteWhisper(data.id);
          }}
          className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
            <Trash2 size={16} />
        </button>
      )}

      <div className="flex gap-4">
        <Link href={`/profile/${data.username}`} onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
           <div className={`w-12 h-12 rounded-full border-2 border-white shadow-sm ${data.color}`}></div>
        </Link>
        
        <div className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${data.username}`} onClick={(e) => e.stopPropagation()}>
                <span className="font-bold text-gray-800 hover:underline decoration-dotted">@{data.username}</span>
            </Link>
            <span className="text-gray-400 text-xs">· {data.time}</span>
          </div>
          
          <Link href={`/whisper/${data.id}`}>
            <p className="text-gray-600 leading-relaxed mb-3 font-light text-[17px]">{data.content}</p>
          </Link>

          <div className="flex gap-12 text-gray-400">
            
            {/* LIKE */}
            <button onClick={(e) => { e.stopPropagation(); toggleLike(data.id); }} className={`flex items-center gap-2 transition-colors group/btn ${data.isLiked ? themeAccent : 'hover:text-yellow-500'}`}>
              <div className={`p-2 rounded-full transition-colors ${data.isLiked ? 'bg-yellow-50' : 'group-hover/btn:bg-yellow-50'}`}><Star size={18} fill={data.isLiked ? "currentColor" : "none"} /></div>
              <span className="text-sm font-medium">{data.hop}</span>
            </button>
            
            {/* REPLY */}
            <Link href={`/whisper/${data.id}`}>
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group/btn">
                <div className="p-2 rounded-full group-hover/btn:bg-blue-50"><MessageCircle size={18} /></div>
                </button>
            </Link>

            {/* SHARE */}
            <button onClick={handleShare} className={`flex items-center gap-2 transition-colors group/btn ${isCopied ? 'text-green-500' : 'hover:text-green-500'}`}>
              <div className={`p-2 rounded-full transition-colors ${isCopied ? 'bg-green-50' : 'group-hover/btn:bg-green-50'}`}>{isCopied ? <Check size={18} /> : <Share2 size={18} />}</div>
              {isCopied && <span className="text-xs font-bold">Copied!</span>}
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
      <div><p className="font-bold text-gray-600 text-sm group-hover:text-gray-900 transition-colors">{tag}</p><p className="text-[10px] text-gray-400">{count}</p></div>
    </div>
  )
}