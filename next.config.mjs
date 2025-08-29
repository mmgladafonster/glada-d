/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Security headers now handled by middleware.ts for better control and performance
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://gladafonster.se/:path*',
        permanent: true,
        has: [{
          type: 'host',
          value: 'www.gladafonster.se',
        }],
      },
    ];
  },
}

export default nextConfig
