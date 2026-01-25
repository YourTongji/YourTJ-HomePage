import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full py-8 text-center">
      <p className="text-wabi-muted dark:text-wabi-dark-muted text-sm font-sans opacity-70 transition-colors duration-300">
        © {currentYear} YourTJ 社区
      </p>
    </footer>
  );
};
