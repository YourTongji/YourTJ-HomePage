import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { Theme } from '../types';

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Storage can be unavailable in private browsing.
  }
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

let activeTheme: Theme = getInitialTheme();
const themeListeners = new Set<(nextTheme: Theme) => void>();

function notifyAll(nextTheme: Theme): void {
  activeTheme = nextTheme;
  try {
    localStorage.setItem('theme', nextTheme);
  } catch {
    // Storage can fail in private browsing
  }
  themeListeners.forEach((listener) => listener(nextTheme));
}

function applyThemeDom(nextTheme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', nextTheme === 'dark');
  root.style.colorScheme = nextTheme;
}

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(activeTheme);

  useEffect(() => {
    const onThemeChange = (newTheme: Theme) => {
      setTheme(newTheme);
    };
    themeListeners.add(onThemeChange);

    // Also observe class mutations on <html> in case class is toggled externally
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const current: Theme = isDark ? 'dark' : 'light';
      if (current !== activeTheme) {
        notifyAll(current);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      themeListeners.delete(onThemeChange);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = activeTheme === 'light' ? 'dark' : 'light';

    if (document.startViewTransition) {
      const root = document.documentElement;
      root.classList.add('vt');
      document
        .startViewTransition(() => {
          flushSync(() => {
            applyThemeDom(nextTheme);
            notifyAll(nextTheme);
          });
        })
        .finished.finally(() => {
          root.classList.remove('vt');
        });
      return;
    }

    applyThemeDom(nextTheme);
    notifyAll(nextTheme);
  };

  return { theme, toggleTheme };
};
