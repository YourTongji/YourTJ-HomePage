import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PREVIEW_SLIDES } from '../constants';
import { useFitScale } from '../app-preview/useFitScale';
import { HUB_CANVAS_HEIGHT, HUB_CANVAS_WIDTH } from '../hub-mock/primitives';
import { hubPreviewPageFor } from '../hub-mock/registry';
import { prefersReducedMotion, useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n';
import {
  ArrowUpRightIcon,
  CloseIcon,
  FlagIcon,
  FlameIcon,
  SearchIcon,
  ShareIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from './icons';
import { Avatar } from '../app-preview/ui/primitives';
import { LineSidebar } from './LineSidebar';
import PeekRating from './PeekRating';
import {
  MessageSquare,
  Eye,
  Heart,
  Bookmark,
  Sparkles,
  MapPin,
  User,
  Clock,
  X,
  Copy,
  Download,
  Check,
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/*
 * YourTJHub preview, scroll-driven storytelling.
 *
 * Left column features the architectural LineSidebar component from React Bits:
 * - High-precision horizontal line markers and in-between ticks
 * - Monospace padded indexes (01, 02, 03, 04)
 * - Proximity-driven cursor physics and exponential smoothing
 * - Directly tied to scroll progress and active slide state
 * - Active chapter narrative, authentic student data, and companion cards:
 *   - 01 论坛: live discussion topic tags, participant pulse and real-time activity
 *   - 02 选课: genuine student rating metrics, recommendation scores and quotes
 *   - 03 课表: smart conflict-free schedule validator and calendar export chips
 *   - 04 文库: collaborative survival manual chapters and peer contributor stats
 *
 * Right column features the flush live presentation canvas pinned sticky at eye-level:
 * - Direct card presentation with rich elevation and border-edge precision
 * - Aspect ratio locked exactly to HUB_CANVAS_WIDTH / HUB_CANVAS_HEIGHT
 * - Subtle 3D physical perspective tilt reacting smoothly to scroll and pointer
 * - Clean choreographed surface switch with layered depth and .hub-stagger cascade
 */

const displayUrl = (href: string): string => href.replace(/^https?:\/\//, '');

/** How far the panel tilts, in degrees, across the whole section. */
const PANEL_TILT = 1.4;
/** Keep canvas strictly flush to avoid exposing borders or margins */
const CANVAS_DRIFT = 0;

const STEPS = [
  {
    id: 'hub-home',
    num: '01',
    label: '论坛社交',
    desc: '',
  },
  {
    id: 'hub-courses',
    num: '02',
    label: '发现好课',
    desc: '',
  },
  {
    id: 'hub-schedule',
    num: '03',
    label: '规划课表',
    desc: '',
  },
  {
    id: 'hub-wiki',
    num: '04',
    label: '校园百科',
    desc: '',
  },
];

/**
 * 01 论坛社交 Companion Component - 1:1 像素级复刻 @[YourTJ-Hub] 卡片视图帖子组件
 */
const ForumCompanion: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(108);
  const [bookmarked, setBookmarked] = useState(false);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  return (
    <div className="rounded-xl border border-edge/80 bg-surface/90 p-3.5 sm:p-4 shadow-2xs transition-all hover:border-edge-strong">
      {/* 头部元信息：作者头像 + 昵称 + 发布时间 + 分类徽标 */}
      <div className="flex items-center gap-2.5">
        <div className="relative h-8 w-8 shrink-0 rounded-full ring-2 ring-brand/20 overflow-hidden bg-surface-subtle">
          <Avatar who="moon" size={32} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="max-w-full truncate text-[13px] sm:text-sm font-semibold leading-5 text-primary">
              Anon
            </span>
            <span className="text-xs leading-5 text-tertiary">
              10 分钟前
            </span>
          </div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-1.5">
            {/* 内容类型徽章: 瞬间 (1:1 对齐 TopicFeedMeta.vue) */}
            <span className="inline-flex h-4.5 items-center gap-1 rounded-full bg-purple-500/15 px-1.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400">
              <Sparkles className="h-2.5 w-2.5" />
              <span>瞬间</span>
            </span>
            {/* 板块 Tag: 泛ACG (1:1 对齐 TopicFeedMeta.vue) */}
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-1.5 py-0.5 text-[10px] font-medium text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              泛ACG
            </span>
            {/* Hot 徽标 */}
            <span className="inline-flex h-4.5 items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              <FlameIcon className="h-2.5 w-2.5" />
              hot
            </span>
          </div>
        </div>
      </div>

      {/* 标题 */}
      <h3 className="mt-2.5 line-clamp-2 text-sm sm:text-[15px] font-semibold leading-6 text-primary transition-colors hover:text-link">
        为什么要演奏春日影？
      </h3>

      {/* 内容简介 */}
      <p className="mt-1 line-clamp-2 text-xs sm:text-sm leading-relaxed text-secondary">
        U咩哇抛瓦⏰
      </p>

      {/* 底部互动操作栏（TopicCardActions.vue 源码 1:1 像素级复刻） */}
      <div className="mt-3 flex flex-wrap items-center gap-0.5 border-t border-edge/60 pt-2 text-xs text-secondary/70">
        <a
          href="https://f.yourtj.de"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 transition-colors hover:bg-surface-subtle hover:text-primary cursor-pointer"
          title="回复"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="tabular-nums font-mono">42</span>
        </a>

        <span
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2"
          title="浏览量"
        >
          <Eye className="h-4 w-4" />
          <span className="tabular-nums font-mono">1.5k</span>
        </span>

        <button
          type="button"
          onClick={toggleLike}
          className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 transition-colors hover:bg-surface-subtle cursor-pointer ${
            liked ? 'text-rose-500 hover:text-rose-600' : 'hover:text-primary'
          }`}
          title="点赞"
          aria-pressed={liked}
          aria-label={`点赞 ${likeCount}`}
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-current text-rose-500' : ''}`} />
          <span className="tabular-nums font-mono">{likeCount}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setBookmarked(!bookmarked);
          }}
          className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2 transition-colors hover:bg-surface-subtle cursor-pointer ${
            bookmarked ? 'text-link hover:text-link' : 'hover:text-primary'
          }`}
          title={bookmarked ? '已收藏' : '收藏'}
          aria-pressed={bookmarked}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current text-link' : ''}`} />
        </button>
      </div>
    </div>
  );
};

