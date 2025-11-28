"use client";

import React from "react";
import { useTheme } from "../context/ThemeContext";

interface HaloOrbProps {
  size?: number;
  className?: string;
}

export function HaloOrb({ size = 80, className = "" }: HaloOrbProps) {
  const { mood, isMoodSetToday } = useTheme();

  // Basit bir "yanık / sönük" mantığı:
  const isActive = isMoodSetToday || mood !== 50;

  return (
    <div
      className={`relative flex items-center justify-center transition-all duration-700 
      ${isActive ? "opacity-100 scale-100" : "opacity-50 scale-95"} ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dış soft glow */}
      <div className="absolute inset-0 rounded-full bg-amber-200/40 blur-xl" />

      {/* Altın halo halkası */}
      <div className="absolute inset-[6px] rounded-full border border-amber-300/80 shadow-[0_0_60px_rgba(251,191,36,0.7)]" />

      {/* İç çekirdek – çok hafif, göz yormayan */}
      <div className="relative inset-[16px] h-[60%] w-[60%] rounded-full bg-gradient-to-b from-amber-100/90 to-amber-50/40" />
    </div>
  );
}
