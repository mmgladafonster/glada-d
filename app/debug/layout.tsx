import type { ReactNode } from "react"
import { assertDevOnlyPage } from "@/lib/security/assert-dev-only-page"

/**
 * Server layout: hide this debug/test route outside local development.
 */
export default function DevOnlyLayout({ children }: { children: ReactNode }) {
  assertDevOnlyPage()
  return children
}
