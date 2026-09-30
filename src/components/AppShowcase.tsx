import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AppDevice } from '../app-preview/AppDevice';
import { APP_SCREENS, APP_SCREEN_COUNT, screenAt } from '../app-preview/screens/registry';
import { DEVICE_BEZEL, DEVICE_H, DEVICE_RADIUS, DEVICE_W, SW } from '../app-preview/ui/Phone';
import { useFitScale } from '../app-preview/useFitScale';
import { prefersReducedMotion, useMediaQuery } from '../hooks/useMediaQuery';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../i18n';
import { FolderFloat } from './FolderFloat';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Reveal } from './Reveal';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * Fan geometry. The whole arrangement is authored in fixed design boxes and
 * scaled to fit (see useFitScale), which lets three live device renders
 * hold their proportions from a 360px mobile screen to a 1600px desktop display
 * without per-element CSS media-query hacks.
 *
 * The placement follows the reference the brief pointed at: the centre
 * device stands upright and slightly proud, the two flanking devices tuck a
 * little under it, sit a touch lower, and rotate outward around their bottom
 * edge. Rotation around the bottom edge (not the centre) is the detail that
 * makes the trio read as standing on a surface instead of spinning in space.
 */
const deviceSize = (screenWidth: number) => ({
  width: (screenWidth / SW) * DEVICE_W,
  height: (screenWidth / SW) * DEVICE_H,
});

type SlotRole = 'previous' | 'active' | 'next';

interface FanSlot {
  role: SlotRole;
  left: number;
  top: number;
  width: number;
  height: number;
  screenWidth: number;
  rotation: number;
  zIndex: number;
  /** How far the slot's screen is offset from the active one. */
  offset: number;
}

/* --- Desktop Fan (>= 1024px) --- */
const FAN_WIDTH = 1000;
const FAN_HEIGHT = 760;
const FAN_BOTTOM_AIR = 26;
const CENTER_SCREEN_WIDTH = 320;
const SIDE_SCREEN_WIDTH = 270;
const SIDE_ROTATION = 5.2;
const SIDE_TUCK = 56;
const SIDE_DROP = 26;

const CENTER_SIZE = deviceSize(CENTER_SCREEN_WIDTH);
const SIDE_SIZE = deviceSize(SIDE_SCREEN_WIDTH);
const CENTER_TOP = FAN_HEIGHT - FAN_BOTTOM_AIR - CENTER_SIZE.height;
const CENTER_LEFT = (FAN_WIDTH - CENTER_SIZE.width) / 2;
const SIDE_TOP = CENTER_TOP + (CENTER_SIZE.height - SIDE_SIZE.height) / 2 + SIDE_DROP;
const SIDE_LEFT = CENTER_LEFT + SIDE_TUCK - SIDE_SIZE.width;
const SIDE_RIGHT_LEFT = CENTER_LEFT + CENTER_SIZE.width - SIDE_TUCK;

const FAN_SLOTS: FanSlot[] = [
  {
    role: 'previous',
    left: SIDE_LEFT,
    top: SIDE_TOP,
    ...SIDE_SIZE,
    screenWidth: SIDE_SCREEN_WIDTH,
    rotation: -SIDE_ROTATION,
    zIndex: 1,
    offset: -1,
  },
  {
    role: 'active',
    left: CENTER_LEFT,
    top: CENTER_TOP,
    ...CENTER_SIZE,
    screenWidth: CENTER_SCREEN_WIDTH,
    rotation: 0,
    zIndex: 2,
    offset: 0,
  },
  {
    role: 'next',
    left: SIDE_RIGHT_LEFT,
    top: SIDE_TOP,
    ...SIDE_SIZE,
    screenWidth: SIDE_SCREEN_WIDTH,
    rotation: SIDE_ROTATION,
    zIndex: 1,
    offset: 1,
  },
];

/* --- Tablet Fan (640px .. 1023px) --- */
const TABLET_FAN_WIDTH = 700;
const TABLET_FAN_HEIGHT = 630;
const TABLET_CENTER_SCREEN_WIDTH = 270;
const TABLET_SIDE_SCREEN_WIDTH = 225;
const TABLET_SIDE_ROTATION = 4.6;
const TABLET_SIDE_TUCK = 52;
const TABLET_SIDE_DROP = 24;

