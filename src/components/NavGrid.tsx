import React from 'react';
import { NAV_LINKS } from '../constants';
import { NavCard } from './NavCard';

export const NavGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 w-full max-w-6xl mx-auto px-4">
      {NAV_LINKS.map((link, index) => (
        <NavCard key={link.id} link={link} index={index} />
      ))}
    </div>
  );
};
