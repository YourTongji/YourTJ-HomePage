import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AppDevice } from '../app-preview/AppDevice';
import { screenById, type AppScreenId } from '../app-preview/screens/registry';
import { BottomNav, Fab, ComposeMenu } from '../app-preview/screens/Home';
import { DEVICE_H, DEVICE_W, SW } from '../app-preview/ui/Phone';
import { AccountDrawer } from '../app-preview/ui/AccountDrawer';
import { useFitScale } from '../app-preview/useFitScale';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { BrandMotionLogo } from './BrandMotionLogo';
import { ActivityIcon, FileTextIcon, PhoneIcon } from './icons';
import { MistBackground } from './MistBackground';
import { ProductEntries } from './ProductEntries';
import { TechText } from './TechText';
import { SpecularButton } from './SpecularButton';

gsap.registerPlugin(useGSAP);

/**
 * The shell's four branches, in GfShellDestination's order (router.dart):
 * `/` HomePage, `/campus` CampusPage, `/messages` MessagesPage, `/profile`
 * ProfilePage. Each id below is that page and nothing else — 消息 is the
 * conversation list, not the thread it pushes, and 我的 is the viewer's own
 * profile, not the one the `/u/:userId` route shows.
 *
 * The hero, rather than the page, owns the nav because the shell does: the app
 * keeps one `GfBottomNavigation` on screen across a branch switch
 * (StatefulShellRoute), so the mock draws it as an overlay the branch content
 * changes under, exactly like the shell's Scaffold — and a pushed route
 * (a thread, someone else's profile) would be drawn by that page instead.
 */
const SHELL_SCREENS: AppScreenId[] = ['home', 'campus', 'notifications', 'messages'];

/** HomePage hangs the publish FAB off the home branch. */
const SHELL_FAB_BRANCH = 0;

/**
 * The app, in a real device, as the hero's visual.
 *
 * This replaces the card that used to sit here wearing a "coming soon" veil.
 * The app is downloadable now, so the honest hero visual is the app itself: the
 * actual home feed, rendered from the same components the promo film used, in
 * the same device frame. Two small motions keep it alive without turning the
 * hero into a demo: a slow float (CSS, so it costs nothing on the main thread)
 * and a pointer tilt that answers the cursor on precise pointers only.
 *
 * The bottom nav is live. Tapping a key switches the branch above it the way the
 * real shell does (`StatefulShellRoute` + `GfBottomNavigation`), and the nav is
 * drawn by this component rather than by each page so that it persists across
 * the switch instead of unmounting with the screen.
 */
const HeroDevice: React.FC = () => {
  const stageHostRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(stageHostRef, DEVICE_W, DEVICE_H, { max: 0.72, min: 0.3 });
  const tiltRef = useRef<HTMLDivElement>(null);
  const [shellIndex, setShellIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const entry = screenById(SHELL_SCREENS[shellIndex]);

  useGSAP(
    () => {
      const host = stageHostRef.current;
      const tiltTarget = tiltRef.current;
      if (!host || !tiltTarget) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      if (reduceMotion || !finePointer) return;

      const rotateY = gsap.quickTo(tiltTarget, 'rotationY', { duration: 0.7, ease: 'power3.out' });
      const rotateX = gsap.quickTo(tiltTarget, 'rotationX', { duration: 0.7, ease: 'power3.out' });

      const onPointerMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
        const vertical = (event.clientY - rect.top) / rect.height - 0.5;
        rotateY(horizontal * 13);
        rotateX(vertical * -9);
      };

      const onPointerLeave = () => {
        rotateY(0);
        rotateX(0);
      };

      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerleave', onPointerLeave);
      return () => {
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerleave', onPointerLeave);
      };
    },
    { dependencies: [scale] },
  );

  return (
    <div
      ref={stageHostRef}
      className="flex h-[clamp(430px,62vh,620px)] w-full items-center justify-center"
      style={{ perspective: 1400 }}
    >
      <div
        style={{
          position: 'relative',
          width: DEVICE_W * scale,
          height: DEVICE_H * scale,
        }}
      >
        <div
          ref={tiltRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: DEVICE_W,
            height: DEVICE_H,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <div className="device-float h-full w-full">
            <AppDevice
              entry={entry}
              screenWidth={SW}
              glare
              renderOptions={{
                shellNav: true,
                onOpenDrawer: () => {
                  setDrawerOpen(true);
                  setComposeOpen(false);
                },
              }}
              // The shell's branch content cross-fades on switch; the nav
              // (drawn as an overlay) stays put.
              screenClassName="motion-safe:animate-fade-up"
              overlay={
                <>
                  {/*
                    The shell's own Scaffold hangs a publish FAB off the home
                    branch (router.dart). Tapping it opens the 3 publishing formats menu
                    replicated 1:1 from Flutter's compose_menu.dart.
                  */}
                  {shellIndex === SHELL_FAB_BRANCH && (
                    <>
                      <Fab
                        open={composeOpen ? 1 : 0}
                        onClick={() => setComposeOpen((prev) => !prev)}
                      />
                      <ComposeMenu
                        open={composeOpen}
                        onClose={() => setComposeOpen(false)}
                      />
                    </>
                  )}
                  <BottomNav
                    active={shellIndex}
                    onSelect={(idx) => {
                      setShellIndex(idx);
                      setComposeOpen(false);
                    }}
                  />
                  <AccountDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();

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

          <div className="hidden lg:block motion-safe:animate-fade-up [animation-delay:220ms]">
            <HeroDevice />
          </div>
        </div>
      </div>
    </section>
  );
};
