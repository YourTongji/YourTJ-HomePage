import React, { useState } from 'react';
import { Icon } from '../Icon';
import { C, alpha } from '../theme';
import { Avatar } from '../ui/primitives';
import { GfGlassIconButton } from '../ui/chrome';
import {
  GfBadgeMedallion,
  UserWornBadge,
  GfAchievementCard,
  OFFICIAL_BADGES,
  BadgeData,
} from '../ui/GfBadgeMedallion';

/**
 * ProfilePage: Pixel-perfect replica of the Flutter app's profile screen
 * (apps/mobile/packages/forum_app/lib/src/pages/profile/profile_page.dart)
 * using the real GfUserCard (ui_kit/gf_user_card.dart), GfUserCardHeader,
 * GfBadgeMedallion (ui_kit/gf_badge_medallion.dart), UserWornBadge, and GfAchievementCard.
 */

const COVER_HEIGHT = 160;

interface ActivityItem {
  actor: string;
  contextSymbol: string;
  contextLabel: string;
  time: string;
  title?: string;
  text: string;
  likes: number;
  bookmarked?: boolean;
}

const ACTIVITIES: ActivityItem[] = [
  {
    actor: '柚子不酸',
    contextSymbol: 'message-circle',
    contextLabel: '发表回复',
    time: '10分钟前',
    text: '记得带好调频耳机！四平一教考前一定去试音，把音量调舒服，听力播放时保持专注 🎧',
    likes: 128,
    bookmarked: false,
  },
  {
    actor: '柚子不酸',
    contextSymbol: 'file-text',
    contextLabel: '发布主题',
    time: '昨天',
    title: '【干货】同济大学大学英语四级 30 天备考复习指北（含真题词汇表）',
    text: '整理了近五年的四级听力核心高频词汇与阅读答题技巧，附带四平/嘉定两校区往届学长学姐总结的考场注意事项，文末附网盘资料包下载地址。',
    likes: 214,
    bookmarked: true,
  },
  {
    actor: '柚子不酸',
    contextSymbol: 'heart',
    contextLabel: '点赞',
    time: '3天前',
    title: '高数下期末冲刺复习题汇总及林老师答疑记录',
    text: '感谢林老师答疑解惑，多元函数微积分这一章总算梳理顺了，复习题答案已校对完毕。',
    likes: 86,
    bookmarked: false,
  },
];

const TOPICS: ActivityItem[] = [
  {
    actor: '柚子不酸',
    contextSymbol: 'file-text',
    contextLabel: '发布主题',
    time: '昨天',
    title: '【干货】同济大学大学英语四级 30 天备考复习指北（含真题词汇表）',
    text: '整理了近五年的四级听力核心高频词汇与阅读答题技巧，附带四平/嘉定两校区往届学长学姐总结的考场注意事项，文末附网盘资料包下载地址。',
    likes: 214,
    bookmarked: true,
  },
  {
    actor: '柚子不酸',
    contextSymbol: 'file-text',
    contextLabel: '发布主题',
    time: '2周前',
    title: '微积分下大作业选题建议整理与参考资料分享',
    text: '整理了过去两届学长学姐推荐的参考题目和评分侧重点，含多元函数微分学与重积分应用典型案例。',
    likes: 189,
    bookmarked: false,
  },
];

const LIKES: ActivityItem[] = [
  {
    actor: '高数林老师',
    contextSymbol: 'heart',
    contextLabel: '点赞',
    time: '3天前',
    title: '高数下期末冲刺复习题汇总及答疑记录',
    text: '期末冲刺系列复习题第二讲已更新，主要针对多元微积分与常微分方程板块疑难点进行剖析。',
    likes: 342,
    bookmarked: false,
  },
  {
    actor: '嘉定小透明',
    contextSymbol: 'heart',
    contextLabel: '点赞',
    time: '5天前',
    title: '嘉定校区的银杏开始黄了 🍂',
    text: '图书馆门口那排最好看，下课路过记得抬头看看～随手抓拍了几张秋景分享。',
    likes: 208,
    bookmarked: true,
  },
];

const BOOKMARKS: ActivityItem[] = [
  {
    actor: '真题搬运工',
    contextSymbol: 'bookmark',
    contextLabel: '收藏',
    time: '1周前',
    title: '四平 ↔ 嘉定 两校区班车时刻表 (2026最新版)',
    text: '更新了周末晚间加车班次，已同步支持导出手机日历提醒与校车预约规则说明。',
    likes: 890,
    bookmarked: true,
  },
];

// Display badges on profile card: 5 badges matching Flutter user.displayBadges
const DISPLAY_BADGES: BadgeData[] = [
  OFFICIAL_BADGES.contributor,
  OFFICIAL_BADGES.writer_10,
  OFFICIAL_BADGES.commenter_50,
  OFFICIAL_BADGES.popular_100,
  OFFICIAL_BADGES.early_member,
];

