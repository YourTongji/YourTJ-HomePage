import React from 'react';
import {
  BellIcon,
  CommentIcon,
  GridIcon,
  ListIcon,
  PinIcon,
  RefreshIcon,
  SparklesIcon,
} from '../../components/icons';
import { MOCK_ANNOUNCEMENT, MOCK_TOPICS, type MockTopic } from '../data';
import { HUB, muted, tint } from '../tokens';
import {
  edge,
  HubAvatarStack,
  HubCard,
  HubCategoryChip,
  HubContentBadge,
  HubShell,
  HubTabRow,
} from '../primitives';

/*
 * 首页 · 论坛信息流
 *
 * Ported from HomePage.vue + TopicRow.vue in their desktop default: the feed
 * mode the product picks at ≥1024px is 'table', so the rows are the five-column
 * grid (title block / participants / replies / views / activity) with hairline
 * separators, not cards. The toolbar, the feed-mode switch and the announcement
 * panel are the page's own markup, down to the alpha values.
 */

const ROW_COLUMNS = 'minmax(0, 1fr) 112px 72px 72px 88px';

const AnnouncementPanel: React.FC = () => (
  <aside
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 12,
      padding: '12px 16px',
      border: `1px solid ${tint(HUB.primary, 15)}`,
      borderRadius: 8,
      background: `linear-gradient(90deg, ${tint(HUB.primary, 5)}, ${HUB.base100} 45%)`,
    }}
  >
    <span
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 28,
        height: 28,
        marginLeft: -4,
        borderRadius: 999,
        color: HUB.primary,
        flexShrink: 0,
      }}
    >
      <BellIcon className="h-4 w-4" />
    </span>
    <div style={{ minWidth: 0, flex: 1 }}>
      <span
        style={{
          display: 'block',
          marginBottom: 4,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: HUB.primary,
        }}
      >
        {MOCK_ANNOUNCEMENT.title}
      </span>
      <span style={{ fontSize: 13, lineHeight: 1.6, color: muted(0.75) }}>{MOCK_ANNOUNCEMENT.body}</span>
    </div>
  </aside>
);

const FeedModeSwitch: React.FC<{ active: 'table' | 'card' }> = ({ active }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      padding: 2,
      borderRadius: 999,
      border: `1px solid ${HUB.line}`,
      background: HUB.base100,
    }}
  >
    {(
      [
        { key: 'table' as const, label: '列表', icon: <ListIcon className="h-3.5 w-3.5" /> },
        { key: 'card' as const, label: '卡片', icon: <GridIcon className="h-3.5 w-3.5" /> },
      ]
    ).map((item) => (
      <span
        key={item.key}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          height: 28,
          padding: '0 10px',
          borderRadius: 999,
          background: item.key === active ? HUB.primary : 'transparent',
          color: item.key === active ? HUB.primaryContent : muted(0.55),
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {item.icon}
        {item.label}
      </span>
    ))}
  </div>
);

const TopicRow: React.FC<{ topic: MockTopic; last: boolean }> = ({ topic, last }) => (
  <div
    className="hub-stagger"
    data-hover="话题"
    style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: ROW_COLUMNS,
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      background: HUB.base100,
      minHeight: 76,
    }}
  >
    {/* Row separator: a hairline inset 16px from each side, as the product draws it. */}
    {!last && (
      <span
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 0,
          height: 1,
          background: edge(70),
        }}
      />
    )}
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px', minHeight: 24 }}>
        {topic.pinned && (
          <PinIcon className="h-3.5 w-3.5" style={{ flexShrink: 0, color: HUB.error, rotate: '45deg' }} />
        )}
        <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>{topic.title}</span>
        {topic.contentType && <HubContentBadge kind={topic.contentType} />}
        {topic.categories.map((category) => (
          <HubCategoryChip key={category.name} name={category.name} color={category.color} />
        ))}
        {topic.viewCount > 500 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              height: 20,
              fontSize: 11,
              fontWeight: 600,
              color: HUB.warning,
            }}
          >
            <SparklesIcon className="h-3 w-3" />
            hot
          </span>
        )}
      </div>
      <p
        style={{
          margin: '4px 0 0',
          minHeight: 20,
          fontSize: 13,
          lineHeight: 1.55,
          color: muted(0.55),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {topic.description}
      </p>
    </div>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <HubAvatarStack users={topic.participants} />
    </div>

    <div
      style={{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: muted(0.75),
      }}
    >
      {topic.replyCount}
    </div>
    <div
      style={{
        textAlign: 'center',
        fontSize: 14,
        fontVariantNumeric: 'tabular-nums',
        color: muted(0.55),
      }}
    >
      {topic.viewCount}
    </div>
    <div
      style={{
        textAlign: 'right',
        fontSize: 13,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
        color: muted(0.55),
      }}
    >
      {topic.time}
    </div>
  </div>
);

export const HubHome: React.FC = () => (
  <HubShell activePage="内容">
    <AnnouncementPanel />

    <HubCard style={{ overflow: 'hidden', borderRadius: 8 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '12px 16px',
          borderBottom: `1px solid ${HUB.line}`,
          background: HUB.base100,
        }}
      >
        <HubTabRow items={['最新', '热门', '流行']} active={0} />
        <div style={{ display: 'flex', flexShrink: 0, alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: 32,
              padding: '0 10px',
              borderRadius: 999,
              border: `1px solid ${HUB.line}`,
              background: HUB.base100,
              color: muted(0.55),
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            <RefreshIcon className="h-3.5 w-3.5" />
            刷新话题
          </span>
          <FeedModeSwitch active="table" />
        </div>
      </div>

      {MOCK_TOPICS.map((topic, index) => (
        <TopicRow key={topic.id} topic={topic} last={index === MOCK_TOPICS.length - 1} />
      ))}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '12px 16px',
          borderTop: `1px solid ${edge(70)}`,
          fontSize: 12.5,
          color: muted(0.45),
        }}
      >
        <CommentIcon className="h-3.5 w-3.5" />
        已显示全部内容
      </div>
    </HubCard>
  </HubShell>
);
