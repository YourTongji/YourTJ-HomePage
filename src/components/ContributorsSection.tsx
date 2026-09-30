import React from 'react';
import { useI18n } from '../i18n';
import { useTheme } from '../hooks/useTheme';
import { LightRays } from './LightRays';
import { ShinyText } from './ShinyText';
import { LogoLoop, type LogoItem } from './LogoLoop';
import { Reveal } from './Reveal';
import { ArrowUpRightIcon, GithubIcon } from './icons';

interface Committer {
  login: string;
  name: string;
  avatar: string;
  htmlUrl: string;
  contributions?: number;
}

/**
 * Filtered committers from https://github.com/YourTongji/YourTJ-Hub
 * Bots (dependabot, github-actions, etc.) are excluded.
 */
const COMMITTERS: Committer[] = [
  {
    login: 'yzxoi',
    name: 'yzxoi',
    avatar: 'https://avatars.githubusercontent.com/u/46484956?v=4',
    htmlUrl: 'https://github.com/yzxoi',
    contributions: 1002,
  },
  {
    login: 'WALKERKILLER',
    name: 'WALKERKILLER',
    avatar: 'https://avatars.githubusercontent.com/u/189623296?v=4',
    htmlUrl: 'https://github.com/WALKERKILLER',
    contributions: 245,
  },
  {
    login: 'HalfAnElephant',
    name: 'HalfAnElephant',
    avatar: 'https://avatars.githubusercontent.com/u/67222274?v=4',
    htmlUrl: 'https://github.com/HalfAnElephant',
    contributions: 200,
  },
  {
    login: 'oierxjn',
    name: 'oierxjn',
    avatar: 'https://avatars.githubusercontent.com/u/119778255?v=4',
    htmlUrl: 'https://github.com/oierxjn',
    contributions: 119,
  },
  {
    login: 'Pengyiyan0411',
    name: 'Pengyiyan0411',
    avatar: 'https://avatars.githubusercontent.com/u/180716751?v=4',
    htmlUrl: 'https://github.com/Pengyiyan0411',
    contributions: 13,
  },
  {
    login: 'Ricepies',
    name: 'Ricepies',
    avatar: 'https://avatars.githubusercontent.com/u/89736158?v=4',
    htmlUrl: 'https://github.com/Ricepies',
    contributions: 11,
  },
  {
    login: 'wendaining',
    name: 'wendaining',
    avatar: 'https://avatars.githubusercontent.com/u/182899058?v=4',
    htmlUrl: 'https://github.com/wendaining',
    contributions: 10,
  },
  {
    login: 'pyz2190',
    name: 'pyz2190',
    avatar: 'https://avatars.githubusercontent.com/u/220479871?v=4',
    htmlUrl: 'https://github.com/pyz2190',
    contributions: 5,
  },
  {
    login: 'TTAWDTT',
    name: 'TTAWDTT',
    avatar: 'https://avatars.githubusercontent.com/u/201120162?v=4',
    htmlUrl: 'https://github.com/TTAWDTT',
    contributions: 3,
  },
  {
    login: 'Traveritas',
    name: 'Traveritas',
    avatar: 'https://avatars.githubusercontent.com/u/180509376?v=4',
    htmlUrl: 'https://github.com/Traveritas',
    contributions: 1,
  },
  {
    login: 'TrueEway',
    name: 'TrueEway',
    avatar: 'https://avatars.githubusercontent.com/u/156947530?v=4',
    htmlUrl: 'https://github.com/TrueEway',
    contributions: 1,
  },
];