/**
 * 02 发现好课 Companion Component - 1:1 像素级复刻 @[YourTJ-Hub] 站内课程评价组件 (CourseDetailPage.vue 真实数据)
 */
const CourseCompanion: React.FC<{ active?: boolean }> = ({ active = false }) => {
  const [rating, setRating] = useState(5);
  const [helpful, setHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(12);
  const [disliked, setDisliked] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [reported, setReported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<number[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 640);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    timerRef.current.forEach((t) => window.clearTimeout(t));
    timerRef.current = [];

    if (active) {
      setRating(0);
      // 逐个点亮 5 颗星星，触发 PeekRating 的 pop 和 lift 显像动效
      [1, 2, 3, 4, 5].forEach((val, idx) => {
        const id = window.setTimeout(() => {
          setRating(val);
        }, 160 + idx * 150);
        timerRef.current.push(id);
      });
    } else {
      setRating(5);
    }

    return () => {
      timerRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, [active]);

  const toggleHelpful = (e: React.MouseEvent) => {
    e.preventDefault();
    if (helpful) {
      setHelpful(false);
      setHelpfulCount((c) => c - 1);
    } else {
      setHelpful(true);
      setHelpfulCount((c) => c + 1);
      if (disliked) {
        setDisliked(false);
        setDislikeCount((c) => Math.max(0, c - 1));
      }
    }
  };

  const toggleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disliked) {
      setDisliked(false);
      setDislikeCount((c) => c - 1);
    } else {
      setDisliked(true);
      setDislikeCount((c) => c + 1);
      if (helpful) {
        setHelpful(false);
        setHelpfulCount((c) => Math.max(0, c - 1));
      }
    }
  };

  const toggleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    setReported(!reported);
  };

  return (
    <div className="rounded-xl border border-edge/80 bg-surface/90 p-3 sm:p-4 shadow-2xs transition-all hover:border-edge-strong">
      {/* 头部：左头像 + 作者/开课班信息（1:1 对齐 YourTJ-Hub CourseDetailPage.vue 样式规范） */}
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-full overflow-hidden bg-surface-subtle ring-1 ring-edge/70">
            <Avatar who="xianyu" size={36} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs sm:text-[13px] font-semibold leading-snug sm:leading-5 text-primary">
              历史匿名评价
            </p>
            <p className="truncate text-[10.5px] sm:text-[11px] leading-snug sm:leading-4 text-tertiary">
              管理学概论 (解*梅) · 2024-2025-1
            </p>
          </div>
        </div>

        {/* PeekRating: 移动端自适应紧凑尺寸（size=14），桌面端保持标准尺寸（size=18） */}
        <div className="shrink-0 -mt-0.5 -mr-0.5 sm:-mt-1 sm:-mr-1">
          <PeekRating
            value={rating}
            count={5}
            shape="star"
            size={isMobile ? 14 : 18}
            lift={isMobile ? 3 : 4}
            magnify={1.15}
            riseDuration={240}
            popScale={1.25}
            showTip={!isMobile}
            labels={['很差', '较差', '一般', '推荐', '力荐']}
            activeColor="#f59e0b"
            idleColor="#a1a1aa"
            tipColor="#18181b"
            tipTextColor="#f4f4f5"
            onChange={(val) => setRating(val)}
            ariaLabel="课程评分"
          />
        </div>
      </div>

      {/* 真实评价内容（直取 f.yourtj.de 课程 #11438 真实课评 #2092，自然响应式流式排版） */}
      <div className="mt-2.5 space-y-1 sm:space-y-1.5 text-[11.5px] sm:text-[13px] leading-snug sm:leading-relaxed text-secondary">
        <div>
          <span className="font-semibold text-primary">课程内容：</span>
          <span>老师自己的PPT，正常书上的内容，案例很多很生动。</span>
        </div>
        <div>
          <span className="font-semibold text-primary">上课自由度：</span>
          <span>高，发言会有加分，不发言也没关系，不提问点名。</span>
        </div>
        <div>
          <span className="font-semibold text-primary">考核标准：</span>
          <span>平时分（签到严格）+ pre + 期末，老师期末会捞人，考核很公允。</span>
        </div>
        <div>
          <span className="font-semibold text-primary">授课质量：</span>
          <span>老师人真的很好，温和有耐心，认真听讲收获很大，推荐选读！</span>
        </div>
      </div>

      {/* 底部功能区：点赞 / 点踩 / 分享评论 / 举报 + 评价短码编号（1:1 对齐 YourTJ-Hub 原组件规范） */}
      <div className="mt-3 flex items-center justify-between gap-1 sm:gap-2 border-t border-edge/60 pt-2 text-xs">
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 min-w-0">
          <button
            type="button"
            onClick={toggleHelpful}
            className={`inline-flex min-w-fit shrink-0 items-center gap-1 sm:gap-1.5 rounded-full border px-2 py-1 text-[11px] sm:text-xs font-medium leading-none transition cursor-pointer ${
              helpful
                ? 'border-amber-300/80 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                : 'border-edge bg-surface text-secondary hover:border-edge-strong hover:text-primary'
            }`}
            aria-pressed={helpful}
            title={helpful ? '撤销赞同' : '赞同'}
          >
            <ThumbsUpIcon className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="tabular-nums font-mono">{helpfulCount}</span>
            <span className="hidden xs:inline text-[10px] font-semibold opacity-80">{helpful ? '撤销' : '赞同'}</span>
          </button>

          <button
            type="button"
            onClick={toggleDislike}
            className={`inline-flex min-w-fit shrink-0 items-center gap-1 sm:gap-1.5 rounded-full border px-2 py-1 text-[11px] sm:text-xs font-medium leading-none transition cursor-pointer ${
              disliked
                ? 'border-red-300/80 bg-red-500/10 text-red-700 dark:text-red-300'
                : 'border-edge bg-surface text-secondary hover:border-edge-strong hover:text-primary'
            }`}
            aria-pressed={disliked}
            title={disliked ? '撤销反对' : '反对'}
          >
            <ThumbsDownIcon className="h-3.5 w-3.5 text-tertiary shrink-0" />
            <span className="tabular-nums font-mono">{dislikeCount}</span>
            <span className="hidden xs:inline text-[10px] font-semibold opacity-80">{disliked ? '撤销' : '反对'}</span>
          </button>

          <button
            type="button"
            className="inline-flex min-w-fit shrink-0 items-center gap-1 sm:gap-1.5 rounded-full border border-edge bg-surface px-2 py-1 text-[11px] sm:text-xs font-medium leading-none text-secondary hover:border-edge-strong hover:text-primary transition cursor-pointer"
            title="分享评论"
          >
            <ShareIcon className="h-3.5 w-3.5 text-tertiary shrink-0" />
            <span className="hidden sm:inline text-[10px] font-semibold opacity-80">分享评论</span>
          </button>

          <button
            type="button"
            onClick={toggleReport}
            className={`inline-flex min-w-fit shrink-0 items-center gap-1 sm:gap-1.5 rounded-full border px-2 py-1 text-[11px] sm:text-xs font-medium leading-none transition cursor-pointer ${
              reported
                ? 'border-red-400/50 bg-red-500/10 text-red-600 dark:text-red-400'
                : 'border-edge bg-surface text-secondary hover:border-edge-strong hover:text-primary'
            }`}
            title={reported ? '已提交举报' : '举报这条评价'}
          >
            <FlagIcon className={`h-3.5 w-3.5 shrink-0 ${reported ? 'text-red-500' : 'text-tertiary'}`} />
            <span className="hidden sm:inline text-[10px] font-semibold opacity-80">{reported ? '已举报' : '举报'}</span>
          </button>
        </div>

        {/* 仅保留 # 编号，去除 sqid 名称露出的模板感 */}
        <span className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[11px] tabular-nums text-tertiary pl-1">
          <span className="font-mono opacity-50">#</span>
          <span className="font-mono">m8x2</span>
        </span>
      </div>
    </div>
  );
};

