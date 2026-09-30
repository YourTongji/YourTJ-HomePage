import React from 'react';
import {LOGO_PATHS} from '../logoPaths';

// Path roles in brand_mark.svg: 0 body+Y+T+ring, 1 J, 2 mouth, 3/6 left whiskers,
// 4/5 eyes, 7/8 right whiskers. Pivots are in the 1254-unit viewBox.

// Measured bbox centers (eyes, mouth, body, J); whiskers pivot on their inner end.
export const PIVOTS: Record<number, [number, number]> = {
  0: [657, 632],
  1: [891, 717],
  2: [578, 454],
  3: [245, 442],
  4: [491, 411],
  5: [663, 407],
  6: [227, 501],
  7: [877, 459],
  8: [863, 413],
};

export type PartStyle = {opacity?: number; tx?: number; ty?: number; s?: number; sx?: number; sy?: number; rot?: number};

export const LogoMark: React.FC<{
  size: number;
  mono?: string;
  parts?: Record<number, PartStyle>;
  style?: React.CSSProperties;
}> = ({size, mono, parts = {}, style}) => (
  <svg width={size} height={size} viewBox="0 0 1254 1254" style={{display: 'block', overflow: 'visible', ...style}}>
    {LOGO_PATHS.map((p, i) => {
      const st = parts[i] ?? {};
      const [px, py] = PIVOTS[i];
      const sx = (st.s ?? 1) * (st.sx ?? 1);
      const sy = (st.s ?? 1) * (st.sy ?? 1);
      return (
        <path
          key={i}
          d={p.d}
          fill={mono ?? p.fill}
          opacity={st.opacity ?? 1}
          transform={`translate(${st.tx ?? 0} ${st.ty ?? 0}) translate(${px} ${py}) rotate(${st.rot ?? 0}) scale(${sx} ${sy}) translate(${-px} ${-py})`}
        />
      );
    })}
  </svg>
);

export const GfLogo: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 32, style}) => (
  <LogoMark size={size} mono="var(--app-base-content)" style={style} />
);

