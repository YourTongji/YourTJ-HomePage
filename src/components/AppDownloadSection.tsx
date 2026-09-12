import React from 'react';
import { APP_AVAILABLE, APP_LINKS } from '../constants';
import { useI18n } from '../i18n';
import { assetUrl } from '../utils/assets';
import {
  AndroidIcon,
  AppleIcon,
  ClockIcon,
  FeedbackIcon,
  ReleaseIcon,
} from './icons';
import { Reveal } from './Reveal';

const PRIMARY_CLASS =
  'inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-action px-4 text-sm font-semibold text-on-action lg:h-10';

const SECONDARY_CLASS =
  'inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium text-secondary';

/**
 * Renders a download row. While APP_AVAILABLE is false these are inert spans,
 * so the masked panel never exposes focusable dead links to the keyboard.
 */
const DownloadAction: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  variant: 'primary' | 'secondary';
}> = ({ href, icon, label, variant }) => {
  const className = variant === 'primary' ? PRIMARY_CLASS : SECONDARY_CLASS;

  if (!APP_AVAILABLE) {
    return (
      <span className={className}>
        {icon}
        {label}
      </span>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {icon}
      {label}
    </a>
  );
};

export const AppDownloadSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="app" aria-label={t('app.section.title')} className="scroll-mt-24">
      <Reveal className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <div className="relative overflow-hidden rounded-2xl">
          {/* The panel keeps its full shape under the veil, so the page does not
              collapse while the app is unreleased. */}
          <div aria-hidden="true" className="glass-panel select-none overflow-hidden rounded-2xl">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <h2 className="text-2xl font-semibold leading-[1.2] tracking-tight text-primary md:text-3xl">
                  {t('app.section.title')}
                </h2>
                <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-pretty text-secondary">
                  {t('app.desc')}
                </p>

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <DownloadAction
                    href={APP_LINKS.iosTestflight}
                    icon={<AppleIcon className="h-[18px] w-[18px]" />}
                    label={t('app.ios.cta')}
                    variant="primary"
                  />
                  <DownloadAction
                    href={APP_LINKS.androidAcceleratedApk}
                    icon={<AndroidIcon className="h-[18px] w-[18px]" />}
                    label={t('app.android.cta')}
                    variant="primary"
                  />
                </div>

                <div className="mt-5 hidden flex-wrap items-center gap-x-6 gap-y-2 sm:flex">
                  <DownloadAction
                    href={APP_LINKS.androidReleases}
                    icon={<ReleaseIcon className="h-4 w-4" />}
                    label={t('app.more')}
                    variant="secondary"
                  />
                  <DownloadAction
                    href={APP_LINKS.iosIssues}
                    icon={<FeedbackIcon className="h-4 w-4" />}
                    label={t('app.feedback')}
                    variant="secondary"
                  />
                </div>

                <p className="mt-6 hidden text-xs leading-5 text-tertiary sm:block">{t('app.note')}</p>
              </div>

              {/*
               * The product half of the panel, kept to what is actually true
               * today: the mark, the name, and the release status. A feature
               * list used to sit here, but an unreleased build has no shipped
               * features to list, and inventing some made the panel read as
               * marketing rather than as a placeholder for a real download page.
               */}
              <div className="relative hidden overflow-hidden border-l border-edge bg-surface lg:block">
                <div className="hero-ambient pointer-events-none absolute inset-0 opacity-60" />
                <div className="relative flex h-full flex-col items-center justify-center gap-5 p-10 text-center">
                  <img
                    src={assetUrl('logo.png')}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full bg-white object-contain ring-1 ring-black/10 dark:bg-surface-raised dark:ring-white/10"
                  />
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-primary">
                      {t('app.title')}
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">{t('app.openStatus')}</p>
                  </div>
                </div>
              </div>
            </div>

            <span className="frost-veil absolute inset-0" />
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="glass-card w-full max-w-sm rounded-2xl px-6 py-5 text-center">
              <span className="status-pill">
                <ClockIcon className="h-3.5 w-3.5 text-accent" />
                <span>{t('app.comingSoon')}</span>
              </span>
              <h2 className="mt-3 text-base font-semibold tracking-tight text-primary">
                {t('app.title')}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-pretty text-secondary">
                {t('app.comingSoonNote')}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
