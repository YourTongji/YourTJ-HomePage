import React from 'react';
import {Icon} from '../Icon';
import {C, alpha} from '../theme';
import {GfLogo} from './LogoMark';
import {Avatar} from './primitives';
import {STATUS_H} from './Phone';

/*
 * The mobile shell's chrome, ported from the app's own widgets.
 *
 * Everything here is a port of a component in apps/mobile, not a drawing of
 * one: RootSurface (widgets/root_surface.dart) is the chrome every shell tab
 * root renders, GfTabBar (ui_kit) is the toolbar tab strip, GfSearchField
 * (ui_kit) is the pill search field, GfBottomNavigation (ui_kit) is the four
 * destinations, and GfLogo is the theme-aware brand mark. Sizes, paddings,
 * radii and colours are copied from those sources.
 *
 * The app has moved on from the layout the promo film was cut against, and that
 * older shape is what this preview used to draw: an app bar whose leading slot
 * held the wordmark, four actions, a centred logo *inside* the bar, no tab
 * strip under it, and a nav whose fourth tab was 我的. The current shell is:
 *
 *   [avatar 30]        [brand mark 32 or the page title, centred]        [actions]
 *   [ optional toolbar: tab strip / search field ]
 *   [ 1px divider ]
 *   ... body ...
 *   [ compose FAB, bottom-right, when the page wants one ]
 *   [ 首页 校园 通知 消息 ]  <- nav, icon-only, badges on 通知 and 消息
 */

export const APPBAR_H = 56;
export const NAV_H = 56;
export const NAV_SAFE_H = 34;
/** GfTabBar.heightFor: max(48, 16 * 1.25 + 28). */
export const TAB_BAR_H = 48;
/** GfTabBar item: label + 16pt padding on both sides. */
const TAB_PADDING = 16;

export {GfLogo};


/**
 * GfGlassIconButton: A 44pt circular button on clipped cover glass with subtle border and blur.
 * Ported directly from ui_kit/gf_glass_icon_button.dart and gf_glass_surface.dart.
 */
export const GfGlassIconButton: React.FC<{
  symbol: string;
  size?: number;
  iconSize?: number;
  tooltip?: string;
  onClick?: () => void;
}> = ({symbol, size = 44, iconSize = 22, tooltip, onClick}) => (
  <div
    role="button"
    title={tooltip}
    onClick={onClick}
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(20, 27, 40, 0.55)',
      border: '1px solid rgba(255, 255, 255, 0.26)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.18)',
    }}
  >
    <Icon name={symbol} size={iconSize} color="#ffffff" />
  </div>
);


