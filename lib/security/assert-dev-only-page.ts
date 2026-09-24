import { notFound } from "next/navigation"
import { isInternalRouteBlocked } from "@/lib/security/guard-internal-route"

/**
 * Call from a Server Component (e.g. route `layout.tsx`) to hide
 * debug/test pages on production and Vercel preview. Local `next dev` stays open.
 */
export function assertDevOnlyPage(): void {
  if (isInternalRouteBlocked()) {
    notFound()
  }
}
