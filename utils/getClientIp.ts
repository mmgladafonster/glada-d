// Utility for extracting client IP addresses from request headers
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

/**
 * Extracts the client IP address from request headers
 * @param headersOrRequest - Either Next.js headers() result or NextRequest object
 * @returns The client IP address or 'unknown' if not found
 */
export async function getClientIp(headersOrRequest?: Headers | NextRequest): Promise<string> {
  let headersList: Headers

  if (!headersOrRequest) {
    // Use Next.js headers() function
    headersList = await headers()
  } else if (headersOrRequest instanceof Headers) {
    headersList = headersOrRequest
  } else {
    // NextRequest object
    headersList = headersOrRequest.headers
  }

  // 1. Check x-forwarded-for header (can contain comma-separated IPs)
  const forwardedFor = headersList.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip.length > 0)
    if (ips.length > 0) {
      return ips[0] // Return the first non-empty IP
    }
  }

  // 2. Fallback to x-real-ip header
  const realIp = headersList.get('x-real-ip')
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim()
  }

  // 3. Return 'unknown' if neither header is present
  return 'unknown'
}