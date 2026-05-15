// The footer is present on all pages; these values are used in NAV-03 and EDGE-04

// ── Regulatory disclosure ─────────────────────────────────────────────────────

// Regulatory text is a legal requirement — if this disappears it's a compliance bug, not just a UI issue
export const REGULATORY_TEXT_PATTERNS = [
  /MBIO FZE/i,
  /VARA/i,
  /Virtual Asset/i,
] as const;

// ── Known footer link categories ──────────────────────────────────────────────

// These sections are expected to be present in the footer.
// Used for structural presence checks — not asserting every individual link.
export const FOOTER_SECTION_LABELS = [
  'Company',
  'Support',
  'Legal',
] as const;

// ── Link health check ─────────────────────────────────────────────────────────

// Domains that are allowed to appear in footer links.
// Used in EDGE-04 broken link detection to filter out known external domains
// before making HTTP HEAD requests — avoids false positives on third-party rate limiting.
export const ALLOWED_EXTERNAL_DOMAINS = [
  'mb.io',
  'trade.mb.io',
  'token.multibankgroup.com',
  'multibankgroup.com',
  'apps.apple.com',
  'play.google.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'instagram.com',
  'facebook.com',
  't.me',         // Telegram
] as const;

// Links that redirect to login or are intentionally protected — skip 401/403 in health checks
export const SKIP_AUTH_REQUIRED_PATHS = ['/login', '/register', '/dashboard'];
