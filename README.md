# MB QA Automation

Playwright TypeScript automation framework for [mb.io](https://mb.io/) — the MultiBank public trading platform.

Covers: navigation, spot market functionality, content and links, negative/edge cases, API/network behaviour, visual regression, and parameterized asset pages. All tests run against the public surface only (no auth, no trading execution).

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 20 |
| npm | >= 10 |
| Playwright | ^1.52.0 (installed via `npm ci`) |

---

## Setup

```bash
# 1. Install dependencies
npm ci

# 2. Install Playwright browser binaries
npx playwright install --with-deps

# 3. Copy the environment template
cp .env.example .env
# Edit .env — set ENV and any optional variables you need locally
```

---

## Running Tests

### Full suite (all standard browsers, default: qa environment)
```bash
npm test
```

### Target a specific environment
```bash
ENV=prod npm test
ENV=preprod npm test
```

### Single browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Headed mode
```bash
npm run test:headed
```

### Debug mode (Playwright Inspector)
```bash
npm run test:debug
```

### Smoke tests (fast go/no-go — 3 tests)
```bash
npm run test:smoke
```

### Sanity suite (core coverage — ~25 tests)
```bash
npm run test:sanity
```

### Visual regression tests (opt-in, local only)
```bash
npm run test:visual
```

Visual tests run locally only — they are excluded from CI because the baseline snapshots are committed from macOS and Linux renders fonts differently, producing false pixel diffs. If CI visual regression is needed later, Playwright's `snapshotPathTemplate` supports per-platform baseline folders with no test code changes required.

### Update visual snapshots
```bash
npx playwright test --project=visual --update-snapshots
```

### Filter by keyword
```bash
npx playwright test --grep "TRADE-02"
```

### Run a specific file
```bash
npx playwright test tests/trading.spec.ts
```

---

## Test Coverage

| File | Scenarios | Tests |
|---|---|---|
| `tests/navigation.spec.ts` | NAV-01, NAV-02, NAV-03 | 10 |
| `tests/trading.spec.ts` | TRADE-01, TRADE-02, TRADE-03 | 9 |
| `tests/content-links.spec.ts` | CONTENT-01, CONTENT-02, CONTENT-03 | 8 |
| `tests/edge-cases.spec.ts` | EDGE-01–05 | 16 |
| `tests/api-network.spec.ts` | BONUS-01 | 4 |
| `tests/parameterized-assets.spec.ts` | BONUS-03 | 6 |
| `tests/visual/explore.spec.ts` | BONUS-02 (opt-in) | 3 |

**Note:** EDGE-02 is skipped pending product clarification. In broadly positive market conditions, the same assets appear in both the Gainers and Losers tabs — this may be by design if "Losers" ranks relative underperformers rather than strictly negative movers. The assertion is written and ready; remove `test.skip` once the intended classification is confirmed by the product owner.

---

## Test Classification

Tests are tagged `@smoke`, `@sanity`, or left untagged (regression). Use these to select the right depth for each run.

| Tag | Purpose | Count | Command |
|---|---|---|---|
| `@smoke` | Fastest go/no-go — confirms the site is up and basic rendering works | 3 | `npm run test:smoke` |
| `@sanity` | Core functional coverage — runs after every deploy to catch regressions | ~25 | `npm run test:sanity` |
| *(none)* | Full regression suite — all tests including edge cases and exploratory scenarios | 53+ | `npm test` |

### Tag assignments

| Tag | Tests |
|---|---|
| `@smoke` | NAV-01 (nav renders), TRADE-01 (explore page renders), EDGE-03 (404 handling) |
| `@sanity` | All `@smoke` tests, plus: NAV-02 (all nav links), NAV-03 (desktop viewports), TRADE-02 (tab grouping), TRADE-03 (asset row data), CONTENT-01–03 (banners, app CTA, company page), EDGE-01 (locale routing), EDGE-04 (HTTP 200s), EDGE-05 tests 1–3 (mobile layout) |
| *(regression)* | EDGE-02 (known failing — Gainers/Losers overlap), EDGE-05 test 4 (explore table at 375px), BONUS-01 (network behaviour), BONUS-03 (parameterized assets), BONUS-02 (visual snapshots, opt-in) |

---

## Viewing Reports

The HTML report opens automatically in your browser at the end of every local test run — no extra command needed. This is intentional to make results immediately visible without any additional steps.

If you need to reopen the last report manually:

```bash
npm run report
```

Reports are written to `playwright-report/`. On CI, the merged report is uploaded as a GitHub Actions artifact and retained for 14 days.

---

## BrowserStack

Set `USE_BROWSERSTACK=true` and supply credentials to route the run through BrowserStack Automate. No test code changes are required.

```bash
USE_BROWSERSTACK=true \
BROWSERSTACK_USERNAME=your_user \
BROWSERSTACK_ACCESS_KEY=your_key \
npm test
```

The browser/OS matrix is defined in [`config/browserstack.ts`](config/browserstack.ts).  
For CI-scheduled cross-browser runs, use the [`browserstack.yml`](.github/workflows/browserstack.yml) workflow.

---

## CI Pipeline

**Primary workflow:** [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

- Triggers on push to `main`, pull requests, and manual dispatch with environment selection
- Tests sharded across 2 parallel jobs
- HTML report merged and uploaded as an artifact after all shards complete
- Failure notification sent via SMTP to `REPORT_EMAIL_TO`

**BrowserStack workflow:** [`.github/workflows/browserstack.yml`](.github/workflows/browserstack.yml)

- Triggers on manual dispatch or weekly on Monday at 06:00 UTC

### Required CI Secrets

| Secret | Purpose |
|---|---|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (default: 587) |
| `SMTP_SECURE` | TLS: `true` or `false` |
| `SMTP_USER` | SMTP sender address |
| `SMTP_PASSWORD` | SMTP password |
| `REPORT_EMAIL_TO` | Comma-separated failure report recipients |
| `BROWSERSTACK_USERNAME` | BrowserStack username |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack access key |

---

## Directory Structure

```
mb-qa-automation/
├── .github/workflows/
│   ├── playwright.yml             # Main CI workflow
│   └── browserstack.yml           # Cross-browser workflow
├── config/
│   ├── environments.ts            # Base URL per environment
│   └── browserstack.ts            # BrowserStack capability matrix
├── docs/
│   └── test-plan.md               # Test coverage map and scenario descriptions
├── fixtures/
│   └── pages.fixture.ts           # Extends Playwright test with page object instances
├── helpers/
│   └── env.ts                     # requireEnv / optionalEnv utilities
├── pages/
│   ├── base/BasePage.ts           # Abstract base: page accessor, goto()
│   ├── CompanyPage.ts
│   ├── ExplorePage.ts
│   ├── Footer.ts
│   ├── HomePage.ts
│   ├── NavigationBar.ts
│   └── PricePage.ts
├── scripts/
│   └── send-report.ts             # SMTP report mailer (invoked on CI failure)
├── testdata/
│   ├── assets.ts                  # Crypto symbols and price format patterns
│   ├── company.ts                 # Company page headings, stats, pillars
│   ├── explore.ts                 # Market tabs, banners, sentiment labels
│   ├── footer.ts                  # Regulatory text patterns, allowed domains
│   ├── navigation.ts              # Nav items with expected hrefs
│   ├── routes.ts                  # Valid, invalid, and locale route fixtures
│   └── viewports.ts               # Viewport sizes
├── tests/
│   ├── navigation.spec.ts
│   ├── trading.spec.ts
│   ├── content-links.spec.ts
│   ├── edge-cases.spec.ts
│   ├── api-network.spec.ts
│   ├── parameterized-assets.spec.ts
│   └── visual/explore.spec.ts     # Opt-in visual regression
├── .env.example
├── playwright.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── package.json
```

---

## Adding a New Page Object

1. Create `pages/YourPage.ts` extending `BasePage`.
2. Define all locators as `readonly` properties in the constructor.
3. Add an instance to `fixtures/pages.fixture.ts`.
4. Import `{ test, expect }` from `fixtures/pages.fixture.ts` in your spec.

---

## Framework Decisions and Assumptions

**Why Playwright?**
Playwright runs tests on Chromium, Firefox, and WebKit from a single setup. That matters here because Safari is a real browser for trading platform users and most tools do not support it properly. It also handles network interception out of the box, which I needed for the API and network tests. Cypress does not support WebKit and Selenium needs a lot more setup for the same outcome.

**Why Page Object Model?**
When a selector changes on the site, I fix it in one place and every test that uses it is sorted. Without POM, one UI change can break tests across multiple files and tracking them all down takes time. For anything meant to grow and be maintained, POM is the obvious choice.

**Why getByRole for locators?**
Role-based locators work against what an element actually is, not what it looks like in the DOM. They also catch accessibility problems as a side effect. If a role locator cannot find something, there is a good chance that element has an accessibility issue too.

**Scope: public pages only**
Every test runs against pages you can reach without logging in. Authenticated flows like trading, portfolio, and wallet are out of scope. No real credentials, no real orders, no personal data is used anywhere in the suite.

**Live market data**
Prices change every second so tests check structure and format rather than exact values. The Gainers tab test checks that each row shows a valid percentage, not that a specific coin moved by a specific amount. This keeps the suite stable regardless of what the market is doing.

**EDGE-02 skipped**
During exploratory testing I noticed the same assets showing up in both Gainers and Losers at the same time. This might be intentional, where Losers shows the smallest gainers rather than strictly negative movers. The test is written and ready, it is just skipped until the product team confirms what the expected behaviour actually is.

**Mobile projects in the config**
The config includes mobile-chrome and mobile-safari to show the framework supports responsive testing. No separate mobile specs are written because the scope is the desktop web surface. The mobile projects run the edge-cases file at device dimensions to cover viewport regression.

**Visual tests run locally only**
Visual snapshot tests are not in CI because the baseline images are created on macOS and Linux renders fonts slightly differently, which causes false failures. They work fine locally. If visual regression in CI is needed later, Playwright supports per-platform snapshot folders through a single config option with no test code changes required.

**HTML report included for reviewers**
The Playwright HTML report is committed to this repo so anyone who clones it can open the latest test results straight away without running anything. Use `npm run report` to open it. Running the tests locally will overwrite it with a fresh report.

