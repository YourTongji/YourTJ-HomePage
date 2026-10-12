import React, { useRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { useSpecular } from './Specular';
import './SpecularButton.css';

export interface SpecularButtonProps {
  /** Button label or any custom content. */
  children?: React.ReactNode;
  /** Preset padding and font size of the button. */
  size?: 'sm' | 'md' | 'lg';
  /** Corner radius in pixels; clamps to a pill automatically. */
  radius?: number;
  /** Color of the glass background tint. */
  tint?: string;
  /** Strength of the glass tint (0..1). */
  tintOpacity?: number;
  /** Backdrop blur in pixels behind the button. */
  blur?: number;
  /** Color of the button label. */
  textColor?: string;
  /** Color of the moving specular highlight. */
  lineColor?: string;
  /** Color of the static edge stroke under the highlight. */
  baseColor?: string;
  /** Brightness of the specular highlight. */
  intensity?: number;
  /** Distance in pixels within which the shine fades in as cursor approaches. */
  proximity?: number;
  /** Render the single child element (e.g. a link with extra props) instead of the default element. */
  asChild?: boolean;
  /** Disable the button. */
  disabled?: boolean;
  /** Click handler. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Native button type. */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS class names. */
  className?: string;
  /** Optional link destination if rendering as an anchor tag. */
  href?: string;
  /** Link target (e.g. "_blank"). */
  target?: string;
  /** Link rel (e.g. "noopener noreferrer"). */
  rel?: string;
}

/*
 * Glass action with a specular rim that faces the cursor. The rim used to be a
 * WebGL canvas per button; it is now two CSS layers whose angle and brightness
 * come from one shared pointer listener (see ./Specular), so five buttons cost
 * one rAF per pointer move instead of five GL contexts.
 */
export const SpecularButton: React.FC<SpecularButtonProps> = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  proximity = 250,
  asChild = false,
  disabled = false,
  onClick,
  className,
  type = 'button',
  href,
  target,
  rel,
}) => {
  const ref = useRef<HTMLElement>(null);
  useSpecular(ref, proximity);

  const styleVars = {
    '--sb-radius': `${radius}px`,
    '--sb-tint': tint,
    '--sb-tint-opacity': tintOpacity,
    '--sb-blur': `${blur}px`,
    '--sb-text-color': textColor,
    '--sb-line-color': lineColor,
    '--sb-base-color': baseColor,
    '--sb-intensity': Math.min(1, intensity),
  } as React.CSSProperties;

  const shared = {
    className: cn('specular-button', `specular-button--${size}`, className),
    style: styleVars,
  };
  const label = <span className="specular-button__label">{children}</span>;

  if (asChild) {
    return (
      <Slot ref={ref} {...shared}>
        {children}
      </Slot>
    );
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-disabled={disabled}
        {...shared}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...shared}
    >
      {label}
    </button>
  );
};

export default SpecularButton;
