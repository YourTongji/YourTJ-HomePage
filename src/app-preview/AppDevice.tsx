import React from 'react';
import type { AppScreenEntry, AppScreenRenderOptions } from './screens/registry';
import { DeviceFrame } from './ui/Phone';

export interface AppDeviceProps {
  entry: AppScreenEntry;
  /** Width of the 402pt screen in CSS pixels; the frame derives the rest. */
  screenWidth: number;
  glare?: boolean;
  shadow?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Hook for the page's own motion. The screens render as absolutely-positioned
   * layers, so the page needs one element it owns between the frame and the
   * screen to translate or fade without touching the app's own markup.
   */
  screenClassName?: string;
  /** What the screen should leave room for; see AppScreenRenderOptions. */
  renderOptions?: AppScreenRenderOptions;
  /**
   * Shell chrome the page draws inside the screen, above the screen layer —
   * the hero's live bottom nav. Rendered outside the keyed layer so it survives
   * a screen switch instead of remounting with it.
   */
  overlay?: React.ReactNode;
}

export const AppDevice: React.FC<AppDeviceProps> = ({
  entry,
  screenWidth,
  glare = false,
  shadow = 1,
  className,
  style,
  screenClassName,
  renderOptions,
  overlay,
}) => (
  <DeviceFrame
    screenWidth={screenWidth}
    glare={glare}
    shadow={shadow}
    className={className}
    style={style}
  >
    <div
      key={entry.id}
      className={screenClassName}
      style={{ position: 'absolute', inset: 0 }}
    >
      {entry.render(renderOptions)}
    </div>
    {overlay}
  </DeviceFrame>
);
