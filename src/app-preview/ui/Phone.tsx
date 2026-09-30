import React from 'react';
import { C, FONT } from '../theme';

/*
 * Device frame for the app previews.
 *
 * Same hardware model as the promo film (iPhone 17 Pro at 402x874 logical
 * points: titanium bezel, dynamic island, status bar, home indicator), but
 * rebuilt for the page: the film positioned devices absolutely on a 1080x1920
 * canvas, whereas a website has to place them in normal flow and let them size
 * to the viewport.
 *
 * The trick that makes one component work at every size: the screens are laid
 * out in fixed points and never reflow, and the whole device is scaled by a
 * single `scale()` around its top-left corner. Callers pass the width they want
 * the *screen* to occupy and the frame derives everything else, so the aspect
 * ratio, bezel thickness and radii stay in proportion at any size.
 */

export const SW = 402;
export const SH = 874;
export const STATUS_H = 62;
export const APPBAR_H = 55;
export const DEVICE_BEZEL = 11;
export const DEVICE_RADIUS = 58;
export const DEVICE_W = SW + DEVICE_BEZEL * 2;
export const DEVICE_H = SH + DEVICE_BEZEL * 2;

const StatusBar: React.FC = () => {
  /*
   * The ink follows the app theme, not the device: a dark-mode screen needs
   * white glyphs. It reads `--app-status-ink` from the .app-mock scope that
   * DeviceFrame puts on the screen box, so the bar flips with the site theme
   * like everything else in the mock.
   */
  const ink = 'var(--app-status-ink)';
  const chrome = `color-mix(in srgb, ${ink} 45%, transparent)`;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: SW,
        height: STATUS_H,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 50,
          top: 20,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: -0.2,
          color: ink,
        }}
      >
        09:41
      </div>
      <div style={{ position: 'absolute', right: 96, top: 26, display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        {[5, 7, 9.5, 12].map((height, index) => (
          <div key={index} style={{ width: 3, height, borderRadius: 1, background: ink }} />
        ))}
      </div>
      <svg style={{ position: 'absolute', right: 70, top: 25 }} width={17} height={13} viewBox="0 0 17 13">
        <path
          d="M8.5 2.2c2.5 0 4.8 1 6.5 2.6l1.2-1.2C14.1 1.6 11.4.5 8.5.5S2.9 1.6.8 3.6L2 4.8C3.7 3.2 6 2.2 8.5 2.2z"
          fill={ink}
        />
        <path
          d="M8.5 5.6c1.6 0 3 .6 4.1 1.6l1.2-1.2C12.4 4.7 10.5 3.9 8.5 3.9S4.6 4.7 3.2 6l1.2 1.2c1.1-1 2.5-1.6 4.1-1.6z"
          fill={ink}
        />
        <path
          d="M8.5 9c.7 0 1.3.3 1.8.7l1.2-1.2c-.8-.7-1.9-1.2-3-1.2s-2.2.5-3 1.2l1.2 1.2c.5-.4 1.1-.7 1.8-.7zM8.5 12.6l1.6-1.6c-.4-.4-1-.6-1.6-.6s-1.2.2-1.6.6l1.6 1.6z"
          fill={ink}
        />
      </svg>
      <div style={{ position: 'absolute', right: 34, top: 24 }}>
        <div
          style={{
            width: 26,
            height: 13,
            borderRadius: 4,
            border: `1.2px solid ${chrome}`,
            padding: 1.6,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: '82%', height: '100%', borderRadius: 2, background: ink }} />
        </div>
        <div
          style={{
            position: 'absolute',
            right: -3.2,
            top: 4.3,
            width: 1.6,
            height: 4.4,
            borderRadius: 1,
            background: chrome,
          }}
        />
      </div>
    </div>
  );
};

export interface DeviceFrameProps {
  /** Width of the screen area in CSS pixels. Everything else scales from it. */
  screenWidth: number;
  children: React.ReactNode;
  /** Glossy highlight across the glass. Used on devices that hold still. */
  glare?: boolean;
  /** Elevation strength of the cast shadow. */
  shadow?: number;
  className?: string;
  style?: React.CSSProperties;
  screenBackground?: string;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  screenWidth,
  children,
  glare = false,
  shadow = 1,
  className,
  style,
  screenBackground = C.base100,
}) => {
  const scale = screenWidth / SW;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: DEVICE_W * scale,
        height: DEVICE_H * scale,
        ...style,
      }}
    >
      {/*
       * Everything below is authored at true device size and scaled as a single
       * unit, so the bezel, the island and the corner radii keep their real
       * proportions instead of being re-derived per breakpoint.
       */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: DEVICE_W,
          height: DEVICE_H,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: DEVICE_RADIUS + DEVICE_BEZEL,
            boxShadow: `0 40px 90px rgba(15, 23, 42, ${0.22 * shadow}), 0 12px 28px rgba(15, 23, 42, ${0.14 * shadow})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: DEVICE_RADIUS + DEVICE_BEZEL,
            background: 'linear-gradient(145deg, #3a3d42 0%, #1b1c1f 38%, #2b2d31 70%, #121315 100%)',
            boxShadow: 'inset 0 0 0 1.2px rgba(255,255,255,.18), inset 0 0 0 3px #0b0b0c',
          }}
        />
        <div
          className="app-mock"
          style={{
            position: 'absolute',
            left: DEVICE_BEZEL,
            top: DEVICE_BEZEL,
            width: SW,
            height: SH,
            borderRadius: DEVICE_RADIUS,
            overflow: 'hidden',
            background: screenBackground,
            fontFamily: FONT,
            color: C.content,
            textAlign: 'left',
            isolation: 'isolate',
          }}
        >
          {children}
          <StatusBar />
          <div
            style={{
              position: 'absolute',
              left: (SW - 124) / 2,
              top: 11,
              width: 124,
              height: 36,
              borderRadius: 18,
              background: '#000',
              zIndex: 60,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: (SW - 138) / 2,
              bottom: 8,
              width: 138,
              height: 5,
              borderRadius: 3,
              background: '#0b0b0c',
              zIndex: 60,
            }}
          />
          {glare && (
            <div
              aria-hidden="true"
              className="device-glare"
              style={{ position: 'absolute', inset: 0, zIndex: 55, pointerEvents: 'none' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
