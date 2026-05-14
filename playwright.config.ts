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
  // Validates responsive layout and touch-friendly navigation on trade.mb.io.
  {
    name: 'mobile-chrome',
    testIgnore: ['**/visual/**'],
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'mobile-safari',
    testIgnore: ['**/visual/**'],
    use: { ...devices['iPhone 13'] },
  },

  // ── Visual regression (opt-in, never included in the default run) ─────────
  {
    name: 'visual',
    testMatch: ['**/tests/visual/**/*.spec.ts'],
    use: { ...devices['Desktop Chrome'] },
  },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 4 : undefined,

  // HTML report is always emitted to playwright-report/ regardless of environment.
  // list reporter streams test names in CI; dot is compact for local runs.
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    isCI ? ['list'] : ['dot'],
  ],

  use: {
    baseURL: envConfig.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: useBrowserStack ? buildBrowserStackProjects() : standardProjects,
});
