import React from 'react';
import { C } from '../theme';

export interface BadgeData {
  code: string;
  name: string;
  description: string;
  colorName: string;
  color: string;
  level: 'bronze' | 'silver' | 'gold' | 'special';
  iconUrl: string;
}

export const OFFICIAL_BADGES: Record<string, BadgeData> = {
  contributor: {
    code: 'contributor',
    name: '贡献者',
    description: '为社区建设做出贡献',
    colorName: 'fuchsia',
    color: '#A21CAF',
    level: 'special',
    iconUrl: '/static/badges/contributor.svg',
  },
  writer_10: {
    code: 'writer_10',
    name: '持续创作',
    description: '累计发布 10 篇主题',
    colorName: 'sky',
    color: '#0369A1',
    level: 'silver',
    iconUrl: '/static/badges/writer-10.svg',
  },
  commenter_50: {
    code: 'commenter_50',
    name: '热心讨论',
    description: '累计发布 50 条评论或回复',
    colorName: 'emerald',
    color: '#047857',
    level: 'silver',
    iconUrl: '/static/badges/commenter-50.svg',
  },
  popular_100: {
    code: 'popular_100',
    name: '社区之光',
    description: '累计获得 100 个赞',
    colorName: 'orange',
    color: '#C2410C',
    level: 'gold',
    iconUrl: '/static/badges/popular-100.svg',
  },
  early_member: {
    code: 'early_member',
    name: '早期成员',
    description: '社区早期加入者',
    colorName: 'cyan',
    color: '#0E7490',
    level: 'special',
    iconUrl: '/static/badges/early-member.svg',
  },
  liked_10: {
    code: 'liked_10',
    name: '受到认可',
    description: '累计获得 10 个赞',
    colorName: 'amber',
    color: '#B45309',
    level: 'silver',
    iconUrl: '/static/badges/liked-10.svg',
  },
  first_post: {
    code: 'first_post',
    name: '初次发帖',
    description: '发布了第一篇主题',
    colorName: 'blue',
    color: '#1D4ED8',
    level: 'bronze',
    iconUrl: '/static/badges/first-post.svg',
  },
  first_comment: {
    code: 'first_comment',
    name: '初次评论',
    description: '留下了第一条评论或回复',
    colorName: 'teal',
    color: '#0F766E',
    level: 'bronze',
    iconUrl: '/static/badges/first-comment.svg',
  },
};

export const WORN_BADGE_COLORS: Record<string, { bg: string; ring: string }> = {
  blue: { bg: '#DBEAFE', ring: '#BFDBFE' },
  emerald: { bg: '#D1FAE5', ring: '#A7F3D0' },
  teal: { bg: '#CCFBF1', ring: '#99F6E4' },
  sky: { bg: '#E0F2FE', ring: '#BAE6FD' },
  cyan: { bg: '#CFFAFE', ring: '#A5F3FC' },
  rose: { bg: '#FFE4E6', ring: '#FECDD3' },
  violet: { bg: '#EDE9FE', ring: '#DDD6FE' },
  purple: { bg: '#F3E8FF', ring: '#E9D5FF' },
  fuchsia: { bg: '#FAE8FF', ring: '#F5D0FE' },
  indigo: { bg: '#E0E7FF', ring: '#C7D2FE' },
  amber: { bg: '#FEF3C7', ring: '#FDE68A' },
  orange: { bg: '#FFEDD5', ring: '#FED7AA' },
  yellow: { bg: '#FEF9C3', ring: '#FEF08A' },
  slate: { bg: '#F1F5F9', ring: '#E2E8F0' },
};

/**
 * Authentic SVG artwork from apps/gooseforum/resource/static/badges/
 */
