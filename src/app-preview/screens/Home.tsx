import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {APPBAR_H, STATUS_H, SW} from '../ui/Phone';
import {Avatar, CategoryChip, Divider} from '../ui/primitives';
import {clamp, ipl} from '../timing';

const posts = [
  {
    who: 'moon',
    name: '嘉定小透明',
    time: '3 分钟前',
    cat: ['校园生活', C.violet],
    title: '嘉定校区的银杏开始黄了 🍂',
    body: '图书馆门口那排最好看，下课路过记得抬头看看～',
    stats: [12, 208, 36],
  },
  {
    who: 'xianyu',
    name: '四平路咸鱼',
    time: '15 分钟前',
    cat: ['学习交流', C.primary],
    title: '期中周图书馆占座心得',
    body: '七点半前到，三楼靠窗插座最多，别忘了带水杯。',
    stats: [8, 156, 21],
  },
  {
    who: 'zaoba',
    name: '早八战士',
    time: '1 小时前',
    cat: ['闲聊茶馆', C.success],
    title: '今天食堂的糖醋小排太香了',
    body: '二楼窗口，去晚了就没了，冲！',
    stats: [23, 341, 58],
  },
  {
    who: 'youzi',
    name: '柚子不酸',
    time: '2 小时前',
    cat: ['学习交流', C.primary],
    title: '微积分下大作业选题建议整理',
    body: '整理了过去两届学长学姐推荐的参考题目和评分侧重点，需要的同学自取～',
    stats: [19, 412, 63],
  },
  {
    who: 'zhenti',
    name: '真题搬运工',
    time: '4 小时前',
    cat: ['资源共享', C.orange],
    title: '四平 ↔ 嘉定 两校区班车时刻表 (2026最新版)',
    body: '更新了周末晚间加车班次，已同步支持导出手机日历提醒。',
    stats: [31, 890, 142],
  },
  {
    who: 'sakura',
    name: '樱花大道散步员',
    time: '昨天',
    cat: ['校园生活', C.violet],
    title: '一二九运动场夜跑打卡打招呼区 🏃',
    body: '晚上风很舒服，跑完还可以去西苑吃个烤冷面，冲！',
    stats: [15, 275, 48],
  },
] as const;

/*
 * The app shell's bottom navigation — gf_bottom_navigation.dart, as the shell
 * configures it (router.dart).
 *
 * Four destinations and nothing else, in GfShellDestination's order
 * (home / campus / messages / profile). The shell passes `showLabels: false`,
 * so the keys are icons only: a 24pt glyph in a 28pt box, each key padded
 * 4/8/4/6, the bar 56pt tall, and the home indicator's inset left empty below
 * it. The selected key takes the primary colour; the unread dot the shell hands
 * the messages branch sits on the box's top-right corner. There is deliberately
 * no plate or pill behind the active key — the widget draws none, and an
 * earlier version of this mock had invented one.
 *
 * `onSelect` is what separates the two uses: static in the showcase, where the
 * phones are pictures, and live in the hero, where the visitor is invited to
 * press the keys. Passing it turns each key into a real button — pointer, focus
 * ring and press feedback included — and it carries `data-hover`, so pointing
 * at a key names the destination in the preview's hover layer.
 */
import { GfLogo, BottomNav, NAV_SAFE_H } from '../ui/chrome';
import { ComposeMenu } from '../ui/ComposeMenu';

export { BottomNav, ComposeMenu };

