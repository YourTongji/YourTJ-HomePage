import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';

type Point = { x: number; y: number } | { clientX: number; clientY: number };

function applyThemeDom(nextTheme: Theme): void {
  const root = document.documentElement;
  if (nextTheme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');

  // Hint to the browser which palette we're using to reduce flashes during transitions.
  root.style.colorScheme = nextTheme;
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  useEffect(() => {
    applyThemeDom(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = (point?: Point) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    const x =
      point && 'x' in point
        ? point.x
        : point && 'clientX' in point
          ? point.clientX
          : window.innerWidth / 2;
    const y =
      point && 'y' in point
        ? point.y
        : point && 'clientY' in point
          ? point.clientY
          : window.innerHeight / 2;

    const rx = Math.max(x, window.innerWidth - x);
    const ry = Math.max(y, window.innerHeight - y);
    const r = Math.hypot(rx, ry);

    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    const dur = prefersReducedMotion ? 180 : 320;

    // If supported, use the View Transitions API to avoid repaint-heavy per-element color transitions.
    // flushSync ensures React applies the class toggle within the transition callback.
    if (document.startViewTransition) {
      root.style.setProperty('--vt-x', `${x}px`);
      root.style.setProperty('--vt-y', `${y}px`);
      root.style.setProperty('--vt-r', `${r}px`);
      root.style.setProperty('--vt-dur', `${dur}ms`);
      root.classList.add('vt');

      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
          applyThemeDom(nextTheme);
        });
      }).finished.finally(() => {
        root.classList.remove('vt');
        root.style.removeProperty('--vt-x');
        root.style.removeProperty('--vt-y');
        root.style.removeProperty('--vt-r');
        root.style.removeProperty('--vt-dur');
      });

      return;
    }

    // Fallback: fade an overlay (covers potential jank during lots of color transitions).
    if (!prefersReducedMotion && document.body) {
      const overlay = document.createElement('div');
      const bg = getComputedStyle(document.documentElement).backgroundColor;
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = bg;
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '2147483647';
      overlay.style.opacity = '1';
      overlay.style.transition = 'opacity 220ms cubic-bezier(0.2, 0, 0, 1)';
      document.body.appendChild(overlay);

      setTheme(nextTheme);
      applyThemeDom(nextTheme);

      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
      });

      overlay.addEventListener(
        'transitionend',
        () => {
          overlay.remove();
        },
        { once: true }
      );

      return;
    }

    setTheme(nextTheme);
    applyThemeDom(nextTheme);
  };

  return { theme, toggleTheme };
};
