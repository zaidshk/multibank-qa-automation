import { defineConfig } from '@playwright/test';

type PlaywrightProject = NonNullable<Parameters<typeof defineConfig>[0]['projects']>[number];

interface BrowserStackCapabilities {
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
}

function buildWsEndpoint(caps: BrowserStackCapabilities): string {
  const username = process.env['BROWSERSTACK_USERNAME'];
  const accessKey = process.env['BROWSERSTACK_ACCESS_KEY'];

  if (!username || !accessKey) {
    throw new Error(
      'BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set to run on BrowserStack.',
    );
  }

  const capabilities = {
    ...caps,
    project: process.env['BS_PROJECT_NAME'] ?? 'MB QA Automation',
    build: process.env['BS_BUILD_NAME'] ?? `Build ${new Date().toISOString().slice(0, 10)}`,
    'browserstack.debug': true,
    'browserstack.networkLogs': true,
  };

  const capsEncoded = encodeURIComponent(JSON.stringify(capabilities));
  return `wss://cdp.browserstack.com/playwright?caps=${capsEncoded}&browserstack.user=${username}&browserstack.key=${accessKey}`;
}

const matrix: Array<{ name: string; caps: BrowserStackCapabilities }> = [
  {
    name: 'BS | Chrome | Windows 11',
    caps: { browser: 'chrome', browser_version: 'latest', os: 'Windows', os_version: '11' },
  },
  {
    name: 'BS | Safari | macOS Sonoma',
    caps: { browser: 'safari', browser_version: 'latest', os: 'OS X', os_version: 'Sonoma' },
  },
  {
    name: 'BS | Chrome | Android 13',
    caps: { browser: 'chrome', browser_version: 'latest', os: 'android', os_version: '13.0' },
  },
];

export function buildBrowserStackProjects(): PlaywrightProject[] {
  return matrix.map(({ name, caps }) => ({
    name,
    use: {
      connectOptions: { wsEndpoint: buildWsEndpoint(caps) },
    },
  }));
}
