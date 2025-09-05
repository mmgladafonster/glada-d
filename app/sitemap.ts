import { MetadataRoute } from 'next';
import { getStaticParams } from '@/scripts/filterPages';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: 'https://gladafonster.se', lastModified: new Date(), priority: 1.0 },
    { url: 'https://gladafonster.se/tjanster', lastModified: new Date(), priority: 0.8 },
    { url: 'https://gladafonster.se/privacy-policy', lastModified: new Date(), priority: 0.3 },
    { url: 'https://gladafonster.se/contact', lastModified: new Date(), priority: 0.8 },
    { url: 'https://gladafonster.se/about', lastModified: new Date(), priority: 0.7 },
  ];

  // Generate new high-quality service-location pages
  const newServicePages = getStaticParams().map(({ service, location }) => {
    return {
      url: `https://gladafonster.se/tjanster/${service}/${location}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9, // High priority for quality pages
    };
  });

  // Combine all pages (LP pages removed completely)
  const allPages = [
    ...staticPages.map(page => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: 'weekly' as const,
      priority: page.priority,
    })),
    ...newServicePages
  ];

  return allPages;
}
