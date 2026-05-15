// ── Market tabs ───────────────────────────────────────────────────────────────

// Only three tabs exist on this page — Hot, Gainers, Losers.
// A fourth tab appearing would be a new feature that needs test coverage.
export const MARKET_TABS = ['Hot', 'Gainers', 'Losers'] as const;
export type MarketTab = (typeof MARKET_TABS)[number];

// ── Promotional banners ───────────────────────────────────────────────────────

// Testing structural presence — not asserting exact copy since marketing can update these.
export const PROMO_BANNERS = [
  'Earn interest on your assets',
  'Get crypto with your card',
  'Deposits using card or wire transfer',
] as const;

// ── Market sentiment ──────────────────────────────────────────────────────────

// The Fear & Greed widget shows a live value — any of these labels is a valid state.
// We assert that one of them is visible, not which one.
export const MARKET_SENTIMENT_LABELS = [
  'Extreme Fear',
  'Fear',
  'Neutral',
  'Greed',
  'Extreme Greed',
] as const;

// ── App download CTA ──────────────────────────────────────────────────────────

export const DOWNLOAD_APP_CTA_TEXT = 'Download the app';

// Partial URL patterns — the smart link is device-aware and can route to either store
export const APP_STORE_URL_PATTERNS = {
  ios:     /apps\.apple\.com/,
  android: /play\.google\.com/,
} as const;
