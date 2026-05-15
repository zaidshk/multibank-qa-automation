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

### Visual regression tests (opt-in)
```bash
npm run test:visual
```

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

**Note:** EDGE-02 is an intentionally failing test. It exposes a known data integrity issue where the Gainers and Losers tabs show overlapping assets in bull-market conditions.

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

```bash
# Open the last HTML report
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
