# Technology Stack

## Framework & Runtime
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Node.js** - Server runtime

## Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI primitives
- **Radix UI** - Headless UI components for accessibility
- **Lucide React** - Icon library
- **next-themes** - Dark/light theme support

## Development Tools
- **ESLint** - Code linting (build errors ignored in config)
- **PostCSS** - CSS processing
- **TypeScript** - Type checking (build errors ignored in config)

## Key Libraries
- **React Hook Form + Zod** - Form handling and validation
- **Resend** - Email service integration
- **csv-parse** - CSV file processing
- **date-fns** - Date manipulation
- **clsx + tailwind-merge** - Conditional CSS classes

## Security Features
- Custom security middleware with CSP headers
- Environment exposure scanning
- Security monitoring and logging
- Rate limiting for API routes
- Comprehensive security headers (HSTS, XSS protection, etc.)

## Build & Deployment
- **Vercel** - Hosting platform
- **pnpm** - Package manager (lockfile present)
- Images unoptimized in Next.js config

## Common Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Package management (uses pnpm)
pnpm install         # Install dependencies
pnpm add <package>   # Add new package
```

## Configuration Notes
- TypeScript and ESLint errors are ignored during builds
- Security headers handled by middleware.ts
- Path aliases configured: @/* maps to project root
- Swedish locale (sv) configured in layout