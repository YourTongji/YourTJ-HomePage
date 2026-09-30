import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { BrandMotionLogo } from './BrandMotionLogo';
import { ActivityIcon, FileTextIcon, PhoneIcon } from './icons';
import { MistBackground } from './MistBackground';
import { ProductEntries } from './ProductEntries';
import { TechText } from './TechText';
import { SpecularButton } from './SpecularButton';

gsap.registerPlugin(useGSAP);

const DeferredHeroDevice = React.lazy(() =>
  import('./HeroDevice').then(({ HeroDevice }) => ({ default: HeroDevice })),
);

export const Hero: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const brandLockupRef = useRef<HTMLDivElement>(null);
  const logoHostRef = useRef<HTMLDivElement>(null);
  const wordmarkHostRef = useRef<HTMLDivElement>(null);
  const [logoReplayKey, setLogoReplayKey] = useState(0);

  const triggerRoll = () => {
    const logo = logoHostRef.current;
    const wordmark = wordmarkHostRef.current;
    if (!logo || !wordmark) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set([logo, wordmark], { x: 0, rotation: 0, opacity: 1, scale: 1 });
      return;
    }

    setLogoReplayKey((k) => k + 1);

    const isMobile = window.innerWidth < 640;
    const startX = isMobile ? -140 : -220;
    const startRot = isMobile ? -360 : -450;

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // Logo rolls in from left with elastic settle
    tl.fromTo(
      logo,
      {
        x: startX,
        rotation: startRot,
        opacity: 0,
        scale: 0.8,
      },
      {
        x: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        duration: 1.35,
        ease: 'elastic.out(1.08, 0.46)',
      }
    );

    // Wordmark receives the impact as the logo reaches x=0 and docks
    tl.fromTo(
      wordmark,
      {
        opacity: 0,
        x: -16,
      },
      {
        opacity: 1,
        x: 8,
        duration: 0.16,
        ease: 'power2.out',
      },
      0.32
    ).to(
      wordmark,
      {
        x: 0,
        duration: 0.65,
        ease: 'elastic.out(1.2, 0.38)',
      },
      '>'
    );
  };

  useGSAP(
    () => {
      triggerRoll();
    },
    { scope: brandLockupRef }
  );

  return (
    <section aria-labelledby="hero-title" className="mist-hero relative overflow-hidden">
      <MistBackground />
      <div aria-hidden="true" className="spectrum-field" />

      <div className="relative z-10 mx-auto max-w-page px-4 sm:px-6">
        <div className="short-safe grid min-h-[calc(100dvh-4.25rem)] items-center gap-10 py-8 md:py-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div className="max-w-[640px]">
            {/* Prominent Brand Lockup: Scaled Rolling Logo + Faster One Typography */}
            <div
              ref={brandLockupRef}
              className="relative mb-4 sm:mb-6 flex items-center gap-3.5 sm:gap-5 overflow-visible select-none"
            >
              {/* Rolling Brand Logo from logo_motion_package/exports */}
              <div
                ref={logoHostRef}
                className="relative z-10 shrink-0 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
              >
                <BrandMotionLogo
                  replayKey={logoReplayKey}
                  onClick={triggerRoll}
                  className="h-full w-full"
                />
              </div>

              {/* YourTJ Wordmark with pure CSS theme responsiveness */}
              <div
                ref={wordmarkHostRef}
                className="font-brand text-[44px] leading-none tracking-normal sm:text-[58px] md:text-[72px]"
              >
                <span className="text-primary transition-colors duration-200">Your</span>
                <span className="text-link transition-colors duration-200">TJ</span>
              </div>
            </div>

            {/* Semantic H1 for SEO & A11y */}
            <h1 id="hero-title" className="sr-only">
              {t('hero.headline.1')} {t('hero.headline.2')}
            </h1>

            {/* Interactive TechText headline: 连接校园，也连接每一种可能 */}
            <div
              aria-hidden="true"
              className="relative h-[96px] sm:h-[120px] md:h-[140px] w-full max-w-[380px] sm:max-w-[480px] md:max-w-[560px] overflow-visible select-none motion-safe:animate-fade-up [animation-delay:80ms]"
            >
              <TechText
                lines={[t('hero.headline.1'), t('hero.headline.2')]}
                fontSize={46}
                lineGap={10}
                bleed={120}
                fontFamily='system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'
                fontWeight={600}
                color={theme === 'dark' ? '#f4f4f5' : '#18181b'}
                accentColor={theme === 'dark' ? '#18c967' : '#096a39'}
                reveal="letter"
                lineStyle="dashed"
                specks={14}
                selection={true}
                labels={true}
                draggable={true}
                sweep={true}
                sweepDirection="ltr"
                speed={0.65}
                align="left"
                padLeft={4}
                className="h-full w-full overflow-visible"
              />
            </div>

            {/* The app is installable now, so the hero's entry is a real action. */}
            <div className="mt-6 sm:mt-7 flex flex-row flex-nowrap items-stretch sm:items-center gap-1.5 sm:gap-3 w-full sm:w-auto motion-safe:animate-fade-up [animation-delay:140ms]">
              <SpecularButton
                href="#download"
                size="sm"
                radius={10}
                tint={theme === 'dark' ? '#18c967' : '#10b981'}
                tintOpacity={theme === 'dark' ? 0.22 : 0.14}
                blur={10}
                textColor={theme === 'dark' ? '#f4f4f5' : '#075e31'}
                lineColor={theme === 'dark' ? '#72f0a6' : '#10b981'}
                baseColor={theme === 'dark' ? '#0f766e' : '#a7f3d0'}
                intensity={1.2}
                proximity={240}
                className="flex-1 sm:flex-initial min-w-0 justify-center h-10 sm:h-11 !px-2.5 sm:!px-5 font-semibold text-xs sm:text-sm shadow-xs"
              >
                <PhoneIcon className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate whitespace-nowrap">{t('app.cta')}</span>
              </SpecularButton>
              <SpecularButton
                href="https://status.yourtj.de"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                radius={10}
                tint={theme === 'dark' ? '#27272a' : '#ffffff'}
                tintOpacity={theme === 'dark' ? 0.35 : 0.65}
                blur={8}
                textColor={theme === 'dark' ? '#d4d4d8' : '#525252'}
                lineColor={theme === 'dark' ? '#72f0a6' : '#10b981'}
                baseColor={theme === 'dark' ? '#3f3f46' : '#e4e4e7'}
                intensity={0.95}
                proximity={220}
                className="flex-1 sm:flex-initial min-w-0 justify-center h-10 sm:h-11 !px-2 sm:!px-4 text-xs sm:text-sm font-medium shadow-xs"
              >
                <ActivityIcon className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-75 shrink-0" />
                <span className="truncate whitespace-nowrap">{t('hero.status')}</span>
              </SpecularButton>
              <SpecularButton
                href="https://docs.yourtj.de"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                radius={10}
                tint={theme === 'dark' ? '#27272a' : '#ffffff'}
                tintOpacity={theme === 'dark' ? 0.35 : 0.65}
                blur={8}
                textColor={theme === 'dark' ? '#d4d4d8' : '#525252'}
                lineColor={theme === 'dark' ? '#72f0a6' : '#10b981'}
                baseColor={theme === 'dark' ? '#3f3f46' : '#e4e4e7'}
                intensity={0.95}
                proximity={220}
                className="flex-1 sm:flex-initial min-w-0 justify-center h-10 sm:h-11 !px-2 sm:!px-4 text-xs sm:text-sm font-medium shadow-xs"
              >
                <FileTextIcon className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-75 shrink-0" />
                <span className="truncate whitespace-nowrap">{t('hero.docs')}</span>
              </SpecularButton>
            </div>

            <div className="mt-8">
              <ProductEntries />
            </div>
          </div>

          {isDesktop && (
            <div className="hidden lg:block motion-safe:animate-fade-up [animation-delay:220ms]">
              <React.Suspense fallback={<div aria-hidden="true" className="h-[clamp(430px,62vh,620px)] w-full" />}>
                <DeferredHeroDevice />
              </React.Suspense>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