const TABLET_CENTER_SIZE = deviceSize(TABLET_CENTER_SCREEN_WIDTH);
const TABLET_SIDE_SIZE = deviceSize(TABLET_SIDE_SCREEN_WIDTH);
const TABLET_CENTER_TOP = TABLET_FAN_HEIGHT - 18 - TABLET_CENTER_SIZE.height;
const TABLET_CENTER_LEFT = (TABLET_FAN_WIDTH - TABLET_CENTER_SIZE.width) / 2;
const TABLET_SIDE_TOP = TABLET_CENTER_TOP + (TABLET_CENTER_SIZE.height - TABLET_SIDE_SIZE.height) / 2 + TABLET_SIDE_DROP;
const TABLET_SIDE_LEFT = TABLET_CENTER_LEFT + TABLET_SIDE_TUCK - TABLET_SIDE_SIZE.width;
const TABLET_SIDE_RIGHT_LEFT = TABLET_CENTER_LEFT + TABLET_CENTER_SIZE.width - TABLET_SIDE_TUCK;

const TABLET_FAN_SLOTS: FanSlot[] = [
  {
    role: 'previous',
    left: TABLET_SIDE_LEFT,
    top: TABLET_SIDE_TOP,
    ...TABLET_SIDE_SIZE,
    screenWidth: TABLET_SIDE_SCREEN_WIDTH,
    rotation: -TABLET_SIDE_ROTATION,
    zIndex: 1,
    offset: -1,
  },
  {
    role: 'active',
    left: TABLET_CENTER_LEFT,
    top: TABLET_CENTER_TOP,
    ...TABLET_CENTER_SIZE,
    screenWidth: TABLET_CENTER_SCREEN_WIDTH,
    rotation: 0,
    zIndex: 2,
    offset: 0,
  },
  {
    role: 'next',
    left: TABLET_SIDE_RIGHT_LEFT,
    top: TABLET_SIDE_TOP,
    ...TABLET_SIDE_SIZE,
    screenWidth: TABLET_SIDE_SCREEN_WIDTH,
    rotation: TABLET_SIDE_ROTATION,
    zIndex: 1,
    offset: 1,
  },
];

/* --- Mobile Peek Fan (< 640px) --- */
const MOBILE_FAN_WIDTH = 360;
const MOBILE_FAN_HEIGHT = 540;
const MOBILE_CENTER_SCREEN_WIDTH = 236;
const MOBILE_SIDE_SCREEN_WIDTH = 186;
const MOBILE_SIDE_ROTATION = 3.8;

const MOBILE_CENTER_SIZE = deviceSize(MOBILE_CENTER_SCREEN_WIDTH);
const MOBILE_SIDE_SIZE = deviceSize(MOBILE_SIDE_SCREEN_WIDTH);
const MOBILE_CENTER_TOP = 6;
const MOBILE_CENTER_LEFT = (MOBILE_FAN_WIDTH - MOBILE_CENTER_SIZE.width) / 2;
const MOBILE_SIDE_TOP = 72;
const MOBILE_SIDE_LEFT = 6;
const MOBILE_SIDE_RIGHT_LEFT = MOBILE_FAN_WIDTH - 6 - MOBILE_SIDE_SIZE.width;

const MOBILE_FAN_SLOTS: FanSlot[] = [
  {
    role: 'previous',
    left: MOBILE_SIDE_LEFT,
    top: MOBILE_SIDE_TOP,
    ...MOBILE_SIDE_SIZE,
    screenWidth: MOBILE_SIDE_SCREEN_WIDTH,
    rotation: -MOBILE_SIDE_ROTATION,
    zIndex: 1,
    offset: -1,
  },
  {
    role: 'active',
    left: MOBILE_CENTER_LEFT,
    top: MOBILE_CENTER_TOP,
    ...MOBILE_CENTER_SIZE,
    screenWidth: MOBILE_CENTER_SCREEN_WIDTH,
    rotation: 0,
    zIndex: 2,
    offset: 0,
  },
  {
    role: 'next',
    left: MOBILE_SIDE_RIGHT_LEFT,
    top: MOBILE_SIDE_TOP,
    ...MOBILE_SIDE_SIZE,
    screenWidth: MOBILE_SIDE_SCREEN_WIDTH,
    rotation: MOBILE_SIDE_ROTATION,
    zIndex: 1,
    offset: 1,
  },
];

interface MacaronTheme {
  color: string;
  lightBg: string;
  lightBorder: string;
  lightInk: string;
  darkBg: string;
  darkBorder: string;
  darkInk: string;
  glow: string;
}

