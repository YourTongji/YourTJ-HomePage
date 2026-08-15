import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { LOCALES, Locale, useI18n } from '../i18n';
import { Theme } from '../types';
import { assetUrl } from '../utils/assets';
import { ArrowDownRightIcon, CheckIcon, MoonIcon, PhoneIcon, SunIcon } from './icons';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const byPrefixAndName = {
  fas: {
    language: faLanguage,
  },
};

const LanguageMenu: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentLocale = LOCALES.find((item) => item.value === locale) ?? LOCALES[0];

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 10,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();
    menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    window.addEventListener('resize', updatePosition);
    document.addEventListener('wheel', closeMenu, { passive: true });
    document.addEventListener('touchmove', closeMenu, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('wheel', closeMenu);
      document.removeEventListener('touchmove', closeMenu);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      closeMenu();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selectLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    closeMenu();
    triggerRef.current?.focus();
  };

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((value) => !value);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t('nav.language')}: ${currentLocale.label}`}
        title={currentLocale.label}
        className="inline-flex h-11 w-11 items-center justify-center gap-1.5 rounded-full text-primary transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.96] sm:h-10 sm:w-auto sm:px-3"
      >
        <FontAwesomeIcon
          icon={byPrefixAndName.fas.language}
          className="h-4 w-4 shrink-0 text-secondary"
        />
        <span className="hidden text-sm font-medium sm:inline">{currentLocale.label}</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={t('nav.language')}
            onKeyDown={onMenuKeyDown}
            className="language-menu fixed z-[70] min-w-[168px] overflow-hidden rounded-2xl p-1.5"
            style={{ top: position.top, right: position.right }}
          >
            {LOCALES.map((item) => {
              const selected = item.value === locale;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => selectLocale(item.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                    selected
                      ? 'bg-surface-selected text-link'
                      : 'text-primary hover:bg-surface'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  {selected && <CheckIcon className="h-4 w-4" />}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
};

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const lastScrollY = useRef(0);
  const [compact, setCompact] = useState(() => window.scrollY > 96);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (reduceMotion) return;

    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;

    if (delta > 0 && latest > 96) {
      setCompact(true);
    } else if (delta < 0) {
      setCompact(false);
    }
  });

  return (
    <header
      className={`glass-panel floating-nav sticky top-3 z-40 mx-auto flex h-14 w-[calc(100%-2rem)] max-w-page origin-top items-center justify-between gap-3 pl-3 pr-2 transition-[transform,opacity] duration-300 ease-out sm:w-[calc(100%-3rem)] ${
        compact ? 'nav-compact' : ''
      }`}
    >
      <a
        href="#top"
        aria-label={t('nav.homeAria')}
        className="flex min-w-0 items-center gap-2.5 rounded-full pr-1 transition-[opacity,transform] duration-200 hover:opacity-75 active:scale-[0.96]"
      >
        <img
          src={assetUrl('logo.png')}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-full bg-white object-contain ring-1 ring-black/10 dark:bg-surface-raised dark:ring-white/10"
        />
      </a>

      <nav aria-label={t('nav.primary')} className="flex shrink-0 items-center gap-1.5">
        <a
          href="#app"
          aria-label={t('nav.getApp')}
          className="group hidden h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-surface-selected px-4 text-sm font-semibold text-link transition-[background-color,transform] duration-200 hover:bg-brand/20 active:scale-[0.96] sm:inline-flex sm:h-10 sm:px-5 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <PhoneIcon className="h-4 w-4" />
          <span aria-hidden="true">{t('nav.getApp')}</span>
          <ArrowDownRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        </a>

        <LanguageMenu />

        <button
          type="button"
          onClick={() => toggleTheme()}
          aria-label={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
          aria-pressed={theme === 'dark'}
          data-theme={theme}
          className="theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-full text-primary transition-[background-color,transform] duration-200 hover:bg-surface active:scale-[0.96] sm:h-10 sm:w-10"
        >
          <span aria-hidden="true" className="theme-icon theme-icon-sun">
            <SunIcon className="h-[18px] w-[18px]" />
          </span>
          <span aria-hidden="true" className="theme-icon theme-icon-moon">
            <MoonIcon className="h-[18px] w-[18px]" />
          </span>
        </button>
      </nav>
    </header>
  );
};
