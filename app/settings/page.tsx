// DOSYA: app/settings/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";
import { ArrowLeft, Bell, Moon, Shield, LogOut, Volume2, Eye } from "lucide-react";

export default function SettingsPage() {
  const { getThemeColors, setMood, mood } = useTheme();
  const theme = getThemeColors();

  // Ayarlar State'leri
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg}`}>
      
      {/* Arkaplan */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-br opacity-50 transition-all duration-1000 ${theme.gradient}`} />

      <div className="relative z-10 max-w-xl mx-auto pt-10 pb-20 px-6">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-3 rounded-full bg-white/50 hover:bg-white transition-all shadow-sm text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Settings</h1>
        </div>

        <div className="space-y-6">
          
          {/* --- BÖLÜM 1: GÖRÜNÜM & HALE --- */}
          <Section title="Appearance & Aura">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
               <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${theme.halo}`}>
                    <Moon size={20} className={theme.accent} />
                 </div>
                 <div>
                   <p className="font-bold text-gray-700">Default Mood</p>
                   <p className="text-xs text-gray-400">Başlangıç hale rengin</p>
                 </div>
               </div>
               {/* Mini Mood Slider */}
               <div className="w-32">
                 <input 
                    type="range" min="0" max="100" value={mood} 
                    onChange={(e) => setMood(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-600"
                 />
               </div>
            </div>
          </Section>

          {/* --- BÖLÜM 2: BİLDİRİMLER --- */}
          <Section title="Notifications">
            <ToggleItem 
              icon={<Bell size={20} />} 
              title="Push Notifications" 
              desc="Hope ve fısıltı bildirimlerini al"
              active={notifications}
              onToggle={() => setNotifications(!notifications)}
              color={theme.halo}
              accent={theme.accent}
            />
            <ToggleItem 
              icon={<Volume2 size={20} />} 
              title="Sound Effects" 
              desc="Rahatlatıcı ses efektleri"
              active={sound}
              onToggle={() => setSound(!sound)}
              color={theme.halo}
              accent={theme.accent}
            />
          </Section>

          {/* --- BÖLÜM 3: GİZLİLİK --- */}
          <Section title="Privacy">
            <ToggleItem 
              icon={<Eye size={20} />} 
              title="Private Profile" 
              desc="Sadece takipçilerin fısıltılarını görebilir"
              active={privateProfile}
              onToggle={() => setPrivateProfile(!privateProfile)}
              color={theme.halo}
              accent={theme.accent}
            />
            <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/40 transition-colors rounded-b-3xl">
               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                 <Shield size={20} />
               </div>
               <span className="font-bold text-gray-600 text-sm">Privacy Policy & Terms</span>
            </div>
          </Section>

          {/* --- ÇIKIŞ BUTONU --- */}
          <button className="w-full py-4 mt-8 bg-white border border-red-100 text-red-500 font-bold rounded-2xl shadow-sm hover:bg-red-50 hover:shadow-md transition-all flex items-center justify-center gap-2">
            <LogOut size={20} />
            Log Out
          </button>

          <p className="text-center text-[10px] text-gray-400 mt-4">Halo Whispers v1.0 (MVP) • Made with Light</p>

        </div>
      </div>
    </div>
  );
}

// --- YARDIMCI BİLEŞENLER ---

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">{title}</h3>
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function ToggleItem({ icon, title, desc, active, onToggle, color, accent }: any) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100/50 last:border-none cursor-pointer hover:bg-white/30 transition-colors" onClick={onToggle}>
       <div className="flex items-center gap-3">
         <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${color}`}>
            <div className={accent}>{icon}</div>
         </div>
         <div>
           <p className="font-bold text-gray-700 text-sm">{title}</p>
           <p className="text-xs text-gray-400">{desc}</p>
         </div>
       </div>
       
       {/* Toggle Switch */}
       <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${active ? 'bg-green-400' : 'bg-gray-200'}`}>
          <motion.div 
            layout
            className="w-5 h-5 bg-white rounded-full shadow-sm"
            animate={{ x: active ? 20 : 0 }}
          />
       </div>
    </div>
  )
}