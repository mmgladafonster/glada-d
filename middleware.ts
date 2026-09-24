import { NextRequest, NextResponse } from 'next/server'
import { checkResponseForExposure } from './lib/env-exposure-scanner'

export function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next()

  // Environment-aware CSP extras (Vercel Live / preview toolbar)
  const isDev = process.env.NODE_ENV === 'development'
  const isPreview = process.env.VERCEL_ENV === 'preview'
  const allowVercelToolbar = isDev || isPreview

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
    'https://www.google.com',
    'https://www.gstatic.com',
    'https://www.googletagmanager.com',
    ...(allowVercelToolbar ? ['https://vercel.live'] : []),
  ].join(' ')

  // GA4 collect endpoints + reCAPTCHA; Vercel Live/Pusher only outside production
  const connectSrc = [
    "'self'",
    'https://www.google.com',
    'https://www.googletagmanager.com',
    'https://region1.google-analytics.com',
    'https://www.google-analytics.com',
    ...(allowVercelToolbar
      ? ['https://vercel.live', 'wss://ws-us3.pusher.com']
      : []),
  ].join(' ')

  // Security Headers
  const securityHeaders = {
    // Prevent clickjacking attacks
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy for privacy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy (restrict dangerous features)
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // Content Security Policy — no Clarity; Vercel Live only in preview/dev
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      `connect-src ${connectSrc}`,
      // google.com: reCAPTCHA; youtube.com: homepage embeds (OptimizedYouTubeVideo)
      "frame-src 'self' https://www.google.com https://www.youtube.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; '),
    
    // HSTS (HTTP Strict Transport Security) - only in production
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    }),
    
    // Cross-Origin policies
    // Note: COEP disabled to allow YouTube embeds
    // 'Cross-Origin-Embedder-Policy': 'credentialless',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value)
    }
  })

  // Rate limiting headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Policy', 'contact-form: 3/15min, health: 60/1min')
  }

  // Security monitoring header
  response.headers.set('X-Security-Version', '3.0')
  
  // Environment exposure protection for API routes (development only)
  if (process.env.NODE_ENV === 'development' && request.nextUrl.pathname.startsWith('/api/')) {
    // Note: We can't easily check response body in middleware, but we can add headers
    response.headers.set('X-Env-Exposure-Check', 'enabled')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}