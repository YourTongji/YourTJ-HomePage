import React, { useState } from 'react';
import { NavLink } from '../types';
import { Sprout, Award, FileCode2, ExternalLink } from 'lucide-react';

interface NavCardProps {
  link: NavLink;
  index: number;
}

const icons = {
  community: Sprout,
  credit: Award,
  docs: FileCode2,
};

// Pastel tape colors with better contrast
const tapeColors = [
  'bg-yellow-100/90 dark:bg-yellow-200/80',
  'bg-green-100/90 dark:bg-green-200/80',
  'bg-blue-100/90 dark:bg-blue-200/80',
];

// Accessible labels for screen readers
const ariaLabels = {
  community: '访问 YourTJ 选课社区 - 不记名、自由、简洁、高效的选课平台',
  credit: '访问 YourTJ 积分站 - 记录你为社区做出的每一份贡献',
  docs: '访问 YourTJ 开发文档 - 参与社区开发，成为社区的一员',
};

export const NavCard: React.FC<NavCardProps> = ({ link, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const Icon = icons[link.iconType];

  // Reduced rotation on mobile (first value) vs desktop
  const rotation = (index % 2 === 0 ? 0.5 : -0.5) * ((index % 3) + 1);
  const tapeRotation = (index % 2 === 0 ? -2 : 3);
  const tapeColor = tapeColors[index % tapeColors.length];

  // Staggered animation delay for cards
  const animationDelay = `${index * 0.15}s`;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabels[link.iconType]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className="group relative block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-goose-blue-400/50 dark:focus-visible:ring-goose-blue-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-wabi-dark-paper rounded-sm transition-all duration-300 ease-out md:hover:-translate-y-2 md:hover:scale-[1.02] animate-fade-in-up"
      style={{
        transform: `rotate(${rotation}deg)`,
        animationDelay,
        animationFillMode: 'both'
      }}
    >
      {/* Washi Tape - Smaller on mobile */}
      <div
        className={`absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 w-20 md:w-24 h-6 md:h-8 ${tapeColor} backdrop-blur-[1px] shadow-sm z-20 pointer-events-none transition-all duration-300`}
        style={{
          transform: `translateX(-50%) rotate(${tapeRotation}deg) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
          clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
        }}
      >
        <div className="w-full h-full opacity-20 bg-paper-pattern"></div>
      </div>

      {/* Shadow - Enhanced depth with press effect */}
      <div
        className={`absolute inset-0 bg-stone-300/60 dark:bg-black/40 rounded-sm transition-all duration-300 ${
          isPressed
            ? 'translate-y-1 translate-x-0.5 blur-[1px]'
            : 'translate-y-2 translate-x-1 blur-[2px] group-hover:translate-y-4 group-hover:blur-[6px] group-hover:opacity-40'
        }`}
      />

      {/* Main Card Surface */}
      <div className={`relative h-full bg-white dark:bg-wabi-dark-subtle rounded-sm border border-stone-100 dark:border-wabi-dark-stone flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-goose-blue-900/20 transition-all duration-300 ${
        isPressed ? 'scale-[0.98]' : ''
      }`}>

        {/* Sketchy inner border */}
        <div className="absolute inset-1 border-2 border-stone-200/50 dark:border-wabi-dark-darkstone/50 rounded-sm pointer-events-none transition-colors duration-300 group-hover:border-goose-blue-200/60 dark:group-hover:border-goose-blue-600/40"
             style={{
               clipPath: 'polygon(0% 0%, 100% 1%, 99% 100%, 1% 99%)'
             }}>
        </div>

        {/* Organic corner decoration - Biophilic */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-goose-blue-300 dark:text-goose-blue-400">
            <path d="M100 0 Q80 20 70 40 Q60 60 50 70 Q40 80 20 90 L100 100 Z" fill="currentColor" opacity="0.5" />
            <path d="M100 0 Q85 15 75 30 Q65 45 55 55 Q45 65 30 75 L100 80 Z" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        {/* Content - Reduced padding on mobile (p-6) vs desktop (p-8) */}
        <div className="p-6 md:p-8 relative z-10 flex flex-col h-full">

          <div className="flex justify-between items-start mb-4 md:mb-6">
             {/* Icon with enhanced animation */}
            <div className="relative">
               <svg className="absolute -inset-3 w-[160%] h-[160%] text-goose-blue-100 dark:text-goose-blue-800/40 -rotate-12 group-hover:text-goose-blue-200 dark:group-hover:text-goose-blue-700/50 transition-all duration-500 group-hover:rotate-[-8deg]" viewBox="0 0 100 100">
                 <path d="M 20 50 Q 30 20 50 20 Q 80 20 80 50 Q 80 80 50 80 Q 20 80 20 50" fill="currentColor" opacity="0.8" />
               </svg>
               <Icon
                 size={28}
                 strokeWidth={1.5}
                 className="text-goose-blue-600 dark:text-goose-blue-400 relative z-10 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                 aria-hidden="true"
               />
            </div>

            <ExternalLink
              size={16}
              className="text-wabi-muted dark:text-wabi-dark-muted opacity-50 group-hover:opacity-100 transition-all duration-300 md:w-[18px] md:h-[18px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-wabi-text dark:text-wabi-dark-text mb-2 md:mb-3 font-sans group-hover:text-goose-blue-700 dark:group-hover:text-goose-blue-400 transition-colors tracking-tight">
            {link.title}
          </h3>

          <p className="text-wabi-muted dark:text-wabi-dark-muted text-sm md:text-base leading-relaxed font-hand font-medium tracking-wide">
            {link.description}
          </p>

          {/* Bottom decorative sketch line - Enhanced animation */}
          <div className="mt-auto pt-4 md:pt-6 flex items-center gap-2">
             <div className="w-12 md:w-16 h-1 bg-stone-200 dark:bg-wabi-dark-stone rounded-full group-hover:bg-goose-blue-300 dark:group-hover:bg-goose-blue-500 group-hover:w-20 md:group-hover:w-24 transition-all duration-300"></div>
             {/* Small decorative dots */}
             <div className="flex gap-1 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
               <div className="w-1 h-1 rounded-full bg-goose-blue-400 dark:bg-goose-blue-300"></div>
               <div className="w-1 h-1 rounded-full bg-goose-blue-400 dark:bg-goose-blue-300"></div>
               <div className="w-1 h-1 rounded-full bg-goose-blue-400 dark:bg-goose-blue-300"></div>
             </div>
          </div>
        </div>

        {/* Paper texture */}
        <div className="absolute inset-0 bg-paper-pattern opacity-30 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
      </div>
    </a>
  );
};
