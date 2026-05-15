// Viewport sizes used across tests.
// Desktop sizes cover the three most common display resolutions in QA lab environments.
// Tablet and mobile entries are here for the framework demonstration — no specs target them.

export interface Viewport {
  name: string;
  width: number;
  height: number;
}

// ── Desktop ───────────────────────────────────────────────────────────────────

// All current test specs run at these desktop sizes
export const DESKTOP_VIEWPORTS: Viewport[] = [
  { name: 'Full HD',   width: 1920, height: 1080 },
  { name: 'Laptop L',  width: 1440, height: 900  },
  { name: 'Laptop',    width: 1280, height: 800  },
];

// ── Tablet ────────────────────────────────────────────────────────────────────

// Kept here as a reference — responsive layout breakpoints for future use
export const TABLET_VIEWPORTS: Viewport[] = [
  { name: 'iPad Air',  width: 820,  height: 1180 },
  { name: 'iPad Mini', width: 768,  height: 1024 },
];

// ── Mobile ────────────────────────────────────────────────────────────────────

// Framework supports mobile via Playwright device emulation (see playwright.config.ts)
// No test specs target mobile currently — these are reference values only
export const MOBILE_VIEWPORTS: Viewport[] = [
  { name: 'iPhone 14',  width: 390, height: 844 },
  { name: 'Pixel 7',    width: 412, height: 915 },
  { name: 'Galaxy S23', width: 360, height: 780 },
];

// ── Breakpoint thresholds ─────────────────────────────────────────────────────

// Approximate breakpoints based on typical Tailwind/Bootstrap setups.
// Confirm against the actual site CSS before writing layout-specific assertions.
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;