export const ContributorsSection: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Map committers into LogoLoop items with refined concentric avatar containers
  const committerItems: LogoItem[] = React.useMemo(
    () =>
      COMMITTERS.map((c) => ({
        title: c.name,
        href: c.htmlUrl,
        ariaLabel: `${c.name} on GitHub`,
        node: (
          <div className="group/committer relative flex items-center gap-2.5 rounded-full border border-edge/80 bg-surface/70 py-1.5 pl-1.5 pr-3.5 shadow-xs backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-surface-raised hover:shadow-lift active:scale-[0.96]">
            {/* Concentric circular avatar container with zero distortion */}
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge/90 bg-surface-subtle overflow-hidden">
              <img
                src={import.meta.env.DEV ? c.avatar : `/.netlify/images?url=${encodeURIComponent(c.avatar)}&w=64&h=64&fit=cover&q=85`}
                alt={c.name}
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover block"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Committer Name & Link Arrow */}
            <div className="flex items-center gap-1 min-w-0">
              <span className="truncate text-xs sm:text-sm font-medium tracking-tight text-primary transition-colors group-hover/committer:text-accent">
                {c.name}
              </span>
              <ArrowUpRightIcon className="h-3 w-3 shrink-0 text-tertiary transition-transform duration-200 group-hover/committer:translate-x-0.5 group-hover/committer:-translate-y-0.5 group-hover/committer:text-primary" />
            </div>
          </div>
        ),
      })),
    []
  );

  return (
    <section
      id="contributors"
      aria-labelledby="contributors-title"
      className="scroll-mt-24 relative pt-6 pb-16 sm:pt-8 sm:pb-24"
    >
      {/*
        Spotlight LightRays (React Bits):
        Positioned strictly below AppDownloadSection (top-0 within ContributorsSection).
        Faded seamlessly at the top edge (starting at transparent 0%) and internal 4-sided
        shader smoothstep feathering, eliminating any straight lines, mask seams, or cutoffs.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 bottom-0 z-0 overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 18%, black 36%, black 72%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 18%, black 36%, black 72%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        <LightRays
          raysOrigin="top-center"
          raysColor={isDark ? '#72f0a6' : '#38bdf8'}
          raysSpeed={1.0}
          lightSpread={0.9}
          rayLength={2.0}
          fadeDistance={1.3}
          followMouse={true}
          mouseInfluence={0.12}
          distortion={0.04}
          noiseAmount={0.03}
          className={`w-full h-full transition-all duration-500 ${
            isDark ? 'opacity-85 mix-blend-screen' : 'opacity-80 mix-blend-normal'
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-page px-4 sm:px-6">
        {/* Soft Organic Atmospheric Glow: Sky goose blue in light mode, aurora mint in dark mode */}
        <div
          className="pointer-events-none mx-auto flex items-center justify-center mb-4 sm:mb-6"
          aria-hidden="true"
        >
          <div
            className={`h-16 w-56 sm:w-80 rounded-full blur-3xl transition-all duration-500 ${
              isDark
                ? 'bg-emerald-400/20 shadow-[0_0_60px_rgba(114,240,166,0.25)]'
                : 'bg-sky-300/30 shadow-[0_0_70px_rgba(56,189,248,0.35)]'
            }`}
          />
        </div>
        {/* Section Header: Pure, clean typography without clunky badge */}
        <Reveal className="text-center mx-auto max-w-2xl">
          <h2
            id="contributors-title"
            className="text-2xl font-bold tracking-tight text-primary md:text-3xl lg:text-4xl"
          >
            {t('contributors.title')}
          </h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-secondary text-pretty">
            {t('contributors.desc')}
          </p>
        </Reveal>

        {/* Horizontal Marquee Loop of Committers: Fully integrated with transparent mask */}
        <div className="mt-8 relative w-full overflow-hidden">
          <LogoLoop
            logos={committerItems}
            speed={36}
            direction="left"
            gap={16}
            logoHeight={42}
            pauseOnHover={true}
            hoverSpeed={8}
            fadeOut={true}
            ariaLabel="YourTJ-Hub committers"
            className="w-full py-1"
          />
        </div>

        {/* Special With Synergy Showcase: "with" in a delicate ShinyText shimmer, followed by Synergy card */}
        <Reveal delay={100} className="mt-8 mx-auto max-w-xl flex flex-col items-center">
          {/* Row 1: "with" using ShinyText from React Bits */}
          <div className="flex justify-center items-center mb-2.5">
            <ShinyText
              text="with"
              speed={2.6}
              delay={1.2}
              spread={100}
              color={isDark ? '#9ca3af' : '#525252'}
              shineColor={isDark ? '#ffffff' : '#0a0a0a'}
              pauseOnHover={true}
              className="text-xs sm:text-[13px] font-mono font-medium tracking-widest lowercase select-none"
            />
          </div>

          {/* Row 2: Synergy Card */}
          <a
            href="https://github.com/SII-Holos/synergy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Synergy - Autonomous Software Development by SII-Holos"
            className="glass-card group w-full relative flex items-center justify-between gap-4 rounded-2xl border border-edge/80 bg-surface/60 p-3.5 sm:p-4 shadow-lift backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-xl active:scale-[0.98]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Synergy Agent Avatar: clean concentric rounded-xl, no AI badge */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-edge/80 bg-surface-subtle p-0.5 shadow-xs transition-transform duration-200 group-hover:scale-105">
                <img
                  src="https://github.com/synergy-agent.png"
                  alt="Synergy Agent"
                  width={44}
                  height={44}
                  className="h-full w-full rounded-[10px] object-cover block"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Title and Tagline */}
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-semibold tracking-tight text-primary">
                    Synergy
                  </span>
                  <span className="inline-flex items-center rounded-md border border-edge/70 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                    SII-Holos
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-secondary truncate">
                  {t('contributors.synergy.desc')}
                </p>
              </div>
            </div>

            {/* Action link */}
            <span className="inline-flex items-center gap-1.5 shrink-0 rounded-xl border border-edge/80 bg-surface-raised/90 px-3 py-1.5 text-xs font-medium text-secondary transition-all duration-200 group-hover:border-edge-strong group-hover:text-primary">
              <GithubIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">SII-Holos / synergy</span>
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default ContributorsSection;
