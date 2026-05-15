# Test Plan — mb.io Public Platform

**Framework:** Playwright + TypeScript · Page Object Model  
**Target:** https://mb.io (public surface only — no auth, no trading execution)  
**Updated:** 2026-05-15

---

## Scope

**In scope:** All pages reachable without logging in — home, explore, company, features, OTC desk, support, and individual asset price pages.  
**Out of scope:** Login, registration, wallet, order placement, portfolio, account settings.


---

## Page Objects

| Class | File | Used In |
|---|---|---|
| `NavigationBar` | `pages/NavigationBar.ts` | NAV-01, NAV-02, NAV-03, EDGE-04 |
| `HomePage` | `pages/HomePage.ts` | NAV-03, EDGE-05 |
| `ExplorePage` | `pages/ExplorePage.ts` | TRADE-01–03, CONTENT-01–02, EDGE-02, EDGE-05, BONUS-01 |
| `CompanyPage` | `pages/CompanyPage.ts` | CONTENT-03 |
| `Footer` | `pages/Footer.ts` | NAV-03 |
| `PricePage` | `pages/PricePage.ts` | BONUS-03 |

---

## Test Scenarios

### 1. Navigation & Layout

**NAV-01 — All eight nav items render on desktop**  
Asserts each nav item is visible: Explore, Features, OTC Desk, Company, Support, $MBG, Sign in, Sign up. Sign in/Sign up sit outside the `<nav>` landmark and are scoped to the banner element.

**NAV-02 — Each nav link goes to the right place**  
Clicks the five internal links and checks the resulting URL. $MBG is href-only (external domain). Sign in/Sign up hrefs are asserted against `/login` and `/register`.

**NAV-03 — Nav and footer stable at 1280px and 1920px**  
Checks that all nav items remain visible (not collapsed) and the page has no horizontal overflow at both common desktop widths.

---

### 2. Trading Functionality

**TRADE-01 — Spot market section renders correctly**  
Checks the main heading, three market tabs (Hot / Gainers / Losers), the Fear & Greed sentiment widget, and the Download CTA are all visible on the explore page.

**TRADE-02 — Tab grouping works correctly**  
Hot tab shows populated rows. Gainers tab shows positive numeric change values. Losers tab shows well-formed percentage values (direction is colour-coded, not sign-prefixed). Gainers and Losers return different lists.

**TRADE-03 — Asset rows contain the required data fields**  
First row on the Hot tab has at least 3 cells and a visible USD price element.

---

### 3. Content & Links

**CONTENT-01 — Promotional banners render on the explore page**  
All three banners visible: "Earn interest on your assets", "Get crypto with your card", "Deposits using card or wire transfer". Sub-labels ("Up to 25% APY", "Instant buy", "Top up today") also checked.

**CONTENT-02 — App download CTA links to the correct store**  
CTA is visible with a valid href. Following the smart link resolves to Apple App Store or Google Play (device-aware redirect — both are valid outcomes).

**CONTENT-03 — Company page headings, stats, and pillars**  
Main heading, five section headings, five key stats ($2T turnover, 2M+ customers, 25+ offices, founded 2005, $35B daily volume), and three trust pillars verified visible.

---

### 4. Edge Cases

**EDGE-01 — Locale URLs route correctly**  
`/ar/explore` redirects to `/ar-AE/explore`. `/ru/explore` redirects to `/ru-AE/explore`. Both render a visible h1.

**EDGE-02 — No asset in both Gainers and Losers simultaneously** *(intentionally failing)*  
Collects symbols from both tabs and asserts no overlap. Currently fails because the backend ranks the smallest gainers as "Losers" in a bull market — tracked as an open data integrity defect.

**EDGE-03 — Invalid route returns a 404 page**  
`/en/this-page-does-not-exist-abc123` should return HTTP 404 and render a "Page not found" heading.

**EDGE-04 — Primary nav links return HTTP 200**  
The five internal nav links are each requested via `page.request.get()` and asserted to return 200. $MBG is href-only (token site blocks automated requests with 403).

**EDGE-05 — Mobile breakpoint (375px) regression**  
Runs on desktop browsers at forced 375px width, and natively on the `mobile-chrome` and `mobile-safari` projects. Checks: no horizontal overflow, hero heading and Download CTA visible, nav landmark in DOM, explore table visible.

---

### 5. Bonus

**BONUS-01 — Network and API behaviour**  
Four tests: no first-party requests fail on load; at least one fetch/XHR call is made; route interception passthrough doesn't break the page; failing all network calls doesn't produce uncaught JS errors.

**BONUS-02 — Visual regression snapshots** *(opt-in, `npm run test:visual`)*  
Captures the promotional banner strip, tab bar, and heading region. Live price cells are masked. Run `--update-snapshots` to set the baseline.

**BONUS-03 — Parameterized asset price pages**  
Six assets tested via `for...of` loop (BTC, ETH, SOL, XRP, DOGE, MBG). Each checks the coin name is visible and the price heading matches a numeric format.

---

## Priority Summary

| Priority | Scenarios |
|---|---|
| P1 — must pass | NAV-01, NAV-02, NAV-03, TRADE-01, TRADE-02, TRADE-03, CONTENT-01, CONTENT-02, CONTENT-03 |
| P2 — required | EDGE-01, EDGE-02*, EDGE-03, EDGE-04, EDGE-05, BONUS-01, BONUS-03 |
| P3 — opt-in | BONUS-02 |

*EDGE-02 is expected to fail and tracks an open backend defect.

---

## Test Classification

Tests carry a `@smoke`, `@sanity`, or no tag (regression default). Run the relevant subset depending on the context.

| Tag | When to run | Scenarios |
|---|---|---|
| `@smoke` | Post-deploy gate, CI quick check | NAV-01, TRADE-01, EDGE-03 |
| `@sanity` | After every merge, pre-release sign-off | All `@smoke` + NAV-02, NAV-03, TRADE-02, TRADE-03, CONTENT-01, CONTENT-02, CONTENT-03, EDGE-01, EDGE-04, EDGE-05 (tests 1–3) |
| *(none — regression)* | Full suite, scheduled runs, release candidates | Everything above + EDGE-02, EDGE-05 (test 4), BONUS-01, BONUS-03, BONUS-02 |

```bash
npm run test:smoke    # @smoke only
npm run test:sanity   # @sanity only
npm test              # full regression (default)
```