const MACARON_THEMES: Record<string, MacaronTheme> = {
  home: {
    color: '#0284c7',
    lightBg: '#f0f9ff',
    lightBorder: '#bae6fd',
    lightInk: '#0369a1',
    darkBg: 'rgba(56, 189, 248, 0.18)',
    darkBorder: '#38bdf8',
    darkInk: '#bae6fd',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  course: {
    color: '#d97706',
    lightBg: '#fffbeb',
    lightBorder: '#fde68a',
    lightInk: '#92400e',
    darkBg: 'rgba(245, 158, 11, 0.18)',
    darkBorder: '#fbbf24',
    darkInk: '#fde68a',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  campus: {
    color: '#059669',
    lightBg: '#ecfdf5',
    lightBorder: '#a7f3d0',
    lightInk: '#047857',
    darkBg: 'rgba(52, 211, 153, 0.18)',
    darkBorder: '#34d399',
    darkInk: '#a7f3d0',
    glow: 'rgba(52, 211, 153, 0.35)',
  },
  topic: {
    color: '#7c3aed',
    lightBg: '#f5f3ff',
    lightBorder: '#ddd6fe',
    lightInk: '#6d28d9',
    darkBg: 'rgba(167, 139, 250, 0.18)',
    darkBorder: '#a78bfa',
    darkInk: '#ddd6fe',
    glow: 'rgba(167, 139, 250, 0.35)',
  },
  wiki: {
    color: '#0d9488',
    lightBg: '#f0fdfa',
    lightBorder: '#99f6e4',
    lightInk: '#0f766e',
    darkBg: 'rgba(45, 212, 191, 0.18)',
    darkBorder: '#2dd4bf',
    darkInk: '#99f6e4',
    glow: 'rgba(45, 212, 191, 0.35)',
  },
  notifications: {
    color: '#ea580c',
    lightBg: '#fff7ed',
    lightBorder: '#fed7aa',
    lightInk: '#c2410c',
    darkBg: 'rgba(251, 146, 60, 0.18)',
    darkBorder: '#fb923c',
    darkInk: '#fed7aa',
    glow: 'rgba(251, 146, 60, 0.35)',
  },
  messages: {
    color: '#e11d48',
    lightBg: '#fff1f2',
    lightBorder: '#fecdd3',
    lightInk: '#be123c',
    darkBg: 'rgba(244, 63, 94, 0.18)',
    darkBorder: '#f43f5e',
    darkInk: '#fecdd3',
    glow: 'rgba(244, 63, 94, 0.35)',
  },
  composer: {
    color: '#4f46e5',
    lightBg: '#eef2ff',
    lightBorder: '#c7d2fe',
    lightInk: '#4338ca',
    darkBg: 'rgba(129, 140, 248, 0.18)',
    darkBorder: '#818cf8',
    darkInk: '#c7d2fe',
    glow: 'rgba(129, 140, 248, 0.35)',
  },
  chat: {
    color: '#c026d3',
    lightBg: '#fdf4ff',
    lightBorder: '#f5d0fe',
    lightInk: '#a21caf',
    darkBg: 'rgba(232, 121, 249, 0.18)',
    darkBorder: '#e879f9',
    darkInk: '#f5d0fe',
    glow: 'rgba(232, 121, 249, 0.35)',
  },
  profile: {
    color: '#65a30d',
    lightBg: '#f7fee7',
    lightBorder: '#d9f99d',
    lightInk: '#4d7c0f',
    darkBg: 'rgba(163, 230, 53, 0.18)',
    darkBorder: '#a3e635',
    darkInk: '#d9f99d',
    glow: 'rgba(163, 230, 53, 0.35)',
  },
  widgets: {
    color: '#006c4c',
    lightBg: '#ecfdf5',
    lightBorder: '#a7f3d0',
    lightInk: '#006c4c',
    darkBg: 'rgba(99, 219, 178, 0.18)',
    darkBorder: '#63dbb2',
    darkInk: '#a7f3d0',
    glow: 'rgba(99, 219, 178, 0.35)',
  },
};

const DEFAULT_MACARON: MacaronTheme = {
  color: '#0284c7',
  lightBg: '#f0f9ff',
  lightBorder: '#bae6fd',
  lightInk: '#0369a1',
  darkBg: 'rgba(56, 189, 248, 0.18)',
  darkBorder: '#38bdf8',
  darkInk: '#bae6fd',
  glow: 'rgba(56, 189, 248, 0.35)',
};

export const AppShowcase: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const previousIndexRef = useRef(0);
  const scopeRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const [folderOpen, setFolderOpen] = useState(false);

  const folderItems = APP_SCREENS.map((entry) => {
    const macaron = MACARON_THEMES[entry.id] ?? DEFAULT_MACARON;
    return {
      label: t(entry.labelKey),
      value: entry.id,
      icon: <entry.Icon className="h-3.5 w-3.5 stroke-[2]" />,
      ...macaron,
    };
  });

  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isCompact = !useMediaQuery('(min-width: 1024px)');

  const stageWidth = isMobile ? MOBILE_FAN_WIDTH : isTablet ? TABLET_FAN_WIDTH : FAN_WIDTH;
  const stageHeight = isMobile ? MOBILE_FAN_HEIGHT : isTablet ? TABLET_FAN_HEIGHT : FAN_HEIGHT;
  const slots = isMobile ? MOBILE_FAN_SLOTS : isTablet ? TABLET_FAN_SLOTS : FAN_SLOTS;

  const stageHostRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(stageHostRef, stageWidth, stageHeight, {
    max: 1,
    min: 0.35,
  });

  const activeEntry = screenAt(activeIndex);

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % APP_SCREEN_COUNT) + APP_SCREEN_COUNT) % APP_SCREEN_COUNT);
  }, []);

  const tiltRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (isCompact && tabItemRefs.current[activeIndex] && tabListRef.current) {
      const container = tabListRef.current;
      const item = tabItemRefs.current[activeIndex];
      if (item) {
        const offset = item.offsetLeft - (container.clientWidth - item.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, offset),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }
    }
  }, [activeIndex, isCompact]);

  /* Entrance: the fan assembles once, when the section first comes into view. */
  useGSAP(
    (_context, contextSafe) => {
      const host = scopeRef.current;
      const motionElements = gsap.utils.toArray<HTMLElement>('.fan-device');
      if (!host || motionElements.length === 0) return;

      if (isCompact) {
        gsap.set(motionElements, { autoAlpha: 1, y: 0, scale: 1, rotation: 0 });
        return;
      }

      // ScrollTrigger: release pills on entering, stow only when scrolling down past the section, spit out on scroll back
      const st = ScrollTrigger.create({
        trigger: host,
        start: 'top 75%',
        end: 'bottom 15%',
        onEnter: () => setFolderOpen(true),
        onLeave: () => setFolderOpen(false),
        onEnterBack: () => setFolderOpen(true),
        onLeaveBack: () => setFolderOpen(false),
      });

      if (st.isActive) {
        setFolderOpen(true);
      }

      const restingRotations = slots.map((slot) => slot.rotation);
      const settle = () => {
        gsap.to(motionElements, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotation: (index) => restingRotations[index] ?? 0,
          duration: 0.95,
          ease: 'power3.out',
          stagger: { each: 0.08, from: 'center' },
          overwrite: 'auto',
        });
      };

      if (prefersReducedMotion()) {
        gsap.set(motionElements, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotation: (index) => restingRotations[index] ?? 0,
        });
        return;
      }

      gsap.set(motionElements, { autoAlpha: 0, y: 58, scale: 0.95, rotation: 0 });

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          contextSafe?.(settle)();
          observer.disconnect();
        },
        { threshold: 0.06, rootMargin: '0px 0px -2% 0px' },
      );

      observer.observe(host);

      // Desktop subtle mouse parallax
      const stage = stageHostRef.current;
      const tiltTarget = tiltRef.current;
      if (!isCompact && stage && tiltTarget && window.matchMedia('(pointer: fine)').matches) {
        const rotateY = gsap.quickTo(tiltTarget, 'rotationY', { duration: 0.8, ease: 'power3.out' });
        const rotateX = gsap.quickTo(tiltTarget, 'rotationX', { duration: 0.8, ease: 'power3.out' });

        const onPointerMove = (event: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
          const vertical = (event.clientY - rect.top) / rect.height - 0.5;
          rotateY(horizontal * 8);
          rotateX(vertical * -5);
        };

        const onPointerLeave = () => {
          rotateY(0);
          rotateX(0);
        };

        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerleave', onPointerLeave);
        return () => {
          observer.disconnect();
          stage.removeEventListener('pointermove', onPointerMove);
          stage.removeEventListener('pointerleave', onPointerLeave);
        };
      }

      return () => observer.disconnect();
    },
    { scope: scopeRef, dependencies: [isMobile, isTablet, isCompact] },
  );

  /*
   * Screen switch. Only the screen layers move: the three device shells stay
   * exactly where they are, so a page change reads as the app doing the work
   * rather than as the page rearranging itself.
   */
  useEffect(() => {
    const previous = previousIndexRef.current;
    previousIndexRef.current = activeIndex;
    if (previous === activeIndex || prefersReducedMotion()) return;

    const forward = activeIndex === (previous + 1) % APP_SCREEN_COUNT;
    const direction = forward ? 1 : -1;

    gsap.fromTo(
      gsap.utils.toArray<HTMLElement>('.fan-screen'),
      { autoAlpha: 0, x: 30 * direction },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.52,
        ease: 'power3.out',
        stagger: { each: 0.05, from: 'center' },
        overwrite: 'auto',
      },
    );

    const captions = gsap.utils.toArray<HTMLElement>('.showcase-caption');
    if (captions.length > 0) {
      gsap.fromTo(
        captions,
        { autoAlpha: 0, x: 16 * direction },
        { autoAlpha: 1, x: 0, duration: 0.42, ease: 'power3.out', overwrite: 'auto' },
      );
    }
  }, [activeIndex]);

  const onTabListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(APP_SCREEN_COUNT - 1);
    }
  };

  const renderPhoneStage = (heightClass: string) => (
    <div
      ref={stageHostRef}
      className={`flex w-full overflow-hidden items-center justify-center ${heightClass}`}
      style={{ perspective: 1400 }}
      onPointerDown={(event) => {
        pointerStartX.current = event.clientX;
        pointerStartY.current = event.clientY;
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return;
        const deltaX = event.clientX - pointerStartX.current;
        const deltaY = event.clientY - (pointerStartY.current ?? event.clientY);
        pointerStartX.current = null;
        pointerStartY.current = null;
        if (Math.abs(deltaX) >= 36 && Math.abs(deltaX) > Math.abs(deltaY)) {
          goTo(activeIndex + (deltaX < 0 ? 1 : -1));
        }
      }}
      onPointerCancel={() => {
        pointerStartX.current = null;
        pointerStartY.current = null;
      }}
    >
      <div
        style={{
          position: 'relative',
          width: stageWidth * scale,
          height: stageHeight * scale,
        }}
      >
        <div
          ref={tiltRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: stageWidth,
            height: stageHeight,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Ambient spotlight behind the phone cluster */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-65 blur-3xl -z-10 ${
              isMobile
                ? 'w-[88%] max-w-[320px] h-[70%]'
                : isTablet
                  ? 'w-[95%] max-w-[560px] h-[80%]'
                  : 'w-[115%] h-[95%]'
            }`}
            style={{
              background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.20) 0%, rgba(147, 51, 234, 0.07) 50%, transparent 70%)',
            }}
          />
          {/* Ground pedestal reflection & shadow line */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 bottom-[14px] -translate-x-1/2 h-[34px] rounded-[100%] opacity-80 ${
              isMobile
                ? 'w-[80%] max-w-[280px]'
                : isTablet
                  ? 'w-[85%] max-w-[540px]'
                  : 'w-[85%] max-w-[840px]'
            }`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.28) 0%, rgba(37, 99, 235, 0.12) 38%, transparent 75%)',
              filter: 'blur(10px)',
            }}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-1/2 bottom-[26px] -translate-x-1/2 h-[1.5px] opacity-60 ${
              isMobile
                ? 'w-[60%] max-w-[200px]'
                : isTablet
                  ? 'w-[60%] max-w-[380px]'
                  : 'w-[60%] max-w-[560px]'
            }`}
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.55) 50%, transparent 100%)',
            }}
          />
          {slots.map((slot) => {
            const entry = screenAt(activeIndex + slot.offset);
            const isActive = slot.role === 'active';
            const bezel = DEVICE_BEZEL * (slot.screenWidth / SW);
            const screenRadius = DEVICE_RADIUS * (slot.screenWidth / SW);
            const isSide = !isActive;

            return (
              <div
                key={slot.role}
                className="fan-device"
                style={{
                  position: 'absolute',
                  left: slot.left,
                  top: slot.top,
                  width: slot.width,
                  height: slot.height,
                  zIndex: slot.zIndex,
                  transformOrigin: '50% 100%',
                  visibility: 'hidden',
                }}
              >
                {isSide ? (
                  <button
                    type="button"
                    onClick={() => goTo(activeIndex + slot.offset)}
                    aria-label={t('app.showcase.sideAction').replace('{name}', t(entry.labelKey))}
                    className="group block h-full w-full origin-bottom cursor-pointer text-left transition-transform duration-300 ease-out hover:scale-[1.02] focus-visible:scale-[1.02] active:scale-[0.98]"
                    style={{ textAlign: 'left' }}
                  >
                    <AppDevice
                      entry={entry}
                      screenWidth={slot.screenWidth}
                      shadow={0.8}
                      screenClassName="fan-screen"
                    />
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute transition-opacity duration-300 ease-out ${
                        isMobile
                          ? 'opacity-85'
                          : 'opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0'
                      }`}
                      style={{
                        inset: bezel,
                        borderRadius: screenRadius,
                        background: isMobile
                          ? 'rgb(var(--background-page-rgb) / 0.32)'
                          : 'rgb(var(--background-page-rgb) / 0.22)',
                      }}
                    />
                  </button>
                ) : (
                  <div className={`h-full w-full ${isActive && !isCompact ? 'device-float' : ''}`}>
                    <AppDevice
                      entry={entry}
                      screenWidth={slot.screenWidth}
                      glare={isActive}
                      shadow={1}
                      screenClassName="fan-screen"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderInfoCard = (isDesktopMode: boolean) => (
    <div
      className={`rounded-2xl border border-edge bg-surface-subtle/85 p-4 sm:p-5 shadow-xs backdrop-blur-sm ${
        isDesktopMode ? 'mt-6 w-full max-w-lg' : 'mx-auto mt-4 w-full max-w-sm sm:max-w-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="font-mono text-xs font-semibold text-link">
            {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(APP_SCREEN_COUNT).padStart(2, '0')}
          </span>
          <span className="h-3.5 w-px bg-edge" />
          <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-primary">
            <activeEntry.Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span>{t(activeEntry.labelKey)}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous screen"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-surface text-secondary transition-all duration-200 hover:border-edge-strong hover:text-primary active:scale-[0.94] cursor-pointer"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next screen"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-edge bg-surface text-secondary transition-all duration-200 hover:border-edge-strong hover:text-primary active:scale-[0.94] cursor-pointer"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p
        ref={isDesktopMode ? captionRef : undefined}
        className="showcase-caption mt-2.5 sm:mt-3 text-xs leading-relaxed text-secondary sm:text-sm"
      >
        {t(activeEntry.descKey)}
      </p>

      <div
        className="mt-3.5 sm:mt-4 flex items-center gap-1"
        role="progressbar"
        aria-valuenow={activeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={APP_SCREEN_COUNT}
      >
        {APP_SCREENS.map((screen, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={screen.id}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={t(screen.labelKey)}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? 'bg-brand shadow-xs' : 'bg-edge/60 hover:bg-edge'
              }`}
            />
          );
        })}
      </div>
    </div>
  );

  const renderFolder = (isDesktopMode: boolean) => (
    <div
      className={`w-full flex flex-col items-center justify-center overflow-visible ${
        isDesktopMode ? 'mt-6 pt-36 pb-3' : 'mt-3 pt-24 pb-2'
      }`}
      onKeyDown={onTabListKeyDown}
    >
      <FolderFloat
        items={folderItems}
        label={t('app.showcase.tabsLabel') || '新建文件夹...'}
        sublabel=""
        isOpen={folderOpen}
        onOpenChange={setFolderOpen}
        onSelect={(_val, index) => goTo(index)}
        selectedValue={activeEntry.id}
        trigger="scroll"
        closeOnSelect={false}
        physics={true}
        drift={0.55}
        folderColor={theme === 'dark' ? '#18181b' : '#e2e8f0'}
        frontColor={theme === 'dark' ? '#27272a' : '#f8fafc'}
        paperColor={theme === 'dark' ? '#3f3f46' : '#ffffff'}
        itemColor={theme === 'dark' ? '#27272a' : '#ffffff'}
        itemTextColor={theme === 'dark' ? '#f4f4f5' : '#1e293b'}
        labelColor={theme === 'dark' ? '#f4f4f5' : '#0f172a'}
        width={isDesktopMode ? 220 : isMobile ? 180 : 205}
        height={isDesktopMode ? 125 : isMobile ? 100 : 115}
        spread={isDesktopMode ? 230 : isMobile ? 135 : 175}
        lift={isDesktopMode ? 22 : isMobile ? 18 : 20}
        ceiling={isDesktopMode ? 136 : isMobile ? 86 : 106}
        bounce={0.35}
        className="z-20"
      />
    </div>
  );

  const renderCompactView = () => {
    const activeTheme = MACARON_THEMES[activeEntry.id] ?? DEFAULT_MACARON;
    const mobileScreenWidth = isTablet ? 195 : 166;
    const phoneWidth = (mobileScreenWidth / SW) * DEVICE_W;
    const phoneHeight = (mobileScreenWidth / SW) * DEVICE_H;

    return (
      <div className="flex flex-col items-center w-full max-w-md mx-auto">
        {/* 1. Header: clean, compact single-line title */}
        <Reveal>
          <div className="text-center mb-3 px-1 w-full overflow-hidden">
            <h2
              id="app-showcase-title"
              className="text-[16px] min-[375px]:text-[17.5px] min-[390px]:text-[18.5px] sm:text-2xl font-bold tracking-tight text-primary whitespace-nowrap text-center"
            >
              {t('app.showcase.title')}
            </h2>
          </div>
        </Reveal>

        {/* 2. Top Scrollable Pill Tab Switcher */}
        <div className="relative w-full mb-3.5">
          {/* Subtle edge fades for scroll cue (better-layout Principle 5) */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[rgb(var(--background-page-rgb))] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[rgb(var(--background-page-rgb))] to-transparent z-10" />

          <div
            ref={tabListRef}
            role="tablist"
            aria-label="App features"
            onKeyDown={onTabListKeyDown}
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-6 py-1 scroll-smooth"
          >
            {APP_SCREENS.map((screen, idx) => {
              const isActive = idx === activeIndex;
              const Icon = screen.Icon;
              const screenTheme = MACARON_THEMES[screen.id] ?? DEFAULT_MACARON;
              return (
                <button
                  key={screen.id}
                  ref={(el) => {
                    tabItemRefs.current[idx] = el;
                  }}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goTo(idx)}
                  className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'border shadow-xs'
                      : 'text-secondary hover:text-primary bg-surface-subtle/70 border border-edge/50 hover:border-edge'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor:
                            theme === 'dark' ? screenTheme.darkBg : screenTheme.lightBg,
                          borderColor:
                            theme === 'dark' ? screenTheme.darkBorder : screenTheme.lightBorder,
                          color:
                            theme === 'dark' ? screenTheme.darkInk : screenTheme.lightInk,
                        }
                      : undefined
                  }
                >
                  <Icon className="h-3.5 w-3.5 stroke-[2] shrink-0" />
                  <span>{t(screen.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Centered Phone Mockup with Left & Right Chevrons */}
        <div className="relative flex items-center justify-center w-full my-1">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous screen"
            className="absolute left-1 sm:left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-edge/80 bg-surface/85 text-secondary shadow-sm backdrop-blur-md transition-all duration-200 hover:text-primary hover:border-edge-strong active:scale-90 cursor-pointer"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          {/* Centered Phone with Touch Swipe */}
          <div
            className="fan-device relative flex items-center justify-center touch-pan-y"
            onTouchStart={(e) => {
              pointerStartX.current = e.touches[0].clientX;
              pointerStartY.current = e.touches[0].clientY;
            }}
            onTouchEnd={(e) => {
              if (pointerStartX.current === null) return;
              const deltaX = e.changedTouches[0].clientX - pointerStartX.current;
              const deltaY =
                e.changedTouches[0].clientY - (pointerStartY.current ?? e.changedTouches[0].clientY);
              pointerStartX.current = null;
              pointerStartY.current = null;
              if (Math.abs(deltaX) >= 36 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
                goTo(activeIndex + (deltaX < 0 ? 1 : -1));
              }
            }}
            style={{
              width: phoneWidth,
              height: phoneHeight,
              visibility: 'visible',
            }}
          >
            {/* Ambient dynamic glow underneath phone */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[85%] rounded-full blur-2xl opacity-45 -z-10 transition-colors duration-500"
              style={{
                backgroundColor: activeTheme.color,
              }}
            />
            {/* Ground shadow ellipse */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 -bottom-2 -translate-x-1/2 w-[80%] h-4 rounded-full blur-md opacity-40 bg-black -z-10"
            />
            <AppDevice
              entry={activeEntry}
              screenWidth={mobileScreenWidth}
              glare={true}
              shadow={0.85}
              screenClassName="fan-screen"
            />
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next screen"
            className="absolute right-1 sm:right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-edge/80 bg-surface/85 text-secondary shadow-sm backdrop-blur-md transition-all duration-200 hover:text-primary hover:border-edge-strong active:scale-90 cursor-pointer"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>

        {/* 4. Bottom Information & Micro-indicators */}
        <div className="mt-3 flex flex-col items-center text-center w-full px-4">
          {/* Screen Index badge and Label */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors duration-300"
              style={{
                backgroundColor: theme === 'dark' ? activeTheme.darkBg : activeTheme.lightBg,
                borderColor: theme === 'dark' ? activeTheme.darkBorder : activeTheme.lightBorder,
                color: theme === 'dark' ? activeTheme.darkInk : activeTheme.lightInk,
              }}
            >
              {String(activeIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(APP_SCREEN_COUNT).padStart(2, '0')}
            </span>
            <span className="font-semibold text-xs sm:text-sm text-primary flex items-center gap-1.5">
              <activeEntry.Icon
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                style={{ color: activeTheme.color }}
              />
              <span>{t(activeEntry.labelKey)}</span>
            </span>
          </div>

          {/* Screen Description with GSAP slide */}
          <p className="showcase-caption text-xs leading-relaxed text-secondary min-h-[36px] max-w-xs">
            {t(activeEntry.descKey)}
          </p>

          {/* 11 Micro progress dots */}
          <div
            className="mt-1.5 flex items-center gap-1.5"
            role="progressbar"
            aria-valuenow={activeIndex + 1}
            aria-valuemin={1}
            aria-valuemax={APP_SCREEN_COUNT}
          >
            {APP_SCREENS.map((screen, idx) => {
              const isActive = idx === activeIndex;
              const screenTheme = MACARON_THEMES[screen.id] ?? DEFAULT_MACARON;
              return (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  aria-label={t(screen.labelKey)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? 'w-5 shadow-xs' : 'w-1.5 bg-edge/70 hover:bg-edge'
                  }`}
                  style={isActive ? { backgroundColor: screenTheme.color } : undefined}
                />
              );
            })}
          </div>
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-tertiary">
          {t('app.showcase.note')}
        </p>
      </div>
    );
  };

  return (
    <section
      ref={scopeRef}
      id="app"
      aria-labelledby="app-showcase-title"
      className="scroll-mt-24 overflow-hidden"
    >
      <div className="mx-auto max-w-page px-4 py-10 sm:px-6 md:py-24">
        {!isCompact ? (
          /* Desktop Co-located Side-by-Side Studio Layout (>= 1024px) */
          <div>
            <div className="grid lg:grid-cols-12 lg:gap-x-12 lg:items-center">
              {/* Left Column: Title + Active Screen Card + FolderFloat Playground */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <Reveal>
                  <div className="w-full overflow-visible">
                    <h2
                      id="app-showcase-title"
                      className="text-2xl lg:text-[22px] xl:text-[25px] 2xl:text-[27px] font-semibold leading-tight tracking-tight text-primary whitespace-nowrap"
                    >
                      {t('app.showcase.title')}
                    </h2>
                  </div>
                </Reveal>

                {/* Active Screen Editorial Card */}
                <Reveal delay={40}>
                  {renderInfoCard(true)}
                </Reveal>

                {/* Zero-G FolderFloat with dedicated airspace */}
                <Reveal delay={80}>
                  {renderFolder(true)}
                </Reveal>
              </div>

              {/* Right Column: 3-Phone Peek Stage */}
              <div className="lg:col-span-7 flex items-center justify-center">
                {renderPhoneStage('h-[660px] lg:h-[720px]')}
              </div>
            </div>

            <p className="mt-8 text-center text-xs leading-5 text-tertiary">
              {t('app.showcase.note')}
            </p>
          </div>
        ) : (
          /* Mobile & Tablet Ergonomic Single-Viewport Stage (< 1024px) */
          renderCompactView()
        )}
      </div>
    </section>
  );
};
