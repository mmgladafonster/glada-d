# Glada Fönster SEO Recovery - Deployment Checklist

## Phase 1: Pre-Deployment Setup

### ✅ Environment Variables
- [ ] Add `REVALIDATION_SECRET` to your environment variables (generate a secure random string)
- [ ] Verify all environment variables are properly set in production

### ✅ Code Review
- [ ] Review all new files created:
  - `lib/locationData.ts` - Location and service databases
  - `lib/contentGenerator.ts` - Content generation system
  - `scripts/filterPages.ts` - Page filtering logic
  - `app/tjanster/[service]/[location]/page.tsx` - Dynamic pages with homepage styling
  - `app/tjanster/page.tsx` - Services overview with consistent design
  - `app/api/revalidate/route.ts` - ISR revalidation API
  - `app/robots.txt/route.ts` - Dynamic robots.txt
  - Updated `app/sitemap.ts` - New sitemap with quality pages
  - Updated `next.config.mjs` - Redirects and headers

### ✅ Testing
- [ ] Run test script: `npx tsx scripts/test-implementation.ts`
- [ ] Verify all 10 page combinations are generated correctly
- [ ] Check that content is unique and high-quality

## Phase 2: Deployment

### ✅ Deploy Changes
- [ ] Deploy to staging environment first
- [ ] Test a few pages manually in staging
- [ ] Deploy to production

### ✅ Verify Deployment
- [ ] Check that new pages are accessible and styled correctly:
  - `/tjanster/fonsterputsning/goteborg` - Should match homepage design
  - `/tjanster/fonsterputsning/kungsbacka` - Check responsive layout
  - `/tjanster/kommersiell-stadning/goteborg` - Verify all sections render
  - `/tjanster` - Services overview page
- [ ] Verify sitemap is updated: `/sitemap.xml`
- [ ] Check robots.txt: `/robots.txt`
- [ ] Test ISR revalidation API (with secret)
- [ ] Confirm Header/Footer consistency across all pages

## Phase 3: Search Console Setup

### ✅ Google Search Console
- [ ] Submit new sitemap: `https://gladafonster.se/sitemap.xml`
- [ ] Remove old sitemaps if any
- [ ] Request indexing for high-priority pages:
  - `/tjanster/fonsterputsning/goteborg`
  - `/tjanster/kommersiell-stadning/goteborg`

### ✅ Monitor Indexing
- [ ] Check indexing status in Search Console
- [ ] Monitor for any crawl errors
- [ ] Verify canonical tags are working correctly

## Phase 4: LP System Removal (COMPLETED)

### ✅ LP System Cleanup
- [x] Removed `/app/lp/[slug]/page.tsx` - Old doorway page system
- [x] Updated sitemap to exclude LP pages
- [x] Added catch-all 404 handler for remaining LP URLs
- [x] Kept redirects for high-traffic LP pages in `next.config.mjs`
- [x] Updated robots.txt to block LP paths

### ✅ Migration Monitoring
- [ ] Monitor that redirects are working correctly
- [ ] Check Google Search Console for crawl errors
- [ ] Verify new pages are being indexed faster
- [ ] Monitor overall SEO performance improvement

## Phase 5: Optimization

### ✅ Content Optimization
- [ ] Review page performance in Search Console
- [ ] Optimize content based on search queries
- [ ] Add more location-specific details if needed

### ✅ Technical Optimization
- [ ] Monitor page load speeds
- [ ] Optimize images and assets
- [ ] Consider adding more structured data

## Emergency Rollback Plan

If issues arise:
1. **Quick Fix**: Add redirects from new pages back to LP pages
2. **Full Rollback**: Revert sitemap changes and restore LP page priority
3. **Gradual Fix**: Use ISR revalidation to update problematic pages

## Success Metrics

Track these metrics to measure success:
- [ ] Indexing rate of new pages (target: 80%+ within 2 weeks)
- [ ] Search visibility maintenance or improvement
- [ ] **ELIMINATION** of "Alternate page with proper canonical tag" errors
- [ ] Improved page quality scores in Search Console
- [ ] Maintained or improved organic traffic
- [ ] Reduction in total indexed pages (from 5,100+ to ~15 quality pages)
- [ ] Improved crawl efficiency in Search Console

## Contact Information

For technical issues:
- ISR Revalidation: `GET /api/revalidate?secret=YOUR_SECRET&service=SERVICE&location=LOCATION`
- Batch Revalidation: `PUT /api/revalidate?secret=YOUR_SECRET`

## Notes

- This implementation creates 10 high-quality pages initially
- All pages have unique, location-specific content
- ISR ensures content stays fresh with daily revalidation
- Gradual rollout minimizes risk to existing SEO performance