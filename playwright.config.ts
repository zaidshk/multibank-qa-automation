import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { resolveEnvConfig } from './config/environments';
import { buildBrowserStackProjects } from './config/browserstack';

const envConfig = resolveEnvConfig();
const useBrowserStack = process.env['USE_BROWSERSTACK'] === 'true';
const isCI = Boolean(process.env['CI']);

const standardProjects = [
  // ── Desktop browsers ──────────────────────────────────────────────────────
  {
    name: 'chromium',
    testIgnore: ['**/visual/**'],
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    testIgnore: ['**/visual/**'],
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    testIgnore: ['**/visual/**'],
    use: { ...devices['Desktop Safari'] },
  },

  // ── Mobile viewports ──────────────────────────────────────────────────────
  // Scoped to edge-cases.spec.ts only — these projects run the viewport regression
  // test natively at device size. Desktop specs are excluded because they assume
  // desktop layout (full nav, wide tables) and would produce meaningless failures on mobile.
  {
    name: 'mobile-chrome',
    testMatch: ['**/tests/edge-cases.spec.ts'],
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'mobile-safari',
    testMatch: ['**/tests/edge-cases.spec.ts'],
    use: { ...devices['iPhone 13'] },
  },

  // ── Visual regression (opt-in, local only) ───────────────────────────────
  // Excluded from CI — snapshots are generated on macOS and pixel rendering
  // differs on Linux, causing false failures. Run locally with: npm run test:visual
  ...(!isCI ? [{
    name: 'visual',
    testMatch: ['**/tests/visual/**/*.spec.ts'],
    use: { ...devices['Desktop Chrome'] },
  }] : []),
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 4 : undefined,

  // In CI the blob reporter feeds the merge-reports job that produces the final HTML.
  // Locally we emit HTML directly since there's no merge step.
  reporter: isCI
    ? [['blob'], ['list']]
    : [['html', { outputFolder: 'playwright-report', open: 'always' }], ['dot']],

  use: {
    baseURL: envConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: useBrowserStack ? buildBrowserStackProjects() : standardProjects,
});
