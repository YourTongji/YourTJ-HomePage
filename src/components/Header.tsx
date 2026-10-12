import React, { useEffect, useState } from 'react';
import { LOCALES, Locale, useI18n } from '../i18n';
import { Theme } from '../types';
import { assetUrl } from '../utils/assets';
import {
  ArrowDownRightIcon,
  CheckIcon,
  LanguageIcon,
  MoonIcon,
  PhoneIcon,
  SunIcon,
} from './icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * The nav carries exactly one primary action, and now that the app ships it
 * points at the download panel: the one place on the page where a visitor can
 * actually install it. The hub keeps its own entry in the hero's product card,
 * so the nav never has to choose between two destinations.
 */
const PRIMARY_NAV_ACTION = { href: '#download', labelKey: 'nav.getApp' } as const;

const LanguageMenu: React.FC = () => {
  const { locale, setLocale, t } = useI18n();
  const currentLocale = LOCALES.find((item) => item.value === locale) ?? LOCALES[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${t('nav.language')}: ${currentLocale.label}`}
          title={currentLocale.label}
          className="gap-1.5 sm:w-auto sm:px-3"
        >
          {/*
           * Optically matched to the theme glyph next to it, not numerically: the
           * translate mark keeps its ink well inside its viewBox while the sun and
           * moon fill theirs, so an equal 18px box reads visibly smaller. One step
           * larger evens them out. Same colour too - both are peer utility buttons,
           * and a muted tint made the icon-only mobile variant look disabled.
           */}
          <LanguageIcon className="h-5 w-5 shrink-0" />
          <span className="hidden text-sm font-medium sm:inline">{currentLocale.label}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" collisionPadding={12} aria-label={t('nav.language')}>
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)}>
          {LOCALES.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              <span className="font-medium">{item.label}</span>
              <DropdownMenuItemIndicator className="flex">
                <CheckIcon className="h-4 w-4" />
              </DropdownMenuItemIndicator>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const COMPACT_AFTER = 96;

/**
 * Compact once the page leaves the top, expand only when it is back at zero.
 * The gap between the two thresholds keeps the pill from flickering around the
 * boundary, and state only changes on a crossing, so scrolling does not
 * re-render the header.
 */
const useCompactNav = () => {
  const [compact, setCompact] = useState(() => window.scrollY > COMPACT_AFTER);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 0) setCompact(false);
      else if (y > COMPACT_AFTER) setCompact(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return compact;
};

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { t } = useI18n();
  const compact = useCompactNav();

  return (
    <header
      className={`floating-nav sticky top-3 z-40 mx-auto flex h-14 w-[calc(100%-2rem)] max-w-page origin-top items-center justify-between gap-3 pl-3 pr-2 transition-[max-width,transform,opacity] duration-[420ms] ease-in-out sm:w-[calc(100%-3rem)] lg:w-[calc(100%-3rem)] ${
        compact ? 'glass-panel nav-compact' : 'lg:max-w-[1240px]'
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
        <Button asChild variant="soft" className="group hidden sm:inline-flex">
          <a href={PRIMARY_NAV_ACTION.href} aria-label={t(PRIMARY_NAV_ACTION.labelKey)}>
            <PhoneIcon className="h-4 w-4" />
            <span aria-hidden="true">{t(PRIMARY_NAV_ACTION.labelKey)}</span>
            <ArrowDownRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </a>
        </Button>

        <LanguageMenu />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleTheme()}
          aria-label={theme === 'light' ? t('theme.toDark') : t('theme.toLight')}
          aria-pressed={theme === 'dark'}
          data-theme={theme}
          className="theme-toggle"
        >
          <span aria-hidden="true" className="theme-icon theme-icon-sun">
            <SunIcon className="h-[18px] w-[18px]" />
          </span>
          <span aria-hidden="true" className="theme-icon theme-icon-moon">
            <MoonIcon className="h-[18px] w-[18px]" />
          </span>
        </Button>
      </nav>
    </header>
  );
};
