import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {APPBAR_H, STATUS_H, SW} from '../ui/Phone';
import {Avatar} from '../ui/primitives';
import {BottomNav} from './Home';
import {clamp} from '../timing';

const TABS = ['今天', '我的课表', '学业记录', '校园消息', '校历'];
const TAB_X = [16, 76, 170, 264, 358];
const TAB_W = [34, 68, 68, 68, 34];

export const TODAY = [
  {time: '08:00-09:35 · 第 1-2 节', name: '高等数学(B)上', where: '北楼 201 · 四平路校区 · 林老师'},
  {time: '10:00-11:35 · 第 3-4 节', name: '大学英语(3)', where: '南楼 305 · 四平路校区 · 周老师'},
  {time: '13:30-15:05 · 第 5-6 节', name: '程序设计基础', where: '济事楼 402 · 嘉定校区 · 陈老师'},
];

export const GRADES = [
  {name: '工程图学', term: '2026春', score: 96, gpa: '5.0', credit: 3},
  {name: '线性代数', term: '2026春', score: 92, gpa: '5.0', credit: 3},
  {name: '中国近现代史纲要', term: '2026春', score: 88, gpa: '4.0', credit: 3},
  {name: '大学物理(上)', term: '2026春', score: 85, gpa: '4.0', credit: 4},
];

export const NOTICES = [
  {title: '关于 2026 年下半年全国大学英语四、六级考试报名的通知', pub: '本科生院', date: '2026-09-24'},
  {title: '2026-2027 学年第一学期期中教学检查工作安排', pub: '本科生院', date: '2026-09-22'},
  {title: '图书馆国庆假期开放时间调整', pub: '图书馆', date: '2026-09-21'},
  {title: '关于开展 2026 年秋季学期学生评教工作的通知', pub: '本科生院', date: '2026-09-19'},
  {title: '2026 年度国家奖学金评审工作通知', pub: '学生处', date: '2026-09-16'},
];