/**
 * 03 课表规划 Companion Component - 1:1 像素级复刻 @[YourTJ-Hub] 排课器图片导出海报 (ScheduleExportDialog.vue)
 * 严格对齐 ScheduleExportDialog.vue 源码：
 * - 4 极简转角十字标（＋）
 * - 双层水平轴对称横幅：左主标题+学期，右「由YourTJ社区生成」品牌标；次层方案+周次+专业统计，右侧时钟时间戳
 * - 课表网格：上课安排 + 周一至周五双层表头（中文+英文缩写），节次侧栏（上午/下午 + 节号 + 时间段）
 * - 课程卡片：顶部色彩胶囊条 + 课程名 + 课号 + 地点(MapPin) + 教师(User) + 周次与单双周标签
 * - 课表下方独立悬浮交互操作坞 (Floating Action Dock)：关闭 + 复制图片 + 下载图片
 */
const ScheduleCompanion: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-2xl border border-edge/80 bg-surface/95 p-3 sm:p-3.5 shadow-md font-sans select-none overflow-hidden transition-all hover:border-edge-strong">
      {/* 极简转角十字标 (对齐 ScheduleExportDialog 源码 lines 403-406) */}
      <div className="pointer-events-none absolute left-2.5 top-2.5 font-mono text-[10px] font-bold text-slate-300 dark:text-slate-600 select-none">＋</div>
      <div className="pointer-events-none absolute right-2.5 top-2.5 font-mono text-[10px] font-bold text-slate-300 dark:text-slate-600 select-none">＋</div>
      <div className="pointer-events-none absolute left-2.5 bottom-2.5 font-mono text-[10px] font-bold text-slate-300 dark:text-slate-600 select-none">＋</div>
      <div className="pointer-events-none absolute right-2.5 bottom-2.5 font-mono text-[10px] font-bold text-slate-300 dark:text-slate-600 select-none">＋</div>

      {/* 海报顶部横幅：双层水平轴对称结构 (ScheduleExportDialog lines 409-453) */}
      <header className="border-b border-edge/70 pb-2 space-y-1.5">
        {/* 顶层主轴：左侧标题与学期，右侧品牌标识徽标 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-black text-primary tracking-tight leading-none">
              课表
            </h4>
            <span className="inline-flex items-center whitespace-nowrap rounded-md bg-surface-subtle border border-edge px-1.5 py-0.5 font-mono text-[10px] font-bold text-secondary">
              2024-2025-1
            </span>
          </div>

          {/* 品牌标识：作为第一行顶层右侧锚点 (ScheduleExportDialog lines 425-430) */}
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-edge/80 bg-surface px-2 py-0.5 shadow-2xs">
            <img src="/logo.svg" alt="YourTJ Logo" className="h-3.5 w-3.5 object-contain shrink-0" />
            <span className="text-[10px] font-bold text-primary tracking-tight whitespace-nowrap">
              由YourTJ社区生成
            </span>
          </div>
        </div>

        {/* 次层信息轴：左侧方案、周次与汇总统计，右侧生成时间戳 */}
        <div className="flex items-center justify-between text-[10.5px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center whitespace-nowrap rounded bg-surface-subtle border border-edge/80 px-1.5 py-0.5 font-bold text-primary text-[9.5px]">
              推荐方案 A
            </span>
            <span className="inline-flex items-center whitespace-nowrap rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 font-bold text-emerald-700 dark:text-emerald-400 text-[9.5px]">
              第 4 周
            </span>
            <span className="inline-flex items-center whitespace-nowrap text-secondary font-bold text-[9.5px] pl-0.5">
              海洋科学 · 7 门课程 · 24.5 学分
            </span>
          </div>

          {/* 时间戳 */}
          <div className="flex items-center gap-1 font-mono text-[9.5px] font-semibold text-tertiary tabular-nums">
            <Clock className="h-3 w-3 text-tertiary/70 stroke-[2]" />
            <span>2024.10.14 14:00</span>
          </div>
        </div>
      </header>

      {/* 课表表格网格 (ScheduleExportDialog lines 456-585) */}
      <div className="mt-2 overflow-x-auto rounded-lg border border-edge/80 bg-surface shadow-2xs">
        <table className="w-full min-w-[340px] table-fixed border-collapse text-left">
          <thead>
            <tr className="h-8 bg-surface-subtle/80 border-b border-edge/80 text-secondary">
              <th className="w-12 border-r border-edge/80 p-0.5 text-center font-mono text-[9px] font-black uppercase tracking-wider">
                上课安排
              </th>
              <th className="border-r border-edge/80 p-1 text-center">
                <div className="font-black text-[9.5px] text-primary tracking-tight leading-tight">周一</div>
                <div className="font-mono text-[8px] font-bold text-tertiary tracking-wider leading-none">MON</div>
              </th>
              <th className="border-r border-edge/80 p-1 text-center">
                <div className="font-black text-[9.5px] text-primary tracking-tight leading-tight">周二</div>
                <div className="font-mono text-[8px] font-bold text-tertiary tracking-wider leading-none">TUE</div>
              </th>
              <th className="border-r border-edge/80 p-1 text-center">
                <div className="font-black text-[9.5px] text-primary tracking-tight leading-tight">周三</div>
                <div className="font-mono text-[8px] font-bold text-tertiary tracking-wider leading-none">WED</div>
              </th>
              <th className="border-r border-edge/80 p-1 text-center">
                <div className="font-black text-[9.5px] text-primary tracking-tight leading-tight">周四</div>
                <div className="font-mono text-[8px] font-bold text-tertiary tracking-wider leading-none">THU</div>
              </th>
              <th className="p-1 text-center">
                <div className="font-black text-[9.5px] text-primary tracking-tight leading-tight">周五</div>
                <div className="font-mono text-[8px] font-bold text-tertiary tracking-wider leading-none">FRI</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/60 text-[9.5px]">
            {/* 01-02 节 */}
            <tr className="h-[54px] sm:h-[58px]">
              <td className="border-r border-edge/80 bg-surface-subtle/40 p-1 text-center align-middle">
                <span className="mb-0.5 block text-[8px] font-black text-emerald-600 dark:text-emerald-400">上午</span>
                <div className="font-mono text-[11px] font-black text-primary leading-tight">01-02</div>
                <span className="mt-0.5 block font-mono text-[7.5px] font-bold text-tertiary tabular-nums leading-none">08:00-09:35</span>
              </td>
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-blue-500/30 bg-blue-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-blue-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">物理海洋学</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#310086</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>南205</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>张艳伟</span>
                    </div>
                    <span className="font-mono text-tertiary">3-15单</span>
                  </div>
                </div>
              </td>
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-teal-500/30 bg-teal-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-teal-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">电工学技术</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#310088</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>南205</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>南策文</span>
                    </div>
                    <span className="font-mono text-tertiary">3-16周</span>
                  </div>
                </div>
              </td>
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-emerald-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">机械制图CAD</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#121212</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>北201</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>吴田田</span>
                    </div>
                    <span className="font-mono text-tertiary">1-16周</span>
                  </div>
                </div>
              </td>
              <td className="border-r border-edge/60 p-1 align-top bg-surface-subtle/10" />
              <td className="p-1 align-top bg-surface-subtle/10" />
            </tr>

            {/* 03-04 节 */}
            <tr className="h-[54px] sm:h-[58px]">
              <td className="border-r border-edge/80 bg-surface-subtle/40 p-1 text-center align-middle">
                <span className="mb-0.5 block text-[8px] font-black text-emerald-600 dark:text-emerald-400">上午</span>
                <div className="font-mono text-[11px] font-black text-primary leading-tight">03-04</div>
                <span className="mt-0.5 block font-mono text-[7.5px] font-bold text-tertiary tabular-nums leading-none">10:05-11:40</span>
              </td>
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-amber-500/30 bg-amber-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-amber-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">构造地质学</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#121209</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>南208</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>张伟伟</span>
                    </div>
                    <span className="font-mono text-tertiary">1-16周</span>
                  </div>
                </div>
              </td>
              <td className="border-r border-edge/60 p-1 align-top bg-surface-subtle/10" />
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-amber-500/30 bg-amber-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-amber-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">构造地质学</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#121209</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>南210</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>张伟伟</span>
                    </div>
                    <span className="font-mono text-tertiary">1-16周</span>
                  </div>
                </div>
              </td>
              <td className="border-r border-edge/60 p-1 align-top bg-surface-subtle/10" />
              <td className="p-1 align-top">
                <div className="h-full rounded-md border border-rose-500/30 bg-rose-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-rose-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">思想道德法治</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#5000101</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>综楼 302</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>赵老师</span>
                    </div>
                    <span className="font-mono text-tertiary">1-16周</span>
                  </div>
                </div>
              </td>
            </tr>

            {/* 05-06 节 */}
            <tr className="h-[54px] sm:h-[58px]">
              <td className="border-r border-edge/80 bg-surface-subtle/40 p-1 text-center align-middle">
                <span className="mb-0.5 block text-[8px] font-black text-blue-600 dark:text-blue-400">下午</span>
                <div className="font-mono text-[11px] font-black text-primary leading-tight">05-06</div>
                <span className="mt-0.5 block font-mono text-[7.5px] font-bold text-tertiary tabular-nums leading-none">13:30-15:05</span>
              </td>
              <td className="border-r border-edge/60 p-1 align-top bg-surface-subtle/10" />
              <td className="border-r border-edge/60 p-1 align-top bg-surface-subtle/10" />
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-purple-500/30 bg-purple-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-purple-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">海洋遥感概论</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#310090</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>南205</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>陈华伟</span>
                    </div>
                    <span className="font-mono text-tertiary">1-16周</span>
                  </div>
                </div>
              </td>
              <td className="border-r border-edge/60 p-1 align-top">
                <div className="h-full rounded-md border border-blue-500/30 bg-blue-500/10 p-1 text-left flex flex-col justify-between">
                  <div>
                    <div className="mx-auto rounded-full mb-0.5 h-[2px] w-5 bg-blue-500 opacity-90" />
                    <h5 className="font-black text-[9.5px] text-primary leading-tight truncate">物理海洋学</h5>
                    <div className="font-mono text-[7.5px] font-bold text-tertiary leading-none mt-0.5">#310086</div>
                  </div>
                  <div className="flex items-center gap-0.5 font-black text-[8.5px] text-primary mt-0.5">
                    <MapPin className="h-2.5 w-2.5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
                    <span>南205</span>
                  </div>
                  <div className="text-[8px] text-secondary flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <User className="h-2 w-2 shrink-0 text-tertiary stroke-[2]" />
                      <span>张艳伟</span>
                    </div>
                    <span className="font-mono text-tertiary">1-16周</span>
                  </div>
                </div>
              </td>
              <td className="p-1 align-top bg-surface-subtle/10" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* 课表下方独立悬浮交互操作坞 (Floating Action Dock) - 1:1 像素级复刻 ScheduleExportDialog.vue lines 590-631 */}
      <nav
        aria-label="Export Actions"
        className="mt-3 flex shrink-0 items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-slate-900/90 dark:bg-slate-950/90 px-3.5 py-1.5 text-white shadow-xl backdrop-blur-xl transition-all cursor-default select-none mx-auto w-fit"
      >
        {/* 关闭操作 */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all active:scale-[0.96] cursor-pointer"
          title="关闭"
        >
          <X className="h-3.5 w-3.5" />
          <span>关闭</span>
        </button>

        <div className="hidden sm:block h-3.5 w-px bg-white/20" aria-hidden="true" />

        {/* 复制图片 */}
        <button
          type="button"
          onClick={handleCopy}
          className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-slate-100 hover:bg-white/15 transition-all active:scale-[0.96] cursor-pointer"
          title="复制图片"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? '已复制' : '复制图片'}</span>
        </button>

        {/* 下载高清图片 */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1 text-xs font-bold text-white shadow hover:brightness-110 transition-all active:scale-[0.96] cursor-pointer"
          title="下载图片"
        >
          <Download className="h-3.5 w-3.5" />
          <span>下载图片</span>
        </button>
      </nav>
    </div>
  );
};

