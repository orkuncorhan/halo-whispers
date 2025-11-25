"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import {
  ArrowLeft,
  Settings,
  Camera,
  Edit3,
  Check,
  Share2,
  X,
  Download,
  Copy,
  Home,
  Bell,
  User,
  Star,
} from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toPng } from "html-to-image";

export default function ProfilePage() {
  const { getThemeColors, mood, username, setUsername, whispers, haloHistory } = useTheme();
  const theme = getThemeColors();

  const [isEditing, setIsEditing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bio, setBio] = useState("Işık arayan bir gezgin. ✨");
  const [localName, setLocalName] = useState(username || "Halo Walker");

  const myWhispers = whispers.filter((w) => w.isUserPost === true);

  const handleSaveProfile = () => {
    setIsEditing(false);
    setUsername(localName);
  };

  const handleDownloadCard = async () => {
    const node = document.getElementById("share-halo-card");
    if (!node) return;

    try {
      const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `halo-card-${username || "user"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Kart oluşturulamadı", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (username) setLocalName(username);
  }, [username]);

  const data = [
    { name: "Mon", value: 30 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 60 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 80 },
    { name: "Sat", value: 95 },
    { name: "Sun", value: mood },
  ];

  const displayUsername = username || "Halo Walker";

  if (!mounted) return null;

  return (
    <>
      <div className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg} pb-24 md:pb-0 relative`}>
        
        <div className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b opacity-40 transition-all duration-1000 ${theme.gradient}`} />

        <div className="relative z-10 max-w-2xl mx-auto pt-10 px-6">

          <div className="flex justify-between items-center mb-8">
            <Link href="/feed" className="p-3 rounded-full bg-white/60 hover:bg-white transition-all shadow-sm text-gray-600">
              <ArrowLeft size={24} />
            </Link>
            <Link href="/settings" className="p-3 rounded-full bg-white/60 hover:bg-white transition-all shadow-sm text-gray-600">
              <Settings size={24} />
            </Link>
          </div>

          {/* PROFİL KARTI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-[40px] shadow-xl overflow-hidden"
          >
            <div className={`h-32 w-full transition-colors duration-1000 ${theme.halo} opacity-60`} />

            <div className="px-8 pb-8">
              
              <div className="relative -mt-16 mb-4 flex justify-between items-end">
                
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${theme.halo}`}>
                  <div className="w-28 h-28 bg-white/40 rounded-full backdrop-blur-md" />
                </div>

                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-[#2D3436] text-white rounded-full text-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Check size={14} /> Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-bold shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
                  >
                    <Edit3 size={14} /> Edit Profile
                  </button>
                )}
              </div>

              {/* İSİM + BIO */}
              <div className="space-y-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    className="text-3xl font-serif font-bold bg-white/50 border-b border-gray-300 outline-none w-full text-gray-800 px-2 py-1 rounded-lg"
                  />
                ) : (
                  <h1 className="text-3xl font-serif font-bold text-gray-800">{displayUsername}</h1>
                )}

                <p className={`text-sm font-bold tracking-widest uppercase ${theme.accent}`}>
                  @{displayUsername.toLowerCase().replaceAll(" ", "_")} • {theme.name} Aura
                </p>

                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white/50 border border-gray-200 rounded-xl p-3 text-gray-600 outline-none mt-2 text-sm resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-500 leading-relaxed font-light max-w-md">{bio}</p>
                )}
              </div>

              {/* STATİSTİKLER */}
              <div className="flex gap-8 mt-6 border-t border-gray-100 pt-6">
                <div>
                  <span className="block text-xl font-bold text-gray-800">{myWhispers.length}</span>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Whispers</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-gray-800">4.2k</span>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Hope</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-gray-800">850</span>
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Following</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* GRAFİK + SHARE CARD */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

            <div className="md:col-span-2 bg-white/60 backdrop-blur-md border border-white/70 rounded-[32px] p-6 shadow-lg">
              <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6">Your Halo Journey</h3>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={haloHistory.length > 0 ? haloHistory : data}>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#a0aec0", fontSize: 10 }}
                      dy={10}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      }}
                      cursor={{ stroke: "#cbd5e0", strokeWidth: 1, strokeDasharray: "5 5" }}
                    />

                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={
                        theme.accent === "text-rose-500"
                          ? "#f43f5e"
                          : theme.accent === "text-blue-600"
                          ? "#2563eb"
                          : "#d97706"
                      }
                      strokeWidth={4}
                      dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />

                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SHARE CARD KUTUSU */}
            <div className={`md:col-span-1 rounded-[32px] p-6 shadow-lg flex flex-col justify-between text-white bg-gradient-to-br from-indigo-400 to-gray-400`}>
              <div>
                <StarIcon className="mb-4 opacity-80" />
                <h3 className="text-2xl font-serif font-medium mb-2">Share Your Light</h3>
                <p className="text-white/80 text-xs leading-relaxed">
                  Haleni ve enerjini arkadaşlarınla paylaş.
                </p>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="mt-6 w-full py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={16} /> Share Card
              </button>
            </div>
          </div>

          {/* YOUR WHISPERS */}
          <div className="mb-20">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6 pl-2">Your Whispers</h3>

            <div className="space-y-4">
              {myWhispers.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm opacity-60">
                  Henüz bir şey fısıldamadın.
                </p>
              ) : (
                myWhispers.map((w) => (
                  <div key={w.id} className="p-6 bg-white/50 border border-white/70 rounded-[24px] shadow-sm">
                    <p className="text-gray-600 text-lg font-light mb-4">{w.content}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{w.time}</span>
                      <span className="flex gap-1 items-center">
                        <Star size={14} /> {w.hop}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* MOBİL ALT MENÜ */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/85 backdrop-blur-xl border-t border-gray-200 p-4 flex justify-around z-[50] pb-8">
          <Link href="/feed" className="p-2 text-gray-400 hover:text-gray-800">
            <Home size={24} />
          </Link>
          <Link href="/notifications" className="p-2 text-gray-400 hover:text-gray-800">
            <Bell size={24} />
          </Link>
          <Link href="/profile" className="p-2 text-[#2D3436]">
            <User size={24} />
          </Link>
        </div>
      </div>

      {/* SHARE CARD MODAL */}
      <ShareCardModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
        onDownload={handleDownloadCard}
        displayUsername={displayUsername}
        theme={theme}
      />
    </>
  );
}

/* --- SHARE CARD MODAL COMPONENT --- */

function ShareCardModal({
  show,
  onClose,
  onDownload,
  displayUsername,
  theme,
}: {
  show: boolean;
  onClose: () => void;
  onDownload: () => void;
  displayUsername: string;
  theme: any;
}) {
  if (!show || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className="relative w-[360px] bg-white rounded-[32px] overflow-hidden shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white"
          >
            <X size={18} />
          </button>

          <div
            id="share-halo-card"
            className={`aspect-[9/16] w-full relative flex flex-col items-center justify-center text-center p-6 ${theme.bg}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-60 ${theme.gradient}`} />

            <div className="relative z-10 flex flex-col items-center">
              <StarIcon className="w-6 h-6 text-gray-600 opacity-60 mb-8" />

              <div className={`w-28 h-28 rounded-full border-4 border-white shadow-xl flex items-center justify-center mb-6 ${theme.halo}`}>
                <div className="w-24 h-24 bg-white/40 backdrop-blur-md rounded-full" />
              </div>

              <h2 className="text-3xl font-serif font-bold text-gray-800">{displayUsername}</h2>
              <p className={`text-xs font-bold tracking-[0.3em] uppercase mt-2 mb-8 ${theme.accent}`}>
                {theme.name} AURA
              </p>

              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-5 w-full shadow-lg text-gray-700">
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase text-gray-500">Total Hope</span>
                  <span className="font-bold text-sm">4.2k ✨</span>
                </div>

                <div className="w-full h-1.5 bg-gray-200/50 rounded-full overflow-hidden mb-3">
                  <div className={`h-full w-[80%] ${theme.button}`} />
                </div>

                <p className="text-[10px] text-gray-500 italic font-light">
                  "Whispering kindness since 2025"
                </p>
              </div>

              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mt-10 opacity-80">
                Halo Whispers
              </span>
            </div>
          </div>

          <div className="bg-white p-4 flex gap=3 border-t border-gray-100">
            <button
              onClick={onDownload}
              className="w-full py-3 bg-[#2D3436] text-white rounded-xl font-bold text-xs flex justify-center items-center gap-2 hover:opacity-90"
            >
              <Download size={14} /> Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* --- ICON --- */

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}