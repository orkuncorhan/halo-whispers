// DOSYA: app/icon.tsx
import { ImageResponse } from 'next/og';

// Resim boyutu ve türü
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// İkon Oluşturucu
export default function Icon() {
  return new ImageResponse(
    (
      // Arkaplan (Şeffaf olabilir ama görünür olsun diye hafif renk verelim)
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to bottom right, #FFF9F0, #FFF0F5)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%', // Yuvarlak ikon
          border: '1px solid rgba(255,215,0,0.3)',
        }}
      >
        {/* İçindeki Hale */}
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'linear-gradient(to top right, #ffffff, #ffd700)',
            boxShadow: '0 0 8px rgba(255, 165, 0, 0.8)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}