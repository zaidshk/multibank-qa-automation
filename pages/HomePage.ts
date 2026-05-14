import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class HomePage extends BasePage {
  // Hero section
  readonly heroSection: Locator;
  readonly heroPrimaryHeading: Locator;
  readonly heroCtaButton: Locator;

  // App store links
  readonly appStoreLink: Locator;
  readonly googlePlayLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heroSection = page.getByRole('banner');
    this.heroPrimaryHeading = page.getByRole('heading', { level: 1 });
    // NOTE: Recommend data-testid="banner-hero-cta" once dev team adopts testid strategy
    this.heroCtaButton = page.getByRole('link', { name: /start trading|get started|open account/i });

    // NOTE: Recommend data-testid="link-app-store-ios" / "link-app-store-android"
    this.appStoreLink = page.getByRole('link', { name: /app store/i });
    this.googlePlayLink = page.getByRole('link', { name: /google play/i });
  }

  async goto(): Promise<void> {
    await super.goto('/');
  }
}
