"use client";

import React from "react";
import { useColorMode } from "@/app/context/ColorModeContext";

export default function HaloBrandMark() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <div className="flex items-center gap-2">
      {/* Yumuşak, tek tip HALO orb */}
      <div
        className={
          "h-7 w-7 md:h-8 md:w-8 rounded-full transition-colors duration-300 " +
          (isDark
            ? // koyu temada: hafif, sarımsı ay ışığı
              "bg-[radial-gradient(circle_at_center,_#fffdf5_0%,_#fef3c7_40%,_rgba(148,163,184,0.12)_70%,_transparent_100%)] shadow-[0_0_24px_rgba(250,250,220,0.55)]"
            : // açık temada: feed’deki gibi yumuşak, nazik güneş/halo
              "bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#fff7d6_40%,_rgba(252,211,77,0.35)_70%,_transparent_100%)] shadow-[0_0_26px_rgba(252,211,77,0.40)]")
        }
      />

      {/* Yazı – tüm sayfalarda aynı */}
      <span
        style={{
          color: "#111827",
          textShadow: "0 0 6px rgba(255,255,255,0.85)",
        }}
        className="
    text-[22px] font-semibold tracking-tight
    dark:text-slate-100 
    dark:drop-shadow-[0_0_6px_rgba(15,23,42,0.9)]
  "
      >
        Halo Whispers
      </span>
    </div>
  );
}
