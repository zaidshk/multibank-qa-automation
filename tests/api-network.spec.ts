import { test, expect } from '../fixtures/pages.fixture';

// ── BONUS-01 ──────────────────────────────────────────────────────────────────

test.describe('BONUS-01 — Network and API behaviour on the explore page', () => {

  test('no first-party requests fail when the explore page loads', async ({ page }) => {
    const failedRequests: string[] = [];

    // Collect failures for mb.io and multibankgroup.com only — third-party analytics
    // and tracking scripts fail in automated environments and are out of scope.
    // Hostname check avoids false positives from analytics requests that carry mb.io
    // as a query parameter (e.g. dl=https://mb.io/... in Google Analytics calls).
    page.on('requestfailed', (request) => {
      const url = request.url();
      let hostname: string;
      try { hostname = new URL(url).hostname; } catch { return; }
      const isFirstParty =
        hostname === 'mb.io' ||
        hostname.endsWith('.mb.io') ||
        hostname === 'multibankgroup.com' ||
        hostname.endsWith('.multibankgroup.com');
      if (!isFirstParty) return;
      failedRequests.push(
        `${request.method()} ${url} — ${request.failure()?.errorText ?? 'unknown error'}`,
      );
    });

    await page.goto('/en/explore');
    // networkidle can stall in Firefox due to polling requests — cap the wait so the
    // test doesn't time out; we're asserting on what failed, not what's still pending
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    expect(
      failedRequests,
      `No first-party requests should fail. Failed:\n${failedRequests.join('\n')}`,
    ).toHaveLength(0);
  });

  test('explore page makes at least one fetch/XHR call on load', async ({ page }) => {
    const fetchCalls: string[] = [];

    page.on('request', (request) => {
      const type = request.resourceType();
      if (type === 'fetch' || type === 'xhr') {
        fetchCalls.push(request.url());
      }
    });

    await page.goto('/en/explore');
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

    // A count of zero would mean the market data is fully static — that would be
    // a significant architectural change worth flagging
    expect(
      fetchCalls.length,
      'Explore page should make at least one fetch/XHR call — market data is dynamic',
    ).toBeGreaterThan(0);
  });

  test('explore page renders the asset table when all API requests are intercepted and passed through', async ({ page, explorePage }) => {
    const interceptedUrls: string[] = [];

    // Intercept every request and immediately continue it unchanged.
    // This validates that our interception layer doesn't corrupt the request pipeline
    // and establishes a baseline for future tests that need to stub specific endpoints.
    await page.route('**/*', async (route) => {
      const type = route.request().resourceType();
      if (type === 'fetch' || type === 'xhr') {
        interceptedUrls.push(route.request().url());
      }
      await route.continue();
    });

    await explorePage.goto();
    await explorePage.waitForTableLoad();

    await expect(
      explorePage.assetTable,
      'Asset table must remain visible after route passthrough — confirms interception does not break rendering',
    ).toBeVisible();

    expect(
      interceptedUrls.length,
      'At least one fetch/XHR call should have been intercepted during page load',
    ).toBeGreaterThan(0);
  });

  test('explore page handles a failed market data request without a JS crash', async ({ page, explorePage }) => {
    // Simulate a backend outage by blocking all XHR/fetch calls.
    // The page should degrade gracefully — no uncaught JS errors, no white screen.
    const jsErrors: string[] = [];
    page.on('pageerror', (err) => jsErrors.push(err.message));

    await page.route('**/*', async (route) => {
      const type = route.request().resourceType();
      if (type === 'fetch' || type === 'xhr') {
        await route.abort('failed');
        return;
      }
      await route.continue();
    });

    // waitUntil: 'domcontentloaded' — the page skeleton must load even if data calls fail
    await page.goto('/en/explore', { waitUntil: 'domcontentloaded' });

    expect(
      jsErrors,
      `The page should not throw uncaught JS errors when network requests fail.\nErrors:\n${jsErrors.join('\n')}`,
    ).toHaveLength(0);
  });

});
