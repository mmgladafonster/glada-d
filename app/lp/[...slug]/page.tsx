// Catch-all handler for removed LP pages
// Returns 404 for any LP pages that don't have specific redirects

import { notFound } from 'next/navigation';

export default function LPCatchAll() {
  // All LP pages have been removed - return 404
  notFound();
}