export const Fab: React.FC<{open: number; onClick?: () => void}> = ({open, onClick}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={open > 0 ? '关闭发布菜单' : '发布'}
    data-hover={open > 0 ? '关闭' : '发布'}
    style={{
      position: 'absolute',
      right: 16,
      bottom: 72 + NAV_SAFE_H,
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: C.primary,
      boxShadow: `0 8px 20px ${alpha(C.primary, 0.35)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 43,
      border: 'none',
      cursor: onClick ? 'pointer' : 'default',
      padding: 0,
      outline: 'none',
      transition: 'transform 120ms ease, box-shadow 150ms ease',
    }}
    onMouseDown={(e) => {
      if (onClick) e.currentTarget.style.transform = 'scale(0.92)';
    }}
    onMouseUp={(e) => {
      if (onClick) e.currentTarget.style.transform = 'scale(1)';
    }}
    onMouseLeave={(e) => {
      if (onClick) e.currentTarget.style.transform = 'scale(1)';
    }}
  >
    <div
      style={{
        transform: `rotate(${open * 45}deg)`,
        transition: 'transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon name="plus" size={28} color={C.primaryContent} />
    </div>
  </button>
);

export const HomeFeed: React.FC<{nav?: boolean; onOpenDrawer?: () => void}> = ({nav = true, onOpenDrawer}) => (
  <div style={{position: 'absolute', inset: 0, background: C.base100}}>
    {/*
      The home app bar (home_page.dart + root_surface.dart):
      - Left: AccountAvatar button (opens drawer/profile)
      - Center: GfLogo (size 32)
      - Right: Search button (GfSymbol search)
    */}
    <div
      data-hover="导航栏"
      style={{
        position: 'absolute',
        top: STATUS_H,
        left: 0,
        width: SW,
        height: APPBAR_H,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        boxSizing: 'border-box',
      }}
    >
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="打开侧边抽屉"
        style={{
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: onOpenDrawer ? 'pointer' : 'default',
          transition: 'transform 120ms ease',
        }}
        onMouseDown={(e) => {
          if (onOpenDrawer) e.currentTarget.style.transform = 'scale(0.92)';
        }}
        onMouseUp={(e) => {
          if (onOpenDrawer) e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          if (onOpenDrawer) e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Avatar who="me" size={30} ring />
      </button>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <GfLogo size={32} />
      </div>
      <div style={{width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon name="search" size={24} color={C.content} />
      </div>
    </div>
    {/* tabs */}
    <div style={{position: 'absolute', top: 124, left: 16, right: 16, height: 36, display: 'flex', gap: 30, alignItems: 'center'}}>
      {['最新', '关注', '热门', '流行'].map((t, i) => (
        <div key={t} data-hover="信息流分页" style={{fontSize: 17, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? C.content : C.iconMuted, position: 'relative'}}>
          {t}
          {i === 0 && (
            <div style={{position: 'absolute', left: 1, right: 1, bottom: -11, height: 3.5, borderRadius: 2, background: C.primary}} />
          )}
        </div>
      ))}
      <div style={{flex: 1}} />
      <Icon name="layout-grid" size={22} color={C.content} />
    </div>
    {/* category chips */}
    <div style={{position: 'absolute', top: 172, left: 12, display: 'flex', gap: 8, whiteSpace: 'nowrap'}}>
      <div
        data-hover="分类筛选"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          borderRadius: 10,
          background: tint(C.primary, 8),
          border: `1.5px solid ${alpha(C.primary, 0.35)}`,
          color: C.primary,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        <Icon name="check" size={15} color={C.primary} />
        全部分类
      </div>
      {[
        ['学习交流', C.primary],
        ['校园生活', C.violet],
        ['闲聊茶馆', C.success],
      ].map(([l, c]) => (
        <div key={l} data-hover="分类" style={{display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 10, background: C.base300, fontSize: 15}}>
          <div style={{width: 8, height: 8, borderRadius: 4, background: c}} />
          {l}
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', top: 214, left: 0, right: 0, height: 1, background: C.line}} />
    {/* feed */}
    <div
      className="no-scrollbar"
      style={{
        position: 'absolute',
        top: 222,
        left: 0,
        right: 0,
        bottom: nav ? 90 : 20,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {posts.map((p) => (
        <div key={p.title} data-hover="话题">
          <div style={{display: 'flex', padding: '14px 16px 12px 16px', gap: 12}}>
            <Avatar who={p.who} size={36} />
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, height: 26}}>
                <span style={{fontWeight: 600, fontSize: 16}}>{p.name}</span>
                <span style={{fontSize: 14, color: C.iconMuted}}>{p.time}</span>
                <CategoryChip label={p.cat[0]} color={p.cat[1]} />
              </div>
              <div style={{fontWeight: 700, fontSize: 17, lineHeight: 1.4, marginTop: 4}}>{p.title}</div>
              <div style={{fontSize: 16, lineHeight: 1.4, color: alpha(C.content, 0.82), marginTop: 3}}>{p.body}</div>
              <div style={{display: 'flex', gap: 26, marginTop: 12, color: C.iconMuted, fontSize: 14, alignItems: 'center'}}>
                {(['message-circle', 'eye', 'heart'] as const).map((ic, k) => (
                  <div key={ic} style={{display: 'flex', alignItems: 'center', gap: 5}}>
                    <Icon name={ic} size={18} color={C.iconMuted} />
                    {p.stats[k]}
                  </div>
                ))}
                <Icon name="bookmark" size={18} color={C.iconMuted} />
              </div>
            </div>
          </div>
          <Divider inset={16} style={{marginRight: 16}} />
        </div>
      ))}
    </div>
    {nav && <BottomNav active={0} />}
  </div>
);

/** Speed dial opened from the FAB (瞬间 / 文章 / 提问). */
export const SpeedDial: React.FC<{open: number; b: number; start: number}> = ({open, b, start}) => {
  const items = [
    {label: '瞬间', icon: 'sparkles', bg: tint(C.violet, 12), fg: C.violet, y: 547},
    {label: '文章', icon: 'book-open', bg: tint(C.orange, 12), fg: C.orange, y: 610},
    {label: '提问', icon: 'circle-help', bg: tint(C.emerald, 12), fg: C.emerald, y: 673},
  ];
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.4 * open})`, zIndex: 40}} />
      {items.map((it, i) => {
        const p = clamp(ipl(b, [start + (2 - i) * 0.12, start + (2 - i) * 0.12 + 0.6], [0, 1]));
        const vis = p * open;
        return (
          <div
            key={it.label}
            style={{
              position: 'absolute',
              right: 17,
              top: it.y - 26,
              width: 116,
              height: 52,
              borderRadius: 18,
              background: C.base100,
              boxShadow: '0 6px 18px rgba(0,0,0,.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px 0 20px',
              boxSizing: 'border-box',
              zIndex: 46,
              opacity: vis,
              transform: `translateY(${(1 - vis) * 24}px) scale(${0.85 + 0.15 * vis})`,
              transformOrigin: '100% 100%',
            }}
          >
            <span style={{fontWeight: 700, fontSize: 17}}>{it.label}</span>
            <div style={{width: 36, height: 36, borderRadius: 18, background: it.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon name={it.icon} size={20} color={it.fg} />
            </div>
          </div>
        );
      })}
    </>
  );
};

