# AI IDE Prompt for Glada Fönster SEO Recovery Implementation (App Router)

Copy and paste this prompt to your AI IDE (Claude, Cursor, etc.) to generate all necessary code for programmatic SEO recovery in your Next.js 15 App Router project.

---

**CONTEXT:**  
I have a Next.js 15.2.4 App Router website (gladafonster.se) with ~5,100 auto-generated landing pages under `/app/lp/{slug}`. Google isn't indexing these due to "Alternate page with proper canonical tag" errors and is treating them as doorway pages. I need to consolidate to ~50-200 high-quality, location-specific pages and implement proper programmatic SEO without manually editing every page.

**CURRENT STRUCTURE:**  
- Next.js App Router under `app/`  
- Dynamic landing pages at `app/lp/[slug]/`  
- API routes under `app/api/`  
- Sitemap in `app/sitemap.ts`, 404 in `app/not-found.tsx`, homepage in `app/page.tsx`  
- Keywords data in `lib/keywords.json` and CSV files  
- Major cities: Göteborg, Kungsbacka, Varberg, Mölndal, Kungälv  
- Main services: Fönsterputs (fonsterputsning), Kommersiell Städning (kommersiell-stadning)

**IMPLEMENTATION REQUIREMENTS (APP ROUTER):**

1. **Create new file structure under `app/`:**
   ```
   app/
   ├── tjanster/[service]/[location]/page.tsx     // Main dynamic pages
   ├── sitemap.ts                                 // Dynamic sitemap route
   ├── robots.txt.tsx                             // Dynamic robots.txt route
   ├── api/
   │   └── revalidate/route.ts                    // ISR revalidation API
   ```

   Create supporting files:
   ```
   lib/
   ├── locationData.ts                            // Location database interfaces & data
   └── contentGenerator.ts                        // Content templates and schema generation

   scripts/
   └── filterPages.ts                             // Logic to generate valid service/location combinations
   ```

2. **Data Interfaces & Databases:**
   - **LocationData** interface with:
     - city, region, lat, lng, postalCode
     - climateFactors[], buildingTypes[], localLandmarks[], serviceChallenges[], seasonalPatterns[]
     - recommendedFrequency (number)
   - **ServiceData** interface with: name, baseDescription, serviceSpecifics[]
   - Create `locationDatabase` for the five major cities with realistic Swedish data.
   - Create `serviceDatabase` for fonsterputsning and kommersiell-stadning.

3. **Dynamic Page Implementation (`page.tsx`):**
   - Use `export async function generateStaticParams()` to return valid combinations from `filterPages.ts`.
   - In `page.tsx`, fetch `locationData` and `serviceData` based on params.
   - Use `export const revalidate = 86400;` for ISR (daily revalidation).
   - Include proper `<head>` metadata:
     - `<title>` with service and city
     - `<meta name="description">` summarizing local challenges
     - `<link rel="canonical" href="https://gladafonster.se/tjanster/{service}/{location}" />`
   - Render dynamic content sections:
     - Local climate challenges (salt air, rain, frost)
     - Building types common to city
     - Recommended service frequency
     - Local landmarks and service-specific bullet points

4. **Content Template System (`contentGenerator.ts`):**
   - Provide functions to assemble location-specific paragraphs.
   - Example template with placeholders for city, region, climateFactors, buildingTypes, landmarks, recommendedFrequency.
   - Generate LocalBusiness schema (JSON-LD) based on `locationData`.

5. **Filtering Combinations (`filterPages.ts`):**
   - Define arrays `allowedCities` and `allowedServices`.
   - Export `generateValidCombinations()` returning `{ service, location }[]` for main cities and services (~10 combos, scale up to ~50).

6. **SEO Infrastructure in App Router:**
   - **Sitemap (`app/sitemap.ts`):**
     - Export `GET()` handler generating XML sitemap from valid combinations and homepage.
   - **Robots.txt (`app/robots.txt.tsx`):**
     - Export `GET()` handler returning plain text:
       ```
       User-agent: *
       Allow: /
       Disallow: /lp/
       Disallow: /*?_rsc=
       
       Sitemap: https://gladafonster.se/sitemap.xml
       ```
   - **next.config.js:**
     - Pattern-based 301 redirects from `/lp/:city-:modifier` to `/tjanster/{service}/{city}`.
     - Middleware or headers config to send `X-Robots-Tag: noindex, nofollow` for `/lp/` paths.

7. **ISR Revalidation API (`app/api/revalidate/route.ts`):**
   ```ts
   import { NextResponse } from 'next/server';

   export async function GET(request) {
     const { searchParams } = new URL(request.url);
     const secret = searchParams.get('secret');
     const service = searchParams.get('service');
     const location = searchParams.get('location');
     
     if (secret !== process.env.REVALIDATION_SECRET) {
       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
     }

     await revalidatePath(`/tjanster/${service}/${location}`);
     return NextResponse.json({ revalidated: true });
   }
   ```

8. **Search Console Integration:**
   - Add `<meta name="google-site-verification" content="YOUR_CODE" />` in `app/layout.tsx`.
   - In Google Search Console, submit the new `/sitemap.xml` route and remove old sitemaps.

9. **Redirect Strategy (`next.config.js`):**
   ```js
   module.exports = {
     redirects: async () => [
       {
         source: '/lp/:city(goteborg|kungsbacka|varberg|molndal|kungalv)-:modifier(billig|basta|nara)',
         destination: '/tjanster/fonsterputsning/:city',
         permanent: true
       }
       // Add similar patterns for kommersiell-stadning
     ],
     headers: async () => [
       {
         source: '/lp/:path*',
         headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
       }
     ]
   };
   ```

10. **Content Guidelines:**
    - Minimum 500 words per page, with ≥60% unique content.
    - Use Swedish language and local terminology.
    - Emphasize real local challenges and genuine value.
    - Include LocalBusiness JSON-LD schema.

**EXPECTED OUTCOME:**  
Transform 5,100 doorway pages into ~50 high-quality, location-specific pages that satisfy Google’s quality guidelines, pass canonical checks, and deliver genuine value to users in each Swedish city.

---

Generate all code files and configurations required to implement this plan in your Next.js App Router project.