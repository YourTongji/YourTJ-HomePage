import React from 'react';
import { COMMUNITY_LINKS } from '../constants';
import { useI18n } from '../i18n';
import { CommunityLink } from '../types';
import { ExternalLinkIcon, GithubIcon, MailIcon, QQIcon, TelegramIcon } from './icons';
import { Reveal } from './Reveal';

const COMMUNITY_ICONS: Record<CommunityLink['icon'], React.ReactNode> = {
  qq: <QQIcon className="h-5 w-5" />,
  telegram: <TelegramIcon className="h-5 w-5" />,
  email: <MailIcon className="h-5 w-5" />,
  github: <GithubIcon className="h-5 w-5" />,
};

const CommunityCard: React.FC<{ link: CommunityLink }> = ({ link }) => {
  const { t } = useI18n();
  const baseClassName =
    'glass-card group relative flex min-h-[72px] items-center gap-3 overflow-hidden rounded-2xl px-4 py-3';
  const enabledClassName = `${baseClassName} transition-[transform,border-color,background-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-brand/35 hover:shadow-lift active:translate-y-0 active:scale-[0.96]`;

  const body = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-selected text-accent">
        {COMMUNITY_ICONS[link.icon]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-primary">
          {t(link.labelKey)}
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-secondary">{t(link.noteKey)}</span>
      </span>
      {link.href && (
        <ExternalLinkIcon className="h-4 w-4 shrink-0 text-tertiary transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (link.href) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={enabledClassName}>
        {body}
        <span aria-hidden="true" className="card-aura" />
        <span aria-hidden="true" className="edge-runner" />
        <span aria-hidden="true" className="card-sheen" />
      </a>
    );
  }

  return (
    <div className={baseClassName} role="group" aria-disabled="true" tabIndex={-1}>
      {body}
    </div>
  );
};

export const CommunitySection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="community" aria-labelledby="community-title" className="scroll-mt-24">
      <div className="mx-auto max-w-page px-4 pb-20 sm:px-6 md:pb-28">
        <Reveal className="max-w-[560px]">
          <h2
            id="community-title"
            className="text-2xl font-semibold leading-[1.2] tracking-tight text-primary md:text-3xl"
          >
            {t('community.title')}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-pretty text-secondary">
            {t('community.desc')}
          </p>
        </Reveal>

        <Reveal delay={90} className="mt-8">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {COMMUNITY_LINKS.map((link) => (
              <CommunityCard key={link.id} link={link} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
