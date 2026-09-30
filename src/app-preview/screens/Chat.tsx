import React from 'react';
import {Icon} from '../Icon';
import {C, alpha} from '../theme';
import {SH, STATUS_H, SW} from '../ui/Phone';
import {Avatar, Back, Caret} from '../ui/primitives';
import {LogoMark} from '../ui/LogoMark';
import {clamp} from '../timing';

export type Msg = {mine: boolean; text?: string; sticker?: boolean; at: number; time: string};

/** Cat sticker drawn from the brand mark (sticker-only messages render bubble-less). */
export const CatSticker: React.FC<{size?: number; wiggle?: number}> = ({size = 118, wiggle = 0}) => (
  <div style={{width: size, height: size, position: 'relative'}}>
    <div style={{position: 'absolute', inset: 0, transform: `rotate(${Math.sin(wiggle) * 6}deg)`}}>
      <LogoMark size={size} />
    </div>
    <div style={{position: 'absolute', right: -6, top: -4, fontSize: size * 0.26, transform: `scale(${1 + Math.sin(wiggle * 1.7) * 0.12})`}}>❤️</div>
    <div
      style={{
        position: 'absolute',
        left: -8,
        bottom: -6,
        background: C.base100,
        border: `2.5px solid ${C.brand}`,
        color: C.brand,
        borderRadius: 12,
        fontSize: size * 0.15,
        fontWeight: 800,
        padding: '2px 8px',
        transform: 'rotate(-8deg)',
      }}
    >
      要要要！
    </div>
  </div>
);

const EMOJI = ['😀', '😂', '🥹', '😍', '🥰', '😎', '🤔', '😭', '👍', '🙌', '👏', '🙏', '💪', '🎉', '✨', '❤️', '🔥', '📚', '☕️', '🍜', '🌙', '⭐️', '🎧', '✅'];

export const EMOJI_PANEL_H = 300;

