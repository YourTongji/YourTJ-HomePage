import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {SH, STATUS_H, SW} from '../ui/Phone';
import {AppBar, Avatar, Back, CategoryChip} from '../ui/primitives';
import {clamp, ipl} from '../timing';
import {QUESTION_BODY, QUESTION_TITLE} from './Composer';

export type Reply = {
  who: string;
  name: string;
  text: string;
  lines: number;
  likes: number;
  short: string; // floating card copy
  icon: string;
};

export const REPLIES: Reply[] = [
  {who: 'youzi', name: '柚子不酸', text: '记得带耳机！考前一定去试音，把音量调舒服 🎧', lines: 2, likes: 128, short: '记得带耳机，考前先试音', icon: '🎧'},
  {who: 'zaoba', name: '早八战士', text: '千万别睡过考试！！下午场也定三个闹钟 ⏰', lines: 2, likes: 96, short: '千万别睡过考试！', icon: '⏰'},
  {who: 'zhenti', name: '真题刷刷刷', text: '刷几份近三年真题，真题比什么都管用', lines: 1, likes: 87, short: '刷几份往年真题', icon: '📚'},
  {who: 'xianyu', name: '四平路咸鱼', text: '作文背两个万能模板，翻译多积累文化词', lines: 1, likes: 64, short: '作文背两个模板', icon: '✍️'},
  {who: 'moon', name: '嘉定小透明', text: '听力每天精听一篇，坚持两周就有感觉', lines: 1, likes: 51, short: '每天精听一篇', icon: '👂'},
  {who: 'sakura', name: '学姐不是学妹', text: '准考证提前打印，2B 铅笔和橡皮别忘带！', lines: 1, likes: 45, short: '准考证提前打印', icon: '🪪'},
  {who: 'duck', name: '冲鸭', text: '冲！425 稳稳的 💪', lines: 1, likes: 33, short: '425 稳稳的！', icon: '💪'},
];

// Fixed row geometry so scrolling stays deterministic.
const ROW_BASE = 128;
const LINE = 25;
export const rowHeight = (r: Reply) => ROW_BASE + r.lines * LINE;
export const REPLIES_TOP = 398; // content y where the first reply row starts

export const replyTop = (i: number) => {
  let y = REPLIES_TOP;
  for (let k = 0; k < i; k++) y += rowHeight(REPLIES[k]);
  return y;
};

