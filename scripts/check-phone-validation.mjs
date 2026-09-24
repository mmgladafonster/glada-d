/**
 * Unit check for normalizeAndValidatePhone (real TypeScript module).
 * Run: node --experimental-strip-types scripts/check-phone-validation.mjs
 */
import { normalizeAndValidatePhone } from "../lib/contact-form-validation.ts"

const valid = [
  "0701234567",
  "070-123 45 67",
  "070 123 45 67",
  "070-1234567",
  "+46701234567",
  "+46 70 123 45 67",
  "0046701234567",
  "08-123 456 78",
  "081234567",
  "031-123456",
  "(08) 123 456 78",
  "  070-123 45 67  ",
  "070\u00A0123\u00A045\u00A067",
  "070\u20131234567",
  "070.123.45.67",
  "+46 (0) 70 123 45 67",
  "+4712345678",
]

const invalid = ["abc", "123", "070-12x", "", "   ", "12", "+123", "701234567"]

let failed = 0
console.log("VALID cases:")
for (const input of valid) {
  const r = normalizeAndValidatePhone(input)
  const status = r.ok ? "PASS" : "FAIL"
  if (!r.ok) failed++
  console.log(`  [${status}] ${JSON.stringify(input)} -> ${r.ok ? r.normalized : "rejected"}`)
}
console.log("INVALID cases:")
for (const input of invalid) {
  const r = normalizeAndValidatePhone(input)
  const status = !r.ok ? "PASS" : "FAIL"
  if (r.ok) failed++
  console.log(`  [${status}] ${JSON.stringify(input)} -> ${r.ok ? r.normalized : "rejected"}`)
}
console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`)
process.exit(failed === 0 ? 0 : 1)
