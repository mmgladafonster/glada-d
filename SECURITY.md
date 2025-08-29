# Security Policy

## Overview
This document outlines the security measures implemented in the Glada Fönster website.

## Security Measures Implemented

### 1. Input Validation & Sanitization
- All form inputs are validated and sanitized
- Length limits enforced on all fields
- XSS prevention through input sanitization
- Email and phone format validation
- Name field validation (letters only)

### 2. Rate Limiting
- Contact form submissions limited to 3 per 15 minutes per email
- IP-based rate limiting: 10 requests per 15 minutes per IP
- Health endpoint: 60 requests per minute per IP
- In-memory rate limiting with automatic cleanup
- **Vercel Deployment**: Rate limits reset between serverless function invocations (expected behavior)
- Multi-layer protection (email + IP) provides redundant security
- Progressive delay with exponential backoff for repeat offenders

### 3. Security Headers (Enhanced - Phase 3)
- **Middleware-based**: All security headers applied via Next.js middleware
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME sniffing)
- X-XSS-Protection: enabled for legacy browsers
- Content Security Policy: Strict policy with specific domain allowlists
- Referrer Policy: strict-origin-when-cross-origin
- Permissions Policy: Restricts dangerous browser features
- HSTS: Enforced in production (max-age=31536000)
- Cross-Origin Policies: COEP, COOP, CORP configured
- Rate limiting headers for API routes
- Security version tracking

### 4. Environment Security
- Sensitive credentials removed from version control
- Minimal logging in production
- API key validation without exposure

### 5. reCAPTCHA Protection
- Google reCAPTCHA v3 integration
- Server-side token verification
- Protection against automated submissions

### 6. Secure Error Handling (Enhanced - Phase 3)
- **Generic error messages**: No internal information exposed to users
- **Detailed server-side logging**: Full error details logged internally only
- **Error code system**: Internal tracking codes never exposed to users
- **User-friendly error IDs**: Generated for user reference without revealing system details
- **Message validation**: Automatic detection of sensitive information in error messages
- **Log injection prevention**: Sanitized logging to prevent log manipulation
- **Environment-aware messaging**: Different detail levels for development vs production
- **Structured security event logging**: Comprehensive error tracking and analysis

### 7. Health Endpoint Security (NEW - Phase 1)
- Minimal response data (no sensitive configuration details)
- Server-side logging for monitoring
- No API key information exposed
- Simple status reporting only

### 8. Enhanced Rate Limiting (NEW - Phase 2)
- Multi-layer rate limiting (email + IP address)
- Progressive delay system with exponential backoff
- Different limits for different endpoints
- Rate limiting for health endpoint
- Comprehensive monitoring and logging

### 9. Production Logging System (NEW - Phase 2)
- Environment-based log levels (dev vs production)
- Structured JSON logging for production
- Security-specific logging with error codes
- No sensitive information in logs
- Proper log formatting and context

### 10. Strengthened Content Security Policy (NEW - Phase 2)
- Removed unsafe-inline and unsafe-eval directives
- Specific domain allowlists for external resources
- Added object-src 'none' and base-uri 'self'
- Form-action restrictions
- Additional security headers (Permissions-Policy, HSTS)

### 11. Dependency Security (NEW - Phase 2)
- All dependencies locked to specific versions
- Removed "latest" version specifiers
- Predictable security posture
- Easier vulnerability tracking

### 12. Environment Variable Management (Enhanced - Phase 3)
- **Automated validation**: All environment variables validated on startup
- **Production vs development**: Key validation with environment-specific checks
- **Secure configuration**: Comprehensive configuration security checking
- **Environment-specific warnings**: Tailored security warnings per environment
- **Exposure detection**: Runtime scanning for environment variable exposure risks
- **Client-side protection**: Prevention of sensitive variables in NEXT_PUBLIC_ vars
- **Response sanitization**: Automatic removal of sensitive data from API responses
- **Logging protection**: Prevention of sensitive data in application logs

### 13. Security Monitoring Dashboard (Enhanced - Phase 3)
- **Real-time security metrics**: Comprehensive monitoring and analysis
- **Security event tracking**: Detailed event logging and analysis
- **Automated threat detection**: Intelligent pattern recognition
- **Comprehensive security scoring**: Dynamic scoring based on multiple factors
- **Security alerts system**: Real-time notifications for critical events
- **Email notifications**: Automated alerts sent to security team
- **Webhook integration**: Support for external monitoring systems
- **Alert thresholds**: Configurable alerting based on event frequency and severity

### 14. Automated Security Scanning (NEW - Phase 3)
- Comprehensive security vulnerability scanning
- Runtime security checks
- Dependency security validation
- Automated security recommendations

## Vercel Deployment Security Considerations

### Serverless Function Behavior
- **Rate Limiting**: In-memory rate limits reset between function invocations (normal serverless behavior)
- **Environment Variables**: Securely managed through Vercel dashboard
- **Edge Protection**: Vercel provides additional DDoS protection at the edge level
- **Function Isolation**: Each invocation runs in isolated environment

