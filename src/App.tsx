import React from 'react';
import { AppDownloadSection } from './components/AppDownloadSection';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { useTheme } from './hooks/useTheme';
import { I18nProvider, useI18n } from './i18n';

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

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
        <AppDownloadSection />
        <CommunitySection />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <I18nProvider>
    <AppContent />
  </I18nProvider>
);

export default App;
