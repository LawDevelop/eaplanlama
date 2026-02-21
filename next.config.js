/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    domains: [],
  },
  // Prevent trailing slash redirect for webhooks
  trailingSlash: false,
  // Skip trailing slash redirect for API routes
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
