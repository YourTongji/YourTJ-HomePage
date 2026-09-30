/*
 * Theme bridge for the app previews.
 *
 * The phone screens are the product's own pages (apps/mobile in YourTJ-Hub)
 * rebuilt in React, so their colours are the Flutter app's colours — but a
 * marketing page has to follow the *site's* theme, not a second, independent
 * toggle. So instead of two palettes in JS, the tokens below are CSS variables:
 * `--app-*` is defined once in src/index.css for light and once for dark, and
 * every screen reads them through this object. Switching the site theme flips
 * the phone instantly, with no re-render and no risk of the two themes drifting
 * apart.
 *
 * The values come from apps/mobile/packages/ui_kit/lib/src/theme/tokens.json —
 * the single source of truth mirrored from the web's tokens.css — plus the
 * handful of derived hues the app uses for section accents (emerald / brand /
 * violet / orange), which are not part of the token set. Those four are lifted
 * for dark mode the same way tokens.json lifts primary and info (hue kept,
 * lightness raised), and the comment next to each dark value says so.
 */

export const C = {
  base100: 'var(--app-base-100)',
  base200: 'var(--app-base-200)',
  base300: 'var(--app-base-300)',
  content: 'var(--app-base-content)',
  iconMuted: 'var(--app-icon-muted)',
  line: 'var(--app-line)',
  primary: 'var(--app-primary)',
  primaryContent: 'var(--app-primary-content)',
  secondary: 'var(--app-secondary)',
  accent: 'var(--app-accent)',
  neutral: 'var(--app-neutral)',
  success: 'var(--app-success)',
  warning: 'var(--app-warning)',
  error: 'var(--app-error)',
  info: 'var(--app-info)',
  emerald: 'var(--app-emerald)',
  brand: 'var(--app-brand)',
  violet: 'var(--app-violet)',
  orange: 'var(--app-orange)',
};

/**
 * A translucent version of a palette colour.
 *
 * `color-mix` rather than rgba(): the tokens are CSS variables, so there is no
 * hex string to take apart — and mixing in sRGB against transparent gives the
 * same result the Flutter code gets from `withValues(alpha:)`.
 */
export const alpha = (color: string, a: number) =>
  `color-mix(in srgb, ${color} ${Math.round(a * 10000) / 100}%, transparent)`;

/**
 * A soft tint of a hue over the current surface — the app's habit for chips,
 * icon plates and selected rows (e.g. background-base-300 with a hue lean).
 * Falls back to the surface token, so tints stay readable in dark mode where a
 * pale light-mode hex would glow.
 */
export const tint = (color: string, a: number, base = C.base100) =>
  `color-mix(in srgb, ${color} ${Math.round(a * 10000) / 100}%, ${base})`;

// iOS renders the Flutter app with SF Pro + PingFang SC.
export const FONT =
  '-apple-system, "SF Pro Text", "SF Pro Display", "PingFang SC", "Apple Color Emoji", sans-serif';
// Headlines use bundled Noto Sans SC ExtraBold/Black (OFL) for weight PingFang lacks.
export const DISPLAY_FONT =
  '"PromoDisplay", "SF Pro Display", -apple-system, "PingFang SC", "Apple Color Emoji", sans-serif';

// Section accents, each taken from the product's own palette.
export const ACCENT = {
  ask: C.primary,
  reviews: C.warning,
  wiki: C.emerald,
  campus: C.brand,
  chat: C.violet,
};
