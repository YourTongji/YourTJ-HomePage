import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {APPBAR_H, STATUS_H, SW} from './Phone';
import {clamp} from '../timing';
import {assetUrl} from '../../utils/assets';
import {GfLogo} from './LogoMark';

// Fictional people wearing the forum's built-in 小茶 preset avatars
// (apps/gooseforum/resource/static/pic/{1..12,default-avatar}.webp).
export const AVATARS: Record<string, string> = {
  me: '1.webp',
  youzi: '5.webp',
  zaoba: '9.webp',
  zhenti: '12.webp',
  xianyu: '10.webp',
  moon: '4.webp',
  sakura: '8.webp',
  duck: '3.webp',
  panda: '2.webp',
  fox: '6.webp',
  bear: '7.webp',
  rabbit: '11.webp',
  penguin: 'default.webp',
};

export const Avatar: React.FC<{who: string; size: number; ring?: boolean; style?: React.CSSProperties}> = ({
  who,
  size,
  ring,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      background: tint(C.emerald, 10),
      boxShadow: ring ? `0 0 0 2px ${C.base100}, 0 0 0 3.5px ${alpha(C.primary, 0.35)}` : undefined,
      ...style,
    }}
  >
    <img
      src={assetUrl(`avatars/${AVATARS[who]}`)}
      alt=""
      loading="lazy"
      decoding="async"
      style={{width: '100%', height: '100%', display: 'block'}}
    />
  </div>
);

export const AppBar: React.FC<{

  left?: React.ReactNode;
  title?: React.ReactNode;
  showLogo?: boolean;
  right?: React.ReactNode;
  divider?: boolean;
  bg?: string;
  /**
   * GfAppBar is built on TNavBar, whose title sits left-aligned after the
   * leading slot unless `centerTitle: true` is passed — which the app only does
   * for pushed pages. Branch roots (消息, 个人主页) therefore align start.
   */
  titleAlign?: 'center' | 'start';
}> = ({left, title, showLogo = false, right, divider = true, bg = C.base100, titleAlign = 'center'}) => {
  const content = showLogo || (!title && title !== '') ? <GfLogo size={32} /> : title;
  return (
    <div
      data-hover="导航栏"

    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: SW,
      height: STATUS_H + APPBAR_H,
      background: bg,
      zIndex: 20,
      borderBottom: divider ? `1px solid ${C.line}` : undefined,
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: STATUS_H,
        left: 0,
        right: 0,
        height: APPBAR_H,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>{left}</div>
      {titleAlign === 'center' ? (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 17,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {content}
        </div>
      ) : (
        <div
          style={{
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
            fontSize: 17,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {content}
        </div>
      )}
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>{right}</div>
    </div>
  </div>
  );
};


export const Back: React.FC = () => <Icon name="chevron-left" size={26} color={C.iconMuted} />;

export const Divider: React.FC<{inset?: number; style?: React.CSSProperties}> = ({inset = 0, style}) => (
  <div style={{height: 1, background: alpha(C.line, 0.85), marginLeft: inset, ...style}} />
);

export const Dot: React.FC<{color: string; size?: number}> = ({color, size = 7}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0}} />
);

export const CategoryChip: React.FC<{label: string; color: string; size?: number}> = ({label, color, size = 13}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 9px',
      borderRadius: 8,
      background: C.base300,
      fontSize: size,
      color: alpha(C.content, 0.8),
      whiteSpace: 'nowrap',
    }}
  >
    <Dot color={color} size={6} />
    {label}
  </div>
);

/** Blinking text caret. */
export const Caret: React.FC<{frame: number; height?: number; color?: string; solid?: boolean}> = ({
  frame,
  height = 22,
  color = C.primary,
  solid,
}) => {
  const on = solid || Math.floor(frame / 16) % 2 === 0;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height,
        background: color,
        borderRadius: 1,
        marginLeft: 1,
        verticalAlign: 'middle',
        opacity: on ? 1 : 0,
        transform: 'translateY(-1px)',
      }}
    />
  );
};

/**
 * Characters revealed between two beats (uneven rhythm, word-ish grouping).
 * Kept for screens whose copy is revealed progressively.
 */
export const typed = (text: string, progress: number, from: number, to: number) => {
  const chars = Array.from(text);
  const t = clamp((progress - from) / (to - from));
  return chars.slice(0, Math.round(t * chars.length)).join('');
};
