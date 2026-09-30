import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {SW} from '../ui/Phone';
import {AppBar, Back} from '../ui/primitives';
import {clamp} from '../timing';

export const COURSE = {
  name: '高等数学(B)上',
  code: '100251',
  school: '数学科学学院',
  teacher: '林老师',
  credits: '5 学分',
  alias: '高数',
  avg: 4.7,
  count: 128,
  dist: [2, 3, 8, 29, 86], // 1★..5★
};

export type Review = {id: string; stars: number; text: string; lines: number; date: string; helpful: number};

export const REVIEWS: Review[] = [
  {id: '0417', stars: 5, text: '讲得超清楚，板书工整，每章都会带着推一遍例题，期末复习一点不慌。', lines: 2, date: '2026-09-20', helpful: 86},
  {id: '1024', stars: 4, text: '作业量适中，习题课一定要去，助教会讲往年的题型。', lines: 2, date: '2026-09-18', helpful: 41},
  {id: '2333', stars: 5, text: '给分很友好，认真听课 + 按时交作业，90+ 不难。', lines: 2, date: '2026-09-15', helpful: 67},
  {id: '0901', stars: 4, text: '节奏偏快，建议课后当天复习，不然容易跟不上。', lines: 1, date: '2026-09-12', helpful: 23},
  {id: '1314', stars: 5, text: '答疑超级耐心，邮件基本当天就回，强推！', lines: 1, date: '2026-09-10', helpful: 52},
  {id: '0628', stars: 5, text: '选到就是赚到，高数原来也可以这么有意思。', lines: 1, date: '2026-09-08', helpful: 38},
  {id: '0233', stars: 4, text: '期中难度中等，平时的小测认真做就行。', lines: 1, date: '2026-09-05', helpful: 19},
  {id: '1111', stars: 5, text: '课件和板书都会发到群里，笔记党福音。', lines: 1, date: '2026-09-02', helpful: 27},
];

const LINE = 22.5;
export const reviewHeight = (r: Review) => 116 + r.lines * LINE;
export const REVIEWS_TOP = 560;
export const Stars: React.FC<{n: number; size?: number; fill?: number}> = ({n, size = 15, fill = 1}) => (
  <div style={{display: 'flex'}}>
    {[1, 2, 3, 4, 5].map((s) => {
      const on = s <= n && fill >= s / 5 - 0.01;
      return <Icon key={s} name={on ? 'star-filled' : 'star'} size={size} color={on ? C.warning : alpha(C.content, 0.2)} />;
    })}
  </div>
);

const Chip: React.FC<{icon: string; label: string; bold?: boolean}> = ({icon, label, bold}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      height: 34,
      padding: '0 12px',
      borderRadius: 17,
      border: `1px solid ${C.line}`,
      fontSize: 15,
      fontWeight: bold ? 600 : 400,
      color: alpha(C.content, 0.85),
    }}
  >
    <Icon name={icon} size={16} color={C.primary} />
    {label}
  </div>
);

const ReviewRow: React.FC<{r: Review; appear?: number; highlight?: number}> = ({r, appear = 1, highlight = 0}) => (
  <div
    data-hover="课程评价"
    style={{
      height: reviewHeight(r),
      boxSizing: 'border-box',
      padding: '12px 16px',
      borderBottom: `1px solid ${alpha(C.line, 0.8)}`,
      opacity: appear,
      background: highlight > 0 ? alpha(tint(C.warning, 30), highlight) : undefined,
    }}
  >
    <div style={{display: 'flex', alignItems: 'flex-start'}}>
      <div style={{flex: 1}}>
        <div style={{fontSize: 15, fontWeight: 600}}>匿名同学 #{r.id}</div>
        <div style={{fontSize: 12, color: alpha(C.content, 0.45), marginTop: 2}}>26秋 · {COURSE.teacher} · {r.date}</div>
      </div>
      <Stars n={r.stars} />
    </div>
    <div style={{fontSize: 15, lineHeight: `${LINE}px`, color: alpha(C.content, 0.85), marginTop: 8, height: r.lines * LINE}}>{r.text}</div>
    <div style={{marginTop: 8, display: 'flex'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          height: 32,
          padding: '0 12px',
          borderRadius: 16,
          border: `1px solid ${C.line}`,
          fontSize: 13,
          color: alpha(C.content, 0.7),
        }}
      >
        <Icon name="thumbs-up" size={15} color={alpha(C.content, 0.7)} />
        {r.helpful} 有用
      </div>
    </div>
  </div>
);

