import React from 'react';
import {ICONS} from './iconData';

export const Icon: React.FC<{
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({name, size = 24, color = 'currentColor', style}) => {
  const icon = ICONS[name];
  if (!icon) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{color, display: 'block', flexShrink: 0, ...style}}
      >
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox={icon.vb}
      fill={icon.fill}
      style={{color, display: 'block', flexShrink: 0, ...style}}
      dangerouslySetInnerHTML={{__html: icon.body}}
    />
  );
};
