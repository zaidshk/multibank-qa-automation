// Route test data for navigation and edge case tests

// ── Valid routes ──────────────────────────────────────────────────────────────

// Key routes used in smoke / navigation tests.
// These should always resolve to a real page — if any return 404 in CI that's a blocker.
export interface ValidRoute {
  path: string;
  description: string;
}

export const VALID_ROUTES: ValidRoute[] = [
  { path: '/en',              description: 'Home page'       },
  { path: '/en/explore',      description: 'Explore markets' },
  { path: '/en/features',     description: 'Features page'   },
  { path: '/en/features/otc-desk',  description: 'OTC Desk'   },
  { path: '/en/support',      description: 'Support page'    },
];

// ── Invalid / 404 routes ──────────────────────────────────────────────────────

// Used in EDGE-03 to verify the app handles unknown paths gracefully.
// Mix of slightly-wrong paths and completely random ones to cover different failure modes.
export interface InvalidRoute {
  path: string;
  description: string;
}

export const INVALID_ROUTES: InvalidRoute[] = [
  { path: '/en/this-page-does-not-exist',   description: 'Random slug under /en'    },
  { path: '/en/explore/fakeasset',          description: 'Non-existent asset route'  },
  { path: '/xyz',                           description: 'Completely unknown path'   },
  { path: '/en/features/notasubpage',       description: 'Deep path under features'  },
];

// ── Language / locale variants ────────────────────────────────────────────────

// Used in EDGE-01 — changing the locale segment in the URL should load the correct locale.
// ar-AE is an RTL locale; worth checking the page still renders correctly.
export interface LocaleRoute {
  locale: string;
  path: string;
  description: string;
}

export const LOCALE_ROUTES: LocaleRoute[] = [
  { locale: 'en',    path: '/en/explore',       description: 'English'         },
  { locale: 'ar-AE', path: '/ar-AE/explore',    description: 'Arabic (UAE)'    },
];