/** Course detail (courses/detail_page.dart). `fill` animates score + distribution. */
export const CoursePage: React.FC<{scroll: number; fill: number; b: number; highlightAt?: number[]}> = ({scroll, fill, b, highlightAt = []}) => {
  const max = Math.max(...COURSE.dist);
  const score = (COURSE.avg * fill).toFixed(1);
  const count = Math.round(COURSE.count * fill);
  return (
    <div style={{position: 'absolute', inset: 0, background: C.base100, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: -scroll, width: SW}}>
        <div style={{position: 'absolute', top: 132, left: 16, fontSize: 22, fontWeight: 700}}>{COURSE.name}</div>
        <div style={{position: 'absolute', top: 134, right: 16, fontSize: 14, color: C.iconMuted, background: C.base300, borderRadius: 8, padding: '3px 9px'}}>
          {COURSE.code}
        </div>
        <div style={{position: 'absolute', top: 170, left: 16, fontSize: 14, color: alpha(C.content, 0.45)}}>原名：高等数学B(1)</div>
        <div style={{position: 'absolute', top: 198, left: 16, display: 'flex', gap: 8}}>
          <Chip icon="university" label={COURSE.school} />
          <Chip icon="users-round" label={COURSE.teacher} />
          <Chip icon="graduation-cap" label={COURSE.credits} bold />
        </div>
        <div style={{position: 'absolute', top: 246, left: 16, display: 'flex', gap: 10, alignItems: 'center', fontSize: 14, color: alpha(C.content, 0.45)}}>
          别名：
          <span style={{background: C.base300, borderRadius: 6, padding: '2px 8px', color: alpha(C.content, 0.7)}}>{COURSE.alias}</span>
        </div>
        <div style={{position: 'absolute', top: 280, left: 0, right: 0, height: 1, background: C.line}} />
        {/* rating */}
        <div style={{position: 'absolute', top: 296, left: 16, display: 'flex', alignItems: 'baseline', gap: 8}}>
          <span style={{fontSize: 16, fontWeight: 700}}>课程评分</span>
          <span style={{fontSize: 13, color: alpha(C.content, 0.45)}}>{count} 条评价</span>
        </div>
        <div style={{position: 'absolute', top: 360, left: 16, display: 'flex', alignItems: 'baseline'}}>
          <span style={{fontSize: 30, fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>{score}</span>
          <span style={{fontSize: 15, color: alpha(C.content, 0.5), marginLeft: 5}}>/ 5.0</span>
        </div>
        <div style={{position: 'absolute', top: 326, left: 118, right: 16}}>
          {[5, 4, 3, 2, 1].map((star) => {
            const cnt = COURSE.dist[star - 1];
            const ratio = (cnt / max) * clamp(fill * 1.1 - (5 - star) * 0.04);
            return (
              <div key={star} style={{display: 'flex', alignItems: 'center', height: 24}}>
                <div style={{width: 28, display: 'flex', alignItems: 'center', gap: 2}}>
                  <Icon name="star-filled" size={12} color={alpha(C.content, 0.3)} />
                  <span style={{fontSize: 12, color: alpha(C.content, 0.55)}}>{star}</span>
                </div>
                <div style={{flex: 1, height: 6, borderRadius: 3, background: alpha(C.base300, 0.9)}}>
                  <div style={{width: `${ratio * 100}%`, height: '100%', borderRadius: 3, background: alpha(C.warning, [0.95, 0.72, 0.5, 0.34, 0.24][star - 1] + 0.1)}} />
                </div>
                <div style={{width: 30, textAlign: 'right', fontSize: 12, color: alpha(C.content, 0.45)}}>{Math.round(cnt * fill)}</div>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', top: 460, left: 0, right: 0, height: 1, background: C.line}} />
        <div style={{position: 'absolute', top: 476, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8}}>
          <Icon name="sparkles" size={18} color={C.primary} />
          <span style={{fontSize: 16, fontWeight: 700}}>AI 总结</span>
          <div style={{flex: 1}} />
          <Icon name="chevron-down" size={20} color={C.iconMuted} />
        </div>
        <div style={{position: 'absolute', top: 514, left: 0, right: 0, height: 1, background: C.line}} />
        <div style={{position: 'absolute', top: 528, left: 16, display: 'flex', gap: 8, alignItems: 'baseline'}}>
          <span style={{fontSize: 18, fontWeight: 700}}>课评</span>
          <span style={{fontSize: 15, color: alpha(C.content, 0.45)}}>{count}</span>
        </div>
        <div style={{position: 'absolute', top: REVIEWS_TOP, left: 0, width: SW}}>
          {REVIEWS.map((r, i) => (
            <ReviewRow key={r.id} r={r} highlight={highlightAt[i] !== undefined ? Math.max(0, 1 - Math.abs(b - highlightAt[i]) / 1.2) : 0} />
          ))}
        </div>
      </div>
      <AppBar left={<Back />} title={COURSE.name} right={<Icon name="ellipsis" size={22} color={C.content} />} />
      {/* bottom action bar */}
      <div data-hover="写课评" style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 108, background: C.base100, borderTop: `1px solid ${alpha(C.line, 0.6)}`, zIndex: 25}}>
        <div style={{position: 'absolute', left: 30, top: 23}}>
          <Icon name="bookmark" size={24} color={C.content} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 78,
            top: 12,
            width: 308,
            height: 48,
            borderRadius: 24,
            background: C.primary,
            color: C.primaryContent,
            fontWeight: 600,
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          写课评
        </div>
      </div>
    </div>
  );
};
