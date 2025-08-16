import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // List your static pages
  const staticPages = [
    { url: 'https://gladafonster.se', lastModified: new Date() }, // Root path
    { url: 'https://gladafonster.se/privacy-policy', lastModified: new Date() },
    // Add other static pages here if you create them
  ];

  // If you had dynamic content, you would fetch it here and map it to URL objects.
  // For example, if you had a blog with posts:
  // const posts = await fetchBlogPosts();
  // const blogPages = posts.map((post) => ({
  //   url: `https://gladafonster.se/blog/${post.slug}`,
  //   lastModified: post.updatedAt || post.createdAt,
  // }));

  // Combine static and dynamic pages
  const pages = staticPages.map((page) => ({
    url: page.url,
    lastModified: page.lastModified,
    changeFrequency: 'weekly', // Or 'daily', 'monthly', etc.
    priority: page.url === 'https://gladafonster.se' ? 1 : 0.8, // Homepage gets priority 1
  }));

  return pages;
}