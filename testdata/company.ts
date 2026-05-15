// The company page lives at mb.io/en/company
// ── Section headings ──────────────────────────────────────────────────────────

export const COMPANY_MAIN_HEADING = 'Why MultiBank Group?';

// Using partial strings so minor punctuation or capitalisation changes don't break tests.
export const COMPANY_SECTION_HEADINGS = [
  'Tradition of Global Leadership',
  'Innovation with Purpose',
  'Integrity Built into Every Decision',
  'Strength Behind MultiBank Group',
  'Community',
] as const;

// ── Key statistics ────────────────────────────────────────────────────────────

export interface CompanyStat {
  label: string;
  // Regex to match the displayed value — we test presence, not numeric precision
  valuePattern: RegExp;
}

// If any stat changes, it was a deliberate marketing update — update the regex to match
export const COMPANY_STATS: CompanyStat[] = [
  { label: 'Annual Turnover',   valuePattern: /\$2\s*trillion/i          },
  { label: 'Customers',         valuePattern: /2,000,000\+/              },
  { label: 'Offices',           valuePattern: /25\+\s*offices/i          },
  { label: 'Founded',           valuePattern: /founded in 2005/i         },
  { label: 'Daily Volumes',     valuePattern: /\$35b\s*daily/i           },
];

// ── Strength pillars ──────────────────────────────────────────────────────────

// Three trust pillars displayed in the Strength section
export const STRENGTH_PILLARS = [
  'Regulation at Core',
  'Proven Track Record',
  'Secure & Trusted',
] as const;
