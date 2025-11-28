"use client";

import React, { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className = "" }: GlassCardProps) {
  const { getThemeColors } = useTheme();
  const theme = getThemeColors();

  return (
    <div
      className={`rounded-3xl border ${theme.cardBorder} ${theme.card} 
      backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.25)] ${className}`}
    >
      {children}
    </div>
  );
}
