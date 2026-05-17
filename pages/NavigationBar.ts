import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class NavigationBar extends BasePage {
  // Scoped to the header banner role — avoids false matches on footer nav links
  readonly nav: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = page.getByRole('banner').getByRole('navigation')
      .or(page.getByRole('navigation').first());
  }

  // ── Mobile hamburger & overlay ───────────────────────────────────────────────

  // Visible only at mobile widths (≤ ~768px). Uses aria-label="Open menu" which is
  // stable and accessible — unlike the language switcher which has no aria-label (R-02).
  get hamburgerButton(): Locator {
    return this.page.getByRole('button', { name: /open menu/i });
  }

  // The mobile menu renders in a Radix UI dialog portal — a separate <nav> element
  // outside the header's <nav>, so existing nav-scoped link locators return 0 matches.
  // Scope mobile assertions to this locator after calling openMobileMenu().
  get mobileMenu(): Locator {
    return this.page.getByRole('dialog').getByRole('navigation');
  }

  // ── Nav item locators (scoped to nav to avoid footer link conflicts) ────────

  get logoLink(): Locator {
    return this.nav.getByRole('link', { name: /mb\.io|multibank/i }).first();
  }

  get exploreLink(): Locator {
    return this.nav.getByRole('link', { name: /^explore$/i });
  }

  get featuresLink(): Locator {
    return this.nav.getByRole('link', { name: /^features$/i });
  }

  get otcDeskLink(): Locator {
    return this.nav.getByRole('link', { name: /^otc desk$/i });
  }

  get companyLink(): Locator {
    return this.nav.getByRole('link', { name: /^company$/i });
  }

  get supportLink(): Locator {
    return this.nav.getByRole('link', { name: /^support$/i });
  }

  // $MBG links out to token.multibankgroup.com — tested by href check only (site blocks automated requests)
  get mbgLink(): Locator {
    return this.nav.getByRole('link', { name: /\$mbg/i });
  }

  // Sign in and Sign up sit outside the <nav> landmark — scoped to the banner to avoid
  // accidentally matching footer links with the same labels.
  get signInLink(): Locator {
    return this.page
      .getByRole('banner')
      .getByRole('link', { name: /sign in/i })
      .or(this.page.getByRole('banner').getByRole('button', { name: /sign in/i }));
  }

  get signUpLink(): Locator {
    // Sign up is a button (yellow pill), not a link — .or() covers both just in case
    return this.page
      .getByRole('banner')
      .getByRole('button', { name: /sign up/i })
      .or(this.page.getByRole('banner').getByRole('link', { name: /sign up/i }));
  }

  // Returns all anchor links inside the nav — used in broken link detection (EDGE-04)
  get allLinks(): Locator {
    return this.nav.getByRole('link');
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async isVisible(): Promise<boolean> {
    return this.nav.isVisible();
  }

  async openMobileMenu(): Promise<void> {
    await this.hamburgerButton.click();
    await this.mobileMenu.waitFor({ state: 'visible' });
  }

  async clickExplore(): Promise<void> {
    await this.exploreLink.click();
  }

  async clickFeatures(): Promise<void> {
    await this.featuresLink.click();
  }

  async clickOtcDesk(): Promise<void> {
    await this.otcDeskLink.click();
  }

  async clickCompany(): Promise<void> {
    await this.companyLink.click();
  }

  async clickSupport(): Promise<void> {
    await this.supportLink.click();
  }

  // Collects href values for all nav links — used in EDGE-04 broken link detection
  async getAllLinkHrefs(): Promise<string[]> {
    const links = this.allLinks;
    const count = await links.count();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }
}
