import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';

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
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // If supported, use the View Transitions API to avoid repaint-heavy per-element color transitions.
    // flushSync ensures React applies the class toggle within the transition callback.
    if (!prefersReducedMotion && document.startViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        });
      });
      return;
    }

    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};
