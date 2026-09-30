import React, { useEffect, useRef, useState } from 'react';
import {
  ArchiveIcon,
  BookIcon,
  BookmarkIcon,
  ChevronDownIcon,
  CourseScreenIcon,
  FileTextIcon,
  MoonIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from '../../components/icons';
import { useTheme } from '../../hooks/useTheme';
import { Avatar } from './primitives';
import { STATUS_H, SW } from './Phone';

interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
}

type ThemeModeChoice = 'system' | 'light' | 'dark';

/**
 * AccountDrawer: Faithfully ported 1:1 from Flutter's AccountDrawer & AccountDrawerLayer
 * (apps/mobile/packages/forum_app/lib/src/widgets/account_drawer.dart).
 *
 * Exact Geometry & Anatomy from Flutter source:
 * - Width: (constraints.maxWidth * .84).clamp(0, 400) ≈ 328pt (for SW = 390)
 * - Shape: const RoundedRectangleBorder() (strict zero border-radius)
 * - Surface: GfTheme.colorsOf(context).base100
 * - Backdrop: modal barrier with Colors.black.withValues(alpha: .54)
 * - Motion: GfMotion.overlay (280ms) + GfMotion.enterCurve (cubic-bezier(0.22, 1, 0.36, 1))
 * - Header (EdgeInsets.fromLTRB(24, 12, 24, 12)):
 *   - 56pt GfAvatar
 *   - SizedBox(height: 12)
 *   - Nickname: '校园漫游者' (type.title2.copyWith(fontSize: 20))
 *   - Username: '@yzxoi' (type.small.copyWith(color: colors.iconMuted))
 *   - SizedBox(height: 8)
 *   - Wrap(spacing: 18):
 *     - '108 正在关注' (formatNumber + l10n.accountFollowing)
 *     - '13 关注者' (formatNumber + l10n.accountFollowers)
 * - Signed-in entries (each ListTile: minTileHeight: 56, horizontalTitleGap: 16, horizontalPadding: 24):
 *   1. '个人资料' (user-round, 24pt)
 *   2. '收藏' (bookmark, 24pt)
 *   3. '草稿箱' (file-text, 24pt)
 *   4. '我的内容' (archive, 24pt)
 *   5. '回收站' (trash-2, 24pt)
 *   6. '我的课评' (graduation-cap, 24pt)
 * - GfDivider(key: drawerSectionDividerKey, inset: 24) with vertical padding 8
 * - Bottom entries:
 *   7. '设置' (settings, 24pt)
 *   8. '关于社区' (book-open, 24pt)
 *   9. '外观' (moon, 24pt, trailing: chevron-down 18pt) -> _showThemeModeSheet
 */
