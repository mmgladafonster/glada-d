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
      // WWW redirect
      {
        source: '/:path*',
        destination: 'https://gladafonster.se/:path*',
        permanent: true,
        has: [{
          type: 'host',
          value: 'www.gladafonster.se',
        }],
      },
      // Redirect old LP pages to new service pages
      // Göteborg redirects
      {
        source: '/lp/fonsterputs-goteborg',
        destination: '/tjanster/fonsterputsning/goteborg',
        permanent: true,
      },
      {
        source: '/lp/billig-fonsterputs-goteborg',
        destination: '/tjanster/fonsterputsning/goteborg',
        permanent: true,
      },
      {
        source: '/lp/basta-fonsterputs-goteborg',
        destination: '/tjanster/fonsterputsning/goteborg',
        permanent: true,
      },
      {
        source: '/lp/fonsterputs-nara-goteborg',
        destination: '/tjanster/fonsterputsning/goteborg',
        permanent: true,
      },
      {
        source: '/lp/foretagsstadning-goteborg',
        destination: '/tjanster/kommersiell-stadning/goteborg',
        permanent: true,
      },
      // Kungsbacka redirects
      {
        source: '/lp/fonsterputs-kungsbacka',
        destination: '/tjanster/fonsterputsning/kungsbacka',
        permanent: true,
      },
      {
        source: '/lp/billig-fonsterputs-kungsbacka',
        destination: '/tjanster/fonsterputsning/kungsbacka',
        permanent: true,
      },
      {
        source: '/lp/basta-fonsterputs-kungsbacka',
        destination: '/tjanster/fonsterputsning/kungsbacka',
        permanent: true,
      },
      {
        source: '/lp/foretagsstadning-kungsbacka',
        destination: '/tjanster/kommersiell-stadning/kungsbacka',
        permanent: true,
      },
      // Varberg redirects
      {
        source: '/lp/fonsterputs-varberg',
        destination: '/tjanster/fonsterputsning/varberg',
        permanent: true,
      },
      {
        source: '/lp/billig-fonsterputs-varberg',
        destination: '/tjanster/fonsterputsning/varberg',
        permanent: true,
      },
      {
        source: '/lp/basta-fonsterputs-varberg',
        destination: '/tjanster/fonsterputsning/varberg',
        permanent: true,
      },
      {
        source: '/lp/foretagsstadning-varberg',
        destination: '/tjanster/kommersiell-stadning/varberg',
        permanent: true,
      },
      // Mölndal redirects
      {
        source: '/lp/fonsterputs-molndal',
        destination: '/tjanster/fonsterputsning/molndal',
        permanent: true,
      },
      {
        source: '/lp/billig-fonsterputs-molndal',
        destination: '/tjanster/fonsterputsning/molndal',
        permanent: true,
      },
      {
        source: '/lp/foretagsstadning-molndal',
        destination: '/tjanster/kommersiell-stadning/molndal',
        permanent: true,
      },
      // Kungälv redirects
      {
        source: '/lp/fonsterputs-kungalv',
        destination: '/tjanster/fonsterputsning/kungalv',
        permanent: true,
      },
      {
        source: '/lp/billig-fonsterputs-kungalv',
        destination: '/tjanster/fonsterputsning/kungalv',
        permanent: true,
      },
      {
        source: '/lp/foretagsstadning-kungalv',
        destination: '/tjanster/kommersiell-stadning/kungalv',
        permanent: true,
      },
    ];
  },
  
  async headers() {
    return [
      // Add noindex headers to remaining LP pages during transition
      {
        source: '/lp/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
}

export default nextConfig
