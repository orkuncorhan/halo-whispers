// DOSYA: next.config.ts
/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// Temel ayarlar
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// 1. Önce PWA ile ayarları sarmalıyoruz
const pwaConfig = withPWA(nextConfig);

// 2. Sonra 'turbopack' ayarını EN SONA, ELLE ekliyoruz
// (Böylece eklenti bunu silemiyor)
module.exports = {
  ...pwaConfig,
  turbopack: {}, 
};