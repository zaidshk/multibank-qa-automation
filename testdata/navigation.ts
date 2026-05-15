// href values are partial matches — the site prepends the base domain and locale prefix

export interface NavItem {
  label: string;
  // Partial href to match against the actual anchor's href attribute
  hrefContains: string;
  // true means the link should open in a new browser tab
  opensNewTab: boolean;
}

// These are the 8 primary navigation links visible on desktop.
// Logo is excluded — it's a branding element, not a navigation item under test.
export const NAV_ITEMS: NavItem[] = [
  { label: 'Explore',   hrefContains: '/en/explore',                          opensNewTab: false },
  { label: 'Features',  hrefContains: '/en/features',                         opensNewTab: false },
  { label: 'OTC Desk',  hrefContains: '/en/features/otc-desk',                 opensNewTab: false },
  { label: 'Company',   hrefContains: '/en/company',                          opensNewTab: false },
  { label: 'Support',   hrefContains: '/en/support',                          opensNewTab: false },
  // $MBG points to the token site — external, opens in a new tab
  { label: '$MBG',      hrefContains: 'token.multibankgroup.com',             opensNewTab: true  },
  { label: 'Sign in',   hrefContains: '/login',                               opensNewTab: false },
  { label: 'Sign up',   hrefContains: '/register',                            opensNewTab: false },
];

// Used in NAV-01 to assert the exact count of nav links
export const EXPECTED_NAV_LINK_COUNT = NAV_ITEMS.length;

// Internal nav items are the ones where clicking should stay in the same tab
// and navigate to a known path — used in NAV-02 navigation flow tests
export const INTERNAL_NAV_ITEMS = NAV_ITEMS.filter((item) => !item.opensNewTab);

// External items need a context.waitForEvent('page') pattern in tests
export const EXTERNAL_NAV_ITEMS = NAV_ITEMS.filter((item) => item.opensNewTab);