/**
 * 04 校园百科 Companion Component - 1:1 像素级复刻 @[YourTJ-Hub] 站内 Wiki 专属搜索结果浮层 (WikiSearchPanel.vue 搜“社团”真实结果)
 */
const WikiCompanion: React.FC = () => (
  <div className="rounded-xl border border-edge/80 bg-surface/95 shadow-2xs overflow-hidden transition-all hover:border-edge-strong">
    {/* 搜索输入栏 */}
    <div className="flex h-10 items-center gap-2 border-b border-edge/70 px-3 bg-surface-subtle/50">
      <SearchIcon className="h-4 w-4 shrink-0 text-tertiary" />
      <span className="min-w-0 flex-1 text-xs font-semibold text-primary">社团</span>
      <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-surface border border-edge px-1.5 py-0.5 font-mono text-[9px] font-semibold text-tertiary">
        ↑ ↓
      </span>
      <span className="text-tertiary/70 hover:text-primary transition-colors cursor-pointer">
        <CloseIcon className="h-3.5 w-3.5" />
      </span>
    </div>

    {/* 搜索命中列表 */}
    <div className="p-1 divide-y divide-edge/40">
      {/* 命名空间分组头 */}
      <div className="flex items-center gap-2 px-3 pt-2 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary">
          同济新手教程
        </span>
        <span className="h-px flex-1 bg-edge/60" />
      </div>

      {/* 候选项 1 (高亮选中态) */}
      <div className="rounded-lg bg-link/10 p-2.5 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-[13px] font-bold text-primary truncate">
              <mark className="bg-amber-400/30 text-amber-900 dark:text-amber-200 rounded px-0.5 font-bold">社团</mark>名单
            </span>
          </div>
          <span className="shrink-0 rounded bg-link/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-link">
            标题匹配
          </span>
        </div>
        <div className="mt-0.5 text-[10px] text-tertiary truncate">
          同济新手教程 › 校园生活/社团名单
        </div>
        <p className="mt-1 text-xs leading-relaxed text-secondary line-clamp-2">
          本页整理自同济大学<mark className="bg-amber-400/30 text-amber-900 dark:text-amber-200 rounded px-0.5">社团</mark>管理系统在册<mark className="bg-amber-400/30 text-amber-900 dark:text-amber-200 rounded px-0.5">社团</mark>，共 133 个，按学校的<mark className="bg-amber-400/30 text-amber-900 dark:text-amber-200 rounded px-0.5">社团</mark>类别分组。
        </p>
      </div>

      {/* 候选项 2 */}
      <div className="p-2.5 transition-colors hover:bg-surface-subtle/60 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-[13px] font-bold text-primary truncate">
              学生组织与<mark className="bg-amber-400/30 text-amber-900 dark:text-amber-200 rounded px-0.5 font-bold">社团</mark>
            </span>
          </div>
          <span className="shrink-0 rounded bg-surface-subtle border border-edge/60 px-1.5 py-0.5 text-[9.5px] font-semibold text-tertiary">
            标题匹配
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[10px] text-tertiary truncate">
          <span>同济新手教程 › 校园生活/学生组织与社团</span>
          <span className="text-secondary/70">§ 它们分别是什么？</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-secondary line-clamp-2">
          学生<mark className="bg-amber-400/30 text-amber-900 dark:text-amber-200 rounded px-0.5">社团</mark>主要围绕共同兴趣开展活动，由学校业务指导单位和指导教师指导...
        </p>
      </div>
    </div>

    {/* 底部快捷键与总数 */}
    <div className="flex items-center justify-between border-t border-edge/60 bg-surface-subtle/50 px-3 py-1.5 text-[10px] text-tertiary">
      <span>共 831 个匹配结果</span>
      <span className="inline-flex items-center gap-1 font-mono">
        <span>按 Enter 跳转</span>
        <span className="font-bold">↵</span>
      </span>
    </div>
  </div>
);

