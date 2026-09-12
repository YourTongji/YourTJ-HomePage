import React from 'react';
import { useI18n } from '../i18n';
import { assetUrl } from '../utils/assets';
import { AndroidIcon, AppleIcon, ClockIcon, PhoneIcon } from './icons';
import { ProductEntries } from './ProductEntries';
import { MistBackground } from './MistBackground';

const AppVisualCard: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="glass-panel relative w-full overflow-hidden rounded-2xl p-7 md:p-8">
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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-edge bg-surface-selected shadow-card">
            <img
              src={assetUrl('logo.png')}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full object-contain ring-1 ring-black/10 dark:ring-white/10"
            />
          </div>
          <div className="min-w-0">
            <p className="text-2xl font-semibold tracking-tight text-primary">{t('app.title')}</p>
            <span className="status-pill mt-2">
              <ClockIcon className="h-3.5 w-3.5 text-accent" />
              <span>{t('app.comingSoon')}</span>
            </span>
          </div>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed text-pretty text-secondary">
          {t('app.desc')}
        </p>

        {/*
         * Only the actionable part — the two store rows — sits under the veil.
         * The product name and the one-line description stay crisp, so the card
         * still reads as a product; the frosted rows are what say "not yet".
         */}
        <div className="relative mt-6 select-none overflow-hidden rounded-xl border border-edge bg-surface-raised/70">
          <div className="grid grid-cols-2 gap-2.5 p-3.5">
            <div className="rounded-xl border border-edge bg-surface-raised p-3">
              <div className="flex items-center gap-2 text-primary">
                <AppleIcon className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold">iOS</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-secondary">{t('app.ios')}</p>
            </div>
            <div className="rounded-xl border border-edge bg-surface-raised p-3">
              <div className="flex items-center gap-2 text-primary">
                <AndroidIcon className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold">Android</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-secondary">{t('app.android')}</p>
            </div>
          </div>
          <span aria-hidden="true" className="frost-veil pointer-events-none absolute inset-0" />
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section aria-labelledby="hero-title" className="mist-hero relative overflow-hidden">
      <MistBackground />
      <div aria-hidden="true" className="spectrum-field" />

      <div className="relative z-10 mx-auto max-w-page px-4 sm:px-6">
        <div className="short-safe grid min-h-[calc(100dvh-4.25rem)] items-center gap-10 py-8 md:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="max-w-[640px]">
            <p className="mb-3 font-brand text-[36px] leading-none tracking-normal sm:text-[46px] motion-safe:animate-fade-up">
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

            {/* Unreleased app entry: the veil gates the row, the badge stays above it. */}
            <div className="relative mt-7 overflow-hidden rounded-2xl border border-edge bg-surface-selected shadow-card sm:hidden">
              <span aria-hidden="true" className="frost-veil pointer-events-none absolute inset-0" />
              <div className="relative flex w-full items-center justify-between gap-3 px-5 py-3.5">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-link">
                  <PhoneIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t('app.cta')}</span>
                </span>
                <span className="status-pill relative z-10 shrink-0">
                  <ClockIcon className="h-3.5 w-3.5 text-accent" />
                  <span>{t('app.comingSoon')}</span>
                </span>
              </div>
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
