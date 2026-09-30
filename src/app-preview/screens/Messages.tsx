import React from 'react';
import { C, alpha } from '../theme';
import { RootSurface, GfSearchField, BottomNav } from '../ui/chrome';
import { GfConversationRow } from '../ui/rows';

/*
 * 消息 — the messages branch root (messages_page.dart).
 *
 * This is the fourth persistent destination of the mobile shell (index 3),
 * corresponding to StatefulShellBranch /messages.
 *
 * Layout matches messages_page.dart + root_surface.dart:
 * - 56pt RootSurface app bar with '消息' title
 * - 64pt toolbar with GfSearchField ('搜索私信会话')
 * - ListView with GfConversationRow items
 * - Compose FAB with 'message-favorite' icon (_startNewChat)
 * - BottomNav with destination index 3 active
 */

interface Conversation {
  who: string;
  name: string;
  last: string;
  time: string;
  unread: number;
}

const CONVERSATIONS: Conversation[] = [
  {who: 'youzi', name: '柚子不酸', last: '真题笔记我放网盘了，链接发你啦～', time: '09:41', unread: 2},
  {who: 'xianyu', name: '四平路咸鱼', last: '那节课换到 209 了，别走错教室', time: '8月30日 20:14', unread: 0},
  {who: 'zaoba', name: '早八战士', last: '明天早八一起走吗？我在食堂门口等你', time: '8月30日 12:03', unread: 1},
  {who: 'moon', name: '嘉定小透明', last: '银杏那篇帖子你看到了吗 🍂', time: '8月29日 21:40', unread: 0},
  {who: 'zhenti', name: '真题搬运工', last: '课评我按老师分类整理好了，先发你', time: '2025年12月2日 18:07', unread: 0},
];

export const MessagesPage: React.FC<{
  nav?: boolean;
}> = ({ nav = true }) => (
  <RootSurface
    title="消息"
    composeSymbol="message-favorite"
    toolbarHeight={64}
    toolbar={
      <div style={{ padding: '8px 16px' }}>
        <GfSearchField hint="搜索私信会话" />
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
      {CONVERSATIONS.map((conversation, index) => (
        <React.Fragment key={conversation.name}>
          <GfConversationRow
            who={conversation.who}
            name={conversation.name}
            message={conversation.last}
            time={conversation.time}
            unread={conversation.unread > 0}
          />
          {index < CONVERSATIONS.length - 1 && (
            <div style={{ height: 1, background: alpha(C.line, 0.7), marginLeft: 68 }} />
          )}
        </React.Fragment>
      ))}
    </div>
    {nav && <BottomNav active={3} />}
  </RootSurface>
);