const ReplyRow: React.FC<{r: Reply; floor: number; likes: number; liked: boolean; appear: number}> = ({
  r,
  floor,
  likes,
  liked,
  appear,
}) => (
  <div
    data-hover={`${floor} 楼`}
    style={{
      height: rowHeight(r),
      boxSizing: 'border-box',
      borderBottom: `1px solid ${C.line}`,
      padding: '14px 12px 0 12px',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 36}px)`,
      background: appear < 1 ? alpha(tint(C.primary, 8), 1 - appear) : undefined,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 8, height: 32}}>
      <Avatar who={r.who} size={32} />
      <span style={{fontWeight: 600, fontSize: 16}}>{r.name}</span>
      <div style={{flex: 1}} />
      <span style={{fontSize: 14, color: C.iconMuted}}>#{floor}</span>
    </div>
    <div style={{fontSize: 17, lineHeight: `${LINE}px`, marginTop: 10, height: r.lines * LINE}}>{r.text}</div>
    <div style={{fontSize: 14, color: C.iconMuted, marginTop: 8}}>刚刚</div>
    <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 10, color: C.iconMuted, fontSize: 15, paddingLeft: 10}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 6, color: liked ? C.error : C.iconMuted}}>
        <Icon name={liked ? 'heart-filled' : 'heart'} size={21} color={liked ? C.error : C.iconMuted} />
        <span style={{minWidth: 28}}>{likes}</span>
      </div>
      <Icon name="bookmark" size={21} color={C.iconMuted} />
      <Icon name="corner-down-left" size={21} color={C.iconMuted} />
      <Icon name="ellipsis" size={21} color={C.iconMuted} />
      <Icon name="flag" size={21} color={C.iconMuted} />
    </div>
  </div>
);

/**
 * Published topic with replies streaming in. `replyAt[i]` is the beat reply i lands.
 * `scroll` is in points.
 */
export const TopicPage: React.FC<{b: number; replyAt: number[]; scroll: number; views: number}> = ({
  b,
  replyAt,
  scroll,
  views,
}) => {
  const count = replyAt.filter((t) => b >= t).length;
  const shownTitle = scroll > 150;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.base100, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: -scroll, width: SW}}>
        {/* author */}
        <div style={{position: 'absolute', top: 133, left: 16, display: 'flex', gap: 12, alignItems: 'center'}}>
          <Avatar who="me" size={42} />
          <div>
            <div style={{fontWeight: 600, fontSize: 17}}>小济同学</div>
            <div style={{fontSize: 14, color: C.iconMuted, marginTop: 3}}>@xiaoji · 刚刚</div>
          </div>
        </div>
        <div style={{position: 'absolute', top: 146, right: 20}}>
          <Icon name="flag" size={22} color={C.iconMuted} />
        </div>
        <div style={{position: 'absolute', top: 190, left: 16}}>
          <CategoryChip label="学习交流" color={C.primary} size={14} />
        </div>
        <div style={{position: 'absolute', top: 226, left: 16, right: 16, fontSize: 24, lineHeight: '32px', fontWeight: 700}}>{QUESTION_TITLE}</div>
        <div style={{position: 'absolute', top: 272, left: 16, right: 16, fontSize: 17, lineHeight: '26px'}}>{QUESTION_BODY}</div>
        <div style={{position: 'absolute', top: 314, left: 16, display: 'flex', gap: 18, color: C.iconMuted, fontSize: 15, alignItems: 'center'}}>
          <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
            <Icon name="eye" size={19} color={C.iconMuted} />
            {views}
          </div>
          <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
            <Icon name="message-circle" size={19} color={C.iconMuted} />
            {count}
          </div>
        </div>
        <div style={{position: 'absolute', top: 344, left: 0, right: 0, height: 1, background: C.line}} />
        {/* replies header */}
        <div style={{position: 'absolute', top: 352, left: 12, right: 10, height: 42, display: 'flex', alignItems: 'center'}}>
          <span style={{fontWeight: 700, fontSize: 18}}>{count} 回复</span>
          <div style={{flex: 1}} />
          <div style={{display: 'flex', border: `1px solid ${C.line}`, borderRadius: 10, padding: '6px 4px', fontSize: 15}}>
            {['正序', '倒序', '只看楼主'].map((t, i) => (
              <span key={t} style={{padding: '0 12px', color: i === 0 ? C.primary : C.iconMuted, fontWeight: i === 0 ? 600 : 400}}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div style={{position: 'absolute', top: REPLIES_TOP, left: 0, width: SW}}>
          {REPLIES.map((r, i) => {
            if (b < replyAt[i]) return null;
            const appear = clamp(ipl(b, [replyAt[i], replyAt[i] + 0.55], [0, 1]));
            const likeT = clamp((b - replyAt[i] - 0.8) / 5);
            const likes = Math.round(r.likes * (0.1 + 0.9 * likeT));
            return <ReplyRow key={r.name} r={r} floor={i + 2} likes={likes} liked={i === 0 && b > replyAt[0] + 5} appear={appear} />;
          })}
        </div>
        <div style={{height: SH + 2000}} />
      </div>
      <AppBar
        left={<Back />}
        title={shownTitle ? QUESTION_TITLE : '话题'}
        right={<Icon name="ellipsis" size={24} color={C.content} />}
      />
      {/* floating action bar */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 782,
          width: 322,
          whiteSpace: 'nowrap',
          height: 46,
          borderRadius: 23,
          background: C.base100,
          border: `1px solid ${C.line}`,
          boxShadow: '0 6px 20px rgba(15,23,42,.10)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 18px',
          boxSizing: 'border-box',
          gap: 20,
          zIndex: 25,
        }}
      >
        <span style={{color: C.primary, fontWeight: 700, fontSize: 16}}>1 / {count + 1}</span>
        <Icon name="heart" size={21} color={C.iconMuted} />
        <Icon name="bookmark" size={21} color={C.iconMuted} />
        <Icon name="bell" size={21} color={C.iconMuted} />
        <div style={{display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 16}}>
          <Icon name="corner-down-left" size={18} color={C.content} />
          参与讨论
        </div>
      </div>
      <div style={{position: 'absolute', top: STATUS_H, left: 0}} />
    </div>
  );
};
