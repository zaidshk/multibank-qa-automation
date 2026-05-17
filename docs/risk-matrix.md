# Risk Matrix — mb.io QA Automation

**Last updated:** 2026-05-17

---

| ID | Risk | Likelihood | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R-01 | **Gainers/Losers tab classification — behaviour unverified against spec** — in broadly positive market conditions, the same assets appear in both tabs. This may be by design: "Losers" could rank relative underperformers (smallest gainers) rather than strictly negative movers, which is a valid approach for a trading app. Alternatively it could indicate missing backend filtering. Cannot be determined without a product requirements document. | Medium | Medium | EDGE-02 skipped pending product clarification. If spec confirms mutual exclusivity, remove `test.skip` — the assertion is already written. If relative ranking is by design, the test should be rewritten to assert format only. | Needs clarification |
| R-02 | **Language switcher — accessibility defects affecting screen reader and keyboard users** — the globe/language toggle is a `<button>` that works correctly for mouse and sighted keyboard users, but has three WCAG AA violations: (1) no `aria-label` — screen readers announce it as "button" with no description, so blind users cannot identify its purpose (WCAG 4.1.2); (2) no `aria-haspopup` — screen readers don't signal that activating it opens a dropdown (WCAG 4.1.2); (3) `outline-none` CSS removes the visible focus indicator — sighted keyboard users cannot see which element is focused (WCAG 2.4.7 Focus Visible). Functional for mouse users only. | Medium | High | Locale tests use direct URL navigation as a workaround since the component has no accessible name to target via `getByRole`; defects raised for dev team | Open |
| R-03 | **Live market data flakiness** — price values and percentage changes update every few seconds | High | Medium | All assertions use format checks (e.g. `/\$[\d,]+/`) rather than exact values | Mitigated |
| R-04 | **Promotional banner copy changes** — marketing can update banner text at any time | Medium | Medium | Locators use partial regex patterns; minor copy tweaks won't break them, but full rewrites require locator updates | Partially mitigated |
| R-05 | **$MBG external link destination changes** — `token.multibankgroup.com` is an external domain outside the team's control; the URL could change or the site could go down | Low | Low | EDGE-04 validates the `href` attribute points to the correct domain AND that the URL resolves with HTTP 200 via `page.request.get()`; soft assertion so a temporary outage does not block CI | Mitigated |
| R-06 | **Smart link redirect changes** — the app download CTA routes through a device-aware smart link | Low | Medium | Test accepts either Apple App Store or Google Play as a valid final destination | Mitigated |
| R-07 | **Next.js framework upgrade** — changes to rendered HTML structure could break locators | Low | Medium | Locators use semantic roles and visible text rather than CSS class names | Mitigated |
| R-08 | **Suite depends on mb.io uptime** — tests run against live production | Medium | High | CI retries set to 1; a pre-flight check on `baseURL` can be added as a setup step | Accepted |
| R-09 | **Visual snapshot drift** — snapshots go stale after UI redesigns | Medium | Low | Visual tests are opt-in and excluded from the default run; refresh with `--update-snapshots` | Mitigated |

---

## Open Defects Requiring Release Decision

| Defect | Severity | Decision Needed |
|---|---|---|
| Language switcher — missing `aria-label`, missing `aria-haspopup`, `outline-none` removes focus ring (WCAG 2.4.7) (R-02) | P1 | Button works for mouse and keyboard users visually; screen reader users cannot identify or use it — fix before releasing to accessible markets (WCAG AA compliance) |
| Gainers/Losers tab classification (R-01) | Needs triage | Clarify with product: is "Losers" relative ranking or strictly negative movers? Answer determines whether EDGE-02 is a defect or an incorrect assertion. |
