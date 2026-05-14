import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NavigationBar } from '../pages/NavigationBar';
import { TradingPairsSection } from '../pages/TradingPairsSection';

type PageFixtures = {
  homePage: HomePage;
  navigationBar: NavigationBar;
  tradingPairsSection: TradingPairsSection;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page));
  },
  tradingPairsSection: async ({ page }, use) => {
    await use(new TradingPairsSection(page));
  },
});

export { expect } from '@playwright/test';
