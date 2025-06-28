# Resend Email Setup Guide

## ⚠️ SECURITY NOTICE
Your API key was shared publicly and should be regenerated immediately for security.

## Setup Steps

### 1. Regenerate API Key
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Delete the current API key
3. Create a new API key
4. Copy the new key (starts with `re_`)

### 2. Add Environment Variable
Add this to your environment variables (replace with your NEW key):

\`\`\`bash
RESEND_API_KEY=re_your_new_key_here
\`\`\`

### 3. Verify Domain
1. Go to [Resend Domains](https://resend.com/domains)
2. Add domain: `gladafonster.se`
3. Add the required DNS records to your domain provider
4. Wait for verification (can take up to 24 hours)

### 4. Test Configuration
1. Visit `/test-email` on your website
2. Check browser console for detailed logs
3. Verify email delivery to mmgladafonster@gmail.com

## Troubleshooting

### Common Issues:
- **Domain not verified**: Check DNS records in your domain provider
- **API key invalid**: Make sure it starts with `re_`
- **Rate limiting**: Resend has sending limits for new accounts
- **Spam folder**: Check spam/junk folder for test emails

### Debug Steps:
1. Check browser console for error messages
2. Verify environment variable is set correctly
3. Confirm domain verification status in Resend dashboard
4. Test with a simple email first

## Environment Variable Setup

### For Vercel:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add: `RESEND_API_KEY` = `your_new_key`
4. Redeploy your application

### For Local Development:
Create a `.env.local` file:
\`\`\`
RESEND_API_KEY=your_new_key_here
\`\`\`

## Support
If you continue having issues:
- Check Resend documentation: https://resend.com/docs
- Contact Resend support: https://resend.com/support
