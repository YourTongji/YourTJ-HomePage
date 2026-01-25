import React from 'react';

export const BackgroundWaves: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-wabi-paper dark:bg-wabi-dark-paper transition-colors duration-500">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 z-[1] bg-paper-pattern opacity-60 dark:opacity-40 md:mix-blend-multiply dark:md:mix-blend-overlay pointer-events-none transition-opacity duration-500"></div>

      {/* Organic Watercolor Blobs (Biophilic/Soft) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Top Right - Soft Goose Blue */}
        <div className="absolute -top-[10%] -right-[10%] w-[26rem] h-[26rem] md:w-[45rem] md:h-[45rem] bg-goose-blue-200/30 dark:bg-goose-blue-800/20 rounded-full md:mix-blend-multiply dark:md:mix-blend-lighten md:filter md:blur-3xl opacity-60 dark:opacity-45 md:opacity-70 dark:md:opacity-50 transform-gpu md:motion-safe:animate-blob transition-colors duration-500"></div>

        {/* Top Left - Warm Stone/Green tint */}
        <div className="absolute top-[10%] -left-[10%] w-[22rem] h-[22rem] md:w-[35rem] md:h-[35rem] bg-stone-200/40 dark:bg-stone-700/20 rounded-full md:mix-blend-multiply dark:md:mix-blend-lighten md:filter md:blur-3xl opacity-45 dark:opacity-30 md:opacity-60 dark:md:opacity-40 transform-gpu md:motion-safe:animate-blob transition-colors duration-500"
          style={{ animationDelay: '2s' }}
        ></div>

        {/* Bottom Center - Deep Teal Accent */}
        <div className="absolute -bottom-[20%] left-[20%] w-[28rem] h-[28rem] md:w-[50rem] md:h-[50rem] bg-goose-blue-100/50 dark:bg-goose-blue-900/20 rounded-full md:mix-blend-multiply dark:md:mix-blend-lighten md:filter md:blur-3xl opacity-55 dark:opacity-30 md:opacity-70 dark:md:opacity-40 transform-gpu md:motion-safe:animate-blob transition-colors duration-500"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Hand Drawn Floor/Horizon Lines (Sketch Style) */}
      <div className="absolute bottom-0 w-full h-64 z-[1] opacity-40 dark:opacity-30 text-goose-blue-300 dark:text-goose-blue-600 transition-all duration-500">
         {/* Back wave - slower */}
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
          <path fill="currentColor" fillOpacity="0.2" d="M0,256L60,245.3C120,235,240,213,360,213.3C480,213,600,235,720,229.3C840,224,960,192,1080,186.7C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          {/* Sketchy line on top of fill */}
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" d="M0,256L60,245.3C120,235,240,213,360,213.3C480,213,600,235,720,229.3C840,224,960,192,1080,186.7C1200,181,1320,203,1380,213.3L1440,224"></path>
        </svg>
      </div>

      <div className="absolute bottom-0 w-full h-48 z-[2] opacity-60 dark:opacity-40 text-goose-blue-200 dark:text-goose-blue-700 transition-all duration-500">
        {/* Front wave - closer */}
        <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
           <path fill="currentColor" fillOpacity="0.3" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,229.3C1248,235,1344,213,1392,202.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
           {/* Rough sketch line */}
           <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" d="M0,160 Q 200,250 400,180 T 800,200 T 1440,192" className="opacity-40"></path>
        </svg>
      </div>
    </div>
  );
};
