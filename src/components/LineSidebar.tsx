'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import './LineSidebar.css';

const FALLOFF_CURVES = {
  linear: (p: number) => p,
  smooth: (p: number) => p * p * (3 - 2 * p),
  sharp: (p: number) => p * p * p,
} as const;

export type FalloffType = keyof typeof FALLOFF_CURVES;

export interface LineSidebarProps {
  /** Labels rendered as the list of sidebar entries. */
  items?: string[];
  /** Color items and markers shift toward as the cursor gets close or when active. */
  accentColor?: string;
  /** Resting color of the option labels. */
  textColor?: string;
  /** Resting color of the leading marker lines. */
  markerColor?: string;
  /** Show the zero-padded index before each label. */
  showIndex?: boolean;
  /** Show the marker lines (and short ticks) beside each item. */
  showMarker?: boolean;
  /** Vertical distance in pixels within which the cursor influences an item. */
  proximityRadius?: number;
  /** Maximum horizontal shift in pixels the label slides at full proximity. */
  maxShift?: number;
  /** Curve mapping cursor distance to the proximity effect. */
  falloff?: FalloffType;
  /** Length in pixels of each marker line. */
  markerLength?: number;
  /** Space in pixels between the marker lines and the item labels. */
  markerGap?: number;
  /** Width of the in-between ticks relative to markerLength. */
  tickScale?: number;
  /** Whether the in-between ticks also grow with cursor proximity. */
  scaleTick?: boolean;
  /** Vertical space in pixels between neighboring items. */
  itemGap?: number;
  /** Font size of the option labels in rem. */
  fontSize?: number;
  /** Smoothing response time in milliseconds for the lerp. */
  smoothing?: number;
  /** Uncontrolled initial active index. */
  defaultActive?: number | null;
  /** Controlled active index. */
  activeIndex?: number | null;
  /** Called whenever an item is clicked. */
  onItemClick?: (index: number, label: string) => void;
  /** Extra class names. */
  className?: string;
}

export const LineSidebar: React.FC<LineSidebarProps> = ({
  items = [],
  accentColor,
  textColor,
  markerColor,
  showIndex = true,
  showMarker = true,
  proximityRadius = 100,
  maxShift = 30,
  falloff = 'smooth',
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  activeIndex: activeIndexProp,
  onItemClick,
  className = '',
}) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const targetsRef = useRef<number[]>([]);
  const currentRef = useRef<number[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const isControlled = activeIndexProp !== undefined;
  const [internalActive, setInternalActive] = useState<number | null>(defaultActive);
  const activeIndex = isControlled ? activeIndexProp : internalActive;

  const activeRef = useRef<number | null>(activeIndex);
  const smoothingRef = useRef<number>(smoothing);

  activeRef.current = activeIndex;
  smoothingRef.current = smoothing;

  // Single rAF loop that eases every item's --effect toward its target using
  // frame-rate independent exponential smoothing, so color, shift and scale
  // all move together without staggering CSS transitions.
  const runFrame = useCallback((now: number) => {
    const dt = Math.min((now - lastRef.current) / 1000, 0.05);
    lastRef.current = now;
    const tau = Math.max(smoothingRef.current, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);

    let moving = false;
    const itemsEl = itemRefs.current;
    for (let i = 0; i < itemsEl.length; i++) {
      const el = itemsEl[i];
      if (!el) continue;
      const target = Math.max(targetsRef.current[i] || 0, activeRef.current === i ? 1 : 0);
      const cur = currentRef.current[i] || 0;
      const next = cur + (target - cur) * k;
      const settled = Math.abs(target - next) < 0.0015;
      const value = settled ? target : next;
      currentRef.current[i] = value;
      el.style.setProperty('--effect', value.toFixed(4));
      if (!settled) moving = true;
    }

    rafRef.current = moving ? requestAnimationFrame(runFrame) : null;
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }

    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      const list = listRef.current;
      if (!list) return;
      const rect = list.getBoundingClientRect();
      const pointerY = e.clientY - rect.top;
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.linear;
      const itemsEl = itemRefs.current;
      for (let i = 0; i < itemsEl.length; i++) {
        const el = itemsEl[i];
        if (!el) continue;
        const center = el.offsetTop + el.offsetHeight / 2;
        const distance = Math.abs(pointerY - center);
        targetsRef.current[i] = ease(Math.max(0, 1 - distance / proximityRadius));
      }
      startLoop();
    },
    [falloff, proximityRadius, startLoop],
  );

  const handlePointerLeave = useCallback(() => {
    targetsRef.current = targetsRef.current.map(() => 0);
    startLoop();
  }, [startLoop]);

  const handleClick = useCallback(
    (index: number, label: string) => {
      if (!isControlled) {
        setInternalActive(index);
      }
      onItemClick?.(index, label);
    },
    [isControlled, onItemClick],
  );

  useEffect(() => {
    startLoop();
  }, [activeIndex, startLoop]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    },
    [],
  );

  const styleVars: Record<string, string | number> = {
    '--marker-length': `${markerLength}px`,
    '--marker-gap': `${markerGap}px`,
    '--tick-scale': tickScale,
    '--max-shift': `${maxShift}px`,
    '--item-gap': `${itemGap}px`,
    '--font-size': `${fontSize}rem`,
    '--smoothing': `${smoothing}ms`,
  };
  if (accentColor) styleVars['--accent-color'] = accentColor;
  if (textColor) styleVars['--text-color'] = textColor;
  if (markerColor) styleVars['--marker-color'] = markerColor;

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={styleVars as React.CSSProperties}
    >
      <ul
        ref={listRef}
        className="line-sidebar__list"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="line-sidebar__item"
            aria-current={activeIndex === index ? 'true' : undefined}
            onClick={() => handleClick(index, label)}
          >
            {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
            <span className="line-sidebar__label">
              {showIndex && (
                <span className="line-sidebar__index">{String(index + 1).padStart(2, '0')}</span>
              )}
              <span className="line-sidebar__text">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LineSidebar;