export const AccountDrawer: React.FC<AccountDrawerProps> = ({ open, onClose }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Close drawer and sheet on Esc key
  useEffect(() => {
    if (!open) {
      setThemeSheetOpen(false);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (themeSheetOpen) {
          setThemeSheetOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, themeSheetOpen, onClose]);

  // Width formula directly from Flutter LayoutBuilder:
  // _drawerWidth = (constraints.maxWidth * .84).clamp(0, 400);
  const DRAWER_WIDTH = Math.min(400, Math.max(0, SW * 0.84));

  // Signed-in menu entries matching Flutter account_drawer.dart lines 478-491
  const accountEntries = [
    { id: 'profile', icon: UserIcon, title: '个人资料', path: '/profile' },
    { id: 'bookmarks', icon: BookmarkIcon, title: '收藏', path: '/profile?stream=bookmarks' },
    { id: 'drafts', icon: FileTextIcon, title: '草稿箱', path: '/drafts' },
    { id: 'content', icon: ArchiveIcon, title: '我的内容', path: '/my-content' },
    { id: 'trash', icon: TrashIcon, title: '回收站', path: '/recycle-bin' },
    { id: 'reviews', icon: CourseScreenIcon, title: '我的课评', path: '/my-course-reviews' },
  ];

  // System appearance sheet choices matching Flutter lines 541-545
  const themeChoices: { key: ThemeModeChoice; label: string }[] = [
    { key: 'system', label: '跟随系统' },
    { key: 'light', label: '浅色' },
    { key: 'dark', label: '深色' },
  ];

  const handleSelectTheme = (choice: ThemeModeChoice) => {
    if (choice === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if ((systemDark && theme !== 'dark') || (!systemDark && theme !== 'light')) {
        toggleTheme();
      }
    } else if (choice !== theme) {
      toggleTheme();
    }
    setThemeSheetOpen(false);
  };

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        pointerEvents: open ? 'auto' : 'none',
        overflow: 'hidden',
      }}
    >
      {/*
        Modal Barrier Backdrop:
        Semantics: modalBarrierDismissLabel
        Color: Colors.black.withValues(alpha: .54 * _progress.value)
      */}
      <div
        onClick={() => {
          if (themeSheetOpen) {
            setThemeSheetOpen(false);
          } else {
            onClose();
          }
        }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.54)',
          opacity: open ? 1 : 0,
          transition: 'opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)',
          cursor: 'pointer',
        }}
      />

      {/*
        Slide-out Drawer Panel:
        Flutter: Drawer(
          width: _drawerWidth,
          backgroundColor: GfTheme.colorsOf(context).base100,
          shape: const RoundedRectangleBorder(),
          child: SafeArea(child: ListView(padding: const EdgeInsets.symmetric(vertical: 12), ...))
        )
      */}
      <div
        ref={drawerRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: DRAWER_WIDTH,
          background: 'var(--app-base-100)',
          color: 'var(--app-base-content)',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: open ? '16px 0 32px rgba(0, 0, 0, 0.22)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        className="no-scrollbar"
      >
        {/* SafeArea top status bar spacing */}
        <div style={{ height: STATUS_H }} />

        {/* ListView vertical padding (padding: const EdgeInsets.symmetric(vertical: 12)) */}
        <div style={{ paddingTop: 12, paddingBottom: 12, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/*
            Account Header:
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 12),
              child: Column(...)
            )
          */}
          <div style={{ padding: '12px 24px 12px 24px' }}>
            {/* GfAvatar (size: 56, circular) */}
            <div
              onClick={onClose}
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <Avatar who="me" size={56} ring />
            </div>

            {/* const SizedBox(height: 12) */}
            <div style={{ height: 12 }} />

            {/* Nickname: Text(user?.nickname, style: type.title2.copyWith(fontSize: 20)) */}
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
                color: 'var(--app-base-content)',
              }}
            >
              你他钩的
            </div>

            {/* Username: Text('@${viewer!.username}', style: type.small.copyWith(color: colors.iconMuted)) */}
            <div
              style={{
                fontSize: 15,
                lineHeight: 1.4,
                color: 'var(--app-icon-muted)',
              }}
            >
              @hiytj
            </div>

            {/* const SizedBox(height: 8) */}
            <div style={{ height: 8 }} />

            {/*
              Wrap(
                spacing: 18,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: [
                  connection(l10n.accountFollowing, user?.followingCount, 'following'),
                  connection(l10n.accountFollowers, user?.followerCount, 'followers'),
                ]
              )
            */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              {/* Following TextButton */}
              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--app-base-content)' }}>114</span>
                <span style={{ color: 'var(--app-icon-muted)' }}>&nbsp;正在关注</span>
              </button>

              {/* Followers TextButton */}
              <button
                type="button"
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--app-base-content)' }}>154</span>
                <span style={{ color: 'var(--app-icon-muted)' }}>&nbsp;关注者</span>
              </button>
            </div>
          </div>

          {/*
            Signed-in Account Entries:
            Flutter: entry(icon, title, path)
            ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 24),
              minTileHeight: 56,
              minLeadingWidth: 24,
              horizontalTitleGap: 16,
              leading: GfSymbol(icon, size: 24, color: colors.baseContent),
              title: Text(title, style: type.bodyStrong.copyWith(fontSize: 18, height: 1.3)),
              ...
            )
          */}
          {accountEntries.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                width: '100%',
                height: 56,
                padding: '0 24px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 120ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor =
                  'color-mix(in srgb, var(--app-base-content) 7%, transparent)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor =
                  'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
              }}
            >
              <item.icon
                className="h-6 w-6 shrink-0"
                style={{ color: 'var(--app-base-content)' }}
              />
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: 'var(--app-base-content)',
                }}
              >
                {item.title}
              </span>
            </button>
          ))}

          {/*
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 8),
              child: GfDivider(key: drawerSectionDividerKey, inset: 24),
            )
          */}
          <div style={{ padding: '8px 0' }}>
            <div
              data-key="drawer-section-divider"
              style={{
                height: 1,
                background: 'var(--app-line)',
                margin: '0 24px',
              }}
            />
          </div>

          {/*
            Bottom items:
            entry('settings', l10n.settingsTitle, '/settings')
            entry('book-open', l10n.siteInfoTitle, '/about')
            entry('moon', l10n.settingsAppearance, null, trailing: GfSymbol('chevron-down', size: 18, color: colors.iconMuted), onTap: () => _showThemeModeSheet(context))
          */}
          {/* 设置 */}
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              height: 56,
              padding: '0 24px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 7%, transparent)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
            }}
          >
            <SettingsIcon
              className="h-6 w-6 shrink-0"
              style={{ color: 'var(--app-base-content)' }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: 1.3,
                color: 'var(--app-base-content)',
              }}
            >
              设置
            </span>
          </button>

          {/* 关于社区 */}
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              height: 56,
              padding: '0 24px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 7%, transparent)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
            }}
          >
            <BookIcon
              className="h-6 w-6 shrink-0"
              style={{ color: 'var(--app-base-content)' }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: 1.3,
                color: 'var(--app-base-content)',
              }}
            >
              关于社区
            </span>
          </button>

          {/* 外观 (带 trailing chevron-down, 点击展开 Flutter 外观底部抽屉) */}
          <button
            type="button"
            onClick={() => setThemeSheetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              width: '100%',
              height: 56,
              padding: '0 24px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 120ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 7%, transparent)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor =
                'color-mix(in srgb, var(--app-base-content) 4.5%, transparent)';
            }}
          >
            <MoonIcon
              className="h-6 w-6 shrink-0"
              style={{ color: 'var(--app-base-content)' }}
            />
            <span
              style={{
                flex: 1,
                fontSize: 18,
                fontWeight: 600,
                lineHeight: 1.3,
                color: 'var(--app-base-content)',
              }}
            >
              外观
            </span>
            <ChevronDownIcon
              className="h-[18px] w-[18px] shrink-0"
              style={{ color: 'var(--app-icon-muted)' }}
            />
          </button>
        </div>
      </div>

      {/*
        Flutter _showThemeModeSheet(context):
        showGfBottomSheet<void>(
          context,
          builder: (_) => Padding(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(l10n.settingsAppearance, style: type.title2),
                const SizedBox(height: 12),
                RadioGroup<ThemeMode>(...)
              ]
            )
          )
        )
      */}
      {themeSheetOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 150,
            overflow: 'hidden',
          }}
        >
          {/* BottomSheet Scrim */}
          <div
            onClick={() => setThemeSheetOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              animation: 'fade-in 200ms ease forwards',
            }}
          />

          {/* BottomSheet Surface (top radius: 24px) */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'var(--app-base-100)',
              color: 'var(--app-base-content)',
              borderRadius: '24px 24px 0 0',
              padding: '20px 16px 28px 16px',
              boxShadow: '0 -8px 28px rgba(0, 0, 0, 0.25)',
              transform: 'translateY(0)',
              transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Sheet Title: Text(l10n.settingsAppearance, style: type.title2) */}
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.3,
                color: 'var(--app-base-content)',
              }}
            >
              外观
            </div>

            {/* const SizedBox(height: 12) */}
            <div style={{ height: 12 }} />

            {/* RadioListTile options */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {themeChoices.map((choice) => {
                const isSelected =
                  choice.key === 'system'
                    ? false
                    : (choice.key === 'dark' && theme === 'dark') ||
                      (choice.key === 'light' && theme === 'light');

                return (
                  <button
                    key={choice.key}
                    type="button"
                    onClick={() => handleSelectTheme(choice.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '12px 4px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 17,
                        fontWeight: 400,
                        color: 'var(--app-base-content)',
                      }}
                    >
                      {choice.label}
                    </span>
                    {/* Material Radio Indicator */}
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: `2px solid ${
                          isSelected ? 'var(--app-primary)' : 'var(--app-icon-muted)'
                        }`,
                        display: 'grid',
                        placeItems: 'center',
                        transition: 'border-color 150ms ease',
                      }}
                    >
                      {isSelected && (
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: 'var(--app-primary)',
                          }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
