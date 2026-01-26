import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full py-8 text-center">
      <div className="flex items-center justify-center gap-2 text-wabi-muted dark:text-wabi-dark-muted text-sm font-sans transition-colors duration-300">
        <span className="inline-block motion-safe:animate-wiggle-slow origin-bottom select-none" aria-hidden="true">
          {'\u00A9'}
        </span>
        <span>{currentYear} YourTJ 社区</span>
      </div>
      <div className="mt-2 flex justify-center gap-1.5 opacity-50" aria-hidden="true">
        <span className="w-1.5 h-1.5 rounded-full bg-goose-blue-300 dark:bg-goose-blue-500 motion-safe:animate-pulse" />
        <span
          className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-wabi-dark-stone motion-safe:animate-pulse"
          style={{ animationDelay: '0.5s' }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-goose-blue-300 dark:bg-goose-blue-500 motion-safe:animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>
    </footer>
  );
};
