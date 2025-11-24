// DOSYA: app/notifications/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// DÜZELTME BURADA: Relative path (../) kullanıyoruz
import { useTheme } from "../context/ThemeContext";
import Link from "next/link";
import { Home, Bell, User, Star, MessageCircle, UserPlus, CheckCircle, Inbox } from "lucide-react";

export default function NotificationsPage() {
  const { getThemeColors } = useTheme();
  const theme = getThemeColors();

  // Temiz Başlangıç
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    return n.type === filter;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg} pb-24 md:pb-0`}>
      
      <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-bl opacity-50 transition-all duration-1000 ${theme.gradient}`} />

      <div className="relative z-10 max-w-6xl mx-auto flex justify-center">
        
        {/* SOL MENÜ (PC) */}
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

        {/* ORTA ALAN */}
        <div className="w-full md:w-[600px] min-h-screen border-r border-gray-200/50 bg-white/30 backdrop-blur-xl">
          
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl font-bold">Notifications</h2>
                <button onClick={markAllRead} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
                    <CheckCircle size={14} /> Mark all read
                </button>
            </div>
            
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
                        {!notif.read && (
                            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${theme.button.replace('bg-', 'bg-')}`} />
                        )}

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
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 opacity-60">
                    <Inbox size={48} className="mb-4 opacity-50" />
                    <p>Henüz yeni bir hareket yok.</p>
                </div>
            )}
          </div>

        </div>

        {/* Sağ Panel */}
        <div className="hidden lg:block w-80 pl-8 pt-8" />

      </div>

      {/* MOBİL ALT MENÜ */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-2 flex justify-around items-center z-50 pb-6">
        <Link href="/feed" className="p-3 rounded-full hover:bg-gray-100 transition-colors"><Home size={26} className="text-gray-400" /></Link>
        <div className="p-3 rounded-full bg-gray-50 cursor-default relative"><Bell size={26} className={theme.accent} /></div>
        <Link href="/profile" className="p-3 rounded-full hover:bg-gray-100 transition-colors"><User size={26} className="text-gray-400" /></Link>
      </div>

    </div>
  );
}