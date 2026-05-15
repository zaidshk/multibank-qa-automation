import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class CompanyPage extends BasePage {
  // ── Primary heading ───────────────────────────────────────────────────────
  readonly mainHeading: Locator;

  // ── Section headings ──────────────────────────────────────────────────────
  readonly globalLeadershipSection: Locator;
  readonly innovationSection: Locator;
  readonly integritySection: Locator;
  readonly strengthSection: Locator;
  readonly communitySection: Locator;

  // ── Key stats ─────────────────────────────────────────────────────────────
  // Assert text presence only — exact figures are subject to change
  readonly annualTurnoverStat: Locator;
  readonly customerCountStat: Locator;
  readonly officesCountStat: Locator;
  readonly foundedYearStat: Locator;
  readonly dailyVolumesStat: Locator;

  // ── Strength pillars ──────────────────────────────────────────────────────
  readonly regulationAtCorePillar: Locator;
  readonly provenTrackRecordPillar: Locator;
  readonly secureTrustedPillar: Locator;

  constructor(page: Page) {
    super(page);

    this.mainHeading = page.getByRole('heading', { name: /why multibank group/i });

    this.globalLeadershipSection = page.getByRole('heading', {
      name: /tradition of global leadership/i,
    });
    this.innovationSection = page.getByRole('heading', { name: /innovation with purpose/i });
    this.integritySection = page.getByRole('heading', {
      name: /integrity built into every decision/i,
    });
    this.strengthSection = page.getByRole('heading', {
      name: /strength behind multibank group/i,
    });
    this.communitySection = page.getByRole('heading', { name: /community.*media/i });

    this.annualTurnoverStat = page.getByText(/\$2\s*trillion/i);
    this.customerCountStat = page.getByText(/2,000,000\+/);
    this.officesCountStat = page.getByText(/25\+\s*offices/i);
    this.foundedYearStat = page.getByText(/founded in 2005/i);
    this.dailyVolumesStat = page.getByText(/\$35b\s*daily/i);

    // "at our core" — the word "our" is part of the live copy and must be in the regex
    this.regulationAtCorePillar = page.getByText(/regulation at our core/i);
    this.provenTrackRecordPillar = page.getByText(/proven track record/i);
    this.secureTrustedPillar = page.getByText(/secure\s*&?\s*trusted/i);
  }

  async goto(): Promise<void> {
    await super.goto('/en/company');
  }
}
