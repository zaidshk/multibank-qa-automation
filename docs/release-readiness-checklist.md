# Release Readiness Checklist — mb.io

**Scope:** Public pages (no auth)  
**Last updated:** 2026-05-17

Sign off each item before releasing. P1 failures block the release. P2 failures need a documented decision.

---

## Functional

| # | Check | Priority | Status |
|---|---|---|---|
| 1 | All P1 tests pass on Chromium, Firefox, and WebKit | P1 | |
| 2 | Navigation: all eight items visible, all five internal links resolve correctly | P1 | |
| 3 | Explore page: Hot / Gainers / Losers tabs load with asset rows | P1 | |
| 4 | All three promotional banners visible with correct copy | P1 | |
| 5 | App download CTA routes to Apple App Store or Google Play | P1 | |
| 6 | Company page: heading, five section headings, key stats, strength pillars all visible | P1 | |
| 7 | Locale routing: `/ar/explore` → `/ar-AE/explore`, `/ru/explore` → `/ru-AE/explore` | P2 | |
| 8 | Unknown routes return a 404 page — not a blank screen or silent 200 | P2 | |
| 9 | All five primary nav links return HTTP 200; $MBG external link resolves with HTTP 200 | P2 | |
| 10 | No first-party network requests fail on the explore page | P2 | |

---

## Cross-Browser

| Browser | Pass |
|---|---|
| Chromium (Desktop Chrome) | |
| Firefox | |
| WebKit (Desktop Safari) | |
| Mobile Chrome (Pixel 5) | EDGE-05 only |
| Mobile Safari (iPhone 13) | EDGE-05 only |

---

## Layout

| Viewport | Check | Status |
|---|---|---|
| 375 × 812 | No horizontal overflow, hero and CTA visible, hamburger button opens mobile menu with all five nav links visible and tappable, explore table visible | |
| 1280 × 800 | Full nav visible, no overflow | |
| 1920 × 1080 | Full nav visible, no overflow | |

---

## Known Issues

| Issue | Severity | Status |
|---|---|---|
| EDGE-02: Gainers and Losers tabs show overlapping assets in bull-market conditions | Medium | Skipped — behaviour may be by design (relative ranking). Confirm with product owner before marking as defect or closing. |
| Language switcher: `<button>` has no `aria-label`, no `aria-haspopup`, and `outline-none` removes focus ring (WCAG 2.4.7) | High | Open — screen reader users cannot identify or operate the control. Fix before releasing to accessible markets. |

---

## Sign-off

| Role | Name | Date |
|---|---|---|
| QA | | |
| Engineering | | |
| Product | | |