export const BadgeArtwork: React.FC<{
  code: string;
  size?: number;
  color?: string;
  className?: string;
}> = ({ code, size = 24, color, className }) => {
  const strokeColor = color ?? 'currentColor';

  switch (code) {
    case 'contributor':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#4f46e5'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M12 3l1.6 4.8L18 6l-1.8 4.4L21 12l-4.8 1.6L18 18l-4.4-1.8L12 21l-1.6-4.8L6 18l1.8-4.4L3 12l4.8-1.6L6 6l4.4 1.8z" />
        </svg>
      );
    case 'writer_10':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#2563eb'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );
    case 'commenter_50':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#059669'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M7 8h10" />
          <path d="M7 12h6" />
          <path d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-4-.8L3 21l1.6-4.2A7.4 7.4 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" />
        </svg>
      );
    case 'popular_100':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#b45309'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M8 20h8" />
          <path d="M12 13v6" />
          <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
          <path d="M7 6H4a2 2 0 0 0 2 4h1" />
          <path d="M17 6h3a2 2 0 0 1-2 4h-1" />
        </svg>
      );
    case 'early_member':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#475569'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
        </svg>
      );
    case 'first_post':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#1d4ed8'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case 'first_comment':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#047857'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
        </svg>
      );
    case 'liked_10':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor || '#d97706'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <path d="M12 3l1.8 5.5h5.8l-4.7 3.4 1.8 5.6L12 14.1l-4.7 3.4 1.8-5.6-4.7-3.4h5.8z" />
          <path d="M12 14v7" />
        </svg>
      );
    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          width={size}
          height={size}
          className={className}
        >
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
  }
};

/**
 * Pixel-perfect GfBadgeMedallion replica from ui_kit/lib/src/components/atoms/gf_badge_medallion.dart
 */
export const GfBadgeMedallion: React.FC<{
  code: string;
  color?: string;
  size?: number;
  icon?: React.ReactNode;
}> = ({ code, color, size = 56, icon }) => {
  const badge = OFFICIAL_BADGES[code];
  const badgeColor = color ?? badge?.color ?? '#A21CAF';

  return (
    <div
      className="gf-medallion gf-medallion-outer"
      style={
        {
          '--med-color': badgeColor,
          '--med-size': `${size}px`,
        } as React.CSSProperties
      }
    >
      <div className="gf-medallion-inner">
        <div className="gf-medallion-artwork">
          {icon ?? <BadgeArtwork code={code} size={size * 0.5} color={badgeColor} />}
        </div>
      </div>
    </div>
  );
};

/**
 * UserWornBadge on bottom-right of avatar from forum_app/lib/src/widgets/user_badge.dart
 */
export const UserWornBadge: React.FC<{
  code?: string;
  avatarSize?: number;
}> = ({ code = 'contributor', avatarSize = 88 }) => {
  const badge = OFFICIAL_BADGES[code] ?? OFFICIAL_BADGES.contributor;
  const wornTheme = WORN_BADGE_COLORS[badge.colorName] ?? WORN_BADGE_COLORS.fuchsia;
  const size = Math.max(14, Math.round(avatarSize * 0.3)); // 26.4 -> 26px

  return (
    <div
      title={badge.name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: wornTheme.bg,
        border: `2px solid ${wornTheme.ring}`,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: 2,
        flexShrink: 0,
      }}
    >
      <BadgeArtwork code={code} size={size - 6} color={badge.color} />
    </div>
  );
};

/**
 * GfAchievementCard from ui_kit/lib/src/components/business/gf_achievement_card.dart
 */
export const GfAchievementCard: React.FC<{
  badge: BadgeData;
  onClick?: () => void;
}> = ({ badge, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.base100,
        borderRadius: 18,
        border: `1px solid ${C.line}`,
        padding: '18px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 120ms ease, box-shadow 120ms ease',
        userSelect: 'none',
      }}
    >
      <GfBadgeMedallion code={badge.code} color={badge.color} size={56} />
      <div
        style={{
          marginTop: 12,
          fontSize: 15,
          lineHeight: 1.4,
          fontWeight: 600,
          color: C.content,
        }}
      >
        {badge.name}
      </div>
      {badge.description && (
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            lineHeight: 1.4,
            color: C.iconMuted,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {badge.description}
        </div>
      )}
    </div>
  );
};
