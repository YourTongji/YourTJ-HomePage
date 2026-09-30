import React from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Ferrofluid } from './components/Ferrofluid';
import { useInViewOnce } from './hooks/useInViewOnce';
import { useTheme } from './hooks/useTheme';
import { I18nProvider, useI18n } from './i18n';

const DeferredAppShowcase = React.lazy(() =>
  import('./components/AppShowcase').then(({ AppShowcase }) => ({ default: AppShowcase })),
);
const DeferredProductPreview = React.lazy(() =>
  import('./components/ProductPreview').then(({ ProductPreview }) => ({ default: ProductPreview })),
);
const DeferredAppDownload = React.lazy(() =>
  import('./components/AppDownloadSection').then(({ AppDownloadSection }) => ({ default: AppDownloadSection })),
);
const DeferredContributors = React.lazy(() =>
  import('./components/ContributorsSection').then(({ ContributorsSection }) => ({ default: ContributorsSection })),
);
const DeferredCommunity = React.lazy(() =>
  import('./components/CommunitySection').then(({ CommunitySection }) => ({ default: CommunitySection })),
);

const DeferredSection: React.FC<{
  id: string;
  className: string;
  children: React.ReactNode;
}> = ({ id, className, children }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isNearViewport = useInViewOnce(ref, '700px');

  return (
    <div id={id} ref={ref} className={className}>
      {isNearViewport && <React.Suspense fallback={null}>{children}</React.Suspense>}
    </div>
  );
};

const AppShowcaseRegion: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInViewOnce(ref, '0px');

  return (
    <div id="app" ref={ref} className="scroll-mt-24 min-h-[695px] overflow-hidden lg:min-h-[964px]">
      {isInView && (
        <React.Suspense fallback={null}>
          <DeferredAppShowcase />
        </React.Suspense>
      )}
    </div>
  );
};

const ProductPreviewRegion: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isNearViewport = useInViewOnce(ref, '300px');

  return (
    // Reserve the 909px desktop stage plus its 2600px pinned scroll distance.
    <div id="preview" ref={ref} className="scroll-mt-24 min-h-[777px] lg:min-h-[3509px] motion-reduce:lg:min-h-[909px]">
      {isNearViewport && (
        <React.Suspense fallback={null}>
          <DeferredProductPreview />
        </React.Suspense>
      )}
    </div>
  );
};

const SkipLink: React.FC = () => {
  const { t } = useI18n();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
    >
      {t('a11y.skip')}
    </a>
  );
};

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const onClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a[href="#download"]') : null;
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
    // Skip the pinned scrollytelling stage, as the previously eager-loaded trigger did.
    document.getElementById(link.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div id="top" onClickCapture={onClickCapture} className="relative flex min-h-dvh flex-col overflow-x-clip bg-page text-primary">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="mesh-gradient absolute inset-0" />
      </div>
      <SkipLink />

      <Header theme={theme} toggleTheme={toggleTheme} />

      <main id="main" className="relative z-10 -mt-14 flex-1">
        <Hero />
        <AppShowcaseRegion />
        <ProductPreviewRegion />

        {/* Lower Ambient Region: App Download, Community, and Footer enveloped in interactive Ferrofluid */}
        <div className="relative">
          {/* Continuous Ferrofluid Ambient Background with soft feathered top mask */}
          <div
            className="pointer-events-none absolute inset-0 -top-28 overflow-hidden z-0"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.7) 120px, black 220px, black calc(100% - 60px), transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.7) 120px, black 220px, black calc(100% - 60px), transparent 100%)',
            }}
            aria-hidden="true"
          >
            <Ferrofluid
              colors={
                theme === 'dark'
                  ? ['#00bc7d', '#72f0a6', '#38bdf8', '#10b981', '#06b6d4']
                  : ['#036099', '#0284c7', '#059669', '#0d9488', '#10b981']
              }
              speed={0.35}
              scale={1.5}
              turbulence={0.9}
              fluidity={0.14}
              rimWidth={0.22}
              sharpness={2.6}
              shimmer={1.2}
              glow={theme === 'dark' ? 1.7 : 1.3}
              flowDirection="down"
              opacity={theme === 'dark' ? 0.48 : 0.3}
              mouseInteraction={true}
              mouseStrength={1.15}
              mouseRadius={0.32}
              mouseDampening={0.14}
              mixBlendMode={theme === 'dark' ? 'screen' : 'multiply'}
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10">
            <DeferredSection
              id="download"
              className="scroll-mt-24 relative mt-14 min-h-[500px] sm:mt-20 md:mt-28 md:min-h-[506px]"
            >
              <DeferredAppDownload />
            </DeferredSection>
            <DeferredSection
              id="contributors"
              className="scroll-mt-24 relative min-h-[472px] sm:min-h-[510px]"
            >
              <DeferredContributors />
            </DeferredSection>
            <DeferredSection id="community" className="scroll-mt-24 min-h-[538px] lg:min-h-[292px]">
              <DeferredCommunity />
            </DeferredSection>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <I18nProvider>
    <AppContent />
  </I18nProvider>
);

export default App;
