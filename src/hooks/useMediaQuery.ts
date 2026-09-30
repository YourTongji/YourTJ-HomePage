import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query. Used for layout branches that cannot be expressed
 * in CSS alone: the app preview mounts a different device arrangement below lg,
 * for instance, and mounting both would mean measuring and animating twice.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
};

/**
 * Read once, not subscribed: every animated section asks for this at the moment
 * it builds its timeline, so the answer only has to be right at mount time.
 */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