export const ChatPage: React.FC<{
  b: number;
  frame: number;
  msgs: Msg[];
  input: string;
  focus: boolean;
  emojiOpen: number;
  emojiPick?: {index: number; at: number};
  scroll: number;
  /**
   * Room to leave under the composer for a shell nav the *host* draws (the
   * hero's tab switching keeps the app shell visible above the thread).
   */
  shellInset?: number;
}> = ({b, frame, msgs, input, focus, emojiOpen, emojiPick, scroll, shellInset = 0}) => {
  const inputBarH = 64;
  const bottomInset = 34;
  const panel = EMOJI_PANEL_H * emojiOpen;
  const barTop = SH - bottomInset - inputBarH - panel - shellInset;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.base100, overflow: 'hidden'}}>
      {/* app bar */}
      <div data-hover="会话标题" style={{position: 'absolute', top: 0, left: 0, width: SW, height: STATUS_H + 55, background: C.base100, borderBottom: `1px solid ${C.line}`, zIndex: 20}}>
        <div style={{position: 'absolute', top: STATUS_H + 14, left: 14}}>
          <Back />
        </div>
        <Avatar who="youzi" size={36} ring style={{position: 'absolute', top: STATUS_H + 9, left: 50}} />
        <div style={{position: 'absolute', top: STATUS_H + 9, left: 96}}>
          <div style={{fontSize: 15, fontWeight: 700}}>柚子不酸</div>
          <div style={{fontSize: 12, color: alpha(C.content, 0.5), marginTop: 2}}>私信</div>
        </div>
        <div style={{position: 'absolute', top: STATUS_H + 16, right: 16}}>
          <Icon name="ellipsis" size={22} color={C.content} />
        </div>
      </div>
      {/* messages (bottom-anchored) */}
      <div style={{position: 'absolute', left: 0, width: SW, top: 117, height: barTop - 117, overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 12, right: 12, bottom: -scroll, display: 'flex', flexDirection: 'column'}}>
          <div style={{alignSelf: 'center', margin: '8px 0', padding: '4px 10px', borderRadius: 999, background: C.base300, color: alpha(C.content, 0.55), fontSize: 11, fontWeight: 600}}>
            今天 20:14
          </div>
          {msgs.map((m, i) => {
            if (b < m.at) return null;
            const p = clamp((b - m.at) / 0.5);
            const s = 1 - Math.exp(-7 * p) * Math.cos(p * 8);
            return (
              <div
                key={i}
                data-hover="消息"
                style={{
                  display: 'flex',
                  justifyContent: m.mine ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '5px 0',
                  opacity: clamp(p * 3),
                  transform: `translateY(${(1 - s) * 30}px) scale(${0.85 + 0.15 * s})`,
                  transformOrigin: m.mine ? '100% 100%' : '0% 100%',
                }}
              >
                {!m.mine && <Avatar who="youzi" size={32} />}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: m.mine ? 'flex-end' : 'flex-start', maxWidth: '74%'}}>
                  {m.sticker ? (
                    <div style={{padding: '6px 6px 10px 10px'}}>
                      <CatSticker wiggle={(b - m.at) * 2.4} />
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 20,
                        background: m.mine ? C.primary : C.base300,
                        color: m.mine ? C.primaryContent : C.content,
                        fontSize: 16,
                        lineHeight: 1.45,
                      }}
                    >
                      {m.text}
                    </div>
                  )}
                  <div style={{fontSize: 12, color: alpha(C.content, 0.55), marginTop: 4}}>{m.time}</div>
                </div>
                {m.mine && <Avatar who="me" size={32} ring />}
              </div>
            );
          })}
        </div>
      </div>
      {/* composer */}
      <div data-hover="输入框" style={{position: 'absolute', left: 0, width: SW, top: barTop, height: inputBarH, background: C.base100, borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', boxSizing: 'border-box', zIndex: 20}}>
        <div style={{width: 40, height: 40, borderRadius: 20, background: C.base200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="plus" size={24} color={C.content} />
        </div>
        <div
          style={{
            flex: 1,
            height: 44,
            borderRadius: 22,
            background: C.base200,
            border: `1.5px solid ${focus ? alpha(C.primary, 0.32) : 'transparent'}`,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px 0 16px',
            boxSizing: 'border-box',
            fontSize: 16,
          }}
        >
          <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden'}}>
            {input ? <span>{input}</span> : !focus && <span style={{color: C.iconMuted}}>输入消息…</span>}
            {focus && <Caret frame={frame} height={20} />}
            {!input && focus && <span style={{color: C.iconMuted}}>输入消息…</span>}
          </div>
          <Icon name={emojiOpen > 0.5 ? 'keyboard' : 'smile'} size={23} color={emojiOpen > 0.5 ? C.primary : C.iconMuted} />
        </div>
        <div style={{width: 40, height: 40, borderRadius: 20, background: input ? C.primary : C.base200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="arrow-up" size={23} color={input ? C.primaryContent : alpha(C.iconMuted, 0.6)} />
        </div>
      </div>
      {/* emoji panel */}
      {emojiOpen > 0 && (
        <div style={{position: 'absolute', left: 0, width: SW, top: SH - bottomInset - panel, height: EMOJI_PANEL_H + bottomInset, background: C.base200, borderTop: `1px solid ${C.line}`, overflow: 'hidden'}}>
          <div style={{display: 'flex', gap: 18, padding: '10px 16px 4px', fontSize: 14, fontWeight: 600}}>
            <span style={{color: C.primary}}>表情</span>
            <span style={{color: C.iconMuted}}>贴纸</span>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', padding: '8px 10px', rowGap: 12}}>
            {EMOJI.map((e, i) => {
              const hit = emojiPick && emojiPick.index === i ? clamp(1 - Math.abs(b - emojiPick.at) / 0.4) : 0;
              return (
                <div key={i} style={{fontSize: 27, textAlign: 'center', transform: `scale(${1 + hit * 0.5})`, background: hit > 0 ? alpha(C.primary, 0.12 * hit) : undefined, borderRadius: 10}}>
                  {e}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

