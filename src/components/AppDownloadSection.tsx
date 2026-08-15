import React from 'react';
import { APP_LINKS } from '../constants';
import { useI18n } from '../i18n';
import { assetUrl } from '../utils/assets';
import {
  AndroidIcon,
  AppleIcon,
  CheckIcon,
  FeedbackIcon,
  ReleaseIcon,
} from './icons';
import { Reveal } from './Reveal';

const APP_FEATURE_KEYS = ['app.feature.course', 'app.feature.review', 'app.feature.schedule'];

const PrimaryDownloadLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-action px-4 text-sm font-semibold text-on-action transition-[background-color,color,transform] duration-200 hover:bg-action-hover active:scale-[0.96] active:bg-action-pressed active:text-on-action-pressed lg:h-10"
  >
    {icon}
    {label}
  </a>
);

const SecondaryTextLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium text-secondary transition-[color,transform] duration-200 hover:text-primary active:scale-[0.96]"
  >
    {icon}
    {label}
  </a>
);

export const AppDownloadSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="app" aria-labelledby="app-title" className="scroll-mt-24">
      <Reveal className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-24">
        <div className="glass-panel overflow-hidden rounded-2xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <h2
                id="app-title"
                className="text-2xl font-semibold leading-[1.2] tracking-tight text-primary md:text-3xl"
              >
                {t('app.section.title')}
              </h2>
              <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-pretty text-secondary">
                {t('app.desc')}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <PrimaryDownloadLink
                  href={APP_LINKS.iosTestflight}
                  icon={<AppleIcon className="h-[18px] w-[18px]" />}
                  label={t('app.ios.cta')}
                />
                <PrimaryDownloadLink
                  href={APP_LINKS.androidAcceleratedApk}
                  icon={<AndroidIcon className="h-[18px] w-[18px]" />}
                  label={t('app.android.cta')}
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                <SecondaryTextLink
                  href={APP_LINKS.androidReleases}
                  icon={<ReleaseIcon className="h-4 w-4" />}
                  label={t('app.more')}
                />
                <SecondaryTextLink
                  href={APP_LINKS.iosIssues}
                  icon={<FeedbackIcon className="h-4 w-4" />}
                  label={t('app.feedback.ios')}
                />
                <SecondaryTextLink
                  href={APP_LINKS.androidIssues}
                  icon={<FeedbackIcon className="h-4 w-4" />}
                  label={t('app.feedback.android')}
                />
              </div>

              <p className="mt-6 text-xs leading-5 text-tertiary">{t('app.note')}</p>
            </div>

            <div className="relative hidden overflow-hidden border-l border-edge bg-surface lg:block">
              <div aria-hidden="true" className="hero-ambient pointer-events-none absolute inset-0 opacity-60" />
              <div className="relative flex h-full flex-col justify-center p-10">
                <div className="flex items-center gap-3">
                  <img
                    src={assetUrl('logo.png')}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl bg-white object-contain ring-1 ring-black/10 dark:bg-surface-raised dark:ring-white/10"
                  />
                  <div>
                    <p className="text-sm font-semibold text-primary">{t('app.title')}</p>
                    <p className="mt-0.5 text-xs text-secondary">{t('app.openStatus')}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {APP_FEATURE_KEYS.map((key) => (
                    <div
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-edge bg-surface-raised px-4 py-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-selected text-accent">
                        <CheckIcon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-primary">{t(key)}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
