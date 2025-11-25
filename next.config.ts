// next.config.ts

/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {}, // Turbopack'i bilinçli olarak kullanıyoruz, uyarıyı sustur
};

module.exports = withPWA(nextConfig);