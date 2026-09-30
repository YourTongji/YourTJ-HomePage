import React from 'react';
import {
  ActivityIcon,
  BellIcon,
  BookIcon,
  CalendarIcon,
  CampusScreenIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  CommentIcon,
  CompassIcon,
  CourseScreenIcon,
  FileTextIcon,
  FlameIcon,
  HeartIcon,
  HelpIcon,
  HouseIcon,
  LanguageIcon,
  LibraryIcon,
  LinkIcon,
  MoonIcon,
  SearchIcon,
  StarIcon,
  UsersIcon,
} from '../components/icons';
import { Avatar } from '../app-preview/ui/primitives';
import { assetUrl } from '../utils/assets';
import { HUB, muted, tint } from './tokens';

/*
 * Shared chrome and parts for the YourTJHub previews.
 *
 * These are ports of the product's own building blocks — AppShell.vue for the
 * shell, and the `.gf-*` component classes from
 * apps/gooseforum/resource/src/styles/components.css for everything else
 * (gf-panel, gf-card, gf-button, gf-input, gf-badge, gf-icon-button, gf-tab,
 * gf-topic-chip). Sizes, radii, borders and alpha values are copied from those
 * classes rather than invented, so a preview can never show a nicer product than
 * the one that ships.
 *
 * Two deliberate choices:
 *
 * 1. Everything is measured in the product's units (14px body text, 8px control
 *    radius, 16px panel radius) on a fixed 1280x860 canvas that is scaled as a
 *    whole — the same trick the device previews use, so the marketing page never
 *    reflows a page that is meant to read as a screenshot.
 * 2. Nothing here is interactive. The canvas is a picture of the product, so it
 *    carries aria-hidden at the call site and the real destinations live in the
 *    preview section's own links.
 */

export const HUB_CANVAS_WIDTH = 1280;
export const HUB_CANVAS_HEIGHT = 880;

const SIDEBAR_WIDTH = 172;

/**
 * The header brand's box, from AppShell.vue's `sm:h-9 w-auto max-w-40` on the
 * wordmark image. The product's header is `h-16` on desktop, as this one is.
 */
const BRAND_HEIGHT = 36;

/** border-line at an alpha, matching Tailwind's `border-line/70` in the product. */
export const edge = (alpha: number) => `color-mix(in oklab, ${HUB.line} ${alpha}%, transparent)`;

const NAV_PRIMARY = [
  { label: '内容', icon: <CommentIcon className="h-3.5 w-3.5" /> },
  { label: '热门', icon: <FlameIcon className="h-3.5 w-3.5" /> },
  { label: '流行', icon: <ActivityIcon className="h-3.5 w-3.5" /> },
];

const NAV_GROUPS = [
  {
    label: '功能',
    items: [
      { label: '我的校园', icon: <CampusScreenIcon className="h-3.5 w-3.5" /> },
      { label: '校园地图', icon: <CompassIcon className="h-3.5 w-3.5" /> },
      { label: '课程', icon: <CourseScreenIcon className="h-3.5 w-3.5" /> },
      { label: '排课器', icon: <CalendarIcon className="h-3.5 w-3.5" /> },
      { label: 'Wiki', icon: <LibraryIcon className="h-3.5 w-3.5" /> },
    ],
  },
  {
    label: '资源',
    items: [
      { label: '运行状态', icon: <ActivityIcon className="h-3.5 w-3.5" /> },
      { label: '友情链接', icon: <LinkIcon className="h-3.5 w-3.5" /> },
      { label: '赞助商', icon: <HeartIcon className="h-3.5 w-3.5" /> },
    ],
  },
];

const CATEGORIES = [
  { name: '论坛运营', color: '#059669' },
  { name: '闲聊茶馆', color: '#e11d48' },
  { name: '技术分享', color: '#2563eb' },
  { name: '选课社区', color: '#f59e0b' },
  { name: '升学求职', color: '#9333ea' },
];

