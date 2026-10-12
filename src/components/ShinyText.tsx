import React, { useEffect, useRef } from 'react';
import './ShinyText.css';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}

/*
 * A shine sweeps across the text, then holds off-screen for `delay` seconds.
 * The sweep is one Web Animation on background-position (0% progress = 150%,
 * 100% = -50%), so there is no per-frame script; it pauses on hover when asked
 * and whenever the text is off screen.
 */
const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const hoveredRef = useRef(false);
  const visibleRef = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || speed <= 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const at = (p: number) => `${150 - (direction === 'left' ? p : 100 - p) * 2}% center`;
    const sweep = speed / (speed + delay);
    const forward: Keyframe[] = [
      { backgroundPosition: at(0), offset: 0 },
      { backgroundPosition: at(100), offset: sweep },
      { backgroundPosition: at(100), offset: 1 },
    ];
    const keyframes = yoyo
      ? [
          { backgroundPosition: at(0), offset: 0 },
          { backgroundPosition: at(100), offset: sweep / 2 },
          { backgroundPosition: at(100), offset: 0.5 },
          { backgroundPosition: at(0), offset: 0.5 + sweep / 2 },
          { backgroundPosition: at(0), offset: 1 },
        ]
      : forward;
    const duration = (speed + delay) * 1000 * (yoyo ? 2 : 1);

    const animation = el.animate(keyframes, { duration, iterations: Infinity, easing: 'linear' });
    animationRef.current = animation;

    const sync = () => {
      if (visibleRef.current && !hoveredRef.current) animation.play();
      else animation.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      sync();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      animation.cancel();
      animationRef.current = null;
    };
  }, [disabled, speed, delay, yoyo, direction]);

  const setHovered = (hovered: boolean) => {
    if (!pauseOnHover) return;
    hoveredRef.current = hovered;
    const animation = animationRef.current;
    if (!animation) return;
    if (hovered) animation.pause();
    else if (visibleRef.current) animation.play();
  };

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    backgroundPosition: '150% center',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <span
      ref={ref}
      className={`shiny-text ${className}`}
      style={gradientStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
    </span>
  );
};

export { ShinyText };
export default ShinyText;
