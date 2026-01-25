import React from 'react';
import { Agentation } from 'agentation';
import { BackgroundWaves } from './components/BackgroundWaves';
import { NavGrid } from './components/NavGrid';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SketchDecorations } from './components/SketchDecorations';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between font-sans selection:bg-goose-blue-200 dark:selection:bg-goose-blue-700 selection:text-wabi-text dark:selection:text-wabi-dark-text overflow-x-hidden bg-wabi-paper dark:bg-wabi-dark-paper transition-colors duration-500">

      {/* Ambient Background & Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundWaves />
        <SketchDecorations />
      </div>

      {/* Main Content Area - Reduced vertical padding on mobile */}
      <main className="relative z-10 w-full max-w-6xl px-4 py-8 md:py-24 flex flex-col items-center flex-grow">
        <Header theme={theme} toggleTheme={toggleTheme} />

        <div className="w-full mt-10 md:mt-24">
          <NavGrid />
        </div>
      </main>

      <Footer />

      {/* Agentation Toolbar - Only in development */}
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
};

export default App;
