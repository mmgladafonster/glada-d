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

/**
 * Lenient phone normalization for Swedish + international numbers.
 * Strips spaces/NBSP, dashes (incl. en/em), dots, parentheses; maps 00… → +…;
 * drops Swedish trunk 0 after +46 (e.g. +46(0)70…).
 * Accepts national numbers starting with 0 (7–12 digits) or +E.164 (7–15 digits).
 */
export type PhoneValidationResult =
  | { ok: true; normalized: string }
  | { ok: false }

const PHONE_DASHES = /[\u002D\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g
const PHONE_SPACES = /[\s\u00A0\u2000-\u200B\u202F\u205F\u3000]/g

export function normalizeAndValidatePhone(raw: string): PhoneValidationResult {
  if (raw == null) return { ok: false }

  let s = String(raw).trim()
  if (!s) return { ok: false }

  // Unify exotic whitespace and dash characters, then strip separators
  s = s.replace(PHONE_SPACES, " ")
  s = s.replace(PHONE_DASHES, "-")
  s = s.replace(/[\s.()\-]/g, "")

  // International prefix 00… → +…
  if (s.startsWith("00")) {
    s = `+${s.slice(2)}`
  }

  // +46(0)70… often becomes +46070… after stripping parens — drop trunk 0
  if (s.startsWith("+460")) {
    s = `+46${s.slice(4)}`
  }

  if (!/^\+?\d+$/.test(s)) {
    return { ok: false }
  }

  if (s.startsWith("+")) {
    const digits = s.slice(1)
    if (digits.length < 7 || digits.length > 15) return { ok: false }
    return { ok: true, normalized: `+${digits}` }
  }

  // Swedish-style national number (leading 0)
  if (!s.startsWith("0")) return { ok: false }
  if (s.length < 7 || s.length > 12) return { ok: false }
  return { ok: true, normalized: s }
}

export function isValidPhone(raw: string): boolean {
  return normalizeAndValidatePhone(raw).ok
}
