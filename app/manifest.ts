// DOSYA: app/manifest.ts
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Halo Whispers',
    short_name: 'Halo',
    description: 'Whisper kindness, gather hope.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F6F9',
    theme_color: '#F4F6F9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}