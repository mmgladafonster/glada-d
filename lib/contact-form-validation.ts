/**
 * Pure validation/sanitization helpers for the contact form.
 * Kept free of Next.js / Resend so they can be unit-tested without network I/O.
 */

export const ALLOWED_PROPERTY_TYPES = [
  "House",
  "Townhouse",
  "Apartment",
  "Office",
  "Shop",
  "Other",
] as const

export type AllowedPropertyType = (typeof ALLOWED_PROPERTY_TYPES)[number]

/** Strip common XSS vectors from free-text fields before embedding in email HTML. */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
}

/**
 * GDPR checkbox (name="gdpr") is sent as "on" when checked (HTML default),
 * and is absent when unchecked. Also accept common truthy strings.
 */
export function isGdprConsentAccepted(raw: FormDataEntryValue | null | undefined): boolean {
  if (raw == null) return false
  const value = String(raw).trim().toLowerCase()
  return value === "on" || value === "true" || value === "1" || value === "yes"
}

/**
 * Whitelist propertyType against the contact form <select> options.
 * Empty string is allowed (optional field / "Välj typ").
 * Returns the safe value, or null when the submitted value is not allowed.
 */
export function normalizePropertyType(raw: string): AllowedPropertyType | "" | null {
  const trimmed = raw.trim()
  if (!trimmed) return ""
  if ((ALLOWED_PROPERTY_TYPES as readonly string[]).includes(trimmed)) {
    return trimmed as AllowedPropertyType
  }
  return null
}
