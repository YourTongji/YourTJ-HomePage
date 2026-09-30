import React from 'react';
import { Icon } from '../Icon';
import { C, FONT, alpha } from '../theme';
import { NAV_SAFE_H } from './chrome';
import { useTheme } from '../../hooks/useTheme';

/**
 * 1:1 replica of Flutter's PublishType (publish_type.dart):
 * - moment (瞬间): 'sparkles', Light #9333EA, Dark #C084FC
 * - article (文章): 'book-open', Light #D97706, Dark #FBBF24
 * - question (提问): 'circle-help', Light #059669, Dark #34D399
 */
export const PUBLISH_OPTIONS = [
  {
    type: 'moment',
    label: '瞬间',
    symbol: 'sparkles',
    lightColor: '#9333EA',
    darkColor: '#C084FC',
  },
  {
    type: 'article',
    label: '文章',
    symbol: 'book-open',
    lightColor: '#D97706',
    darkColor: '#FBBF24',
  },
  {
    type: 'question',
    label: '提问',
    symbol: 'circle-help',
    lightColor: '#059669',
    darkColor: '#34D399',
  },
] as const;

export type PublishOptionType = (typeof PUBLISH_OPTIONS)[number]['type'];

interface ComposeMenuProps {
  open: boolean;
  onClose: () => void;
  onSelect?: (type: PublishOptionType) => void;
  bottomOffset?: number;
}

/**
 * ComposeMenu: 1:1 replica of Flutter forum_app/lib/src/widgets/compose_menu.dart.
 * A modal dialog first level above the FAB anchored to bottom-right.
 *
 * Displays the 3 publishing format cards:
 * 1. 瞬间 (Moment)
 * 2. 文章 (Article)
 * 3. 提问 (Question)
 * Followed by the close FAB with 'x' icon.
 */
export const ComposeMenu: React.FC<ComposeMenuProps> = ({
  open,
  onClose,
  onSelect,
  bottomOffset = 72 + NAV_SAFE_H,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 44,
        pointerEvents: open ? 'auto' : 'none',
        overflow: 'hidden',
      }}
      aria-hidden={!open}
    >
      {/* Barrier scrim: Theme.of(context).colorScheme.scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0.38)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: open ? 1 : 0,
          transition: 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Aligned to bottom-right, exactly above bottom navigation */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: bottomOffset,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {/* 3 format cards in exact order of PublishType.values */}
        {PUBLISH_OPTIONS.map((opt, index) => {
          const color = isDark ? opt.darkColor : opt.lightColor;
          const delay = (2 - index) * 35; // Stagger bottom-to-top

          return (
            <div
              key={opt.type}
              style={{
                marginBottom: 12,
                opacity: open ? 1 : 0,
                transform: open
                  ? 'translateY(0) scale(1)'
                  : `translateY(${(3 - index) * 16}px) scale(0.92)`,
                transition: `opacity 220ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 240ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (onSelect) onSelect(opt.type);
                  onClose();
                }}
                style={{
                  background: C.base100,
                  borderRadius: 18,
                  boxShadow: isDark
                    ? '0 6px 20px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25)'
                    : '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06)',
                  border: `1px solid ${alpha(C.line, 0.7)}`,
                  padding: '10px 12px 10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'transform 120ms ease, background-color 150ms ease',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'scale(0.96)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {/* option.label(l10n): bodyStrong */}
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: 16,
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: C.content,
                    marginRight: 20,
                    letterSpacing: -0.1,
                  }}
                >
                  {opt.label}
                </span>

                {/* PublishTypeIcon: size 32 */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: alpha(color, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={opt.symbol} size={16} color={color} />
                </div>
              </button>
            </div>
          );
        })}

        {/* FloatingActionButton with 'x' close symbol */}
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭发布菜单"
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: C.primary,
            boxShadow: `0 8px 20px ${alpha(C.primary, 0.4)}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            opacity: open ? 1 : 0,
            transform: open ? 'scale(1) rotate(0deg)' : 'scale(0.85) rotate(-45deg)',
            transition:
              'opacity 180ms ease, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            outline: 'none',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.92) rotate(0deg)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          }}
        >
          <Icon name="x" size={28} color={C.primaryContent} />
        </button>
      </div>
    </div>
  );
};

export default ComposeMenu;
