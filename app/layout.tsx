// DOSYA: app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import { ColorModeProvider } from "./context/ColorModeContext";
import { LanguageProvider } from "./context/LanguageContext";
import PageTransition from "./components/PageTransition";
import type React from "react";

export const metadata = {
  title: "Halo Whispers",
  description: "Whispers of light across the city.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased text-slate-900">
        {/* GLOBAL HALO SAHNESİ */}
        <div
          className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,_#FFFFFF_0%,_#F1F5F9_55%,_#E2E8F0_100%)]"
        >
          {/* Üstte sabit, çok hafif global halo */}
          <div
            className="pointer-events-none fixed inset-x-0 -top-40 z-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(252,211,77,0.50)_0%,_rgba(252,211,77,0.08)_35%,_transparent_70%)] blur-3xl opacity-70 animate-[haloGlobalPulse_16s_ease-in-out_infinite]"
          />

          {/* Sayfa içerikleri – halo sahnesinin üstünde */}
          <div className="relative z-10">
            <ColorModeProvider>
              <LanguageProvider>
                <UserProvider>
                  <ThemeProvider>
                    <PageTransition>{children}</PageTransition>
                  </ThemeProvider>
                </UserProvider>
              </LanguageProvider>
            </ColorModeProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
