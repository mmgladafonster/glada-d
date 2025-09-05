import { MetadataRoute } from 'next';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { getStaticParams } from '@/scripts/filterPages';
import { getLocationData, getServiceData } from '@/lib/locationData';

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
  // Static pages
  const staticPages = [
    { url: 'https://gladafonster.se', lastModified: new Date(), priority: 1.0 },
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

  // Keep existing LP pages for now (during transition)
  // But mark them with lower priority
  let lpPages: any[] = [];
  try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    }) as CSVRecord[];

    lpPages = records
      .filter(record => record.Keyword && record.Keyword.trim() !== '')
      .map(record => {
        const slug = sanitizeString(record.Keyword);
        return {
          url: `https://gladafonster.se/lp/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.3, // Lower priority during transition
        };
      });
  } catch (error) {
    console.warn('Could not read CSV file for LP pages:', error);
  }

  // Combine all pages
  const allPages = [
    ...staticPages.map(page => ({
      url: page.url,
      lastModified: page.lastModified,
      changeFrequency: 'weekly' as const,
      priority: page.priority,
    })),
    ...newServicePages,
    ...lpPages
  ];

  return allPages;
}