const NavRow: React.FC<{
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  accent?: string;
}> = ({ label, icon, active, accent }) => (
  <div
    data-hover={accent ? '分类' : '导航'}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 26,
      padding: '0 10px',
      borderRadius: 6,
      fontSize: 12.5,
      fontWeight: active ? 600 : 500,
      color: active ? HUB.primary : muted(0.78),
      background: active ? tint(HUB.primary, 10) : 'transparent',
    }}
  >
    {accent ? (
      <span style={{ width: 6, height: 6, borderRadius: 6, background: accent, flexShrink: 0 }} />
    ) : (
      <span style={{ display: 'flex', color: active ? HUB.primary : muted(0.5) }}>{icon}</span>
    )}
    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  </div>
);

const Sidebar: React.FC<{ activePage?: string; wikiMode?: boolean }> = ({ activePage, wikiMode }) => (
  <div
    style={{
      width: SIDEBAR_WIDTH,
      flexShrink: 0,
      borderRight: `1px solid ${HUB.line}`,
      padding: '14px 10px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    {wikiMode ? (
      <>
        {/* Sticky top capsule from WikiSidebar.vue: Home & Wiki switcher */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            padding: 3,
            borderRadius: 999,
            border: `1px solid ${HUB.line}`,
            background: HUB.base100,
          }}
        >
          {[
            { label: '首页', icon: <HouseIcon className="h-3 w-3" />, active: false },
            { label: 'Wiki', icon: <LibraryIcon className="h-3 w-3" />, active: true },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                height: 22,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                color: item.active ? HUB.primary : muted(0.6),
                background: item.active ? tint(HUB.primary, 10) : 'transparent',
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
        {/* WikiSearchBar from WikiSearchBar.vue */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            height: 30,
            padding: '0 8px',
            borderRadius: 8,
            border: `1px solid ${HUB.line}`,
            background: HUB.base100,
            fontSize: 11.5,
            color: muted(0.5),
          }}
        >
          <SearchIcon className="h-3.5 w-3.5" />
          <span style={{ flex: 1 }}>搜索 Wiki…</span>
          <span style={{ fontSize: 10, color: muted(0.35) }}>⌘K</span>
        </div>
        {/* Namespace tree from WikiSidebar.vue & WikiSidebarNode.vue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>同济新手教程</SectionLabel>
          <NavRow label="学校" icon={<ChevronDownIcon className="h-3 w-3" />} />
          {['学校简介与校史', '学院概况', '校园文化'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2.5px 10px 2.5px 22px', fontSize: 11.5, color: muted(0.65) }}>
              <FileTextIcon className="h-3 w-3 opacity-60 flex-shrink-0" />
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
            </div>
          ))}
          <NavRow label="学业" icon={<ChevronDownIcon className="h-3 w-3" />} />
          {['课程培养', '学分、GPA与考试', '保研', '转专业'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2.5px 10px 2.5px 22px', fontSize: 11.5, color: muted(0.65) }}>
              <FileTextIcon className="h-3 w-3 opacity-60 flex-shrink-0" />
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
            </div>
          ))}
          <NavRow label="校园设施" icon={<ChevronDownIcon className="h-3 w-3" />} />
          {['校区分布与交通', '宿舍生活', '食堂餐饮', '图书馆', '校医院'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2.5px 10px 2.5px 22px', fontSize: 11.5, color: muted(0.65) }}>
              <FileTextIcon className="h-3 w-3 opacity-60 flex-shrink-0" />
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
            </div>
          ))}
          <NavRow label="校园生活" icon={<ChevronDownIcon className="h-3 w-3" />} />
          {['学生组织与社团', '社团名单', '心理咨询'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2.5px 10px 2.5px 22px', fontSize: 11.5, color: muted(0.65) }}>
              <FileTextIcon className="h-3 w-3 opacity-60 flex-shrink-0" />
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
            </div>
          ))}
          <div style={{ height: 4 }} />
          <SectionLabel>老乌龙茶</SectionLabel>
          <NavRow label="课程测评" icon={<ChevronDownIcon className="h-3 w-3" />} />
          {['必修课测评', '选修课全校评教'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2.5px 10px 2.5px 22px', fontSize: 11.5, color: muted(0.65) }}>
              <FileTextIcon className="h-3 w-3 opacity-60 flex-shrink-0" />
              <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px 3px 10px', fontSize: 11.5, color: muted(0.7) }}>
            <FileTextIcon className="h-3 w-3 opacity-70 flex-shrink-0" />
            <span>选课说明</span>
          </div>
        </div>
      </>
    ) : (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {NAV_PRIMARY.map((item, index) => (
            <NavRow key={item.label} label={item.label} icon={item.icon} active={index === 0 && !activePage} />
          ))}
        </div>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <SectionLabel>{group.label}</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {group.items.map((item) => (
                <NavRow
                  key={item.label}
                  label={item.label}
                  icon={item.icon}
                  active={item.label === activePage}
                />
              ))}
            </div>
          </div>
        ))}
        <div>
          <SectionLabel>分类</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {CATEGORIES.map((category) => (
              <NavRow key={category.name} label={category.name} accent={category.color} />
            ))}
          </div>
        </div>
      </>
    )}

    <div style={{ marginTop: 'auto', padding: '0 10px', fontSize: 11, color: muted(0.5) }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
        <span>GitHub</span>
        <span>About</span>
      </div>
      <div style={{ lineHeight: 1.4 }}>© 2026 YourTJ Community, All rights reserved.</div>
    </div>
  </div>
);

const Header: React.FC = () => (
  <div
    style={{
      height: 64,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      padding: '0 20px',
      background: HUB.base100,
      borderBottom: `1px solid ${HUB.line}`,
    }}
  >
    {/*
      The product's own wordmark lockup, one file per theme (AppShell.vue's
      `h-9 w-auto max-w-40 object-contain`). Both are mounted and CSS shows the
      one matching the site theme, so switching theme re-paints the header
      without a re-render — the same trick the rest of the mocks use. The
      classes are the shared mock pair, so the app previews' home app bar can
      draw the same lockup from the same files.
    */}
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        className="mock-brand-light"
        src={assetUrl('brand-wordmark-light.webp')}
        alt="YourTJ社区"
        style={{ height: BRAND_HEIGHT, width: 'auto', maxWidth: 160, objectFit: 'contain' }}
      />
      <img
        className="mock-brand-dark"
        src={assetUrl('brand-wordmark-dark.webp')}
        alt="YourTJ社区"
        style={{ height: BRAND_HEIGHT, width: 'auto', maxWidth: 160, objectFit: 'contain' }}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12.5, color: muted(0.7) }}>
      <span>赞助商</span>
      <span>友情链接</span>
    </div>

    <div
      style={{
        flex: 1,
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 34,
        padding: '0 14px',
        borderRadius: 999,
        background: HUB.base200,
        border: `1px solid ${HUB.line}`,
        fontSize: 12.5,
        color: muted(0.5),
      }}
    >
      <SearchIcon className="h-4 w-4" />
      搜索内容、用户、分类或课程...
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <MoonIcon className="h-4 w-4" />
      <LanguageIcon className="h-4 w-4" />
      <span style={{ fontSize: 13, fontWeight: 600 }}>登录</span>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: 30,
          padding: '0 14px',
          borderRadius: 8,
          background: HUB.content,
          color: HUB.base100,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        注册
      </span>
    </div>
  </div>
);

