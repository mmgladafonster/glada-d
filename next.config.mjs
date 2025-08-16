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