/** The app's 44pt icon button: a bare symbol in a square touch target. */
export const GfIconButton: React.FC<{symbol: string; size?: number; color?: string}> = ({
  symbol,
  size = 24,
  color = C.content,
}) => (
  <div
    style={{
      width: 44,
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    <Icon name={symbol} size={size} color={color} />
  </div>
);

/**
 * GfTabBar: a scrollable strip of text tabs with a fixed 28x4 indicator.
 *
 * The bar is 48pt tall; each item is its label plus 32pt of padding, and the
 * active label is base-content/w600 over a primary indicator that sits on the
 * bar's bottom edge. `heightFor` is `max(48, textScaler(16) * 1.25 + 28)`.
 */
export const GfTabBar: React.FC<{
  tabs: {label: string; value: string}[];
  selected: string;
  onSelect?: (value: string) => void;
}> = ({tabs, selected, onSelect}) => (
  <div
    style={{
      height: TAB_BAR_H,
      display: 'flex',
      alignItems: 'stretch',
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}
  >
    {tabs.map((tab) => {
      const active = tab.value === selected;
      return (
        <button
          key={tab.value}
          type="button"
          onClick={onSelect ? () => onSelect(tab.value) : undefined}
          aria-selected={active}
          style={{
            appearance: 'none',
            background: 'none',
            border: 0,
            padding: `0 ${TAB_PADDING}px`,
            height: TAB_BAR_H,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: onSelect ? 'pointer' : 'default',
            font: 'inherit',
          }}
        >
          <div
            style={{
              marginTop: 12,
              fontSize: 16,
              lineHeight: 1.25,
              fontWeight: active ? 600 : 400,
              color: active ? C.content : C.iconMuted,
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </div>
          <div style={{flex: 1}} />
          <div
            style={{
              width: 28,
              height: 4,
              borderRadius: 2,
              background: active ? C.primary : 'transparent',
            }}
          />
        </button>
      );
    })}
  </div>
);

/**
 * GfSearchField: a filled pill — base-300, radius 28, 48pt tall, 16pt text, a
 * 20pt search glyph 16pt from the left, and the hint in icon-muted.
 */
export const GfSearchField: React.FC<{hint: string}> = ({hint}) => (
  <div
    data-hover="搜索会话"
    style={{
      height: 48,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      boxSizing: 'border-box',
      borderRadius: 28,
      background: C.base300,
    }}
  >
    <Icon name="search" size={20} color={C.iconMuted} />
    <span style={{fontSize: 16, color: C.iconMuted, marginLeft: 10}}>{hint}</span>
  </div>
);

/**
 * The shell's compose FAB: a 56pt primary circle with a 28pt symbol, sitting
 * 16pt from the right edge and 72pt above the nav (RootSurface's position).
 */
export const ComposeFab: React.FC<{symbol: string}> = ({symbol}) => (
  <div
    data-hover="发布"
    style={{
      position: 'absolute',
      right: 16,
      bottom: 72 + NAV_SAFE_H,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: C.primary,
      boxShadow: `0 6px 16px ${alpha(C.primary, 0.35)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 25,
    }}
  >
    <Icon name={symbol} size={28} color={C.primaryContent} />
  </div>
);

/**
 * RootSurface (widgets/root_surface.dart): the chrome every shell tab root
 * wraps its body in.
 *
 * A 56pt bar holding the account avatar on the left, the page's title or the
 * brand mark centred, and the page's own actions on the right; an optional
 * toolbar under it (a tab strip, a search field, both of known height); a 1px
 * divider; and then the body, which in the app scrolls *under* the chrome with
 * `top = 56 + toolbarHeight` / `bottom = 80 + safeArea` insets. The mock lays
 * the same thing out with the body as a sibling, so the geometry is identical
 * without a scroll controller.
 */
export const RootSurface: React.FC<{
  /** Centred page title; ignored when `logo` is set. */
  title?: string;
  /** The home tab centres the brand mark instead of a title. */
  logo?: boolean;
  actions?: React.ReactNode;
  toolbar?: React.ReactNode;
  toolbarHeight?: number;
  /** A compose FAB with this symbol; the app default is 发布 with 'plus'. */
  composeSymbol?: string;
  children: React.ReactNode;
}> = ({title, logo = false, actions, toolbar, toolbarHeight = 0, composeSymbol, children}) => {
  const chromeHeight = STATUS_H + APPBAR_H + (toolbar ? toolbarHeight : 0) + 1;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.base100, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, background: C.base100, zIndex: 20}}>
        <div style={{height: STATUS_H}} />
        <div style={{height: APPBAR_H, display: 'flex', alignItems: 'center', padding: '0 8px'}}>
          <div style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Avatar who="me" size={30} />
          </div>
          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0}}>
            {logo || !title ? (
              <GfLogo size={32} />
            ) : (
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </span>
            )}
          </div>
          {actions ?? <div style={{width: 48}} />}
        </div>
        {toolbar && <div style={{height: toolbarHeight, overflow: 'hidden'}}>{toolbar}</div>}
        <div style={{height: 1, background: alpha(C.line, 0.85)}} />
      </div>

      <div style={{position: 'absolute', top: chromeHeight, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
        {children}
      </div>

      {composeSymbol && <ComposeFab symbol={composeSymbol} />}
    </div>
  );
};

/*
 * The shell's bottom navigation — gf_bottom_navigation.dart, as router.dart
 * configures it.
 *
 * GfShellDestination is `{ home, campus, notifications, messages }`: four
 * destinations, and the fourth is 消息, not 我的 — the profile moved out of the
 * nav and into the account drawer the avatar opens. The shell passes
 * `showLabels: false`, so each key is a 48x36 plate (radius 14) holding a 24pt
 * symbol: primary at 9% behind the selected one, primary vs icon-muted for the
 * glyph. The unread dot — 7pt, primary, ringed in base-100 at (3, 8) inside the
 * plate — belongs to 通知 and 消息, fed by the shell's two unread counters.
 *
 * `onSelect` is what separates the two uses: static in the showcase, where the
 * phones are pictures, and live in the hero, where the visitor is invited to
 * press the keys.
 */
const SHELL_DESTINATIONS: {label: string; symbol: string; badge?: 'notifications' | 'messages'}[] = [
  {label: '首页', symbol: 'house'},
  {label: '校园', symbol: 'graduation-cap'},
  {label: '通知', symbol: 'bell', badge: 'notifications'},
  {label: '消息', symbol: 'mail', badge: 'messages'},
];

export const BottomNav: React.FC<{
  active: number;
  onSelect?: (index: number) => void;
  unread?: {notifications: boolean; messages: boolean} | boolean;
}> = ({active, onSelect, unread = {notifications: true, messages: true}}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: NAV_H + NAV_SAFE_H,
      background: C.base100,
      borderTop: `1px solid ${C.line}`,
      zIndex: 30,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div style={{height: NAV_H, display: 'flex', alignItems: 'stretch'}}>
      {SHELL_DESTINATIONS.map((destination, index) => {
        const selected = index === active;
        const badged =
          destination.badge
            ? typeof unread === 'boolean'
              ? unread
              : unread[destination.badge]
            : false;
        const key = (
          <div
            data-hover={destination.label}
            style={{
              position: 'relative',
              width: 48,
              height: 36,
              borderRadius: 14,
              background: selected ? alpha(C.primary, 0.09) : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name={selected ? `${destination.symbol}-filled` : destination.symbol}
              size={24}
              color={selected ? C.primary : C.iconMuted}
            />
            {badged && (
              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  background: C.primary,
                  border: `1px solid ${C.base100}`,
                  boxSizing: 'content-box',
                }}
              />
            )}
          </div>
        );
        const cell: React.CSSProperties = {
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        };
        if (!onSelect) {
          return (
            <div key={destination.label} style={cell}>
              {key}
            </div>
          );
        }
        return (
          <button
            key={destination.label}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={destination.label}
            aria-current={selected ? 'page' : undefined}
            className="app-nav-key"
            style={cell}
          >
            {key}
          </button>
        );
      })}
    </div>
  </div>
);

/** Kept for the film's screens: the FAB that morphs into the compose menu. */
export const Fab: React.FC<{open: number}> = ({open}) => (
  <ComposeFab symbol={open > 0.5 ? 'x' : 'plus'} />
);
