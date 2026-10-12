import React from 'react';
import { COMMUNITY_LINKS } from '../constants';
import { useI18n } from '../i18n';
import { useTheme } from '../hooks/useTheme';
import { CommunityLink } from '../types';
import { ExternalLinkIcon, GithubIcon, MailIcon, QQIcon, TelegramIcon } from './icons';
import { Reveal } from './Reveal';
import { Card, CardEffects } from '@/components/ui/card';

const renderCommunityIcon = (icon: CommunityLink['icon'], theme: 'light' | 'dark') => {
  switch (icon) {
    case 'qq':
      return <QQIcon theme={theme} className="h-5 w-5" />;
    case 'telegram':
      return <TelegramIcon theme={theme} className="h-5 w-5" />;
    case 'github':
      return <GithubIcon theme={theme} className="h-5 w-5" />;
    case 'email':
    default:
      return <MailIcon className="h-5 w-5" />;
  }
};

const getBadgeClasses = (icon: CommunityLink['icon'], isDark: boolean) => {
  switch (icon) {
    case 'qq':
      return isDark
        ? 'bg-[#1EBAFC]/15 border-[#1EBAFC]/30 text-[#38bdf8] shadow-[0_0_12px_rgba(30,186,252,0.15)]'
        : 'bg-[#1EBAFC]/10 border-[#1EBAFC]/25 text-[#1EBAFC] shadow-xs';
    case 'telegram':
      return isDark
        ? 'bg-[#229ED9]/15 border-[#229ED9]/30 text-[#38bdf8] shadow-[0_0_12px_rgba(34,158,217,0.15)]'
        : 'bg-[#229ED9]/10 border-[#229ED9]/25 text-[#229ED9] shadow-xs';
    case 'github':
      return isDark
        ? 'bg-neutral-800/90 border-neutral-700/80 text-white shadow-xs'
        : 'bg-neutral-100 border-neutral-200/90 text-[#1b1f23] shadow-xs';
    case 'email':
    default:
      return isDark
        ? 'bg-emerald-500/15 border-emerald-400/25 text-[#72f0a6] shadow-xs'
        : 'bg-emerald-50 border-emerald-200/80 text-[#059669] shadow-xs';
  }
};

const ROW_CLASS = 'flex min-h-[72px] items-center gap-3.5 overflow-hidden px-4 py-3';

const CommunityCard: React.FC<{ link: CommunityLink; theme: 'light' | 'dark' }> = ({
  link,
  theme,
}) => {
  const { t } = useI18n();
  const isDark = theme === 'dark';
  const body = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${getBadgeClasses(
          link.icon,
          isDark
        )}`}
      >
        {renderCommunityIcon(link.icon, theme)}
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
      <Card asChild interactive className={ROW_CLASS}>
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {body}
          <CardEffects />
        </a>
      </Card>
    );
  }

  return (
    <Card className={ROW_CLASS} role="group" aria-disabled="true" tabIndex={-1}>
      {body}
    </Card>
  );
};

export const CommunitySection: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();

  return (
    <section aria-labelledby="community-title" className="content-auto-community">
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
              <CommunityCard key={link.id} link={link} theme={theme} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
