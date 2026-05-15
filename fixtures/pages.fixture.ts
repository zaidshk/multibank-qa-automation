import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NavigationBar } from '../pages/NavigationBar';
import { ExplorePage } from '../pages/ExplorePage';
import { CompanyPage } from '../pages/CompanyPage';
import { Footer } from '../pages/Footer';
import { PricePage } from '../pages/PricePage';

type PageFixtures = {
  homePage: HomePage;
  navigationBar: NavigationBar;
  explorePage: ExplorePage;
  companyPage: CompanyPage;
  footer: Footer;
  pricePage: PricePage;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  navigationBar: async ({ page }, use) => {
    await use(new NavigationBar(page));
  },
  explorePage: async ({ page }, use) => {
    await use(new ExplorePage(page));
  },
  companyPage: async ({ page }, use) => {
    await use(new CompanyPage(page));
  },
  footer: async ({ page }, use) => {
    await use(new Footer(page));
  },
  pricePage: async ({ page }, use) => {
    await use(new PricePage(page));
  },
});

export { expect } from '@playwright/test';
