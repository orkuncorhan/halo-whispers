"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import {
  ArrowLeft,
  Star,
  Home,
  Bell,
  User,
} from "lucide-react";

import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PublicProfilePage() {
  const params = useParams();
  const usernameParam = params?.username ? String(params.username) : "user";

  const { getThemeColors, whispers, haloHistory } = useTheme();
  const theme = getThemeColors();

  const [mounted, setMounted] = useState(false);

  // Taklit edilmiş kullanıcı bilgileri – gerçek kullanıcı veritabanı eklenince bağlanacak
  const demoUser = {
    username: usernameParam,
    bio: "Bu kişi bir ışık yolcusu.",
    hope: 3100,
    following: 182,
  };

  const userWhispers = whispers.filter((w: any) => w.username === usernameParam);

  const sampleData = [
    { name: "Mon", value: 32 },
    { name: "Tue", value: 44 },
    { name: "Wed", value: 51 },
    { name: "Thu", value: 38 },
    { name: "Fri", value: 80 },
    { name: "Sat", value: 95 },
    { name: "Sun", value: 60 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div
        className={`min-h-screen font-sans text-[#2D3436] transition-colors duration-1000 ${theme.bg} pb-24 md:pb-0 relative`}
      >
        <div
          className={`fixed inset-0 z-0 pointer-events-none bg-gradient-to-b opacity-40 transition-all duration-1000 ${theme.gradient}`}
        />

        <div className="relative z-10 max-w-2xl mx-auto pt-10 px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/feed"
              className="p-3 rounded-full bg-white/60 hover:bg-white transition-all shadow-sm text-gray-600"
            >
              <ArrowLeft size={24} />
            </Link>
            <div className="p-3 rounded-full bg-white/60 text-gray-600 shadow-sm">
              @{usernameParam}
            </div>
          </div>

          {/* Profil Kartı */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-[40px] shadow-xl overflow-hidden"
          >
            <div className={`h-32 w-full ${theme.halo} opacity-60`} />

            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-4 flex justify-between items-end">
                <div
                  className={`w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center ${theme.halo}`}
                >
                  <div className="w-28 h-28 bg-white/40 rounded-full backdrop-blur-md" />
                </div>
              </div>

              <h1 className="text-3xl font-serif font-bold text-gray-800">
                {demoUser.username}
              </h1>

              <p
                className={`text-sm font-bold tracking-widest uppercase ${theme.accent} mt-1`}
              >
                @{demoUser.username} • {theme.name} Aura
              </p>

              <p className="text-gray-500 leading-relaxed font-light max-w-md mt-2">
                {demoUser.bio}
              </p>

              {/* Stats */}
              <div className="flex gap-8 mt-6 border-t border-gray-100 pt-6">
                <div>
                  <span className="block text-xl font-bold text-gray-800">
                    {userWhispers.length}
                  </span>
                  <span className="text-xs text-gray-400 uppercase font-medium tracking-wider">
                    Whispers
                  </span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-gray-800">
                    {demoUser.hope.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 uppercase font-medium tracking-wider">
                    Hope
                  </span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-gray-800">
                    {demoUser.following}
                  </span>
                  <span className="text-xs text-gray-400 uppercase font-medium tracking-wider">
                    Following
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grafik */}
          <div className="mt-8 mb-12 bg-white/60 backdrop-blur-md border border-white/70 rounded-[32px] p-6 shadow-lg">
            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6">
              Halo Progress
            </h3>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleData}>
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
                    cursor={{
                      stroke: "#cbd5e0",
                      strokeWidth: 1,
                      strokeDasharray: "5 5",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#d97706"
                    strokeWidth={4}
                    dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Whispers */}
          <div className="mb-20">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6 pl-2">
              Whispers from @{usernameParam}
            </h3>

            <div className="space-y-4">
              {userWhispers.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm opacity-60">
                  Bu kişi henüz bir şey fısıldamadı.
                </p>
              ) : (
                userWhispers.map((w: any) => (
                  <div
                    key={w.id}
                    className="p-6 bg-white/50 border border-white/70 rounded-[24px] shadow-sm"
                  >
                    <p className="text-gray-600 text-lg font-light mb-4">
                      {w.content}
                    </p>
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

        {/* Mobile Navbar */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/85 backdrop-blur-xl border-t border-gray-200 p-4 flex justify-around z-[50] pb-8">
          <Link href="/feed" className="p-2 text-gray-400 hover:text-gray-800">
            <Home size={24} />
          </Link>
          <Link
            href="/notifications"
            className="p-2 text-gray-400 hover:text-gray-800"
          >
            <Bell size={24} />
          </Link>
          <Link href="/profile" className="p-2 text-[#2D3436]">
            <User size={24} />
          </Link>
        </div>
      </div>
    </>
  );
}

/* --- Simple Star Icon --- */

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}