// All earned badges in user's profile badge gallery
const ALL_EARNED_BADGES: BadgeData[] = [
  OFFICIAL_BADGES.contributor,
  OFFICIAL_BADGES.writer_10,
  OFFICIAL_BADGES.commenter_50,
  OFFICIAL_BADGES.popular_100,
  OFFICIAL_BADGES.early_member,
  OFFICIAL_BADGES.liked_10,
  OFFICIAL_BADGES.first_post,
  OFFICIAL_BADGES.first_comment,
];

// Official tabs from profile_page.dart (l10n: profileActivity, profilePosts, profileLikedPosts, profileBookmarks, profileBadges)
const TABS = [
  { label: '动态', key: 'timeline' },
  { label: '内容', key: 'topics' },
  { label: '赞过', key: 'likes' },
  { label: '收藏', key: 'bookmarks' },
  { label: '徽章', key: 'badges' },
];

export const ProfilePage: React.FC<{
  follow?: number;
  pressFollow?: boolean;
  pressMail?: boolean;
  self?: boolean;
}> = ({ follow = 1, pressFollow, pressMail, self = false }) => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const following = follow >= 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: C.base100,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      className="no-scrollbar"
    >
      {/* 1. GfUserCardHeader: Cover + Glass Icon Buttons + Overlapping Avatar */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: COVER_HEIGHT,
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 45%, #1e3a8a 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle mesh background glows matching official mobile theme */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(ellipse at 85% 20%, rgba(56, 189, 248, 0.32), transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(139, 92, 246, 0.22), transparent 50%)`,
          }}
        />

        {/* Top Dark Scrim Gradient (Color(0x99000000) -> Color(0x88000000) -> transparent) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.28) 55%, transparent 100%)',
          }}
        />

        {/*
          Glass Navigation Actions on top of cover:
          Matches Flutter profile_page.dart lines 684-704 & 1084-1126:
          - Leading: Navigator.canPop ? GfGlassIconButton(symbol: 'arrow-left') : null
          - Actions: Row([_profileMenu (ellipsis), if (isOwnProfile) GfGlassIconButton(symbol: 'bell')])
        */}
        <div
          style={{
            position: 'absolute',
            top: 53, // STATUS_H (47) + (56 - 44)/2 = 53
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 15,
            pointerEvents: 'auto',
          }}
        >
          {!self ? (
            <GfGlassIconButton symbol="arrow-left" tooltip="返回" />
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GfGlassIconButton symbol="ellipsis" tooltip="更多" />
            {self && (
              <GfGlassIconButton symbol="bell" tooltip="通知" />
            )}
          </div>
        </div>
      </div>

      {/*
        Overlapping Avatar:
        Size 88 in 4px base100 ring (top = coverHeight - 48 = 112px, left = 16px).
        Worn badge attached at right: -5.3px, bottom: -5.3px matching GfAvatar Positioned.
      */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          top: COVER_HEIGHT - 48,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: C.base100,
          padding: 4,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ position: 'relative', width: 88, height: 88 }}>
          <Avatar who="youzi" size={88} />
          {/* Authentic UserWornBadge from user_badge.dart */}
          <div
            style={{
              position: 'absolute',
              right: -5.3,
              bottom: -5.3,
              zIndex: 2,
            }}
          >
            <UserWornBadge code="contributor" avatarSize={88} />
          </div>
        </div>
      </div>

      {/* 2. Action Band: EdgeInsets.fromLTRB(128, 4, 16, 4) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '8px 16px 8px 128px',
          minHeight: 56,
        }}
      >
        {self ? (
          <button
            type="button"
            style={{
              height: 38,
              padding: '0 20px',
              borderRadius: 9999,
              border: `1.5px solid ${C.line}`,
              background: 'transparent',
              color: C.content,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            编辑资料
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: 9999,
                background: following ? 'transparent' : C.content,
                color: following ? C.content : C.base100,
                border: `1.5px solid ${following ? C.line : C.content}`,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: pressFollow ? 'scale(0.95)' : undefined,
              }}
            >
              {following ? '已关注' : '关注'}
            </button>
            <button
              type="button"
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: `1.5px solid ${C.line}`,
                background: pressMail ? C.base300 : 'transparent',
                color: C.content,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transform: pressMail ? 'scale(0.92)' : undefined,
              }}
            >
              <Icon name="mail" size={18} color={C.content} />
            </button>
          </div>
        )}
      </div>

      {/* 3. Identity Details (GfUserCard body) */}
      <div style={{ padding: '0 16px 12px 16px' }}>
        {/* Name Row + Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: C.content, lineHeight: 1.25 }}>
            柚子不酸
          </span>

          {/* Admin badge: GfBadgeVariant.warning */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.32)',
              color: '#d97706',
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            管理员
          </span>

          {/* Online badge: GfBadgeVariant.success */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 8px',
              borderRadius: 4,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.32)',
              color: '#059669',
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            <Icon name="signal-stream" size={11} color="#059669" />
            在线
          </span>
        </div>

        {/* Username */}
        <div style={{ marginTop: 2, fontSize: 13, fontWeight: 500, color: alpha(C.content, 0.55) }}>
          @youzi
        </div>

        {/* Bio */}
        <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.45, color: C.content }}>
          同济大学 · 软件工程 · 2024级本科生 🎓
          <br />
          四级 612 分，乐意分享备考经验与真题资料 📚
        </div>

        {/* Signature + Squiggle Underline */}
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ transform: 'scaleX(-1)', display: 'flex', alignItems: 'center' }}>
                <Icon name="feather" size={14} color={alpha(C.primary, 0.62)} />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  color: alpha(C.content, 0.62),
                }}
              >
                行至水穷处，坐看云起时
              </span>
            </div>

            {/* Custom SVG Squiggle matching _SignatureSquigglePainter */}
            <div style={{ paddingLeft: 20, marginTop: 2 }}>
              <svg width="100" height="8" viewBox="0 0 100 8" fill="none" style={{ display: 'block' }}>
                <path
                  d="M2 5 C10 0, 18 8, 26 5 C34 2, 42 8, 50 5 C58 2, 66 8, 74 5 C82 2, 90 8, 98 5"
                  stroke={alpha(C.primary, 0.45)}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Metadata Details Row */}
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 13,
            color: C.iconMuted,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="calendar-days" size={14} color={C.iconMuted} />
            加入于 2024-09-01
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon name="clock" size={14} color={C.iconMuted} />
            最后活跃 刚刚
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 2 }}>
            <Icon name="github" size={16} color={C.content} />
            <Icon name="globe-pointer-filled" size={16} color={C.content} />
          </span>
        </div>

        {/*
          4. Authentic Colored Badges Row (Medallions):
          Matches gf_user_card.dart lines 276-295 and 386-415:
          - Each badge is inside a 44x44 circular button target (alignment: bottomCenter)
          - Horizontal spacing: 2px
          - Rendered as GfBadgeMedallion with size: 34
        */}
        <div
          style={{
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {DISPLAY_BADGES.map((b) => (
            <button
              key={b.code}
              type="button"
              title={`${b.name}\n${b.description}`}
              onClick={() => {
                setActiveTab('badges');
                setSelectedBadge(b);
              }}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'transform 120ms ease',
              }}
            >
              <GfBadgeMedallion code={b.code} color={b.color} size={34} />
            </button>
          ))}
        </div>

        {/* Stats Row */}
        <div
          style={{
            marginTop: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {[
            { label: '关注', val: '108' },
            { label: '粉丝', val: following ? '187' : '186' },
            { label: '内容', val: '24' },
            { label: '回复', val: '156' },
            { label: '获赞', val: '1.2k' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                height: 40,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.content,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.val}
              </span>
              <span style={{ fontSize: 12, color: C.iconMuted }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Tab Bar (_ProfileTabs from profile_page.dart) */}
      <div
        style={{
          height: 48,
          display: 'flex',
          alignItems: 'stretch',
          position: 'relative',
          background: C.base100,
          borderTop: `1px solid ${alpha(C.line, 0.85)}`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: active ? 700 : 500,
                color: active ? C.content : C.iconMuted,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <span>{tab.label}</span>
              {active && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: 28,
                    height: 3.5,
                    borderRadius: '2px 2px 0 0',
                    background: C.primary,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 6. Tab Content Area */}
      <div style={{ background: C.base100, paddingBottom: 28 }}>
        {/* Badges Tab: Authentic _badgeGallery with GfAchievementCard */}
        {activeTab === 'badges' ? (
          <div
            style={{
              padding: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            {ALL_EARNED_BADGES.map((b) => (
              <GfAchievementCard
                key={b.code}
                badge={b}
                onClick={() => setSelectedBadge(b)}
              />
            ))}
          </div>
        ) : activeTab === 'topics' ? (
          TOPICS.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px 12px 16px',
                borderBottom: `1px solid ${alpha(C.line, 0.7)}`,
                display: 'flex',
                gap: 12,
              }}
            >
              <Avatar who="youzi" size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.content }}>
                    {item.actor}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name={item.contextSymbol} size={13} color={C.iconMuted} />
                    {item.contextLabel}
                  </span>
                  <span style={{ fontSize: 13, color: C.iconMuted }}>{item.time}</span>
                </div>

                {item.title && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: C.content,
                    }}
                  >
                    {item.title}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: C.content,
                    opacity: 0.9,
                  }}
                >
                  {item.text}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name="heart" size={16} color={C.iconMuted} />
                    <span>{item.likes}</span>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: item.bookmarked ? C.primary : C.iconMuted,
                    }}
                  >
                    <Icon
                      name="bookmark"
                      size={16}
                      color={item.bookmarked ? C.primary : C.iconMuted}
                    />
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name="message-square" size={15} color={C.iconMuted} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === 'likes' ? (
          LIKES.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px 12px 16px',
                borderBottom: `1px solid ${alpha(C.line, 0.7)}`,
                display: 'flex',
                gap: 12,
              }}
            >
              <Avatar who={i === 0 ? 'laoshi' : 'moon'} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.content }}>
                    {item.actor}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name={item.contextSymbol} size={13} color="#f43f5e" />
                    {item.contextLabel}
                  </span>
                  <span style={{ fontSize: 13, color: C.iconMuted }}>{item.time}</span>
                </div>

                {item.title && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: C.content,
                    }}
                  >
                    {item.title}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: C.content,
                    opacity: 0.9,
                  }}
                >
                  {item.text}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: '#f43f5e',
                    }}
                  >
                    <Icon name="heart" size={16} color="#f43f5e" />
                    <span>{item.likes}</span>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: item.bookmarked ? C.primary : C.iconMuted,
                    }}
                  >
                    <Icon
                      name="bookmark"
                      size={16}
                      color={item.bookmarked ? C.primary : C.iconMuted}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === 'bookmarks' ? (
          BOOKMARKS.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px 12px 16px',
                borderBottom: `1px solid ${alpha(C.line, 0.7)}`,
                display: 'flex',
                gap: 12,
              }}
            >
              <Avatar who="zhenti" size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.content }}>
                    {item.actor}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 13,
                      color: C.primary,
                    }}
                  >
                    <Icon name="bookmark" size={13} color={C.primary} />
                    {item.contextLabel}
                  </span>
                  <span style={{ fontSize: 13, color: C.iconMuted }}>{item.time}</span>
                </div>

                {item.title && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: C.content,
                    }}
                  >
                    {item.title}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: C.content,
                    opacity: 0.9,
                  }}
                >
                  {item.text}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name="heart" size={16} color={C.iconMuted} />
                    <span>{item.likes}</span>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: C.primary,
                    }}
                  >
                    <Icon name="bookmark" size={16} color={C.primary} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Timeline Tab (default) */
          ACTIVITIES.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px 12px 16px',
                borderBottom: `1px solid ${alpha(C.line, 0.7)}`,
                display: 'flex',
                gap: 12,
              }}
            >
              <Avatar who="youzi" size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header row: Author + context badge + time */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.content }}>
                    {item.actor}
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name={item.contextSymbol} size={13} color={C.iconMuted} />
                    {item.contextLabel}
                  </span>
                  <span style={{ fontSize: 13, color: C.iconMuted }}>{item.time}</span>
                </div>

                {/* Title if present */}
                {item.title && (
                  <div
                    style={{
                      marginTop: 5,
                      fontSize: 15,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      color: C.content,
                    }}
                  >
                    {item.title}
                  </div>
                )}

                {/* Body Text */}
                <div
                  style={{
                    marginTop: item.title ? 4 : 6,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: C.content,
                    opacity: 0.9,
                  }}
                >
                  {item.text}
                </div>

                {/* Action Footer */}
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name="heart" size={16} color={C.iconMuted} />
                    <span>{item.likes}</span>
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: item.bookmarked ? C.primary : C.iconMuted,
                    }}
                  >
                    <Icon
                      name="bookmark"
                      size={16}
                      color={item.bookmarked ? C.primary : C.iconMuted}
                    />
                  </div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 13,
                      color: C.iconMuted,
                    }}
                  >
                    <Icon name="message-square" size={15} color={C.iconMuted} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Badge Detail Modal matching showBadgeDetails in user_badge.dart */}
      {selectedBadge && (
        <div
          onClick={() => setSelectedBadge(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              background: C.base100,
              borderRadius: '24px 24px 0 0',
              padding: '20px 24px 32px 24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: alpha(C.content, 0.2),
                marginBottom: 16,
              }}
            />
            <GfBadgeMedallion code={selectedBadge.code} color={selectedBadge.color} size={64} />
            <div
              style={{
                marginTop: 14,
                fontSize: 18,
                fontWeight: 700,
                color: C.content,
              }}
            >
              {selectedBadge.name}
            </div>
            <div
              style={{
                marginTop: 8,
                fontSize: 14,
                lineHeight: 1.5,
                color: C.iconMuted,
              }}
            >
              {selectedBadge.description}
            </div>
            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              style={{
                marginTop: 20,
                width: '100%',
                height: 44,
                borderRadius: 9999,
                background: C.base200,
                border: `1px solid ${C.line}`,
                color: C.content,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
