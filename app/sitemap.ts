import { MetadataRoute } from 'next';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const csvFilePath = 'gladafonster_programmatic_keywords.csv';

function sanitizeString(str: string) {
  return str
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface CSVRecord {
  Keyword: string;
  Service: string;
  Location: string;
  Modifier: string;
  Keyword_Type: string;
  Search_Intent: string;
  Estimated_Difficulty: string;
  Content_Type_Suggestion: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // List your static pages
  const staticPages = [
    { url: 'https://gladafonster.se', lastModified: new Date() },
    { url: 'https://gladafonster.se/privacy-policy', lastModified: new Date() },
    { url: 'https://gladafonster.se/contact', lastModified: new Date() },
    { url: 'https://gladafonster.se/about', lastModified: new Date() },
  ];

  // Read CSV to get all service-location combinations and keywords for LP pages
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as CSVRecord[];

  // Generate service-location pages
  const uniqueServiceLocations = new Set();
  records.forEach(record => {
    if (record.Service && record.Location && record.Location.toLowerCase() !== 'all') {
      uniqueServiceLocations.add(`${record.Service}|${record.Location}`);
    }
  });

  // Generate dynamic pages for each service-location combination
  const serviceLocationPages = Array.from(uniqueServiceLocations as Set<string>).map((serviceLocation: string) => {
    const [service, location] = serviceLocation.split('|');
    const sanitizedService = sanitizeString(service);
    const sanitizedLocation = sanitizeString(location);
    
    return {
      url: `https://gladafonster.se/services/${sanitizedService}/${sanitizedLocation}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  // Generate LP pages from keywords
  const lpPages = records
    .filter(record => record.Keyword && record.Keyword.trim() !== '')
    .map(record => {
      const slug = sanitizeString(record.Keyword);
      return {
        url: `https://gladafonster.se/lp/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      };
    });

  // Combine all pages
  const allPages = [
    ...staticPages.map(page => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: 'weekly' as const,
      priority: page.url === 'https://gladafonster.se' ? 1 : 0.8,
    })),
    ...serviceLocationPages,
    ...lpPages
  ];

  return allPages;
}