interface PreviewWindowProps {
  slide?: (typeof PREVIEW_SLIDES)[number];
  index?: number;
  frameRef?: React.RefObject<HTMLDivElement>;
  driftRef?: React.RefObject<HTMLDivElement>;
  isDesktop?: boolean;
}

/**
 * PreviewWindow: a pure, flush presentation card hosting the live rendered product page.
 * On desktop, mounts all 4 slides into absolute layers so GSAP can scrub smooth cross-fades.
 */
const PreviewWindow: React.FC<PreviewWindowProps> = React.memo(({
  slide,
  index = 0,
  frameRef,
  driftRef,
  isDesktop = false,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const scale = useFitScale(hostRef, HUB_CANVAS_WIDTH, HUB_CANVAS_HEIGHT, { max: 1, min: 0.18 });

  return (
    <div
      ref={frameRef}
      data-preview-frame={index}
      className="preview-frame relative overflow-hidden rounded-2xl border border-edge/50 bg-[var(--hub-base-200)] shadow-lift"
      style={{
        aspectRatio: `${HUB_CANVAS_WIDTH} / ${HUB_CANVAS_HEIGHT}`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Ambient specular highlight tracking fine pointer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          opacity: 'var(--sheen-opacity, 0)',
          background:
            'radial-gradient(650px circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,255,255,0.12), transparent 60%)',
        }}
      />
      <div
        ref={hostRef}
        className="relative h-full w-full select-none overflow-hidden"
      >
        <div ref={driftRef} className="absolute inset-0">
          <div
            aria-hidden="true"
            {...({ inert: '' } as { inert: string })}
            className="absolute left-0 top-0 origin-top-left select-none"
            style={{
              width: HUB_CANVAS_WIDTH,
              height: HUB_CANVAS_HEIGHT,
              transform: `scale(${scale})`,
            }}
          >
            <React.Suspense fallback={null}>{isDesktop ? (
              PREVIEW_SLIDES.map((s, i) => {
                const PageComp = hubPreviewPageFor(s.id);
                return (
                  <div
                    key={s.id}
                    data-preview-slide={i}
                    className="preview-slide-layer absolute inset-0 will-change-transform"
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      visibility: i === 0 ? 'inherit' : 'hidden',
                    }}
                  >
                    <PageComp />
                  </div>
                );
              })
            ) : (
              <div key={slide?.id || 'default'} data-preview-page>
                {React.createElement(hubPreviewPageFor(slide?.id || 'hub-home'))}
              </div>
            )}
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
});

