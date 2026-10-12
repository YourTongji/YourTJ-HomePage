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

const AppDeviceView: React.FC<AppDeviceProps> = ({
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
    {/*
     * The boundary sits outside the keyed layer on purpose. A boundary created
     * by the switch itself would have nothing to keep on screen and would show
     * its empty fallback while the next screen's chunk loads; an existing one
     * lets a deferred switch (see AppShowcase) keep the current screen visible
     * until the next one is ready.
     */}
    <React.Suspense fallback={null}>
      <div
        key={entry.id}
        className={screenClassName}
        style={{ position: 'absolute', inset: 0 }}
      >
        {entry.render(renderOptions)}
      </div>
    </React.Suspense>
    {overlay}
  </DeviceFrame>
);

export const AppDevice = React.memo(AppDeviceView);
