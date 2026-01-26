import React from 'react';
import { Theme } from '../hooks/useTheme';
import { useHitokoto } from '../hooks/useHitokoto';

interface HeaderProps {
  theme: Theme;
  toggleTheme: (point?: { clientX: number; clientY: number }) => void;
}

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { hitokoto, source } = useHitokoto();

  return (
    <header className="flex flex-col items-center text-center space-y-6 md:space-y-8 relative max-w-5xl mx-auto pt-4 md:pt-12 animate-fade-in-up">

      {/* Theme Toggle Button - Hand-drawn style */}
      <button
        onClick={(e) => toggleTheme({ clientX: e.clientX, clientY: e.clientY })}
        aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 group p-3 rounded-full bg-white dark:bg-wabi-dark-subtle border-2 border-stone-200 dark:border-wabi-dark-stone hover:border-goose-blue-400 dark:hover:border-goose-blue-500 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95 shadow-sm hover:shadow-md z-50"
      >
        <div className="relative w-6 h-6">
          {theme === 'light' ? (
            <MoonIcon className="w-6 h-6 text-wabi-text dark:text-wabi-dark-text transition-transform duration-300 group-hover:rotate-12" />
          ) : (
            <SunIcon className="w-6 h-6 text-wabi-text dark:text-wabi-dark-text transition-transform duration-300 group-hover:rotate-180" />
          )}
        </div>

        {/* Hand-drawn circle decoration */}
        <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] text-goose-blue-300 dark:text-goose-blue-400 opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" strokeLinecap="round" />
        </svg>
      </button>

      {/* Logo Area - Slightly smaller on mobile to save space */}
      <div className="relative group cursor-pointer scale-90 md:scale-100 animate-scale-in" role="img" aria-label="YourTJ Logo">
        {/* Outer large dashed ring */}
        <div className="absolute -inset-6 md:-inset-10 text-stone-200/70 dark:text-wabi-dark-stone/50">
           <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" aria-hidden="true">
             <path d="M 50, 50 m -48, 0 a 48,48 0 1,0 96,0 a 48,48 0 1,0 -96,0"
                   fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 6" strokeLinecap="round" />
           </svg>
        </div>

        {/* Inner dashed ring */}
        <div className="absolute -inset-1 md:-inset-2 text-stone-300 dark:text-wabi-dark-stone">
           <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-reverse-slow" aria-hidden="true">
             <path d="M 50, 50 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                   fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
           </svg>
        </div>

        {/* Logo Container */}
        <div className="relative z-10 w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-white dark:bg-wabi-dark-subtle rounded-full shadow-sm border-2 border-stone-50 dark:border-wabi-dark-stone group-hover:scale-105 group-hover:shadow-md transition-all duration-500">
           <picture>
             <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.png"
                alt="YourTJ Logo"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                width={160}
                height={160}
                className="w-14 h-14 md:w-20 md:h-20 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
           </picture>
        </div>

        {/* Subtle glow on hover */}
        <div className="absolute inset-0 rounded-full bg-goose-blue-200/0 dark:bg-goose-blue-400/0 group-hover:bg-goose-blue-200/20 dark:group-hover:bg-goose-blue-400/20 blur-xl transition-all duration-500 -z-10"></div>
      </div>

      <div className="relative z-10 w-full px-1">
        {/* Title Lockup */}
        <h1 className="flex flex-row flex-wrap sm:flex-nowrap items-center justify-center gap-x-3 gap-y-1 sm:gap-5 md:gap-6 pt-2">

          {/* Part 1: YourTJ */}
          <div className="relative transform -rotate-2 group animate-slide-in-left">
             <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-wabi-text dark:text-wabi-dark-text font-sans relative z-10 transition-colors duration-300 hover:text-wabi-ink dark:hover:text-wabi-dark-ink">
               YourTJ
             </span>
             <svg className="absolute -bottom-2 left-0 w-[105%] h-4 md:h-5 text-stone-300 dark:text-wabi-dark-stone pointer-events-none transition-colors duration-300 group-hover:text-goose-blue-300 dark:group-hover:text-goose-blue-400" viewBox="0 0 100 15" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 5 Q 50 12 100 5 M 5 10 Q 50 15 95 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
             </svg>
          </div>

          {/* Part 2: 社区导航 */}
          <div className="relative group transform rotate-3 origin-left animate-slide-in-right">
            <span className="font-hand font-bold text-5xl sm:text-6xl md:text-7xl text-goose-blue-600 dark:text-goose-blue-400 relative z-10 transition-all duration-300 hover:text-goose-blue-700 dark:hover:text-goose-blue-500 hover:scale-105" style={{ textShadow: '2px 2px 0px rgba(255,255,255,0.8)' }}>
              社区导航
            </span>

            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] -z-10 text-goose-blue-200/60 dark:text-goose-blue-700/40 mix-blend-multiply dark:mix-blend-lighten transition-all duration-300 group-hover:text-goose-blue-300/70 dark:group-hover:text-goose-blue-600/50 group-hover:scale-110" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
               <path d="M15,50 Q 40,15 110,35 T 195,50 Q 185,85 105,70 T 15,50 Z" fill="currentColor" />
            </svg>

            {/* Doodle star - Enhanced animation */}
            <svg className="absolute -top-6 -right-6 w-7 h-7 md:w-9 md:h-9 text-yellow-400 dark:text-yellow-300 opacity-90 animate-wiggle-slow hidden xs:block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" viewBox="0 0 50 50" style={{ filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.1))' }} aria-hidden="true">
               <path d="M25 2 L 28 18 L 45 20 L 30 28 L 35 45 L 25 32 L 15 45 L 20 28 L 5 20 L 22 18 Z" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </h1>

        {/* Subtitle - Optimized for mobile width */}
        <div className="mt-10 md:mt-12 relative inline-block w-full max-w-[92%] sm:max-w-[90%] md:max-w-3xl mx-auto transform -rotate-1 px-6 animate-fade-in-up-delayed">
          <p className="text-wabi-muted dark:text-wabi-dark-muted text-lg sm:text-2xl md:text-3xl font-hitokoto leading-relaxed tracking-wide opacity-90 transition-opacity duration-300 hover:opacity-100 min-h-[4.5rem] sm:min-h-[5.5rem] md:min-h-[6.5rem]">
            {hitokoto}
          </p>
          <p className="mt-3 text-wabi-muted/80 dark:text-wabi-dark-muted/80 text-sm sm:text-base font-hitokoto tracking-wide text-right min-h-[1.25rem] sm:min-h-[1.5rem]">
            {source || '\u00A0'}
          </p>

          {/* Quotes tightened for mobile */}
          <span className="absolute -top-4 -left-1 sm:-top-6 sm:-left-8 font-hand text-4xl sm:text-5xl text-stone-300 dark:text-wabi-dark-stone select-none opacity-50 transition-all duration-300 hover:opacity-70 hover:text-goose-blue-300 dark:hover:text-goose-blue-400" aria-hidden="true">"</span>
          <span className="absolute -bottom-6 -right-1 sm:-bottom-8 sm:-right-8 font-hand text-4xl sm:text-5xl text-stone-300 dark:text-wabi-dark-stone select-none opacity-50 transition-all duration-300 hover:opacity-70 hover:text-goose-blue-300 dark:hover:text-goose-blue-400" aria-hidden="true">"</span>

          <svg className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[100%] h-4 md:h-6 text-stone-300/70 dark:text-wabi-dark-stone/50 pointer-events-none" viewBox="0 0 300 15" preserveAspectRatio="none" aria-hidden="true">
             <path d="M0 7 Q 75 14 150 7 T 300 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 8" />
          </svg>
        </div>

        {/* Small decorative elements - Biophilic touches */}
        <div className="mt-8 flex justify-center gap-3 opacity-40" aria-hidden="true">
          <div className="w-2 h-2 rounded-full bg-goose-blue-300 dark:bg-goose-blue-400 animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="w-2 h-2 rounded-full bg-stone-300 dark:bg-wabi-dark-stone animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
          <div className="w-2 h-2 rounded-full bg-goose-blue-300 dark:bg-goose-blue-400 animate-pulse" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
        </div>
      </div>
    </header>
  );
};
