import React, { useState } from 'react';
import { C, alpha } from '../theme';
import { GfIconButton, GfTabBar, RootSurface, BottomNav } from '../ui/chrome';
import { GfNotificationRow, type NotificationTone } from '../ui/rows';

/*
 * 通知 — the notifications branch root (notifications_page.dart).
 *
 * This is the third persistent destination of the mobile shell (index 2),
 * corresponding to StatefulShellBranch /notifications.
 *
 * Chrome layout:
 * - 56pt RootSurface app bar with '通知' title
 * - Right action: 'check-check' symbol for mark-all-read (tooltip: 全部已读)
 * - Sub-bar toolbar: GfTabBar with '全部' (all) and '未读' (unread)
 * - List body: GfNotificationRow items separated by 1px hairlines
 * - No compose action (showComposeAction: false)
 */

interface NotificationItem {
  id: number;
  symbol: string;
  tone: NotificationTone;
  actor: string;
  actionText: string;
  subtitle?: string;
  time: string;
  unread: boolean;
  who?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    symbol: 'heart-filled',
    tone: 'like',
    actor: '四平路咸鱼',
    actionText: ' 赞了你的话题',
    subtitle: '期中周图书馆占座心得',
    time: '5 分钟前',
    unread: true,
    who: 'xianyu',
  },
  {
    id: 2,
    symbol: 'message-circle',
    tone: 'primary',
    actor: '柚子不酸',
    actionText: ' 在话题中回复了你',
    subtitle: '真题笔记我放网盘了，链接发你啦～记得查收！',
    time: '25 分钟前',
    unread: true,
    who: 'youzi',
  },
  {
    id: 3,
    symbol: 'user-round-plus',
    tone: 'success',
    actor: '早八战士',
    actionText: ' 关注了你',
    time: '2 小时前',
    unread: false,
    who: 'zaoba',
  },
  {
    id: 4,
    symbol: 'award',
    tone: 'warning',
    actor: '系统通知',
    actionText: ' 恭喜获得「济事新星」勋章',
    subtitle: '连续在同济社区分享高质量学术内容与选课指南',
    time: '昨天 16:30',
    unread: false,
  },
  {
    id: 5,
    symbol: 'info',
    tone: 'info',
    actor: '社区管理团队',
    actionText: ' 你的课程评价已被收录为精华课评',
    subtitle: '高等数学(B)上 · 四平路校区 · 林老师',
    time: '3 天前',
    unread: false,
  },
];

export const NotificationsPage: React.FC<{
  nav?: boolean;
}> = ({ nav = true }) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const displayedItems = filter === 'unread' ? items.filter((n) => n.unread) : items;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <RootSurface
      title="通知"
      actions={
        <button
          type="button"
          onClick={markAllRead}
          aria-label="全部已读"
          title="全部已读"
          style={{ appearance: 'none', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
        >
          <GfIconButton symbol="check-check" size={22} color={C.content} />
        </button>
      }
      toolbarHeight={48}
      toolbar={
        <div style={{ padding: '0 8px' }}>
          <GfTabBar
            tabs={[
              { label: '全部', value: 'all' },
              { label: '未读', value: 'unread' },
            ]}
            selected={filter}
            onSelect={(val) => setFilter(val as 'all' | 'unread')}
          />
        </div>
      }
    >
      <div
        className="no-scrollbar"
        style={{
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: nav ? 90 : 20,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {displayedItems.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: C.iconMuted,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 500 }}>没有未读通知</div>
            <div style={{ fontSize: 13, color: alpha(C.content, 0.45) }}>所有互动和消息都已处理完毕</div>
          </div>
        ) : (
          displayedItems.map((n, index) => (
            <React.Fragment key={n.id}>
              <GfNotificationRow
                symbol={n.symbol}
                tone={n.tone}
                title={`${n.actor}${n.actionText}`}
                actor={n.actor}
                subtitle={n.subtitle}
                time={n.time}
                unread={n.unread}
                who={n.who}
              />
              {index < displayedItems.length - 1 && (
                <div style={{ height: 1, background: alpha(C.line, 0.7), marginLeft: 56 }} />
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {nav && <BottomNav active={2} />}
    </RootSurface>
  );
};
