import React, { useState } from 'react';

export interface BrandMotionLogoProps {
  className?: string;
  onClick?: () => void;
  replayKey?: number;
}

export const BrandMotionLogo: React.FC<BrandMotionLogoProps> = ({
  className = '',
  onClick,
  replayKey = 0,
}) => {
  const [internalKey, setInternalKey] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalKey((prev) => prev + 1);
    onClick?.();
  };

  return (
    <button
      type="button"
      aria-label="YourTJ 品牌动态标志 (点击重新滚动)"
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center cursor-pointer select-none rounded-2xl p-1 transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-link ${className}`}
    >
      {/* Light Mode Logo */}
      <img
        key={`light-${replayKey}-${internalKey}`}
        src="/brand/logo_motion.svg"
        alt="YourTJ"
        width={80}
        height={80}
        className="h-full w-full object-contain pointer-events-none drop-shadow-xs dark:hidden"
        draggable={false}
      />

      {/* Dark Mode Logo */}
      <img
        key={`dark-${replayKey}-${internalKey}`}
        src="/brand/logo_motion_dark.svg"
        alt="YourTJ"
        width={80}
        height={80}
        className="h-full w-full object-contain pointer-events-none drop-shadow-[0_0_18px_rgba(74,169,224,0.4)] hidden dark:block"
        draggable={false}
      />
    </button>
  );
};
