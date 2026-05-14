# MB QA Automation

Playwright TypeScript automation framework for [trade.mb.io](https://trade.mb.io/).

Covers public-facing trading platform pages: navigation, hero sections, trading pairs, market data,
app store flows, and visual regression. All tests operate against the public surface only.

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

# 3. Copy the environment template and configure locals
cp .env.example .env
# Edit .env — set ENV and any optional variables you need locally
```

---

## Running Tests

### All tests (default: qa environment, all standard browsers)
```bash
npm test
```

### Target a specific environment
```bash
ENV=prod npm test
ENV=preprod npm test
```

### Target a single browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Headed mode (watch the browser)
```bash
npm run test:headed
```

### Debug mode (Playwright Inspector)
```bash
npm run test:debug
```

### Visual regression tests only
```bash
npm run test:visual
```

### Update visual snapshots
```bash
npx playwright test --project=visual --update-snapshots
```

### Filter by test title
```bash
npx playwright test --grep "navigation"
```

### Run a specific file
```bash
npx playwright test tests/home.spec.ts
```

---

## Viewing Reports

```bash
# Open the last HTML report
npm run report
```

Reports are written to `playwright-report/`. On CI, the merged report is uploaded as a GitHub Actions
artifact and retained for 14 days.

---

## BrowserStack

Set `USE_BROWSERSTACK=true` and supply credentials to route the entire test run through BrowserStack Automate.
No test code changes are required.

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

Triggers:
- Push to `main`
- Pull requests targeting `main`
- Manual dispatch with environment selection (`dev / qa / preprod / prod`)

Tests are sharded across 2 parallel jobs. After all shards complete, blob reports are merged into a
single HTML report and uploaded as an artifact. If any shard fails, an email is sent to `REPORT_EMAIL_TO`.

**BrowserStack workflow:** [`.github/workflows/browserstack.yml`](.github/workflows/browserstack.yml)

Triggers on manual dispatch or every Monday at 06:00 UTC.

### Required CI Secrets

| Secret | Purpose |
|---|---|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (default: 587) |
| `SMTP_SECURE` | Use TLS: `true` or `false` |
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
│   ├── playwright.yml        # Main CI workflow (sharded, env-selectable)
│   └── browserstack.yml      # Cross-browser CI workflow
├── config/
│   ├── environments.ts       # Base URL and env config per environment
│   └── browserstack.ts       # BrowserStack capability matrix and project builder
├── fixtures/
│   └── pages.fixture.ts      # Extends Playwright test with page object instances
├── helpers/
│   └── env.ts                # requireEnv / optionalEnv utilities
├── pages/
│   ├── base/
│   │   └── BasePage.ts       # Abstract base: page accessor, goto()
│   ├── HomePage.ts
│   ├── NavigationBar.ts
│   └── TradingPairsSection.ts
├── scripts/
│   └── send-report.ts        # Standalone SMTP report mailer (invoked on CI failure)
├── tests/
│   ├── visual/               # Visual regression specs (opt-in, isolated project)
│   └── *.spec.ts             # Standard functional specs
├── .env.example              # Environment variable documentation
├── playwright.config.ts      # Central Playwright configuration
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── package.json
```

---

## Code Quality

```bash
# Type check (no emit)
npm run type-check

# Lint
npm run lint

# Lint with auto-fix
npm run lint:fix

# Format
npm run format

# Check formatting (CI-safe)
npm run format:check
```

---

## Adding a New Page Object

1. Create `pages/YourPage.ts` extending `BasePage`.
2. Define all locators as `readonly` properties in the constructor.
3. Add an instance to `fixtures/pages.fixture.ts`.
4. Use `{ test, expect }` from `fixtures/pages.fixture.ts` in your spec — your fixture is automatically available.
