import { NextResponse } from "next/server"

/**
 * True when the app is running in a production Node build or on a Vercel
 * production/preview deployment. Used to hide internal/dev-only surfaces.
 */
export function isInternalRouteBlocked(): boolean {
  const vercelEnv = process.env.VERCEL_ENV
  const isVercelDeployed =
    vercelEnv === "production" || vercelEnv === "preview"
  const isProductionNode = process.env.NODE_ENV === "production"
  return isVercelDeployed || isProductionNode
}

/**
 * Block internal/admin API endpoints on deployed and production builds.
 * Allows access only during local `next dev`.
 *
 * Returns a 404 response with an empty body when blocked; null when allowed.
 * Call at the top of every /api/security/* handler before any work.
 */
export function guardInternalRoute(): NextResponse | null {
  if (isInternalRouteBlocked()) {
    // Opaque 404 — no body details that could fingerprint the endpoint.
    return new NextResponse(null, { status: 404 })
  }
  return null
}
