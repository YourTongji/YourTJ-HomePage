import React from 'react';

export const SketchDecorations: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-15 z-[3] transition-opacity duration-500">
      {/* Top Left - Leaf Sketch with subtle animation */}
      <svg className="absolute top-16 left-8 w-16 h-16 text-stone-400 dark:text-wabi-dark-stone transition-all duration-1000 hover:scale-110 hover:rotate-12" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M32 56 C20 44, 12 28, 20 16 C28 4, 44 8, 48 20 C52 32, 44 48, 32 56" strokeLinecap="round" />
        <path d="M32 56 L32 20" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>

      {/* Top Right - Dashed Circle with rotation */}
      <svg className="absolute top-24 right-16 w-12 h-12 text-goose-blue-400 dark:text-goose-blue-500 animate-spin-slow transition-colors duration-500" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="24" cy="24" r="18" strokeDasharray="4 6" />
      </svg>

      {/* Bottom Left - Wavy Line */}
      <svg className="absolute bottom-32 left-1/4 w-32 h-8 text-stone-300 dark:text-wabi-dark-stone transition-all duration-500 hover:text-goose-blue-300 dark:hover:text-goose-blue-400" viewBox="0 0 128 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M0 16 Q16 8, 32 16 T64 16 T96 16 T128 16" strokeLinecap="round" />
      </svg>

      {/* Bottom Right - Dots with staggered pulse */}
      <svg className="absolute bottom-40 right-24 w-8 h-8 text-goose-blue-300 dark:text-goose-blue-400 transition-colors duration-500" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <circle cx="8" cy="8" r="2" opacity="0.6" className="animate-pulse" style={{ animationDelay: '0s', animationDuration: '2s' }} />
        <circle cx="20" cy="12" r="1.5" opacity="0.4" className="animate-pulse" style={{ animationDelay: '0.7s', animationDuration: '2s' }} />
        <circle cx="12" cy="24" r="2" opacity="0.5" className="animate-pulse" style={{ animationDelay: '1.4s', animationDuration: '2s' }} />
      </svg>

      {/* Additional organic shapes - Biophilic touches */}
      {/* Middle Left - Small branch */}
      <svg className="absolute top-1/2 left-12 w-10 h-10 text-stone-300 dark:text-wabi-dark-stone opacity-60 transition-colors duration-500" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M5 35 Q10 25 15 20 Q20 15 25 10" strokeLinecap="round" />
        <path d="M15 20 L12 18" strokeLinecap="round" />
        <path d="M15 20 L18 18" strokeLinecap="round" />
      </svg>

      {/* Middle Right - Organic curve */}
      <svg className="absolute top-1/3 right-20 w-16 h-16 text-goose-blue-200 dark:text-goose-blue-600 opacity-50 dark:opacity-40 transition-all duration-500" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <path d="M10 32 Q20 10 40 20 Q60 30 50 50" strokeLinecap="round" strokeDasharray="3 4" />
      </svg>
    </div>
  );
};
