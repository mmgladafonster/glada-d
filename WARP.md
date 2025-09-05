# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the **Glada Fönster** website - a Next.js 15.2.4 application for a Swedish window cleaning service. The project uses the App Router architecture with TypeScript, React 19, and has a strong emphasis on security, SEO optimization, and professional service delivery.

**Key Business Context:**
- Swedish window cleaning service serving Göteborg and surrounding areas
- Multiple service types: window cleaning, commercial cleaning, home cleaning
- Location-based SEO strategy targeting specific Swedish cities
- Professional service business with contact form and quote requests

## Development Commands

### Core Development
```bash
# Development server
npm run dev        # or pnpm dev
# Starts on http://localhost:3000

# Production build
npm run build      # or pnpm build

# Production server
npm run start      # or pnpm start

# Linting
npm run lint       # or pnpm lint
```

### Package Management
- **Primary**: `pnpm` (has pnpm-lock.yaml)
- **Fallback**: `npm` (has package-lock.json)
- Use `pnpm` for consistency with existing setup

### Testing
```bash
# Run tests with Vitest
npx vitest

# Run tests in specific directories
npx vitest lib/
npx vitest utils/

# Test specific security implementations
npx tsx scripts/test-implementation.ts
```

### SEO and Content Generation
```bash
# Test page generation implementation
npx tsx scripts/test-implementation.ts

# Filter and generate pages
npx tsx scripts/filterPages.ts

# Process keywords for SEO
npx tsx scripts/process-keywords.js
```

### Revalidation (ISR)
```bash
# Revalidate specific service/location page
curl "/api/revalidate?secret=YOUR_SECRET&service=fonsterputsning&location=goteborg"

# Revalidate all pages
curl -X PUT "/api/revalidate?secret=YOUR_SECRET"
```

## Architecture Overview

### Security-First Design
This application has **enterprise-level security** implementation:
- **Comprehensive middleware** (`middleware.ts`) with strict CSP, security headers
- **Multi-layered security monitoring** with real-time alerts and metrics
- **Environment variable protection** with exposure scanning and validation
- **Rate limiting** with progressive delays and multi-layer protection (IP + email)
- **Input sanitization** and validation for all user inputs
- **reCAPTCHA v3** integration for form protection

**Key Security Components:**
- `lib/security-init.ts` - Initializes security systems on startup
- `lib/security-monitor.ts` - Real-time security event tracking and metrics
- `lib/env-validator.ts` - Environment variable validation and exposure prevention
- `lib/security-scanner.ts` - Automated vulnerability scanning
- `lib/security-alerts.ts` - Alert system with email notifications

### Content & SEO Architecture
- **Dynamic page generation** for service/location combinations
- **ISR (Incremental Static Regeneration)** for fresh content with daily revalidation
- **Programmatic SEO** with location-specific content generation
- **Content generation system** (`lib/contentGenerator.ts`) for unique, high-quality pages
- **Location database** (`lib/locationData.ts`) with Swedish cities and service data

### UI Component System
- **shadcn/ui** complete component library (50+ components)
- **Radix UI** primitives for accessibility
- **Tailwind CSS** with custom design system
- **Dark/light theme** support via `theme-provider.tsx`
- **Responsive design** with mobile-first approach

### Communication & Forms
- **Resend** for email delivery (`lib/resend.ts`)
- **React Hook Form + Zod** for form validation
- **reCAPTCHA v3** for spam protection
- **Server Actions** for form processing (`app/actions/send-email.ts`)

## File Structure Context

### App Directory (Next.js App Router)
```
app/
├── layout.tsx                 # Root layout with Swedish locale, security init
├── page.tsx                   # Homepage
├── api/                       # API routes
│   ├── health/                # Health check with security monitoring
│   ├── security/              # Security monitoring endpoints
│   └── revalidate/            # ISR revalidation API
├── tjanster/[service]/[location]/  # Dynamic SEO pages
├── about/                     # Static pages
├── contact/
└── actions/                   # Server Actions
```

