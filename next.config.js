const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'voters.eci.gov.in',
      },
    ],
  },
  // Experimental features for Next.js 15
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

module.exports = withBundleAnalyzer(nextConfig);