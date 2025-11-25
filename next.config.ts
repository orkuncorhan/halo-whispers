// DOSYA: next.config.ts
/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Turbopack ayarına gerek kalmadı çünkü package.json'dan Webpack'i seçtik
};

module.exports = withPWA(nextConfig);