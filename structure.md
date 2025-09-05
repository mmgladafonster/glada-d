# File Structure Report - Glada Fönster Website

## Project Overview
This is a **Next.js 15.2.4** application for Glada Fönster, a Swedish window cleaning service. The project uses the App Router architecture with TypeScript and a comprehensive security-focused setup.

## Core Architecture

### Framework & Dependencies
- **Next.js 15.2.4** with App Router
- **React 19** with TypeScript 5
- **Tailwind CSS 3.4.17** + shadcn/ui component library
- **Comprehensive Radix UI** component suite (40+ components)
- **Security-first** approach with custom middleware and monitoring

### Project Structure Analysis

```
📁 Root Directory
├── 📁 app/                    # Next.js App Router (main application)
├── 📁 components/             # React components
├── 📁 lib/                    # Core utilities and configuration
├── 📁 hooks/                  # Custom React hooks
├── 📁 utils/                  # Pure utility functions
├── 📁 scripts/                # Build and automation scripts
├── 📁 public/                 # Static assets
├── 📁 .kiro/                  # Kiro IDE configuration
├── 📁 .next/                  # Next.js build output
├── 📁 node_modules/           # Dependencies
└── Configuration files
```

## Detailed Directory Breakdown

### 🚀 App Directory (Next.js App Router)
```
app/
├── layout.tsx                 # Root layout (Swedish locale)
├── page.tsx                   # Homepage
├── globals.css                # Global styles
├── sitemap.ts                 # SEO sitemap generation
├── not-found.tsx              # 404 page
├── 📁 api/                    # API routes
│   ├── health/                # Health check endpoint
│   ├── keywords/              # Keyword management API
│   └── security/              # Security monitoring APIs
├── 📁 about/                  # About page
├── 📁 contact/                # Contact page
├── 📁 services/               # Dynamic service pages
├── 📁 lp/[slug]/              # Dynamic landing pages
├── 📁 privacy-policy/         # Privacy policy
├── 📁 actions/                # Server actions (send-email.ts)
└── 📁 test-*/                 # Development test pages (3 test routes)
```

### 🎨 Components Directory
```
components/
├── 📁 ui/                     # shadcn/ui components (50+ components)
│   ├── button.tsx             # Core UI primitives
│   ├── form.tsx               # Form components
│   ├── dialog.tsx             # Modal components
│   └── ... (comprehensive UI kit)
├── header.tsx                 # Site header
├── footer.tsx                 # Site footer
├── google-analytics.tsx       # Analytics integration
├── optimized-youtube-video.tsx # Video component
├── recaptcha-provider.tsx     # reCAPTCHA integration
└── theme-provider.tsx         # Dark/light theme support
```

### 🔧 Lib Directory (Core Logic)
```
lib/
├── 📁 __tests__/              # Test files
├── config.ts                  # App configuration
├── utils.ts                   # Common utilities (cn function)
├── keywords.json              # SEO keywords data
├── resend.ts                  # Email service integration
├── 🔒 Security Suite:
│   ├── security-init.ts       # Security initialization
│   ├── security-headers.ts    # Security headers config
│   ├── security-monitor.ts    # Security monitoring
│   ├── security-scanner.ts    # Security scanning
│   ├── security-alerts.ts     # Alert system
│   ├── dependency-scanner.ts  # Dependency vulnerability scanning
│   ├── env-exposure-scanner.ts # Environment exposure detection
│   └── env-validator.ts       # Environment validation
├── logger.ts                  # Logging utilities
├── rate-limit.ts              # API rate limiting
└── error-messages.ts          # Error handling
```

### 🪝 Hooks & Utils
```
hooks/
├── use-mobile.tsx             # Mobile detection hook
└── use-toast.ts               # Toast notification hook

utils/
├── 📁 __tests__/              # Test files
└── getClientIp.ts             # IP address extraction utility
```

### 🛠️ Scripts Directory
```
scripts/
├── generate_routes.js         # Route generation
├── populate_pages.js          # Page population
├── process-keywords.js        # Keyword processing
└── test-*.js                  # Various testing scripts (5 files)
```

### 🖼️ Public Assets
```
public/
├── glada-car-background.png   # Brand imagery
├── glada-fonster-kungsbacka-happy.png
├── glada-fonster.ico          # Favicon
├── placeholder-*.* (5 files)  # Placeholder images
└── robots.txt                 # SEO robots file
```

## Key Configuration Files

### Build & Development
- **package.json**: 60+ dependencies, modern React/Next.js stack
- **next.config.mjs**: Build optimization, redirects, security headers via middleware
- **tsconfig.json**: TypeScript config with `@/*` path aliases
- **tailwind.config.ts**: Tailwind CSS configuration
- **components.json**: shadcn/ui configuration

### Data Files
- **Keywords**: `gladafonster_programmatic_keywords.csv`, `pr-keywords.csv`
- **Documentation**: Multiple `.md` files for setup and security

## Architecture Highlights

### 🔒 Security-First Design
- Comprehensive security middleware
- Environment exposure scanning
- Dependency vulnerability monitoring
- Rate limiting and security headers
- Custom security initialization and monitoring

### 🎯 SEO & Performance
- Dynamic sitemap generation
- Keyword-driven content strategy
- Optimized images (unoptimized config for flexibility)
- Swedish locale optimization

### 🧩 Component Architecture
- Complete shadcn/ui implementation (50+ components)
- Radix UI primitives for accessibility
- Custom business components
- Theme provider for dark/light modes

### 📱 Modern Development Stack
- TypeScript throughout
- React Hook Form + Zod validation
- Tailwind CSS with design system
- ESLint (build errors ignored for flexibility)

## Business Context
This is a production website for **Glada Fönster**, a Swedish window cleaning service serving Gothenburg and surrounding areas. The codebase reflects a professional service business with strong emphasis on security, SEO, and user experience.

The structure shows a mature, well-organized Next.js application with enterprise-level security considerations and a comprehensive component library ready for scaling.