export const HubShell: React.FC<{
  children: React.ReactNode;
  activePage?: string;
  wikiMode?: boolean;
  contentPadding?: string;
}> = ({ children, activePage, wikiMode, contentPadding = '22px 26px' }) => (
  <div
    className="hub-mock"
    style={{
      width: HUB_CANVAS_WIDTH,
      height: HUB_CANVAS_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    <Header />
    <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
      <Sidebar activePage={activePage} wikiMode={wikiMode} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: contentPadding }}>
        {children}
      </div>
    </div>
  </div>
);

/*
 * gf-panel: 1px line border + base-100. Panels in the product's newer pages add
 * rounded-2xl (16px) and a soft ambient shadow on top of this.
 */
export const HubPanel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  radius?: number;
}> = ({ children, style, className, radius = 16 }) => (
  <div
    className={className}
    style={{
      background: HUB.base100,
      border: `1px solid ${edge(35)}`,
      borderRadius: radius,
      boxShadow: '0 1px 4px -1px rgb(0 0 0 / 0.03)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** gf-card: the clean, lightweight card style (8px radius, subtle hairline border, zero heavy shadow). */
export const HubCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => (
  <div
    className={className}
    style={{
      background: HUB.base100,
      border: `1px solid ${edge(35)}`,
      borderRadius: 8,
      boxShadow: `0 1px 3px rgb(0 0 0 / 0.02)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** SectionLabel: the small muted heading above a section (h2 px-1 text-sm/55). */
export const SectionLabel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => (
  <div
    className={className}
    style={{ padding: '0 4px', fontSize: 14, fontWeight: 600, color: muted(0.55), ...style }}
  >
    {children}
  </div>
);

/** gf-page-header: title + description on the left, actions on the right. */
export const HubPageHeader: React.FC<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
}> = ({ title, description, actions }) => (
  <header
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      borderBottom: `1px solid ${edge(70)}`,
      paddingBottom: 16,
    }}
  >
    <div style={{ minWidth: 0 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h1>
      {description && (
        <p style={{ margin: '4px 0 0', maxWidth: 672, fontSize: 14, lineHeight: 1.5, color: muted(0.55) }}>
          {description}
        </p>
      )}
    </div>
    {actions && <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 8 }}>{actions}</div>}
  </header>
);

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

const BUTTON_PALETTE: Record<ButtonVariant, { background: string; color: string; border: string }> = {
  primary: { background: HUB.primary, color: HUB.primaryContent, border: 'transparent' },
  secondary: { background: HUB.base100, color: muted(0.75), border: HUB.line },
  outline: { background: 'transparent', color: muted(0.75), border: HUB.line },
  ghost: { background: 'transparent', color: HUB.primary, border: 'transparent' },
  danger: { background: HUB.error, color: 'oklch(98% 0 0)', border: 'transparent' },
};

/** gf-button: 14px semibold label, 8px radius, 32 or 36px tall. */
export const HubButton: React.FC<{
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, variant = 'outline', size = 'md', icon, style, className }) => {
  const palette = BUTTON_PALETTE[variant];

  return (
    <span
      className={className}
      data-hover={variant === 'primary' ? '主按钮' : '按钮'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: size === 'sm' ? 32 : 36,
        padding: '0 12px',
        borderRadius: 8,
        border: `1px solid ${palette.border}`,
        background: palette.background,
        color: palette.color,
        fontSize: 14,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
};

/** gf-icon-button: square hit area, icon-muted, 8px radius. */
export const HubIconButton: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 28, style }) => (
  <span
    style={{
      display: 'inline-grid',
      placeItems: 'center',
      width: size,
      height: size,
      borderRadius: 8,
      color: HUB.iconMuted,
      ...style,
    }}
  >
    {children}
  </span>
);

/** SiteSelect trigger (gf-input): 40px tall, 1px line border, label + chevron. */
export const HubSelect: React.FC<{
  value: string;
  placeholder?: string;
  style?: React.CSSProperties;
  /** Renders the value in base-content, the placeholder in base-content/45. */
  empty?: boolean;
  radius?: number;
  height?: number;
}> = ({ value, placeholder = '请选择', style, empty, radius = 8, height = 40 }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      width: '100%',
      height,
      padding: '0 12px',
      borderRadius: radius,
      border: `1px solid ${HUB.line}`,
      background: HUB.base100,
      fontSize: 14,
      ...style,
    }}
  >
    <span
      style={{
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: empty ? muted(0.45) : HUB.content,
      }}
    >
      {empty ? placeholder : value}
    </span>
    <ChevronDownIcon className="h-4 w-4" style={{ flexShrink: 0, color: muted(0.45) }} />
  </div>
);

type BadgeTone = 'muted' | 'success' | 'warning' | 'error' | 'primary';

const BADGE_PALETTE: Record<BadgeTone, { background: string; color: string }> = {
  muted: { background: HUB.base300, color: muted(0.55) },
  success: { background: tint(HUB.success, 10), color: HUB.success },
  warning: { background: tint(HUB.warning, 10), color: HUB.warning },
  error: { background: tint(HUB.error, 10), color: HUB.error },
  primary: { background: tint(HUB.primary, 10), color: HUB.primary },
};

/** gf-badge: 12px semibold, 8px radius (the product overrides rounded-full). */
export const HubBadge: React.FC<{
  children: React.ReactNode;
  tone?: BadgeTone;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, tone = 'muted', icon, style }) => {
  const palette = BADGE_PALETTE[tone];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 8,
        background: palette.background,
        color: palette.color,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {icon}
      {children}
    </span>
  );
};

/** Content-type badge on a topic title (question / thought / article). */
export const HubContentBadge: React.FC<{ kind: 1 | 2 | 3 }> = ({ kind }) => {
  const config = {
    1: { label: '提问', color: HUB.success, icon: <HelpIcon className="h-3 w-3" /> },
    2: { label: '瞬间', color: 'oklch(55% 0.22 300)', icon: <StarIcon className="h-3 w-3" /> },
    3: { label: '文章', color: 'oklch(66% 0.15 70)', icon: <BookIcon className="h-3 w-3" /> },
  }[kind];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 20,
        padding: '0 6px',
        borderRadius: 999,
        background: tint(config.color, 15),
        color: config.color,
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

/** gf-topic-chip: 20px chip with the category's colour dot. */
export const HubCategoryChip: React.FC<{ name: string; color: string }> = ({ name, color }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 20,
      padding: '0 6px',
      borderRadius: 8,
      background: HUB.base300,
      fontSize: 11,
      fontWeight: 500,
      color: muted(0.55),
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: 6, background: color }} />
    {name}
  </span>
);

/** gf-tab row: the home feed's 最新 / 热门 / 流行 switcher. */
export const HubTabRow: React.FC<{ items: string[]; active: number }> = ({ items, active }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    {items.map((item, index) => (
      <span
        key={item}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: 32,
          padding: '0 12px',
          borderRadius: 8,
          background: index === active ? HUB.content : 'transparent',
          color: index === active ? HUB.base100 : muted(0.55),
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {item}
      </span>
    ))}
  </div>
);

/** .checkbox-sm: 14px box, primary fill with a white tick when checked. */
export const HubCheckbox: React.FC<{ checked?: boolean; style?: React.CSSProperties }> = ({
  checked,
  style,
}) => (
  <span
    style={{
      display: 'inline-grid',
      placeItems: 'center',
      width: 14,
      height: 14,
      flexShrink: 0,
      borderRadius: 3,
      border: `1px solid ${checked ? HUB.primary : HUB.line}`,
      background: checked ? HUB.primary : HUB.base100,
      color: 'oklch(98% 0 0)',
      ...style,
    }}
  >
    {checked && <CheckIcon className="h-2.5 w-2.5" />}
  </span>
);

/** AvatarStack: overlapping avatars with a ring, as the feed rows render them. */
export const HubAvatarStack: React.FC<{ users: string[]; size?: number }> = ({ users, size = 32 }) => (
  <div style={{ display: 'flex' }}>
    {users.map((user, index) => (
      <span
        key={`${user}-${index}`}
        style={{
          marginLeft: index === 0 ? 0 : -12,
          borderRadius: 999,
          boxShadow: `0 0 0 2px ${HUB.base100}`,
        }}
      >
        <Avatar who={user} size={size} />
      </span>
    ))}
  </div>
);

/** Rating cell: filled star + tabular score, as the course table shows it. */
export const HubRating: React.FC<{ value: number }> = ({ value }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
    <StarIcon className="h-3.5 w-3.5" style={{ color: HUB.warning }} />
    <span style={{ fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{value.toFixed(1)}</span>
  </span>
);

export { Avatar as HubAvatar };
export { BellIcon, ClockIcon, UsersIcon };
