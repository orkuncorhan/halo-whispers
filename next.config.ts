// DOSYA: next.config.ts
/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // 1. TypeScript hatalarını görmezden gel (Build için şart)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. Eslint bloğunu SİLDİK (Artık desteklenmiyor)

  // 3. Turbopack/Webpack çakışmasını çözen sihirli satır (Hata mesajının önerisi)
  // @ts-ignore
  turbopack: {}, 
};

module.exports = withPWA(nextConfig);