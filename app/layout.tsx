// DOSYA: app/layout.tsx
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google"; // Google Fontları
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext"; // Yeni beynimizi çağırdık

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "600"],
  variable: '--font-serif'
});

export const metadata: Metadata = {
  title: "Halo Whispers",
  description: "Whisper kindness, gather hope.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        {/* Tüm siteyi ThemeProvider ile sarıyoruz */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}