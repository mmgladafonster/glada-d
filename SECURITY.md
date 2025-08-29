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
- In-memory rate limiting with automatic cleanup

### 3. Security Headers
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME sniffing)
- X-XSS-Protection: enabled
- Content Security Policy configured
- Referrer Policy set to strict-origin-when-cross-origin

### 4. Environment Security
- Sensitive credentials removed from version control
- Minimal logging in production
- API key validation without exposure

### 5. reCAPTCHA Protection
- Google reCAPTCHA v3 integration
- Server-side token verification
- Protection against automated submissions

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

## Reporting Security Issues
If you discover a security vulnerability, please report it to:
- Email: security@gladafonster.se
- Include detailed description and steps to reproduce

## Security Checklist
- [ ] Environment variables configured
- [ ] reCAPTCHA keys regenerated
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] Input validation tested
- [ ] No sensitive data in logs

## Regular Security Tasks
1. Rotate API keys quarterly
2. Review and update dependencies monthly
3. Monitor for security vulnerabilities
4. Test rate limiting functionality
5. Verify security headers are active