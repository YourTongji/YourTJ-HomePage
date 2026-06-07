import React from 'react';
import { NAV_LINKS } from '../constants';
import { NavCard } from './NavCard';

const AppDownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 2.75h8A2.25 2.25 0 0 1 18.25 5v14A2.25 2.25 0 0 1 16 21.25H8A2.25 2.25 0 0 1 5.75 19V5A2.25 2.25 0 0 1 8 2.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M10 5.5h4M10.5 18h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M12 8v6m0 0 2.25-2.25M12 14l-2.25-2.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const NavGrid: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mb-6 flex justify-center">
        <a
          href="#app-download"
          className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-goose-blue-200 bg-white/85 px-5 py-2.5 text-sm font-extrabold text-goose-blue-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-goose-blue-300 hover:bg-goose-blue-50 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-goose-blue-400/40 dark:border-goose-blue-500/40 dark:bg-wabi-dark-subtle/85 dark:text-goose-blue-300 dark:hover:bg-goose-blue-950/30"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-goose-blue-100 text-goose-blue-700 transition-colors duration-200 group-hover:bg-goose-blue-200 dark:bg-goose-blue-500/15 dark:text-goose-blue-200">
            <AppDownloadIcon className="h-5 w-5" />
          </span>
          App 下载
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
        {NAV_LINKS.map((link, index) => (
          <NavCard key={link.id} link={link} index={index} />
        ))}
      </div>
    </div>
  );
};
