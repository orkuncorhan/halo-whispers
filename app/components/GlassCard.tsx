"use client";

import React from "react";
import { useColorMode } from "../context/ColorModeContext";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export function GlassCard({ className = "", ...rest }: GlassCardProps) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const baseClasses =
    "rounded-[32px] backdrop-blur-2xl transition-colors duration-200";

  const themeClasses = isDark
    ? // KOYU TEMA
      "bg-slate-900/85 border border-slate-700/80 shadow-[0_18px_60px_rgba(0,0,0,0.75)]"
    : // AÇIK TEMA
      "bg-white/80 border border-white/70 shadow-[0_18px_60px_rgba(15,23,42,0.12)]";

  return (
    <div
      className={[baseClasses, themeClasses, className].join(" ")}
      {...rest}
    />
  );
}
