import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class Footer extends BasePage {
  readonly footer: Locator;
  readonly regulatoryText: Locator;

  constructor(page: Page) {
    super(page);

    this.footer = page.getByRole('contentinfo');

    // MBIO FZE is the registered entity; VARA is the UAE virtual asset regulatory body
    this.regulatoryText = this.footer.getByText(/MBIO FZE|VARA|Virtual Asset/i);
  }

  // All anchor links within the footer
  get allLinks(): Locator {
    return this.footer.getByRole('link');
  }

  async isVisible(): Promise<boolean> {
    return this.footer.isVisible();
  }

  // Collects all footer link hrefs — used in broken link detection
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
