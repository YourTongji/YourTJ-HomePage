import React from 'react';
import { AppDownloadSection } from './components/AppDownloadSection';
import { AppShowcase } from './components/AppShowcase';
import { CommunitySection } from './components/CommunitySection';
import { ContributorsSection } from './components/ContributorsSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductPreview } from './components/ProductPreview';
import { Ferrofluid } from './components/Ferrofluid';
import { useTheme } from './hooks/useTheme';
import { I18nProvider, useI18n } from './i18n';

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div id="top" className="relative flex min-h-dvh flex-col overflow-x-clip bg-page text-primary">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="mesh-gradient absolute inset-0" />
      </div>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
      >
        {t('a11y.skip')}
      </a>

      <Header theme={theme} toggleTheme={toggleTheme} />

      <main id="main" className="relative z-10 -mt-14 flex-1">
        <Hero />
        <AppShowcase />
        <ProductPreview />

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
            <AppDownloadSection />
            <ContributorsSection />
            <CommunitySection />
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
