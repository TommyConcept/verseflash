/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pexels.com' },
    ],
    dangerouslyAllowSVG: true,
  },
  // Silence noisy logs in production
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Recommended for Vercel deployments
  poweredByHeader: false,
}

module.exports = nextConfig
