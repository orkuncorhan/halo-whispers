"use client";

import React, { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";

interface HaloShellProps {
  children: ReactNode;
}

export default function HaloShell({ children }: HaloShellProps) {
  const { getThemeColors } = useTheme();
  const theme = getThemeColors();

  return (
    <div
      className={`min-h-screen w-full ${theme.bg} relative overflow-hidden`}
    >
      {/* Ana soft gradient katman */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${theme.gradient}`}
      />

      {/* Üstte tanrısal halo bulutu */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-200/40 blur-3xl" />

      {/* Sağ altta yumuşak gökyüzü lekesi */}
      <div className="pointer-events-none absolute bottom-[-7rem] right-[-5rem] h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />

      {/* Hafif noise efekti istersen sonradan ekleyebiliriz */}

      {/* Ortadaki cam kapsül */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl rounded-[2.5rem] bg-white/10 shadow-[0_40px_120px_rgba(15,23,42,0.35)] ring-1 ring-white/40 backdrop-blur-3xl">
          {children}
        </div>
      </div>
    </div>
  );
}
