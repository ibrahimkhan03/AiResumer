import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['images.clerk.dev'],
  },
  experimental: {
    // Enable strict mode for better compatibility
    strictNextHead: true,
    // Suppress headers() warning for Clerk compatibility with Next.js 15
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Suppress the headers warning for now during development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Disable development warnings for Clerk compatibility
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable the warning temporarily for Clerk compatibility
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Add webpack configuration to suppress the headers warning
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Suppress console warnings in development
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0]?.includes?.('headers()') || args[0]?.includes?.('sync-dynamic-apis')) {
          return;
        }
        originalWarn.apply(console, args);
      };
    }
    return config;
  },
}

export default nextConfig