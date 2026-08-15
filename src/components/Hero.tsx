import React from 'react';
import { useI18n } from '../i18n';
import { assetUrl } from '../utils/assets';
import { AndroidIcon, AppleIcon, ArrowDownRightIcon, ArrowUpRightIcon } from './icons';
import { ProductEntries } from './ProductEntries';
import { MistBackground } from './MistBackground';

const AppVisualCard: React.FC = () => {
  const { t } = useI18n();

  return (
    <a
      href="#app"
      aria-label={`${t('nav.getApp')}, ${t('app.desc')}`}
      className="glass-panel group relative block w-full overflow-hidden rounded-2xl p-7 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift active:translate-y-0 active:scale-[0.96] md:p-8"
    >
      <div aria-hidden="true" className="hero-ambient pointer-events-none absolute inset-0 opacity-70" />
      <img
        src={assetUrl('hhholographic.webp')}
        alt=""
        aria-hidden="true"
        width={1800}
        height={1013}
        className="holographic-texture"
        loading="eager"
        decoding="async"
      />
      <span aria-hidden="true" className="iridescent-border" />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-edge bg-surface-selected shadow-card">
            <img
              src={assetUrl('logo.png')}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-contain ring-1 ring-black/10 dark:ring-white/10"
            />
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-primary">{t('app.title')}</p>
            <p className="mt-1.5 text-sm leading-6 text-secondary">{t('app.testing')}</p>
          </div>
        </div>

        <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-pretty text-secondary">
          {t('app.desc')}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-edge bg-surface-raised/90 p-3.5">
            <div className="flex items-center gap-2 text-primary">
              <AppleIcon className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">TestFlight</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-secondary">{t('app.ios')}</p>
          </div>
          <div className="rounded-xl border border-edge bg-surface-raised/90 p-3.5">
            <div className="flex items-center gap-2 text-primary">
              <AndroidIcon className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">{t('app.android')}</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-secondary">{t('app.apk')}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-[15px] font-semibold text-link">{t('nav.getApp')}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRightIcon className="h-[18px] w-[18px]" />
          </span>
        </div>
      </div>
    </a>
  );
};

export const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section aria-labelledby="hero-title" className="mist-hero relative overflow-hidden">
      <MistBackground />

      <div className="relative z-10 mx-auto max-w-page px-4 sm:px-6">
        <div className="short-safe grid min-h-[calc(100dvh-4.25rem)] items-center gap-10 py-8 md:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="max-w-[640px]">
            <p className="mb-3 font-brand text-[24px] leading-none tracking-normal sm:text-[28px] motion-safe:animate-fade-up">
              <span className="text-primary">Your</span>
              <span className="text-link">TJ</span>
            </p>
            <h1
              id="hero-title"
              className="hero-headline text-primary motion-safe:animate-fade-up [animation-delay:80ms]"
            >
              {t('hero.headline.1')}
              <span className="block">{t('hero.headline.2')}</span>
            </h1>

            <div className="mt-7 sm:hidden">
              <a
                href="#app"
                aria-label={t('nav.getApp')}
                className="group flex w-full items-center justify-between rounded-2xl border border-edge bg-surface-selected px-5 py-3.5 text-link shadow-card transition-[transform,border-color,background-color] duration-200 hover:border-brand/35 active:scale-[0.96]"
              >
                <span className="text-sm font-semibold">{t('nav.getApp')}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5">
                  <ArrowDownRightIcon className="h-4 w-4" />
                </span>
              </a>
            </div>

            <div className="mt-3 sm:mt-10">
              <ProductEntries />
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center motion-safe:animate-fade-up [animation-delay:220ms]">
            <AppVisualCard />
          </div>
        </div>
      </div>
    </section>
  );
};
