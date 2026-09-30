/*
 * Design tokens for the YourTJHub previews.
 *
 * The values themselves live in index.css as CSS custom properties, copied
 * verbatim from the product's own token file
 * (YourTJ-Hub/apps/gooseforum/resource/src/styles/tokens.css). Two reasons for
 * that split: the previews then carry the product's real palette (its blue
 * primary, its neutral ramp, the eight course-block slots the timetable assigns
 * by hashing a course code), and the light/dark pair can flip with the site
 * theme the same way the product itself does, with no JavaScript involved.
 *
 * Referencing variables rather than literals here also means the mocks can
 * never drift into showing a nicer-looking product than the real one.
 */

export const HUB = {
  base100: 'var(--hub-base-100)',
  base200: 'var(--hub-base-200)',
  base300: 'var(--hub-base-300)',
  content: 'var(--hub-base-content)',
  iconMuted: 'var(--hub-icon-muted)',
  line: 'var(--hub-line)',
  primary: 'var(--hub-primary)',
  primaryContent: 'var(--hub-primary-content)',
  accent: 'var(--hub-accent)',
  info: 'var(--hub-info)',
  success: 'var(--hub-success)',
  warning: 'var(--hub-warning)',
  error: 'var(--hub-error)',
} as const;

/** Course block slots (tokens.css --gf-color-course-1..8), stable per course code. */
export const COURSE_SLOTS = [
  'var(--hub-course-1)',
  'var(--hub-course-2)',
  'var(--hub-course-3)',
  'var(--hub-course-4)',
  'var(--hub-course-5)',
  'var(--hub-course-6)',
  'var(--hub-course-7)',
  'var(--hub-course-8)',
];

/** Muted text at an alpha, the way the product writes base-content/55. */
export const muted = (alpha: number) => `color-mix(in oklab, ${HUB.content} ${alpha * 100}%, transparent)`;

/** Tinted surface, the way the product builds chips and course cards. */
export const tint = (color: string, percent: number, base: string = HUB.base100) =>
  `color-mix(in oklab, ${color} ${percent}%, ${base})`;

/**
 * Stable slot pick, mirroring courseColorSlotFor() in the product verbatim:
 * `h = (h * 31 + charCode) >>> 0` then `h % 8`. The same course code must land
 * on the same colour on every render, or the timetable would shuffle its palette
 * whenever React re-rendered it.
 */
export const courseSlot = (seed: string): number => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % COURSE_SLOTS.length;
};

export const courseColor = (seed: string) => COURSE_SLOTS[courseSlot(seed)];
