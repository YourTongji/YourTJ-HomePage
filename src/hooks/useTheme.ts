import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Theme } from '../types';

function applyThemeDom(nextTheme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', nextTheme === 'dark');
  root.style.colorScheme = nextTheme;
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {
      // Storage can be unavailable in private browsing.
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    applyThemeDom(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage can be unavailable in private browsing; the in-memory state is enough.
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

    // Use the View Transitions API when available; otherwise toggle the class directly.
    if (document.startViewTransition) {
      const root = document.documentElement;
      root.classList.add('vt');
      document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
          applyThemeDom(nextTheme);
        });
      }).finished.finally(() => {
        root.classList.remove('vt');
      });
      return;
    }

    setTheme(nextTheme);
    applyThemeDom(nextTheme);
  };

  return { theme, toggleTheme };
};