### Security Library (`lib/`)
- **security-init.ts** - Startup initialization
- **security-monitor.ts** - Event tracking and metrics
- **env-validator.ts** - Environment validation
- **security-scanner.ts** - Vulnerability scanning
- **security-alerts.ts** - Alert system
- **rate-limit.ts** - Rate limiting with progressive delays

### Business Logic (`lib/`)
- **contentGenerator.ts** - SEO content generation
- **locationData.ts** - Swedish cities and services database
- **resend.ts** - Email service configuration
- **config.ts** - Application configuration
- **keywords.json** - SEO keywords database

## Development Guidelines

### Security Considerations
- **Never commit sensitive data** - Use `.env.local` for development
- **Environment variables** are validated on startup - check console for errors
- **Security monitoring** is active in development - check logs for security events
- **Rate limiting** applies to all API routes - use different emails for testing

### Content Development
- **Service pages** follow homepage design patterns
- **Content generation** creates unique, location-specific content
- **ISR revalidation** happens daily automatically, can be triggered manually
- **SEO optimization** requires understanding of Swedish market and locations

### Form Development
- **All forms** must use reCAPTCHA v3
- **Server Actions** in `app/actions/` directory
- **Input validation** with Zod schemas
- **Rate limiting** applies - test with different identifiers

### Testing Approach
- **Vitest** for unit testing (see `lib/__tests__/` and `utils/__tests__/`)
- **Security scanning** tests in `lib/__tests__/dependency-scanner.test.ts`
- **Manual testing** with test scripts in `scripts/`

## Environment Setup

### Required Environment Variables
```bash
RESEND_API_KEY=re_your_key_here                    # Email delivery
RECAPTCHA_SECRET_KEY=your_recaptcha_secret         # Form protection
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key       # Client-side reCAPTCHA
REVALIDATION_SECRET=your_secure_random_string      # ISR revalidation
NODE_ENV=development|production                     # Environment mode
```

### Security Validation
- Environment variables are **validated on startup**
- **Placeholder detection** prevents accidental deployment with example values
- **Production vs development** key validation
- **Automatic exposure scanning** for sensitive variables

## Common Development Tasks

### Adding New Service Locations
1. Update `lib/locationData.ts` with new location data
2. Add location to service combinations in content generator
3. Test page generation with `npx tsx scripts/test-implementation.ts`
4. Revalidate affected pages via ISR API

### Security Monitoring
- Check security status at `/api/security/monitor`
- View security metrics and recent events
- Security alerts are sent automatically for critical events

### Content Updates
- Modify `lib/contentGenerator.ts` for content templates
- Update `lib/keywords.json` for SEO keywords
- Use ISR revalidation to refresh content without deployment

### Email System
- Test email configuration at `/test-email` (development only)
- Check Resend dashboard for delivery status
- Rate limiting: 3 emails per 15 minutes per email address

## Integration Points

### External Services
- **Vercel** for hosting and edge functions
- **Resend** for transactional emails
- **Google reCAPTCHA v3** for form protection
- **Google Analytics** for tracking
- **Google Search Console** for SEO monitoring

### v0.dev Integration
- Project synced with v0.dev for UI development
- Automatic deployment to Vercel from v0 changes
- Continue building at: https://v0.dev/chat/projects/vsCIQmCTKO5

## Troubleshooting

### Common Issues
- **Environment validation fails**: Check console for specific missing/invalid variables
- **Email not working**: Verify Resend API key and domain verification
- **Rate limiting hit**: Wait 15 minutes or use different email/IP for testing
- **Security alerts**: Check `/api/security/monitor` for details
- **ISR not updating**: Use manual revalidation API with correct secret

### Debug Resources
- Security monitoring dashboard: `/api/security/monitor`
- Health check: `/api/health`
- Browser console shows detailed error logging in development
- Server logs contain structured security events

This project represents a production-ready, security-focused Next.js application with sophisticated SEO optimization and comprehensive monitoring systems.
