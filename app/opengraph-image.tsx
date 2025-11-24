// DOSYA: app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

// Resim Ayarları
export const runtime = 'edge';
export const alt = 'Halo Whispers - Whisper kindness, gather hope.';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Resim Oluşturucu
export default async function Image() {
  return new ImageResponse(
    (
      // Arkaplan Kutusu
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F4F6F9',
          backgroundImage: 'linear-gradient(to bottom right, #fffbf5, #ffe4e1)',
          position: 'relative',
        }}
      >
        {/* 1. Katman: Dev Arka Işık (Ambient Glow) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,200,100,0.15) 0%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* 2. Katman: Halenin Kendisi (Core) */}
        <div
          style={{
            display: 'flex',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'linear-gradient(to top right, #ffffff, #fef3c7)',
            boxShadow: '0 0 80px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255,255,255,0.8)',
            marginBottom: '40px',
            border: '2px solid rgba(255,255,255,0.6)',
          }}
        />

        {/* Başlık */}
        <div
          style={{
            fontSize: 70,
            color: '#2D3436',
            marginBottom: 10,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            display: 'flex',
            fontFamily: 'serif', // Sistemdeki serif fontu kullanır
          }}
        >
          Halo Whispers
        </div>

        {/* Slogan */}
        <div
          style={{
            fontSize: 24,
            color: '#888',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            display: 'flex',
            fontFamily: 'sans-serif',
          }}
        >
          Whisper kindness, gather hope
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}