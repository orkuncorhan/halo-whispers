"use client";

import { useColorMode } from "@/app/context/ColorModeContext";

export default function GlowHaloLogo({ size = 26 }) {
  const { colorMode } = useColorMode();

  const isDark = colorMode === "dark";

  const glow = isDark
    ? {
        background:
          "radial-gradient(circle at center, rgba(255,255,240,0.9) 0%, rgba(255,245,200,0.5) 40%, rgba(200,180,120,0.15) 70%, rgba(150,130,90,0.05) 100%)",
        boxShadow: "0 0 40px rgba(240,230,190,0.35)",
      }
    : {
        background:
          "radial-gradient(circle at center, rgba(255,255,230,1) 0%, rgba(255,240,170,0.6) 45%, rgba(255,230,140,0.3) 70%, rgba(255,220,110,0) 100%)",
        boxShadow: "0 0 28px rgba(255,235,160,0.45)",
      };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        transition: "0.35s ease",
        ...glow,
      }}
    />
  );
}
