import React from 'react';
import {Icon} from '../Icon';
import {C, alpha} from '../theme';
import {SW} from '../ui/Phone';
import {AppBar, Back} from '../ui/primitives';

const NAMESPACES = [
  {title: '同济新手教程', desc: '学校概况、学业指导、校园设施、生活服务，新生必读', n: 57, date: '2026-09-21 16:34'},
  {title: '选课锦囊', desc: '选课系统提示、选课时间与操作建议', n: 18, date: '2026-09-10 14:05'},
  {title: '校园生活', desc: '社团活动、美食地图、出行攻略', n: 32, date: '2026-09-18 09:20'},
];

const RECENT = [
  ['新生报到全流程', '5 分钟前'],
  ['四平路-嘉定 通勤指南', '1 小时前'],
  ['食堂红黑榜', '昨天'],
  ['图书馆使用指南', '2 天前'],
];

export const WikiHome: React.FC<{press?: number}> = ({press = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: C.base100}}>
    <AppBar left={<Back />} title="Wiki" />
    <div style={{position: 'absolute', top: 132, left: 16, fontSize: 24, fontWeight: 700}}>你的校园生活指南</div>
    <div
      style={{
        position: 'absolute',
        top: 184,
        left: 16,
        right: 16,
        height: 50,
        borderRadius: 12,
        background: C.base200,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 14px',
        fontSize: 16,
        color: alpha(C.content, 0.75),
      }}
    >
      <Icon name="search" size={22} color={C.content} />
      搜索校园知识
    </div>
    <div style={{position: 'absolute', top: 264, left: 16, fontSize: 15, fontWeight: 600, color: C.iconMuted}}>内容分类</div>
    <div style={{position: 'absolute', top: 294, left: 0, width: SW}}>
      {NAMESPACES.map((ns, i) => (
        <div
          key={ns.title}
          data-hover="Wiki 分类"
          style={{
            margin: '0 16px',
            padding: '14px 0',
            borderBottom: `1px solid ${alpha(C.line, 0.8)}`,
            background: i === 0 && press > 0 ? alpha(C.emerald, 0.07 * press) : undefined,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center'}}>
            <span style={{fontSize: 17, fontWeight: 700}}>{ns.title}</span>
            <div style={{flex: 1}} />
            <div style={{display: 'flex', alignItems: 'center', gap: 4, background: C.base200, borderRadius: 8, padding: '3px 8px', fontSize: 14, color: C.iconMuted, fontWeight: 600}}>
              <Icon name="file-text" size={14} color={C.iconMuted} />
              {ns.n}
            </div>
          </div>
          <div style={{fontSize: 15, color: C.iconMuted, marginTop: 6, lineHeight: 1.45}}>{ns.desc}</div>
          <div style={{fontSize: 13, color: alpha(C.iconMuted, 0.85), marginTop: 6, display: 'flex', alignItems: 'center', gap: 5}}>
            <Icon name="clock" size={13} color={alpha(C.iconMuted, 0.85)} />
            {ns.date}
          </div>
        </div>
      ))}
    </div>
    <div style={{position: 'absolute', top: 640, left: 16, fontSize: 15, fontWeight: 600, color: C.iconMuted}}>最近更新</div>
    <div style={{position: 'absolute', top: 668, left: 16, right: 16}}>
      {RECENT.map(([t, d]) => (
        <div key={t} style={{padding: '11px 0', borderBottom: `1px solid ${alpha(C.line, 0.8)}`}}>
          <div style={{fontSize: 17, fontWeight: 600}}>{t}</div>
          <div style={{fontSize: 13, color: C.iconMuted, marginTop: 4}}>{d}</div>
        </div>
      ))}
    </div>
  </div>
);

const TABLE = [
  ['学校', '学校简介、学院概况、校训校歌'],
  ['学业', '培养方案、学分 GPA、考试安排'],
  ['校园设施', '校区交通、宿舍、图书馆、食堂'],
  ['校园生活', '社团组织、创新创业、文体活动'],
  ['服务与资源', '校园卡、信息平台、奖助学金'],
  ['常见问题', '电脑选购、入学考试、报到须知'],
];

const CHECK = ['录取通知书与身份证', '一寸证件照若干', '校园卡激活与充值', '宿舍床品与插线板'];

export const WikiDoc: React.FC<{scroll: number; tocOpen?: number}> = ({scroll, tocOpen = 0}) => (
  <div style={{position: 'absolute', inset: 0, background: C.base100, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 16, right: 16, top: 130 - scroll}}>
      <div style={{fontSize: 17, lineHeight: 1.6}}>
        本空间是面向同济同学的校园百科，涵盖学校概况、学业指导、校园设施、生活服务等板块，帮助新生快速融入校园生活。
      </div>
      <div style={{fontSize: 27, fontWeight: 700, marginTop: 26}}>板块导航</div>
      <div style={{marginTop: 16, fontSize: 16}}>
        <div style={{display: 'flex', fontWeight: 700, paddingBottom: 6}}>
          <div style={{width: 96}}>板块</div>
          <div>内容</div>
        </div>
        {TABLE.map(([k, v]) => (
          <div key={k} style={{display: 'flex', padding: '5px 0'}}>
            <div style={{width: 96, color: C.primary, textDecoration: 'underline', textUnderlineOffset: 3}}>{k}</div>
            <div style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: alpha(C.content, 0.9)}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize: 27, fontWeight: 700, marginTop: 28}}>报到清单</div>
      <div style={{marginTop: 14}}>
        {CHECK.map((t, i) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', fontSize: 17}}>
            <div style={{width: 20, height: 20, borderRadius: 6, background: i < 2 ? C.emerald : 'transparent', border: `1.5px solid ${i < 2 ? C.emerald : C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {i < 2 && <Icon name="check" size={14} color={C.base100} />}
            </div>
            {t}
          </div>
        ))}
      </div>
      <div style={{fontSize: 27, fontWeight: 700, marginTop: 28}}>写作原则</div>
      <div style={{fontSize: 17, lineHeight: 1.6, marginTop: 10}}>先给事实，再给经验，最后引导进一步探索；宁可简洁准确，也不堆砌内容。</div>
    </div>
    <AppBar left={<Back />} title="同济新手教程" right={<Icon name="external-link" size={22} color={C.content} />} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, background: C.base100, borderTop: `1px solid ${C.line}`, display: 'flex', justifyContent: 'space-around', paddingTop: 14, color: C.primary, fontSize: 16, fontWeight: 600, zIndex: 25}}>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', height: 26}}>
        <Icon name="list-ordered" size={20} color={C.primary} /> 目录
      </div>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', height: 26}}>
        <Icon name="search" size={20} color={C.primary} /> 搜索
      </div>
    </div>
    {tocOpen > 0 && (
      <>
        <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.38 * tocOpen})`, zIndex: 40}} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 330,
            background: C.base100,
            borderRadius: '26px 26px 0 0',
            zIndex: 41,
            transform: `translateY(${(1 - tocOpen) * 340}px)`,
            padding: '12px 18px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{width: 40, height: 5, borderRadius: 3, background: C.line, margin: '0 auto 16px'}} />
          <div style={{fontSize: 17, fontWeight: 700, marginBottom: 12}}>目录</div>
          {['板块导航', '报到清单', '写作原则', '常见问题'].map((t, i) => (
            <div key={t} style={{fontSize: 16, padding: '10px 4px', color: i === 1 ? C.primary : alpha(C.content, 0.75), fontWeight: i === 1 ? 600 : 400}}>
              {t}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);