const Tiles: React.FC = () => (
  <div data-hover="功能入口" style={{display: 'flex', gap: 12}}>
    {[
      ['课程评价', 'graduation-cap', C.primary, tint(C.primary, 8)],
      ['排课器', 'calendar-days', C.success, tint(C.success, 8)],
      ['Wiki', 'book-open', C.warning, tint(C.warning, 8)],
    ].map(([l, ic, fg, bg]) => (
      <div
        key={l}
        data-hover={l}
        style={{
          flex: 1,
          height: 112,
          borderRadius: 16,
          border: `1px solid ${C.line}`,
          background: C.base100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <div style={{width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name={ic} size={26} color={fg} />
        </div>
        <span style={{fontSize: 16, fontWeight: 700}}>{l}</span>
      </div>
    ))}
  </div>
);

const Section: React.FC<{title: string; action?: string; children: React.ReactNode; appear?: number}> = ({title, action, children, appear = 1}) => (
  <div style={{marginBottom: 26, opacity: appear, transform: `translateY(${(1 - appear) * 24}px)`}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <span style={{fontSize: 18, fontWeight: 700}}>{title}</span>
      {action && <span style={{fontSize: 15, color: C.primary, fontWeight: 600}}>{action}</span>}
    </div>
    <div style={{marginTop: 10}}>{children}</div>
  </div>
);

const Row: React.FC<{children: React.ReactNode; appear?: number; label?: string}> = ({children, appear = 1, label}) => (
  <div
    data-hover={label}
    style={{padding: '14px 0', borderBottom: `1px solid ${alpha(C.line, 0.7)}`, opacity: appear, transform: `translateX(${(1 - appear) * 30}px)`}}
  >
    {children}
  </div>
);

const stagger = (p: number, i: number, n = 8) => clamp(p * n - i);

export const CampusPage: React.FC<{
  connect: number; // 0 = not connected, 0..1 connecting (spinner), 1 = connected
  pressed?: boolean;
  reveal: number; // 0..1 content reveal after connecting
  tab: number; // active tab index (0, 2, 3)
  tabSlide: number; // 0..1 slide into current tab
  prevTab: number;
  frame: number;
  scroll?: number;
  /** The host draws the shell nav (hero tab switching); skip the page's copy. */
  nav?: boolean;
}> = ({connect, pressed, reveal, tab, tabSlide, prevTab, frame, scroll = 0, nav = true}) => {
  const connected = connect >= 1;
  const underlineX = TAB_X[prevTab] + (TAB_X[tab] - TAB_X[prevTab]) * tabSlide;
  const underlineW = TAB_W[prevTab] + (TAB_W[tab] - TAB_W[prevTab]) * tabSlide;
  const dir = tab >= prevTab ? 1 : -1;
  const body = (t: number) => {
    if (!connected) {
      return (
        <div>
          <Tiles />
          <div style={{fontSize: 18, fontWeight: 700, marginTop: 32}}>身份连接</div>
          <div style={{fontSize: 16, lineHeight: 1.55, marginTop: 10, color: alpha(C.content, 0.85)}}>
            一个账号绑定一个官方身份。姓名、校历和课表会保存在本设备，供离线查看；可在下方清除。
          </div>
          <div
            style={{
              marginTop: 26,
              height: 50,
              borderRadius: 25,
              background: C.primary,
              color: C.primaryContent,
              fontSize: 17,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              transform: `scale(${pressed ? 0.96 : 1})`,
              filter: pressed ? 'brightness(.92)' : undefined,
            }}
          >
            {connect > 0 ? (
              <>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    border: `2.5px solid ${alpha(C.primaryContent, 0.35)}`,
                    borderTopColor: C.primaryContent,
                    transform: `rotate(${frame * 24}deg)`,
                  }}
                />
                正在连接…
              </>
            ) : (
              '连接同济身份'
            )}
          </div>
        </div>
      );
    }
    if (t === 0) {
      return (
        <div>
          <div style={{fontSize: 15, color: C.iconMuted, opacity: stagger(reveal, 0)}}>第 5 周 · 10月9日 周四</div>
          <div style={{fontSize: 24, fontWeight: 700, marginTop: 10, opacity: stagger(reveal, 0.5)}}>上午好，小济</div>
          <div style={{fontSize: 17, marginTop: 10, opacity: stagger(reveal, 1)}}>愿你今天的灵感，比校园网信号还稳定。</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, color: C.primary, fontSize: 15, fontWeight: 600, marginTop: 10, opacity: stagger(reveal, 1.2)}}>
            <Icon name="refresh-cw" size={16} color={C.primary} /> 换一句
          </div>
          <div style={{height: 22}} />
          <Section title="今日课表" appear={stagger(reveal, 1.6)}>
            {TODAY.map((c, i) => (
              <Row key={c.name} appear={stagger(reveal, 2 + i * 0.6)}>
                <div style={{fontSize: 13, color: C.iconMuted}}>{c.time}</div>
                <div style={{fontSize: 16, fontWeight: 700, marginTop: 7}}>{c.name}</div>
                <div style={{fontSize: 16, marginTop: 5, color: alpha(C.content, 0.85)}}>{c.where}</div>
              </Row>
            ))}
          </Section>
          <Section title="校园消息" action="全部消息" appear={stagger(reveal, 4.2)}>
            {NOTICES.slice(0, 2).map((n) => (
              <Row key={n.title}>
                <div style={{fontSize: 16, fontWeight: 700, lineHeight: 1.45}}>{n.title}</div>
                <div style={{fontSize: 13, color: C.iconMuted, marginTop: 6}}>
                  {n.pub} · {n.date}
                </div>
              </Row>
            ))}
          </Section>
        </div>
      );
    }
    if (t === 2) {
      return (
        <div>
          <Section title="学业记录">
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
              {[
                ['平均绩点', '4.52'],
                ['已修学分', '62.5'],
                ['要求学分', '160'],
                ['本学期学分', '24'],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    width: 'calc(50% - 6px)',
                    boxSizing: 'border-box',
                    padding: 16,
                    borderRadius: 8,
                    border: `1px solid ${C.line}`,
                    boxShadow: '0 1px 3px rgba(15,23,42,.06)',
                  }}
                >
                  <div style={{fontSize: 13, color: alpha(C.content, 0.7)}}>{l}</div>
                  <div style={{fontSize: 18, fontWeight: 700, marginTop: 8}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize: 16, marginTop: 20}}>学分进度</div>
            <div style={{height: 8, borderRadius: 4, background: C.base200, marginTop: 8}}>
              <div style={{width: `${39 * clamp(tabSlide * 1.3)}%`, height: '100%', borderRadius: 4, background: C.primary}} />
            </div>
          </Section>
          <Section title="课程成绩">
            {GRADES.map((g) => (
              <Row key={g.name}>
                <div style={{fontSize: 16, fontWeight: 700}}>{g.name}</div>
                <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 16, rowGap: 4, marginTop: 7, fontSize: 15, color: alpha(C.content, 0.85)}}>
                  <span>学期：{g.term}</span>
                  <span>成绩：{g.score}</span>
                  <span>绩点：{g.gpa}</span>
                  <span>学分：{g.credit}</span>
                </div>
              </Row>
            ))}
          </Section>
        </div>
      );
    }
    return (
      <div>
        <div style={{height: 46, borderRadius: 12, background: C.base200, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', fontSize: 16, color: C.iconMuted}}>
          <Icon name="search" size={20} color={C.iconMuted} /> 搜索消息
        </div>
        <div style={{marginTop: 6}}>
          {NOTICES.map((n) => (
            <Row key={n.title}>
              <div style={{fontSize: 16, fontWeight: 700, lineHeight: 1.45}}>{n.title}</div>
              <div style={{fontSize: 13, color: C.iconMuted, marginTop: 6}}>
                {n.pub} · {n.date}
              </div>
            </Row>
          ))}
        </div>
      </div>
    );
  };
  const slideW = SW;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.base100, overflow: 'hidden'}}>
      <div data-hover="导航栏" style={{position: 'absolute', top: STATUS_H, left: 0, width: SW, height: APPBAR_H}}>
        <Avatar who="me" size={32} style={{position: 'absolute', left: 16, top: 11}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 15, textAlign: 'center', fontWeight: 700, fontSize: 17}}>我的校园</div>
        <div style={{position: 'absolute', right: 16, top: 14}}>
          <Icon name="graduation-cap" size={25} color={C.content} />
        </div>
      </div>
      <div style={{position: 'absolute', top: 117, left: 0, width: SW, height: 46, borderBottom: `1px solid ${C.line}`}}>
        {TABS.map((t, i) => (
          <div
            key={t}
            data-hover="校园分页"
            style={{
              position: 'absolute',
              left: TAB_X[i],
              top: 12,
              fontSize: 16,
              fontWeight: i === tab ? 700 : 400,
              color: i === tab ? C.content : C.iconMuted,
              whiteSpace: 'nowrap',
            }}
          >
            {t}
          </div>
        ))}
        <div style={{position: 'absolute', left: underlineX, width: underlineW, bottom: 0, height: 3, borderRadius: 2, background: C.primary}} />
      </div>
      <div style={{position: 'absolute', top: 163, left: 0, width: SW, bottom: 90, overflow: 'hidden'}}>
        {tabSlide < 1 && prevTab !== tab && (
          <div style={{position: 'absolute', top: 18 - scroll, left: 16, width: SW - 32, transform: `translateX(${-dir * tabSlide * slideW}px)`}}>{body(prevTab)}</div>
        )}
        <div style={{position: 'absolute', top: 18 - scroll, left: 16, width: SW - 32, transform: `translateX(${prevTab !== tab ? dir * (1 - tabSlide) * slideW : 0}px)`}}>
          {body(tab)}
        </div>
      </div>
      {nav && <BottomNav active={1} />}
    </div>
  );
};