### Acceptable Limitations
- Rate limiting persistence: Acceptable for this application's use case
- Memory cleanup: Automatic between function restarts
- Session state: Stateless design prevents session-based attacks

### Vercel-Specific Security Features
- Automatic HTTPS/TLS termination
- Edge network DDoS protection
- Environment variable encryption
- Secure deployment pipeline

## Security Best Practices

### Environment Variables
Never commit sensitive data to version control:
```bash
# ❌ NEVER do this
RECAPTCHA_SECRET_KEY=actual_secret_key

# ✅ Use placeholder values
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### API Keys
- Always use environment variables for API keys
- Validate API key format before use
- Never log API keys or sensitive data

### Input Handling
- Always validate and sanitize user inputs
- Use strict validation patterns
- Implement length limits
- Escape HTML characters

### Error Handling (Phase 1 Implementation)
- Use generic error messages for users
- Log detailed errors server-side only
- Implement error codes for tracking
- Never expose internal system information
- Structure security events for monitoring

### Rate Limiting (Phase 2 Implementation)
- Implement multi-layer protection (email + IP)
- Use progressive delays with exponential backoff
- Configure different limits per endpoint type
- Monitor and log rate limit violations
- Automatic cleanup of expired entries

### Logging (Phase 2 Implementation)
- Use structured logging with proper levels
- Environment-based configuration (dev vs prod)
- Security-specific logging functions
- No sensitive data in log outputs
- Proper context and metadata inclusion

### Content Security Policy (Phase 2 Implementation)
- Remove unsafe directives where possible
- Use specific domain allowlists
- Implement additional security headers
- Regular CSP violation monitoring
- Balance security with functionality

### Environment Management (Phase 3 Implementation)
- Validate all environment variables on startup
- Check for production vs development key usage
- Monitor configuration security
- Automated environment validation
- Secure configuration recommendations

### Security Monitoring (Phase 3 Implementation)
- Real-time security event tracking
- Automated threat detection and response
- Security metrics collection and analysis
- Dashboard for security status monitoring
- Comprehensive security scoring

### Security Headers Middleware (Phase 3 Implementation)
- Centralized security header management via middleware.ts
- Consistent application across all routes
- Enhanced CSP with specific domain allowlists
- Production-specific HSTS enforcement
- Cross-origin policy configuration
- Automated security header validation in development

### Enhanced Error Handling (Phase 3 Implementation)
- Secure error response builder with user-friendly error IDs
- Automatic validation of error messages for sensitive information
- Log injection prevention with message sanitization
- Environment-aware error detail levels
- Comprehensive error code system for internal tracking
- Safe error message formatting with fallback mechanisms

### Environment Variable Exposure Protection (Phase 3 Implementation)
- Comprehensive exposure risk scanning for all environment variables
- Client-side exposure prevention (NEXT_PUBLIC_ variable validation)
- Runtime response sanitization to remove sensitive patterns
- Automatic detection of placeholder values in production
- Development vs production key validation
- Logging exposure prevention with pattern detection
- API response monitoring for environment variable leakage

### Security Monitoring Alerts (Phase 3 Implementation)
- Real-time security alert system with email and webhook notifications
- Configurable alert thresholds based on event frequency and severity
- Intelligent alert aggregation to prevent notification spam
- Comprehensive alert categories (rate limiting, reCAPTCHA, validation, environment, system)
- HTML and text email templates for security alerts
- Alert cooldown periods to prevent duplicate notifications
- Integration with existing security monitoring and scanning systems
- Development-mode alert testing and configuration endpoints

### Automated Security Scanning (Phase 3 Implementation)
- Regular vulnerability scans
- Runtime security checks
- Dependency security validation
- Configuration security analysis
- Automated security recommendations

## Reporting Security Issues
If you discover a security vulnerability, please report it to:
- Email: security@gladafonster.se
- Include detailed description and steps to reproduce

## Security Checklist
- [x] Environment variables configured
- [x] reCAPTCHA keys regenerated
- [x] Rate limiting tested
- [x] Security headers verified
- [x] Input validation tested
- [x] No sensitive data in logs
- [x] Secure error handling implemented (Phase 1)
- [x] Health endpoint secured (Phase 1)
- [x] Enhanced rate limiting (Phase 2)
- [x] Production logging system (Phase 2)
- [x] Strict CSP implementation (Phase 2)
- [x] Dependency version locking (Phase 2)
- [x] Environment variable management (Phase 3)
- [x] Security monitoring dashboard (Phase 3)
- [x] Automated security scanning (Phase 3)
- [x] Security headers middleware (Phase 3)
- [x] Enhanced error message security (Phase 3)
- [x] Environment variable exposure protection (Phase 3)
- [x] Security monitoring alerts (Phase 3)

## Regular Security Tasks
1. Rotate API keys quarterly
2. Review and update dependencies monthly
3. Monitor for security vulnerabilities
4. Test rate limiting functionality
5. Verify security headers are active