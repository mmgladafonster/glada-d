// Dynamic robots.txt for Glada Fönster SEO Recovery
// Allows new pages while blocking old LP pages

import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /tjanster/

# Block old LP pages (removed system)
Disallow: /lp/

# Block Next.js internals
Disallow: /*?_rsc=
Disallow: /_next/
Disallow: /api/

# Block test and debug pages
Disallow: /test-*
Disallow: /debug/

# Allow sitemap
Sitemap: https://gladafonster.se/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}