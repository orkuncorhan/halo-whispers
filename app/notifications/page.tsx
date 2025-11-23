// DOSYA: app/notifications/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";
import { Home, Bell, User, Star, MessageCircle, UserPlus, CheckCircle } from "lucide-react";

export default function NotificationsPage() {
  const { getThemeColors } = useTheme();
  const theme = getThemeColors();

  // --- DUMMY DATA: BİLDİRİMLER ---
  const initialNotifications = [
    { id: 1, type: "hope", user: "luna_moth", avatarColor: "bg-purple-100", content: "fısıltına umut bıraktı.", time: "2m", read: false },
    { id: 2, type: "reply", user: "solar_beam", avatarColor: "bg-amber-100", content: "seninle fısıldaştı: 'Kesinlikle katılıyorum...'", time: "15m", read: false },
    { id: 3, type: "follow", user: "deniz_mavi", avatarColor: "bg-blue-100", content: "seni takip etmeye başladı.", time: "1h", read: true },
    { id: 4, type: "hope", user: "forest_spirit", avatarColor: "bg-green-100", content: "fısıltına umut bıraktı.", time: "3h", read: true },
    { id: 5, type: "reply", user: "sky_walker", avatarColor: "bg-sky-100", content: "seninle fısıldaştı: 'Bu harika bir bakış açısı.'", time: "5h", read: true },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all"); // all, hope, reply

  // Filtreleme Mantığı
  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  // Hepsini Okundu İşaretle
  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg}`}>
      
      {/* Arkaplan */}
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-bl opacity-50 transition-all duration-1000 ${theme.gradient}`} />

      <div className="relative z-10 max-w-6xl mx-auto flex justify-center">
        
        {/* --- SOL MENÜ (Navigasyon Tutarlılığı İçin) --- */}
        <div className="hidden md:flex w-64 flex-col h-screen sticky top-0 pt-10 pr-8 border-r border-gray-200/50">
          <Link href="/feed" className="mb-10 flex items-center gap-3 group cursor-pointer">
             <div className={`w-8 h-8 rounded-full border border-white shadow-sm transition-colors duration-500 ${theme.halo} group-hover:scale-110`}></div>
             <span className="font-serif text-2xl font-bold tracking-tight">Halo</span>
          </Link>
          
          <nav className="space-y-2">
            <Link href="/feed">
                <div className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/40 group text-gray-500">
                    <Home size={22} className="group-hover:text-gray-700"/>
                    <span className="text-lg font-medium group-hover:text-gray-700">Home</span>
                </div>
            </Link>
            
            {/* Aktif Sayfa: Bildirimler */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-sm cursor-pointer">
                <Bell size={22} className={theme.accent}/>
                <span className="text-lg font-medium text-gray-800">Notifications</span>
            </div>
            
            <Link href="/profile">
                <div className="flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/40 group text-gray-500">
                    <User size={22} className="group-hover:text-gray-700"/>
                    <span className="text-lg font-medium group-hover:text-gray-700">Profile</span>
                </div>
            </Link>
          </nav>
        </div>

        {/* --- ORTA ALAN: BİLDİRİMLER --- */}
        <div className="w-full md:w-[600px] min-h-screen border-r border-gray-200/50 bg-white/30 backdrop-blur-xl">
          
          {/* Header & Filtreler */}
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl font-bold">Notifications</h2>
                <button onClick={markAllRead} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                    <CheckCircle size={14} /> Mark all read
                </button>
            </div>
            
            {/* Sekmeler */}
            <div className="flex gap-2">
                {['all', 'hope', 'reply'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                            filter === tab 
                            ? 'bg-[#2D3436] text-white shadow-md' 
                            : 'bg-white/50 text-gray-500 hover:bg-white'
                        }`}
                    >
                        {tab === 'all' ? 'All' : tab === 'hope' ? 'Hopes' : 'Whispers'}
                    </button>
                ))}
            </div>
          </div>

          {/* Bildirim Listesi */}
          <div className="p-4 space-y-2 pb-20">
            <AnimatePresence mode="popLayout">
                {filteredNotifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`relative p-4 rounded-[20px] border transition-all hover:shadow-md flex gap-4 items-center ${
                            notif.read ? 'bg-white/40 border-transparent' : 'bg-white border-white shadow-sm'
                        }`}
                    >
                        {/* Okunmadı Noktası */}
                        {!notif.read && (
                            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${theme.button.replace('bg-', 'bg-')}`} />
                        )}

                        {/* İkon */}
                        <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                notif.type === 'hope' ? 'bg-amber-100 text-amber-600' :
                                notif.type === 'reply' ? 'bg-blue-100 text-blue-600' :
                                'bg-purple-100 text-purple-600'
                            }`}>
                                {notif.type === 'hope' && <Star size={18} fill="currentColor" />}
                                {notif.type === 'reply' && <MessageCircle size={18} />}
                                {notif.type === 'follow' && <UserPlus size={18} />}
                            </div>
                        </div>

                        {/* İçerik */}
                        <div className="w-full">
                            <p className="text-sm text-gray-700">
                                <Link href={`/profile/${notif.user}`} className="font-bold hover:underline decoration-dotted mr-1">
                                    @{notif.user}
                                </Link>
                                {notif.content}
                            </p>
                            <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {filteredNotifications.length === 0 && (
                <div className="text-center py-20 text-gray-400 opacity-60">
                    <p>Henüz burada bir fısıltı yok.</p>
                </div>
            )}
          </div>

        </div>

        {/* Sağ Panel Boşluk */}
        <div className="hidden lg:block w-80 pl-8 pt-8" />

      </div>
    </div>
  );
}