import { NextResponse } from "next/server"

/**
 * Block internal/admin security endpoints on deployed and production builds.
 * Allows access only during local `next dev` (NODE_ENV !== "production" and
 * not running on Vercel preview/production).
 *
 * Returns a 404 response with an empty body when blocked; null when allowed.
 * Call at the top of every /api/security/* handler before any work.
 */
export function guardInternalRoute(): NextResponse | null {
  const vercelEnv = process.env.VERCEL_ENV
  const isVercelDeployed =
    vercelEnv === "production" || vercelEnv === "preview"
  const isProductionNode = process.env.NODE_ENV === "production"

  if (isVercelDeployed || isProductionNode) {
    // Opaque 404 — no body details that could fingerprint the endpoint.
    return new NextResponse(null, { status: 404 })
  }

  return null
}
