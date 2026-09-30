import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {STATUS_H, SW} from '../ui/Phone';
import {Back, Caret} from '../ui/primitives';

export const QUESTION_TITLE = '大学英语四级需要怎么准备？';
export const QUESTION_BODY = '听力和作文都没底，求学长学姐支招🙏';

/** 发布 · 提问 composer (publish_page.dart, question type). */
export const Composer: React.FC<{
  frame: number;
  title: string;
  body: string;
  focus: 'title' | 'body' | null;
  step2: number; // 0→1 progress into 预览 step
  pressed?: boolean;
}> = ({frame, title, body, focus, step2, pressed}) => {
  const btnLabel = step2 > 0.5 ? '发布' : '下一步';
  return (
    <div style={{position: 'absolute', inset: 0, background: C.base100}}>
      {/* app bar */}
      <div data-hover="导航栏" style={{position: 'absolute', top: STATUS_H, left: 0, width: SW, height: 55, borderBottom: `1px solid ${C.line}`}}>
        <div style={{position: 'absolute', left: 14, top: 14}}>
          <Back />
        </div>
        <div style={{position: 'absolute', left: 81, top: 13, width: 29, height: 29, borderRadius: 15, background: tint(C.emerald, 12), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="circle-help" size={16} color={C.emerald} />
        </div>
        <div style={{position: 'absolute', left: 118, top: 15, fontWeight: 700, fontSize: 17}}>提问</div>
        <div style={{position: 'absolute', left: 300, top: 16}}>
          <Icon name="chevron-down" size={22} color={C.iconMuted} />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 8,
            top: 11,
            height: 32,
            width: 66,
            borderRadius: 16,
            background: C.primary,
            color: C.primaryContent,
            fontWeight: 600,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${pressed ? 0.92 : 1})`,
            filter: pressed ? 'brightness(0.9)' : undefined,
          }}
        >
          {btnLabel}
        </div>
      </div>
      {/* progress */}
      <div style={{position: 'absolute', top: 137, left: 20, width: 177, height: 3, borderRadius: 2, background: C.emerald}} />
      <div style={{position: 'absolute', top: 137, left: 205, width: 177, height: 3, borderRadius: 2, background: C.line, overflow: 'hidden'}}>
        <div style={{width: `${step2 * 100}%`, height: '100%', background: C.emerald}} />
      </div>
      <div style={{position: 'absolute', top: 152, left: 20, fontSize: 13, fontWeight: 700, display: 'flex', gap: 12}}>
        <span style={{color: step2 > 0.5 ? C.iconMuted : C.emerald}}>1 · 编辑</span>
        <span style={{color: step2 > 0.5 ? C.emerald : C.iconMuted}}>2 · 预览</span>
      </div>
      <div style={{position: 'absolute', top: 184, left: 20, fontSize: 15, color: C.iconMuted}}>描述你的疑问，让大家一起想办法</div>
      {/* image picker card */}
      <div
        data-hover="图片选择"
        style={{
          position: 'absolute',
          top: 226,
          left: 20,
          width: 362,
          height: 78,
          borderRadius: 16,
          background: C.base200,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '0 16px',
          boxSizing: 'border-box',
        }}
      >
        <Icon name="gallery-duotone" size={30} color={C.emerald} />
        <div>
          <div style={{fontWeight: 700, fontSize: 15}}>先选图片，再记录这一刻</div>
          <div style={{fontSize: 13, color: C.iconMuted, marginTop: 4}}>最多 9 张，长按拖动排序</div>
        </div>
      </div>
      {/* title */}
      <div data-hover="标题" style={{position: 'absolute', top: 330, left: 20, right: 20, fontSize: 24, lineHeight: '34px', fontWeight: 700, color: title ? C.content : C.iconMuted}}>
        {title || (focus === 'title' ? '' : '标题')}
        {focus === 'title' && <Caret frame={frame} height={26} />}
        {!title && focus === 'title' && <span style={{color: C.iconMuted}}>标题</span>}
      </div>
      {/* body */}
      <div data-hover="正文" style={{position: 'absolute', top: 386, left: 20, right: 20, fontSize: 17, lineHeight: '26px', color: body ? alpha(C.content, 0.9) : C.iconMuted}}>
        {body || (focus === 'body' ? '' : '正文内容...')}
        {focus === 'body' && <Caret frame={frame} height={20} />}
        {!body && focus === 'body' && <span style={{color: C.iconMuted}}>正文内容...</span>}
      </div>
      {/* bottom bar */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 783, height: 1, background: C.line}} />
      <div style={{position: 'absolute', left: 22, top: 800}}>
        <Icon name="smile" size={26} color={C.iconMuted} />
      </div>
      <div style={{position: 'absolute', right: 26, top: 801, fontSize: 17, fontWeight: 600, color: C.primary}}>保存草稿</div>
    </div>
  );
};
