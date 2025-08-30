# Project Structure

## Next.js App Router Structure
```
app/                    # Next.js 13+ App Router
├── layout.tsx         # Root layout with Swedish locale
├── page.tsx           # Homepage
├── globals.css        # Global styles
├── sitemap.ts         # SEO sitemap generation
├── not-found.tsx      # 404 page
├── api/               # API routes
│   ├── health/        # Health check endpoint
│   ├── keywords/      # Keyword management
│   └── security/      # Security monitoring APIs
├── contact/           # Contact page
├── services/          # Dynamic service pages
│   └── [service]/[location]/  # Dynamic routing
├── lp/[slug]/         # Landing pages
└── test-*/            # Development test pages
```

## Component Organization
```
components/
├── ui/                # shadcn/ui components (Radix-based)
├── header.tsx         # Site header
├── footer.tsx         # Site footer
├── google-analytics.tsx
├── optimized-youtube-video.tsx
├── recaptcha-provider.tsx
└── theme-provider.tsx
```

## Library Structure
```
lib/                   # Utility libraries
├── utils.ts          # Common utilities (cn function)
├── config.ts         # App configuration
├── security-*.ts     # Security-related modules
├── dependency-scanner.ts  # Security scanning
├── env-*.ts          # Environment validation
├── logger.ts         # Logging utilities
├── rate-limit.ts     # API rate limiting
├── resend.ts         # Email service
└── keywords.json     # SEO keywords data
```

## Utilities & Hooks
```
utils/                 # Pure utility functions
└── getClientIp.ts    # IP address extraction

hooks/                 # React hooks
├── use-mobile.tsx    # Mobile detection
└── use-toast.ts      # Toast notifications
```

## Data & Scripts
```
scripts/              # Build and utility scripts
├── generate_routes.js
├── populate_pages.js
├── process-keywords.js
└── test-*.js         # Testing scripts

*.csv                 # Keyword and data files
```

## Key Conventions

### File Naming
- **Pages**: kebab-case directories, page.tsx files
- **Components**: PascalCase for React components
- **Utilities**: camelCase for functions and utilities
- **API Routes**: route.ts in directory structure

### Import Patterns
- Use `@/` path alias for imports from project root
- Components import from `@/components/ui/`
- Utilities import from `@/lib/`
- Hooks import from `@/hooks/`

### Component Structure
- UI components follow shadcn/ui patterns
- Custom components in root components/ directory
- Shared utilities in lib/ directory
- Business logic separated from presentation

### Security Architecture
- Security initialization in lib/security-init.ts
- Middleware handles security headers
- Environment validation on startup
- Comprehensive logging and monitoring

### Styling Approach
- Tailwind CSS with custom design system
- CSS variables for theming
- Component variants using class-variance-authority
- Responsive design with mobile-first approach