export const ProductPreview: React.FC = () => {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const scopeRef = useRef<HTMLElement>(null);
  const stagePinRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollyTriggerRef = useRef<ScrollTrigger | null>(null);
  const windowFrameRef = useRef<HTMLDivElement>(null);
  const windowDriftRef = useRef<HTMLDivElement>(null);

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const scrollToChapter = (idx: number) => {
    setActiveIndex(idx);
    activeIndexRef.current = idx;
    const trigger = scrollyTriggerRef.current;
    const tl = timelineRef.current;
    if (!trigger || !tl || !isDesktop) return;

    const labels = ['ch0', 'ch1', 'ch2', 'ch3'];
    const labelTime = tl.labels[labels[idx]] ?? 0;
    const totalDuration = tl.duration();
    const targetProgress = labelTime / totalDuration;
    const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);

    window.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  };

  /* Unified Master Timeline tied to scroll with natural power1.inOut curve and label snap */
  useGSAP(
    () => {
      const stage = stagePinRef.current;
      if (!stage || !isDesktop) return;

      const reduceMotion = prefersReducedMotion();
      const slideEls = stage.querySelectorAll<HTMLElement>('.preview-slide-layer');
      const narrativeEls = stage.querySelectorAll<HTMLElement>('.narrative-slide-layer');

      if (slideEls.length < 4 || narrativeEls.length < 4) return;

      if (reduceMotion) {
        return;
      }

      // Initial layout setup: Chapter 0 fully active, others offset and hidden
      gsap.set(slideEls[0], { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(narrativeEls[0], { autoAlpha: 1, y: 0 });
      for (let i = 1; i < 4; i++) {
        gsap.set(slideEls[i], { autoAlpha: 0, y: 20, scale: 0.985 });
        gsap.set(narrativeEls[i], { autoAlpha: 0, y: 16 });
      }

      // Master Timeline directly scrubbed by ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          pin: true,
          pinSpacing: true,
          start: 'center center',
          end: '+=2600',
          scrub: 0.8,
          anticipatePin: 1,
          snap: {
            snapTo: 'labels',
            duration: { min: 0.25, max: 0.5 },
            delay: 0.08,
            ease: 'power1.inOut',
          },
          onUpdate: () => {
            const time = tl.time();
            let idx = 0;
            if (time < 1.0) idx = 0;
            else if (time < 2.2) idx = 1;
            else if (time < 3.4) idx = 2;
            else idx = 3;

            if (idx !== activeIndexRef.current) {
              activeIndexRef.current = idx;
              setActiveIndex(idx);
            }
          },
        },
      });

      timelineRef.current = tl;
      scrollyTriggerRef.current = tl.scrollTrigger ?? null;

      // 3D Perspective Tilt on the presentation card synchronized with scroll
      if (windowFrameRef.current) {
        tl.fromTo(
          windowFrameRef.current,
          { rotateX: PANEL_TILT, transformPerspective: 1400, transformOrigin: '50% 50%' },
          { rotateX: -PANEL_TILT, ease: 'none', duration: 4.0 },
          0,
        );
      }
      if (windowDriftRef.current) {
        tl.fromTo(
          windowDriftRef.current,
          { yPercent: CANVAS_DRIFT },
          { yPercent: -CANVAS_DRIFT, ease: 'none', duration: 4.0 },
          0,
        );
      }

      // Chapter 0 Plateau: Label at 0.2
      tl.addLabel('ch0', 0.2);

      // Transition 0 -> 1: between 0.5 and 1.1 (duration: 0.6)
      tl.to(slideEls[0], { autoAlpha: 0, y: -20, scale: 0.985, ease: 'power1.inOut', duration: 0.6 }, 0.5)
        .to(narrativeEls[0], { autoAlpha: 0, y: -16, ease: 'power1.inOut', duration: 0.6 }, 0.5)
        .to(slideEls[1], { autoAlpha: 1, y: 0, scale: 1, ease: 'power1.inOut', duration: 0.6 }, 0.5)
        .to(narrativeEls[1], { autoAlpha: 1, y: 0, ease: 'power1.inOut', duration: 0.6 }, 0.5)
        .addLabel('ch1', 1.4);

      // Transition 1 -> 2: between 1.7 and 2.3 (duration: 0.6)
      tl.to(slideEls[1], { autoAlpha: 0, y: -20, scale: 0.985, ease: 'power1.inOut', duration: 0.6 }, 1.7)
        .to(narrativeEls[1], { autoAlpha: 0, y: -16, ease: 'power1.inOut', duration: 0.6 }, 1.7)
        .to(slideEls[2], { autoAlpha: 1, y: 0, scale: 1, ease: 'power1.inOut', duration: 0.6 }, 1.7)
        .to(narrativeEls[2], { autoAlpha: 1, y: 0, ease: 'power1.inOut', duration: 0.6 }, 1.7)
        .addLabel('ch2', 2.6);

      // Transition 2 -> 3: between 2.9 and 3.5 (duration: 0.6)
      tl.to(slideEls[2], { autoAlpha: 0, y: -20, scale: 0.985, ease: 'power1.inOut', duration: 0.6 }, 2.9)
        .to(narrativeEls[2], { autoAlpha: 0, y: -16, ease: 'power1.inOut', duration: 0.6 }, 2.9)
        .to(slideEls[3], { autoAlpha: 1, y: 0, scale: 1, ease: 'power1.inOut', duration: 0.6 }, 2.9)
        .to(narrativeEls[3], { autoAlpha: 1, y: 0, ease: 'power1.inOut', duration: 0.6 }, 2.9)
        .addLabel('ch3', 3.8);

      // Chapter 3 plateau: holds comfortably from 3.8 to 4.8 before unpinning
      tl.to({}, { duration: 1.0 }, 3.8);

      // Pointer tilt & specular light response for fine pointers on desktop
      const finePointer = window.matchMedia('(pointer: fine)').matches;
      let cleanupPointer: (() => void) | undefined;
      if (finePointer && windowFrameRef.current) {
        const frame = windowFrameRef.current;
        const quickRotY = gsap.quickTo(frame, 'rotationY', { duration: 0.7, ease: 'power3.out' });
        const quickRotX = gsap.quickTo(frame, 'rotationX', { duration: 0.7, ease: 'power3.out' });

        const onMouseMove = (e: MouseEvent) => {
          const rect = frame.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          quickRotY(x * 5);
          quickRotX(-y * 4);

          frame.style.setProperty('--sheen-x', `${((x + 0.5) * 100).toFixed(1)}%`);
          frame.style.setProperty('--sheen-y', `${((y + 0.5) * 100).toFixed(1)}%`);
          frame.style.setProperty('--sheen-opacity', '1');
        };

        const onMouseLeave = () => {
          quickRotY(0);
          quickRotX(0);
          frame.style.setProperty('--sheen-opacity', '0');
        };

        frame.addEventListener('mousemove', onMouseMove);
        frame.addEventListener('mouseleave', onMouseLeave);
        cleanupPointer = () => {
          frame.removeEventListener('mousemove', onMouseMove);
          frame.removeEventListener('mouseleave', onMouseLeave);
        };
      }

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh).catch(() => undefined);
      if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });

      return () => {
        cleanupPointer?.();
        window.removeEventListener('load', refresh);
      };
    },
    { scope: scopeRef, dependencies: [isDesktop] },
  );

  const renderCompanion = (index: number) => {
    switch (index) {
      case 0:
        return <ForumCompanion />;
      case 1:
        return <CourseCompanion active={activeIndex === 1} />;
      case 2:
        return <ScheduleCompanion />;
      case 3:
        return <WikiCompanion />;
      default:
        return null;
    }
  };

  const titles = PREVIEW_SLIDES.map((slide) => t(slide.titleKey));

  return (
    <section ref={scopeRef} aria-label={t('preview.section.label')} className="scroll-mt-24">
      {isDesktop ? (
        /* Desktop Pinned Scrollytelling Stage (pinned centered at optical eye-level) */
        <div ref={stagePinRef} className="w-full py-8">
          <div className="mx-auto max-w-page px-4 sm:px-6">
            {/* Header: Clean, executive title & description */}
            <div className="mb-6 flex items-end justify-between border-b border-edge/40 pb-5">
              <div>
                <h2 className="text-2xl font-semibold leading-[1.2] tracking-tight text-primary md:text-3xl lg:text-4xl">
                  {t('preview.section.label')}
                </h2>
                <p className="mt-2 text-sm text-secondary max-w-xl">
                  {t('product.hub.description')}
                </p>
              </div>

              {/* Precision Chapter Progress Scrubber */}
              <div
                className="flex items-center gap-3 rounded-full border border-edge/70 bg-surface-subtle/70 px-3.5 py-1.5 shadow-2xs backdrop-blur-md"
                role="group"
                aria-label="Story chapters"
              >
                {/* 4 Interactive Segment Bars */}
                <div className="flex items-center gap-1.5">
                  {STEPS.map((step, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => scrollToChapter(idx)}
                        aria-label={`Jump to ${step.label}`}
                        className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center"
                      >
                        <span className={`h-1.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'w-7 bg-link shadow-xs'
                            : 'w-2 bg-edge-strong/50 hover:bg-edge-strong hover:w-3.5'
                        }`} />
                      </button>
                    );
                  })}
                </div>

                <span className="h-3 w-px bg-edge" />

                {/* Monospace Step Indicator */}
                <div className="flex items-center font-mono text-xs tabular-nums text-secondary">
                  <span className="font-semibold text-primary">{STEPS[activeIndex].num}</span>
                  <span className="mx-1 text-tertiary/60">/</span>
                  <span className="text-tertiary">04</span>
                </div>
              </div>
            </div>

            {/* 2-Column Scrollytelling Layout */}
            <div className="grid lg:grid-cols-12 lg:gap-10 xl:gap-14 items-center">
              {/* Left Column: LineSidebar Navigator + Continuous Narrative Stack */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <LineSidebar
                  items={titles}
                  activeIndex={activeIndex}
                  onItemClick={(idx) => scrollToChapter(idx)}
                  markerLength={46}
                  markerGap={14}
                  tickScale={0.5}
                  maxShift={24}
                  itemGap={28}
                  fontSize={1.15}
                  smoothing={140}
                />

                {/* Continuous Stacked Chapter Narratives & Companions (generous min-height prevents bottom overlap) */}
                <div className="relative mt-7 pt-5 border-t border-edge/60 min-h-[460px] lg:min-h-[440px]">
                  {STEPS.map((step, i) => (
                    <div
                      key={step.id}
                      data-narrative-slide={i}
                      className="narrative-slide-layer absolute inset-x-0 top-5 will-change-transform"
                      style={{
                        opacity: i === 0 ? 1 : 0,
                        visibility: i === 0 ? 'inherit' : 'hidden',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center rounded-md border border-link/25 bg-link/10 px-2 py-0.5 font-mono text-xs font-semibold text-link tracking-wide">
                            {step.num}
                          </span>
                          <span className="text-sm font-semibold tracking-tight text-primary">
                            {step.label}
                          </span>
                        </div>

                        <a
                          href={PREVIEW_SLIDES[i].href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-link transition-colors cursor-pointer"
                        >
                          <span>{t('preview.visit')}</span>
                          <ArrowUpRightIcon className="h-3 w-3 text-secondary group-hover/link:text-link transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </a>
                      </div>

                      {step.desc ? (
                        <p className="mt-2.5 text-sm leading-relaxed text-secondary max-w-md">
                          {step.desc}
                        </p>
                      ) : null}

                      <div className="mt-2 flex items-center gap-2 text-xs text-tertiary">
                        <span className="font-mono text-[11px] text-tertiary">{displayUrl(PREVIEW_SLIDES[i].href)}</span>
                      </div>

                      <div className="mt-3.5 max-w-md">
                        {renderCompanion(i)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Presentation Canvas */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="mb-2.5 flex items-center justify-between px-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full border border-edge/60 bg-surface-subtle/80 px-2.5 py-1 shadow-2xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-link" />
                      <span className="font-medium text-xs text-primary">{STEPS[activeIndex].label}</span>
                      <span className="text-tertiary/50">·</span>
                      <span className="font-mono text-[11px] text-tertiary">{displayUrl(PREVIEW_SLIDES[activeIndex].href)}</span>
                    </div>
                  </div>
                  <a
                    href={PREVIEW_SLIDES[activeIndex].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{t('preview.visit')}</span>
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-secondary group-hover/btn:text-primary transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </a>
                </div>

                <PreviewWindow
                  isDesktop={true}
                  frameRef={windowFrameRef}
                  driftRef={windowDriftRef}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Layout (< 1024px) */
        <div className="mx-auto max-w-page px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold leading-[1.2] tracking-tight text-primary sm:text-3xl">
                {t('preview.section.label')}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
                {t('product.hub.description')}
              </p>
            </div>

            {/* Mobile Segmented Step Pill */}
            <div className="flex items-center gap-1.5 rounded-full border border-edge/60 bg-surface-subtle/70 px-2.5 py-1 shrink-0 mt-1 shadow-2xs">
              <span className="font-mono text-xs tabular-nums font-semibold text-primary">
                {STEPS[activeIndex].num}
              </span>
              <span className="font-mono text-xs text-tertiary/70">/</span>
              <span className="font-mono text-xs text-tertiary">04</span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Mobile Segmented Chapter Control */}
            <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-surface-subtle/80 p-1 border border-edge/70 shadow-2xs backdrop-blur-sm">
              {STEPS.map((step, idx) => {
                const isActive = activeIndex === idx;
                const tabNames = ['论坛', '选课', '课表', '百科'];
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer min-h-[40px] select-none ${
                      isActive
                        ? 'bg-surface-raised text-primary shadow-xs font-semibold border border-edge/80'
                        : 'text-secondary hover:text-primary hover:bg-surface/40'
                    }`}
                  >
                    <span className={`font-mono text-[10px] tabular-nums ${isActive ? 'text-link font-bold' : 'text-tertiary'}`}>
                      {step.num}
                    </span>
                    <span className="truncate">{tabNames[idx]}</span>
                  </button>
                );
              })}
            </div>

            {/* Live Web Preview Window */}
            <div className="w-full">
              <PreviewWindow slide={PREVIEW_SLIDES[activeIndex]} index={activeIndex} isDesktop={false} />
            </div>

            {/* Narrative Card */}
            <div className="rounded-2xl border border-edge/50 bg-surface-subtle/60 p-4 sm:p-5 shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md border border-link/25 bg-link/10 px-2 py-0.5 font-mono text-xs font-semibold text-link tracking-wide">
                    {STEPS[activeIndex].num}
                  </span>
                  <span className="text-xs font-semibold tracking-tight text-primary">
                    {STEPS[activeIndex].label}
                  </span>
                </div>
                <a
                  href={PREVIEW_SLIDES[activeIndex].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 text-xs font-medium text-secondary hover:text-link transition-colors"
                >
                  <span>{t('preview.visit')}</span>
                  <ArrowUpRightIcon className="h-3.5 w-3.5 text-secondary group-hover/link:text-link transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              </div>

              {STEPS[activeIndex].desc ? (
                <p className="mt-2.5 text-xs leading-relaxed text-secondary sm:text-sm">
                  {STEPS[activeIndex].desc}
                </p>
              ) : null}

              {/* Companion Component */}
              <div className="mt-3">
                {renderCompanion(activeIndex)}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
