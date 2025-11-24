// DOSYA: app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google"; 
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext"; 

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "Halo Whispers",
  description: "Whisper kindness, gather hope.",
  manifest: "/manifest.json", // Manifesti tanıttık
};

// MOBİL AYARLARI (YENİ EKLENEN KISIM)
export const viewport: Viewport = {
  themeColor: "#F4F6F9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Kullanıcı zoom yapıp tasarımı bozamasın
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}