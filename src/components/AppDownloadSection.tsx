import React from 'react';
import { APP_LINKS } from '../constants';
import { useI18n } from '../i18n';
import { useTheme } from '../hooks/useTheme';
import { useInViewOnce } from '../hooks/useInViewOnce';
import { assetUrl } from '../utils/assets';
import {
  AndroidIcon,
  AppleIcon,
  ArrowUpRightIcon,
  FeedbackIcon,
  ReleaseIcon,
} from './icons';
import { Reveal } from './Reveal';
import { SpecularButton } from './SpecularButton';

const DeferredQRCode = React.lazy(() =>
  import('qrcode.react').then(({ QRCodeSVG }) => ({ default: QRCodeSVG })),
);
const DeferredShapeBlur = React.lazy(() =>
  import('./ShapeBlur').then(({ ShapeBlur }) => ({ default: ShapeBlur })),
);

interface PlatformActionProps {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  channel: string;
  theme: 'light' | 'dark';
  platform: 'ios' | 'android';
}

/**
 * Platform download action wrapped with WebGL SpecularButton.
 * The specular highlight tracks cursor proximity around the card perimeter.
 * On desktop hover, reveals a sleek vector QR code popover for mobile phone scanning.
 */
const PlatformAction: React.FC<PlatformActionProps> = ({
  href,
  icon,
  iconBg,
  label,
  channel,
  theme,
  platform,
}) => {
  const { t } = useI18n();
  const [showQr, setShowQr] = React.useState(false);

  return (
    <div
      className="relative group/qr"
      onMouseEnter={() => setShowQr(true)}
      onFocusCapture={() => setShowQr(true)}
    >
      {/* Specular Action Button */}
      <SpecularButton
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        size="md"
        radius={16}
        tint={theme === 'dark' ? '#202022' : '#ffffff'}
        tintOpacity={theme === 'dark' ? 0.65 : 0.85}
        blur={14}
        baseColor={theme === 'dark' ? '#38383e' : '#e4e4e7'}
        lineColor={theme === 'dark' ? '#72f0a6' : '#10b981'}
        textColor={theme === 'dark' ? '#f4f4f5' : '#18181b'}
        intensity={1.15}
        proximity={280}
        className="group !w-full !p-4 !justify-start !text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform duration-200 group-hover:scale-105 ${iconBg}`}
            >
              {icon}
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-sm sm:text-base font-semibold leading-snug text-primary tracking-tight">
                {label}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-secondary truncate">
                {channel}
              </span>
            </span>
          </div>
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-tertiary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </div>
      </SpecularButton>

      {/* Desktop Hover Floating QR Bubble (hidden on mobile/touch, triggers on hover on desktop) */}
      <div
        className="hidden md:block absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none opacity-0 translate-y-2 scale-95 group-hover/qr:pointer-events-auto group-hover/qr:opacity-100 group-hover/qr:translate-y-0 group-hover/qr:scale-100 group-focus-within/qr:pointer-events-auto group-focus-within/qr:opacity-100 group-focus-within/qr:translate-y-0 group-focus-within/qr:scale-100 transition-[opacity,transform] duration-200 ease-out will-change-[transform,opacity]"
        role="tooltip"
        aria-hidden="true"
      >
        <div className="w-[164px] rounded-2xl border border-edge/90 bg-surface-raised/95 backdrop-blur-xl p-2.5 pb-2 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.18),0_4px_12px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.7),0_4px_14px_-2px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:ring-white/10 flex flex-col items-center relative">
          {/* QR Code Container with subtle inset border */}
          <div className="relative p-1.5 rounded-xl bg-white dark:bg-zinc-950 border border-edge/70 shadow-2xs flex items-center justify-center">
            {showQr && (
              <React.Suspense fallback={null}>
                <DeferredQRCode
                  value={href}
                  size={120}
                  level="H"
                  bgColor="transparent"
                  fgColor={theme === 'dark' ? '#f4f4f5' : '#09090b'}
                  marginSize={1}
                  imageSettings={{
                    src: '',
                    height: 26,
                    width: 26,
                    excavate: true,
                  }}
                />
              </React.Suspense>
            )}
            {/* Center System Icon Badge */}
            <div className="absolute inset-0 m-auto h-6 w-6 rounded-md bg-surface-raised border border-edge/80 shadow-2xs flex items-center justify-center pointer-events-none">
              {platform === 'ios' ? (
                <AppleIcon theme={theme} className="h-3.5 w-3.5" />
              ) : (
                <AndroidIcon theme={theme} className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
          </div>

          {/* Tooltip Copy - Clean tip text without redundant platform label */}
          <div className="mt-2 text-center px-1">
            <p className="text-[11px] font-medium leading-snug text-secondary select-none">
              {t('app.download.qrTip')}
            </p>
          </div>

          {/* Notch / Arrow pointing to button */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 border-r border-b border-edge/90 bg-surface-raised" />
        </div>
      </div>
    </div>
  );
};

const ANDROID_PROBE_URL =
  'https://github.com/YourTongji/YourTJ-Hub/releases/download/mobile-latest/YourTJ-download-probe.png';
const ANDROID_ROUTE_CACHE_KEY = 'yourtj.android-download-route-v2';
const ANDROID_ROUTE_TTL_MS = 30 * 60 * 1000;
const ANDROID_PROBE_TIMEOUT_MS = 3500;
const ANDROID_ROUTES = [
  { id: 'github', prefix: '' },
  { id: 'ghfast', prefix: 'https://ghfast.top/' },
  { id: 'ghproxy', prefix: 'https://ghproxy.net/' },
  { id: 'gh-proxy', prefix: 'https://gh-proxy.com/' },
] as const;

type AndroidRoute = (typeof ANDROID_ROUTES)[number];

const cachedAndroidRoute = (): AndroidRoute | null => {
  try {
    const raw = window.localStorage.getItem(ANDROID_ROUTE_CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as { id?: unknown; expiresAt?: unknown };
    if (typeof cached.id !== 'string' || typeof cached.expiresAt !== 'number') {
      return null;
    }
    if (cached.expiresAt <= Date.now()) {
      window.localStorage.removeItem(ANDROID_ROUTE_CACHE_KEY);
      return null;
    }

    return ANDROID_ROUTES.find((route) => route.id === cached.id) ?? null;
  } catch {
    return null;
  }
};

const routeUrl = (route: AndroidRoute, url: string) =>
  route.prefix ? `${route.prefix}${url}` : url;

const probeAndroidRoute = (route: AndroidRoute): Promise<number> =>
  new Promise((resolve) => {
    const image = new Image();
    const startedAt = performance.now();
    let finished = false;

    const finish = (duration: number) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      resolve(duration);
    };

    const timeout = window.setTimeout(
      () => finish(Number.POSITIVE_INFINITY),
      ANDROID_PROBE_TIMEOUT_MS,
    );
    image.onload = () => finish(performance.now() - startedAt);
    image.onerror = () => finish(Number.POSITIVE_INFINITY);
    const cacheBucket = Math.floor(Date.now() / ANDROID_ROUTE_TTL_MS);
    image.src = `${routeUrl(route, ANDROID_PROBE_URL)}?probe=${cacheBucket}`;
  });

export const AppDownloadSection: React.FC = () => {
  const { t } = useI18n();
  const { theme } = useTheme();
  const sectionRef = React.useRef<HTMLElement>(null);
  const shapeBlurNear = useInViewOnce(sectionRef, '250px');
  const [savedAndroidRoute] = React.useState(cachedAndroidRoute);
  const [androidDownloadUrl, setAndroidDownloadUrl] = React.useState(() =>
    routeUrl(savedAndroidRoute ?? ANDROID_ROUTES[0], APP_LINKS.androidAcceleratedApk),
  );

  React.useEffect(() => {
    if (savedAndroidRoute) return;

    let mounted = true;
    const probeRoutes = () => {
      void Promise.all(
        ANDROID_ROUTES.map(async (route) => ({
          route,
          duration: await probeAndroidRoute(route),
        })),
      ).then((results) => {
        if (!mounted) return;

        const selected =
          results
            .filter((result) => Number.isFinite(result.duration))
            .sort((a, b) => a.duration - b.duration)[0]?.route ?? ANDROID_ROUTES[0];
        try {
          window.localStorage.setItem(
            ANDROID_ROUTE_CACHE_KEY,
            JSON.stringify({ id: selected.id, expiresAt: Date.now() + ANDROID_ROUTE_TTL_MS }),
          );
        } catch {
          // The download remains usable when browser storage is unavailable.
        }
        setAndroidDownloadUrl(routeUrl(selected, APP_LINKS.androidAcceleratedApk));
      });
    };

    const section = sectionRef.current;
    let observer: IntersectionObserver | null = null;
    if (!section || !('IntersectionObserver' in window)) {
      probeRoutes();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        probeRoutes();
      }, { rootMargin: '1000px 0px' });
      observer.observe(section);
    }

    return () => {
      mounted = false;
      observer?.disconnect();
    };
  }, [savedAndroidRoute]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="app-download-title"
      className="content-auto pt-8 sm:pt-12 md:pt-16"
    >
      <Reveal className="mx-auto max-w-page px-4 pb-6 sm:px-6 sm:pb-8 md:pb-10">
        <div className="glass-panel !overflow-visible rounded-3xl border border-edge/80 shadow-lift relative">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-stretch">
            {/* Left Column: Direct App Acquisition */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between rounded-3xl lg:rounded-r-none">
              <div>
                <h2
                  id="app-download-title"
                  className="text-2xl font-semibold leading-[1.2] tracking-tight text-primary md:text-3xl lg:text-4xl"
                >
                  {t('app.section.title')}
                </h2>
                <p className="mt-3.5 max-w-[46ch] text-sm sm:text-base leading-relaxed text-secondary">
                  {t('app.desc')}
                </p>

                {/* Platform Download Actions with Specular Rim Highlight & Hover QR Code Popover */}
                <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <PlatformAction
                    href={APP_LINKS.iosTestflight}
                    icon={<AppleIcon theme={theme} className="h-5 w-5" />}
                    iconBg={
                      theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-700/80 text-white'
                        : 'bg-neutral-100 border-neutral-200/80 text-neutral-900'
                    }
                    label={t('app.ios.cta')}
                    channel={t('app.ios')}
                    theme={theme}
                    platform="ios"
                  />
                  <PlatformAction
                    href={androidDownloadUrl}
                    icon={<AndroidIcon theme={theme} className="h-5 w-5" />}
                    iconBg={
                      theme === 'dark'
                        ? 'bg-emerald-950/70 border-emerald-800/60'
                        : 'bg-emerald-50 border-emerald-200/80'
                    }
                    label={t('app.android.cta')}
                    channel={t('app.android')}
                    theme={theme}
                    platform="android"
                  />
                </div>

                {/* Secondary Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={APP_LINKS.androidReleases}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-edge/80 bg-surface/60 px-3.5 py-2 text-xs font-medium text-secondary transition-all duration-200 hover:border-edge-strong hover:bg-surface-raised hover:text-primary active:scale-[0.98]"
                  >
                    <ReleaseIcon className="h-3.5 w-3.5 text-tertiary" />
                    <span>{t('app.more')}</span>
                  </a>
                  <a
                    href={APP_LINKS.iosIssues}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-edge/80 bg-surface/60 px-3.5 py-2 text-xs font-medium text-secondary transition-all duration-200 hover:border-edge-strong hover:bg-surface-raised hover:text-primary active:scale-[0.98]"
                  >
                    <FeedbackIcon className="h-3.5 w-3.5 text-tertiary" />
                    <span>{t('app.feedback')}</span>
                  </a>
                </div>
              </div>

              <p className="mt-8 border-t border-edge/60 pt-4 text-xs leading-relaxed text-tertiary">
                {t('app.note')}
              </p>
            </div>

            {/* Right Column: Brand Plate & Identity */}
            <div className="relative hidden overflow-hidden rounded-r-3xl border-l border-edge bg-surface/75 lg:flex lg:flex-col lg:items-center lg:justify-center p-10 xl:p-12 text-center">
              <div className="hero-ambient pointer-events-none absolute inset-0 opacity-60" />
              <div className="relative flex flex-col items-center justify-center gap-4">
                {/* Logo Container with React Bits ShapeBlur */}
                <div className="relative group flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
                  {/* React Bits ShapeBlur WebGL background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                    {shapeBlurNear && (
                      <React.Suspense fallback={null}>
                        <DeferredShapeBlur
                          variation={0}
                          pixelRatioProp={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 2}
                          shapeSize={1.4}
                          roundness={0.45}
                          borderSize={0.065}
                          circleSize={0.4}
                          circleEdge={0.7}
                          color={theme === 'dark' ? '#38bdf8' : '#036099'}
                        />
                      </React.Suspense>
                    )}
                  </div>

                  {/* Solid white backing for contrast and optical depth so SVG logo doesn't sit directly on dark */}
                  <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-white border border-black/5 dark:border-white/10 shadow-xl pointer-events-none transition-transform duration-300 group-hover:scale-105" />

                  {/* Transparent SVG Logo (no version badge) */}
                  <img
                    src={assetUrl('logo.svg')}
                    alt="YourTJ"
                    width={100}
                    height={100}
                    className="relative z-10 w-22 h-22 sm:w-26 sm:h-26 object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_16px_rgba(3,96,153,0.25)]"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xl font-semibold tracking-tight text-primary">
                    {t('app.title')}
                  </p>
                  <p className="mt-1 text-sm text-secondary max-w-[26ch]">
                    {t('app.tagline')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
