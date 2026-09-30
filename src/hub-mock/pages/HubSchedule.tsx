import React from 'react';
import {
  AlertIcon,
  BookIcon,
  CalendarCogIcon,
  ChevronDownIcon,
  CloseIcon,
  DownloadIcon,
  HammerIcon,
  HelpIcon,
  MapPinIcon,
  MoreIcon,
  PlusIcon,
  RefreshIcon,
  SaveIcon,
  SearchIcon,
  TrashIcon,
  WarningIcon,
} from '../../components/icons';
import {
  MOCK_CALENDAR_NAME,
  MOCK_GRADE,
  MOCK_MAJOR,
  MOCK_PLAN_NAME,
  MOCK_SCHEDULE_TOTAL_HOURS,
  MOCK_STAGED,
  SECTION_TIMES,
  WEEKDAYS,
  type MockArrangement,
  type MockStagedCourse,
} from '../data';
import { HUB, courseColor, muted, tint } from '../tokens';
import {
  edge,
  HubBadge,
  HubButton,
  HubCheckbox,
  HubPageHeader,
  HubPanel,
  HubSelect,
  HubShell,
} from '../primitives';

/*
 * 排课器 · 课表
 *
 * Ported from SchedulePage.vue and its `components/schedule/*` parts, and this
 * time line by line rather than in spirit. The product's scheduler is a
 * two-column workspace, not a centred list:
 *
 *   left  352px   SchedulePlanBar + ScheduleMajorSelector
 *                  + ScheduleStatsCard + ScheduleRoughList
 *   right 368px+   ScheduleTimeTable (toolbar + banner + grid + watermark)
 *
 * What "line by line" means here, because the first attempt at this page got it
 * wrong in ways that showed:
 *
 * - The toolbar above the grid is one row: the week switch and the week select on
 *   the left, the hint pills and the two actions pushed right, at the product's
 *   own sizes. The semester dates are not repeated there (the product hides them
 *   below `sm`, and they are already in the banner's summary line); squeezing
 *   them in is what made the first attempt wrap into two ugly lines.
 * - Course blocks carry the product's own palette: the eight `--gf-color-course-*`
 *   slots, hashed from the class code, mixed into the card at the exact
 *   percentages `courseCardStyle()` uses (11% surface, 18% border, 45% title,
 *   25% secondary text). Blocks are not tinted by "some blue".
 * - The banner above the grid is the product's: term name, summary line, plan
 *   chip and week chip.
 * - Conflict flags are derived, not authored: same day, overlapping sections,
 *   intersecting weeks (pkConflict's criterion), and the same derivation feeds
 *   the grid badges, the list badges and the stats card.
 *
 * Geometry is the product's too: `interactiveRowMetrics(false)` for row heights
 * (58px base, 72px per stacked card, 8px vertical padding) and
 * `computeRowHeights()`'s allocation, so a cell holding two courses grows its
 * row exactly the way the real timetable does.
 */

/* --------------------------------------------------------------- 几何与度量 */

const MAX_ROWS = SECTION_TIMES.length;
const LABEL_COLUMN_WIDTH = 86;
const TABLE_HEAD_HEIGHT = 40;

/** interactiveRowMetrics(false) — 桌面端交互网格的行高度量（针对 880px 画布紧凑自适应）。 */
const ROW_METRICS = { baseH: 48, padV: 4, multiCardH: 60 } as const;

const cardGap = 4;

/* ------------------------------------------------------------------- 文案 */

const sectionLabel = (section: number) => `第${section}节`;
const weeksText = (range: string) => `${range}周`;
const creditText = (credit: number) => `${credit} 学分`;
const classCountText = (count: number) => `${count} 班`;
const arrangementBrief = (day: string, sections: string, room: string) =>
  `${day} 第${sections}节 ${room}`;
const courseCountAndCredits = (count: number, credits: string) => `${count} 门课程 · ${credits} 学分`;

/* --------------------------------------------------------------- 周次推导 */

/** formatWeeksText：连续段折成 "1-8,10-16"。 */
const compactWeeks = (weeks: readonly number[]): string => {
  if (weeks.length === 0) return '';
  const sorted = [...new Set(weeks)].sort((a, b) => a - b);
  const parts: string[] = [];
  let runStart = sorted[0];
  let previous = sorted[0];
  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }
    parts.push(runStart === previous ? `${runStart}` : `${runStart}-${previous}`);
    runStart = current;
    previous = current;
  }
  return parts.join(',');
};

/** detectWeekParity：全奇为单周，全偶为双周，混合或空为 null。 */
const weekParity = (weeks: readonly number[]): 'odd' | 'even' | null => {
  const unique = [...new Set(weeks)];
  if (unique.length === 0) return null;
  if (unique.every((week) => week % 2 === 1)) return 'odd';
  if (unique.every((week) => week % 2 === 0)) return 'even';
  return null;
};

const parityLabel = (weeks: readonly number[]): string | null => {
  const parity = weekParity(weeks);
  if (parity === 'odd') return '单周';
  if (parity === 'even') return '双周';
  return null;
};

/** formatDisplayWeeks：单周 3-15 提炼为 "3-15周(单周)"，其余回退 compactWeeks。 */
const displayWeeks = (weeks: readonly number[]): string => {
  if (weeks.length === 0) return '';
  const parity = weekParity(weeks);
  const sorted = [...new Set(weeks)].sort((a, b) => a - b);
  if (parity && sorted.length >= 3) {
    const step = sorted.every((week, index) => index === 0 || week === sorted[index - 1] + 2);
    if (step) {
      return `${sorted[0]}-${sorted[sorted.length - 1]}周(${parity === 'odd' ? '单周' : '双周'})`;
    }
  }
  return weeksText(compactWeeks(weeks));
};

/* ----------------------------------------------------------------- 网格数据 */

interface TableCourse {
  /** 课号：课块的配色种子，同课同色。 */
  code: string;
  name: string;
  teacher: string;
  room: string;
  weeks: number[];
  /** occupyTime：1-based 节次。 */
  sections: number[];
  /** occupyDay：1-based 星期。 */
  day: number;
}

const TABLE_COURSES: TableCourse[] = MOCK_STAGED.filter((course) => course.status !== 0).flatMap(
  (course: MockStagedCourse) =>
    course.arrangements.map((arrangement: MockArrangement) => ({
      code: course.code,
      name: course.name,
      teacher: course.teacher,
      room: arrangement.room,
      weeks: arrangement.weeks,
      sections: arrangement.sections,
      day: arrangement.day,
    })),
);

const intersects = (a: readonly number[], b: readonly number[]): boolean =>
  a.some((value) => b.includes(value));

/**
 * deriveConflicts（pkConflict.ts 的判据）：同天 + 节次相交 + 周次相交。
 * 课块角标、列表红标与统计卡都读这一个集合，所以数据一改三处一起动。
 */
const deriveConflictedCodes = (courses: readonly TableCourse[]): Set<string> => {
  const conflicted = new Set<string>();
  for (let first = 0; first < courses.length; first += 1) {
    for (let second = first + 1; second < courses.length; second += 1) {
      const a = courses[first];
      const b = courses[second];
      if (a.day !== b.day) continue;
      if (!intersects(a.sections, b.sections)) continue;
      if (!intersects(a.weeks, b.weeks)) continue;
      conflicted.add(a.code);
      conflicted.add(b.code);
    }
  }
  return conflicted;
};

const CONFLICTED_CODES = deriveConflictedCodes(TABLE_COURSES);
const isConflicted = (code: string) => CONFLICTED_CODES.has(code);

interface DayCluster {
  start: number;
  end: number;
  items: TableCourse[];
}

/** clusterBySections：同天按节次区间聚类，相交（含部分重叠）的排进同一格。 */
const clusterBySections = (courses: readonly TableCourse[]): DayCluster[] => {
  const sorted = [...courses].sort((a, b) => a.sections[0] - b.sections[0]);
  const clusters: DayCluster[] = [];
  for (const course of sorted) {
    const start = course.sections[0];
    const end = course.sections[course.sections.length - 1];
    const last = clusters[clusters.length - 1];
    if (last && start <= last.end) {
      last.end = Math.max(last.end, end);
      last.items.push(course);
    } else {
      clusters.push({ start, end, items: [course] });
    }
  }
  return clusters;
};

interface Grid {
  cellCourses: TableCourse[][][];
  cellSpans: number[][];
  occupied: boolean[][];
}

const buildGrid = (courses: readonly TableCourse[]): Grid => {
  const spans = Array.from({ length: MAX_ROWS }, () => new Array<number>(7).fill(1));
  const occupied = Array.from({ length: MAX_ROWS }, () => new Array<boolean>(7).fill(false));
  const cells = Array.from({ length: MAX_ROWS }, () =>
    Array.from({ length: 7 }, () => [] as TableCourse[]),
  );

  const byDay: TableCourse[][] = Array.from({ length: 7 }, () => []);
  for (const course of courses) byDay[course.day - 1].push(course);

  for (let day = 0; day < 7; day += 1) {
    for (const cluster of clusterBySections(byDay[day])) {
      const anchor = cluster.start - 1;
      spans[anchor][day] = cluster.end - anchor;
      cells[anchor][day] = cluster.items;
      for (let row = anchor + 1; row < anchor + spans[anchor][day]; row += 1) {
        if (row < MAX_ROWS) occupied[row][day] = true;
      }
    }
  }

  return { cellCourses: cells, cellSpans: spans, occupied };
};

/**
 * computeRowHeights（timetableGrid.ts）：多门课叠放的格子先把该行撑高，
 * 单门课的格子再按已撑高的行均分，避免跨节次的下半截留白。
 */
const computeRowHeights = (grid: Grid): number[] => {
  const { baseH, padV, multiCardH } = ROW_METRICS;
  const rowHeights = new Array<number>(MAX_ROWS).fill(baseH);

  const interesting: Array<{ span: number; row: number; count: number }> = [];
  for (let row = 0; row < MAX_ROWS; row += 1) {
    for (let day = 0; day < 7; day += 1) {
      if (grid.occupied[row][day]) continue;
      const span = grid.cellSpans[row][day] || 1;
      interesting.push({ span, row, count: grid.cellCourses[row][day].length });
    }
  }

  interesting.sort((a, b) => a.span - b.span || b.count - a.count);

  for (const { span, row, count } of interesting) {
    if (count === 0) continue;
    const requiredInner =
      count === 1
        ? Math.max(span * baseH - padV, baseH - padV)
        : count * multiCardH + (count - 1) * cardGap;
    const requiredTotal = requiredInner + padV;
    let currentTotal = 0;
    for (let index = 0; index < span; index += 1) currentTotal += rowHeights[row + index] || baseH;
    if (requiredTotal > currentTotal) {
      const perRow = Math.ceil((requiredTotal - currentTotal) / span);
      for (let index = 0; index < span; index += 1) {
        if (row + index < MAX_ROWS) rowHeights[row + index] += perRow;
      }
    }
  }

  return rowHeights;
};

const GRID = buildGrid(TABLE_COURSES);
const ROW_HEIGHTS = computeRowHeights(GRID);

/** cellInnerHeightFor：跨节次格子的可用高度（扣除上下 padding）。 */
const cellInnerHeight = (span: number, row: number): number => {
  let total = 0;
  for (let index = 0; index < span; index += 1) total += ROW_HEIGHTS[row + index] || ROW_METRICS.baseH;
  return Math.max(ROW_METRICS.baseH - ROW_METRICS.padV, total - ROW_METRICS.padV);
};

/** cardMinHeightFor：单门课撑满格子，多门课均分（扣除卡片间距）。 */
const cardMinHeight = (span: number, row: number, count: number): number => {
  const inner = cellInnerHeight(span, row);
  const total = Math.max(1, count);
  if (total === 1) return Math.max(ROW_METRICS.baseH - ROW_METRICS.padV, inner);
  return Math.max(
    ROW_METRICS.baseH - ROW_METRICS.padV,
    Math.floor((inner - (total - 1) * cardGap) / total),
  );
};

/* ------------------------------------------------------------------- 统计 */

const stagedCourses = MOCK_STAGED;
const STATS = {
  courseCount: stagedCourses.length,
  totalCredit: stagedCourses.reduce((sum, course) => sum + course.creditX10, 0) / 10,
  totalHours: MOCK_SCHEDULE_TOTAL_HOURS,
  conflictCount: stagedCourses.filter((course) => isConflicted(course.code)).length,
};

/**
 * exportSummaryText：专业 · N 门课程 · M 学分 · 学期起止。
 * 与产品一样由统计值拼出来，而不是手写一句文案——门数或学分一改，横幅跟着变。
 */
const exportSummaryText = [
  MOCK_MAJOR,
  // 学分行不带 .0：产品的横幅用原始数值（统计卡才 toFixed(1)）。
  courseCountAndCredits(STATS.courseCount, String(STATS.totalCredit)),
  '2026-03-02 ~ 2026-06-21',
].join(' · ');

/* -------------------------------------------------------------- 课块配色 */

/**
 * courseCardStyle（ScheduleTimeTable.vue）：把槽位色按产品的比例混进卡片。
 * 返回的是 CSS 变量，`--card-bg-hover` 由 index.css 里的 .hub-course-card:hover 消费。
 */
const courseCardStyle = (seed: string): React.CSSProperties => {
  const slot = courseColor(seed);
  return {
    '--card-accent': slot,
    '--card-bg': `color-mix(in oklab, ${slot} 11%, ${HUB.base100})`,
    '--card-bg-hover': `color-mix(in oklab, ${slot} 17%, ${HUB.base100})`,
    '--card-title': `color-mix(in oklab, ${slot} 45%, ${HUB.content})`,
    '--card-sub': `color-mix(in oklab, ${slot} 25%, ${HUB.content})`,
    backgroundColor: `color-mix(in oklab, ${slot} 11%, ${HUB.base100})`,
    borderColor: `color-mix(in oklab, ${slot} 18%, transparent)`,
    color: `var(--card-title)`,
  } as React.CSSProperties;
};

/** 顶部居中短条：不包裹、自然悬浮、呼应课程色彩。 */
const AccentBar: React.FC<{ width: number; height: number; margin: number }> = ({
  width,
  height,
  margin,
}) => (
  <div
    aria-hidden="true"
    style={{
      width,
      height,
      margin: `0 auto ${margin}px`,
      borderRadius: 999,
      background: 'var(--card-accent)',
      opacity: 0.68,
    }}
  />
);

/** 单双周小徽标（bg-primary/10 + primary 细边）。 */
const ParityChip: React.FC<{ label: string; fontSize: number }> = ({ label, fontSize }) => (
  <span
    style={{
      flexShrink: 0,
      padding: '1px 4px',
      borderRadius: 4,
      border: `1px solid ${tint(HUB.primary, 20)}`,
      background: tint(HUB.primary, 10),
      color: HUB.primary,
      fontSize,
      fontWeight: 600,
      lineHeight: 1.4,
    }}
  >
    {label}
  </span>
);

/** 冲突角标：右上角轻盈半透警告徽标。 */
const ConflictBadge: React.FC = () => (
  <span
    style={{
      position: 'absolute',
      right: 4,
      top: 4,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 14,
      height: 14,
      borderRadius: 999,
      border: `1px solid ${tint(HUB.error, 30)}`,
      background: tint(HUB.error, 15),
      color: HUB.error,
    }}
  >
    <WarningIcon className="h-2 w-2" />
  </span>
);

/** 紧凑/同格多课模式：顶条 + 课名 + 课号，底部一行教室与周次。 */
const CompactCard: React.FC<{ course: TableCourse; count: number; span: number; row: number }> = ({
  course,
  count,
  span,
  row,
}) => {
  const parity = parityLabel(course.weeks);
  const weeks = compactWeeks(course.weeks);

  return (
    <div
      className="hub-course-card hub-stagger"
      data-hover="课程块"
      style={{
        ...courseCardStyle(course.code),
        position: 'relative',
        display: 'flex',
        flex: 1,
        minWidth: 0,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 4,
        overflow: 'hidden',
        padding: 6,
        borderRadius: 12,
        border: '1px solid',
        minHeight: cardMinHeight(span, row, count),
      }}
    >
      {isConflicted(course.code) && <ConflictBadge />}
      <div style={{ minWidth: 0 }}>
        <AccentBar width={20} height={2.5} margin={4} />
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1.25,
            color: 'var(--card-title)',
          }}
        >
          {course.name}
        </span>
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 9,
            opacity: 0.6,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          #{course.code}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          minWidth: 0,
          fontSize: 10,
          lineHeight: 1,
        }}
      >
        {course.room && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              minWidth: 0,
              fontWeight: 500,
              color: 'var(--card-title)',
              opacity: 0.9,
            }}
          >
            <MapPinIcon className="h-2.5 w-2.5" style={{ flexShrink: 0, opacity: 0.6 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {course.room}
            </span>
          </span>
        )}
        {parity ? (
          <ParityChip label={parity} fontSize={8.5} />
        ) : (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 9,
              opacity: 0.7,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {weeks}
          </span>
        )}
      </div>
    </div>
  );
};

/** 标准舒展模式（span >= 2 且单门课）：课名 + 课号 + 教室 + 教师/周次。 */
const StretchCard: React.FC<{ course: TableCourse; span: number; row: number }> = ({
  course,
  span,
  row,
}) => {
  const parity = parityLabel(course.weeks);

  return (
    <div
      className="hub-course-card hub-stagger"
      data-hover="课程块"
      style={{
        ...courseCardStyle(course.code),
        position: 'relative',
        display: 'flex',
        minWidth: 0,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 6,
        overflow: 'hidden',
        padding: 8,
        borderRadius: 12,
        border: '1px solid',
        minHeight: cardMinHeight(span, row, 1),
      }}
    >
      {isConflicted(course.code) && <ConflictBadge />}
      <div style={{ minWidth: 0 }}>
        <AccentBar width={28} height={3} margin={6} />
        <h3
          style={{
            margin: 0,
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
            color: 'var(--card-title)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-all',
          }}
        >
          {course.name}
        </h3>
        <span
          style={{
            display: 'block',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 9,
            opacity: 0.6,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          #{course.code}
        </span>
      </div>

      {course.room && (
        <div style={{ margin: 'auto 0', padding: '2px 0', minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              minWidth: 0,
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--card-title)',
            }}
          >
            <MapPinIcon className="h-3 w-3" style={{ flexShrink: 0, opacity: 0.65, color: HUB.primary }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.25 }}>
              {course.room}
            </span>
          </div>
        </div>
      )}

      <div style={{ minWidth: 0, fontSize: 10.5, lineHeight: 1.3, color: 'var(--card-sub)' }}>
        {course.teacher && (
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {course.teacher}
          </div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 2,
            fontSize: 10,
            opacity: 0.85,
          }}
        >
          {parity && <ParityChip label={parity} fontSize={8.5} />}
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {displayWeeks(course.weeks)}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 工具条 */

/** 专业课识别误差提示：warning 半透胶囊（HoverCard 在静态预览里略去）。 */
const AcademicNoticePill: React.FC = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: '4px 7px',
      borderRadius: 999,
      border: `1px solid ${tint(HUB.warning, 30)}`,
      background: tint(HUB.warning, 10),
      color: HUB.warning,
      fontSize: 11,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}
  >
    <AlertIcon className="h-3.5 w-3.5" style={{ flexShrink: 0 }} />
    专业课提示
  </span>
);

/** 外部选课工具气泡的触发胶囊（Popover 在静态预览里略去）。 */
const ExternalToolsPill: React.FC = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: '4px 7px',
      borderRadius: 999,
      border: `1px solid ${edge(70)}`,
      background: HUB.base100,
      color: muted(0.75),
      fontSize: 11,
      fontWeight: 500,
      whiteSpace: 'nowrap',
    }}
  >
    <HammerIcon className="h-3.5 w-3.5" style={{ flexShrink: 0, color: muted(0.65) }} />
    其他工具
  </span>
);

/**
 * 工具条：周次开关 + 周次下拉，居左；提示胶囊与两个动作居右。
 *
 * 尺寸用产品的原值（gap-2、`w-24 sm:w-28` 的下拉、`gf-button-sm`、11px 胶囊），
 * 只省掉学期日期那一串——产品自己也在 `sm` 以下把它藏起来，而它在本页横幅的
 * 摘要行里已经出现过一次。上一版为了塞下它把每个部件都压小，还折了行，那才是
 * 难看的地方。
 */
const TimetableToolbar: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
      whiteSpace: 'nowrap',
    }}
  >
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexShrink: 0,
        fontSize: 12,
        color: muted(0.7),
        userSelect: 'none',
      }}
    >
      <HubCheckbox checked />
      当前周次
    </label>
    <div style={{ width: 112, flexShrink: 0 }}>
      <HubSelect value="第 13 周" />
    </div>

    <span style={{ flex: 1, minWidth: 8 }} />

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <AcademicNoticePill />
      <ExternalToolsPill />
      <HubButton size="sm" variant="outline" icon={<CalendarCogIcon className="h-3.5 w-3.5" />}>
        自定义占位
      </HubButton>
      <HubButton size="sm" variant="primary" icon={<DownloadIcon className="h-3.5 w-3.5" />}>
        导出图片
      </HubButton>
    </div>
  </div>
);

/* ------------------------------------------------------------------- 课表 */

/** 抬横幅：学期名 + 摘要，右侧方案与周次两枚 chip。 */
const TimetableBanner: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      padding: '12px 24px',
      borderBottom: `1px solid ${edge(60)}`,
      background: HUB.base100,
    }}
  >
    <div style={{ minWidth: 0 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>
        {MOCK_CALENDAR_NAME}
      </h2>
      <p style={{ margin: '2px 0 0', fontSize: 12, color: muted(0.65) }}>{exportSummaryText}</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, fontSize: 12 }}>
      <span
        style={{
          padding: '4px 10px',
          borderRadius: 8,
          border: `1px solid ${edge(50)}`,
          background: `color-mix(in oklab, ${HUB.base200} 80%, transparent)`,
          color: muted(0.8),
          fontWeight: 600,
        }}
      >
        {MOCK_PLAN_NAME}
      </span>
      <span
        style={{
          padding: '4px 10px',
          borderRadius: 8,
          border: `1px solid ${tint(HUB.primary, 20)}`,
          background: tint(HUB.primary, 10),
          color: HUB.primary,
          fontWeight: 600,
        }}
      >
        第 13 周
      </span>
    </div>
  </div>
);

/** 行表头：上午/下午/晚上分组标签 + 节次 + 起止时间。 */
const DayPartLabel: React.FC<{ row: number }> = ({ row }) => {
  const time = SECTION_TIMES[row];
  if (!time) return null;
  const hour = Number(time.start.slice(0, 2));
  const part = hour < 12 ? '上午' : hour < 18 ? '下午' : '晚上';
  const previous = SECTION_TIMES[row - 1];
  const previousPart = previous
    ? Number(previous.start.slice(0, 2)) < 12
      ? '上午'
      : Number(previous.start.slice(0, 2)) < 18
        ? '下午'
        : '晚上'
    : null;

  return (
    <>
      {part !== previousPart && (
        <span style={{ display: 'block', marginBottom: 2, fontSize: 10, fontWeight: 700, color: tint(HUB.primary, 80) }}>
          {part}
        </span>
      )}
      {sectionLabel(row + 1)}
      <span style={{ display: 'block', whiteSpace: 'nowrap', fontSize: 9, fontWeight: 400, color: muted(0.45), fontVariantNumeric: 'tabular-nums' }}>
        {`${time.start}-${time.end}`}
      </span>
    </>
  );
};

const cellBorder = `1px solid ${edge(70)}`;

const Timetable: React.FC = () => (
  <div style={{ minWidth: 0 }}>
    <TimetableToolbar />
    <div
      style={{
        overflow: 'hidden',
        borderRadius: 16,
        border: `1px solid ${edge(70)}`,
        background: HUB.base100,
        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      }}
    >
      <TimetableBanner />
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr
            style={{
              height: TABLE_HEAD_HEIGHT,
              background: `color-mix(in oklab, ${HUB.base200} 60%, transparent)`,
            }}
          >
            <th
              style={{
                width: LABEL_COLUMN_WIDTH,
                padding: 8,
                border: cellBorder,
                fontSize: 12,
                fontWeight: 600,
                color: muted(0.7),
                textAlign: 'center',
              }}
            >
              上课安排
            </th>
            {WEEKDAYS.map((weekday) => (
              <th
                key={weekday}
                style={{
                  padding: 8,
                  border: cellBorder,
                  fontSize: 12,
                  fontWeight: 600,
                  color: muted(0.7),
                }}
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GRID.cellCourses.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                height: ROW_HEIGHTS[rowIndex],
                background:
                  rowIndex === MAX_ROWS - 1
                    ? `color-mix(in oklab, ${HUB.base200} 50%, transparent)`
                    : rowIndex % 2 === 0
                      ? HUB.base100
                      : `color-mix(in oklab, ${HUB.base200} 30%, transparent)`,
              }}
            >
              <td
                style={{
                  padding: 4,
                  border: cellBorder,
                  textAlign: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  color: muted(0.7),
                  verticalAlign: 'middle',
                }}
              >
                <DayPartLabel row={rowIndex} />
              </td>
              {row.map((courses, dayIndex) => {
                if (GRID.occupied[rowIndex][dayIndex]) return null;
                const span = GRID.cellSpans[rowIndex][dayIndex];
                return (
                  <td
                    key={dayIndex}
                    rowSpan={span}
                    style={{ padding: 4, border: cellBorder, verticalAlign: 'top' }}
                  >
                    {courses.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          minHeight: cellInnerHeight(span, rowIndex),
                          flexDirection: 'column',
                          gap: courses.length > 1 ? cardGap : 0,
                        }}
                      >
                        {courses.map((course, courseIndex) =>
                          courses.length > 1 || span === 1 ? (
                            <CompactCard
                              key={`${course.code}-${courseIndex}`}
                              course={course}
                              count={courses.length}
                              span={span}
                              row={rowIndex}
                            />
                          ) : (
                            <StretchCard
                              key={`${course.code}-${courseIndex}`}
                              course={course}
                              span={span}
                              row={rowIndex}
                            />
                          ),
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 24px',
          borderTop: `1px solid ${edge(50)}`,
          background: `color-mix(in oklab, ${HUB.base200} 20%, transparent)`,
          fontSize: 11,
          color: muted(0.45),
        }}
      >
        <span>YourTJ Hub · 选课与排课助手</span>
        <span>2026-03-02</span>
      </div>
    </div>
  </div>
);

/* --------------------------------------------------------------- 左栏部件 */

/** SchedulePlanBar：标题 + 方案数 + 图标按钮组，下面整宽的方案下拉。 */
const PlanBar: React.FC = () => (
  <HubPanel style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: muted(0.8), whiteSpace: 'nowrap' }}>
          我的方案
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 6px',
            borderRadius: 6,
            background: `color-mix(in oklab, ${HUB.base200} 80%, transparent)`,
            fontSize: 10,
            fontWeight: 500,
            color: muted(0.6),
          }}
        >
          1/5
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        {[
          { key: 'add', icon: <PlusIcon className="h-3.5 w-3.5" /> },
          { key: 'delete', icon: <TrashIcon className="h-3.5 w-3.5" /> },
          { key: 'more', icon: <MoreIcon className="h-3.5 w-3.5" /> },
        ].map((item) => (
          <span
            key={item.key}
            style={{
              display: 'inline-grid',
              placeItems: 'center',
              width: 28,
              height: 28,
              borderRadius: 8,
              color: muted(0.65),
            }}
          >
            {item.icon}
          </span>
        ))}
        <span style={{ width: 1, height: 14, margin: '0 4px', background: edge(80) }} />
        <span
          style={{
            display: 'inline-grid',
            placeItems: 'center',
            width: 28,
            height: 28,
            borderRadius: 8,
            color: muted(0.6),
            rotate: '180deg',
          }}
        >
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
    <HubSelect value={MOCK_PLAN_NAME} />
  </HubPanel>
);

const FieldLabel: React.FC<{ children: React.ReactNode; clear?: boolean }> = ({
  children,
  clear,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    }}
  >
    <span style={{ fontSize: 12, fontWeight: 500, color: muted(0.75) }}>{children}</span>
    {clear && <span style={{ fontSize: 11, color: muted(0.45) }}>清除</span>}
  </div>
);

/** ScheduleMajorSelector：学期 + 年级一行，专业独占一行并带代码查询胶囊。 */
const MajorSelector: React.FC = () => (
  <HubPanel style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <FieldLabel clear>学期</FieldLabel>
        <HubSelect value={MOCK_CALENDAR_NAME} />
      </div>
      <div style={{ width: 112, flexShrink: 0 }}>
        <FieldLabel clear>年级</FieldLabel>
        <HubSelect value={MOCK_GRADE} />
      </div>
    </div>

    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: muted(0.8) }}>专业</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 999,
            border: `1px solid ${tint(HUB.primary, 30)}`,
            background: tint(HUB.primary, 10),
            color: HUB.primary,
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          <HelpIcon className="h-3 w-3" />
          代码查询
        </span>
      </div>
      <HubSelect value={MOCK_MAJOR} />
    </div>
  </HubPanel>
);

/**
 * ScheduleStatsCard：四格统计。第一格与冲突格按条件染色，其余走 base-200/40，
 * 数字用同一套 tabular-nums 的粗体。
 */
const StatsCard: React.FC = () => {
  const tiles: Array<{
    label: string;
    value: string;
    unit: string;
    tone: 'primary' | 'plain' | 'error';
  }> = [
    { label: '已选课程', value: String(STATS.courseCount), unit: '门', tone: 'primary' },
    { label: '总学分', value: STATS.totalCredit.toFixed(1), unit: '分', tone: 'plain' },
    { label: '总学时', value: String(STATS.totalHours), unit: '时', tone: 'plain' },
    { label: '冲突', value: String(STATS.conflictCount), unit: '门', tone: 'error' },
  ];

  return (
    <HubPanel
      style={{ padding: 10, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}
    >
      {tiles.map((tile) => {
        const active = tile.tone === 'primary' ? STATS.courseCount > 0 : tile.tone === 'error' ? STATS.conflictCount > 0 : false;
        const accent = tile.tone === 'primary' ? HUB.primary : tile.tone === 'error' ? HUB.error : HUB.content;

        return (
          <div
            key={tile.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 8,
              borderRadius: 12,
              border: `1px solid ${
                active ? tint(accent, tile.tone === 'primary' ? 25 : 35) : edge(40)
              }`,
              background: active
                ? tint(accent, tile.tone === 'error' ? 10 : 4)
                : `color-mix(in oklab, ${HUB.base200} 40%, transparent)`,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: active && tile.tone === 'error' ? 600 : 500,
                lineHeight: 1,
                color: active && tile.tone === 'error' ? HUB.error : muted(0.65),
              }}
            >
              {tile.label}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
              {active && tile.tone === 'error' && (
                <WarningIcon className="h-3 w-3" style={{ flexShrink: 0, color: HUB.error, marginRight: 2 }} />
              )}
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  color: active ? accent : HUB.content,
                }}
              >
                {tile.value}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 400,
                  color: active && tile.tone === 'error' ? tint(HUB.error, 70) : muted(0.5),
                }}
              >
                {tile.unit}
              </span>
            </span>
          </div>
        );
      })}
    </HubPanel>
  );
};

/* --------------------------------------------------------- 已选课程列表 */

const statusBadge = (status: MockStagedCourse['status']) => {
  if (status === 2) return <HubBadge tone="success">已选</HubBadge>;
  if (status === 1) return <HubBadge tone="warning">备选</HubBadge>;
  return <HubBadge tone="muted">未选</HubBadge>;
};

/** arrangementSummary：已排班级的「周几 第N节 教室」串联，最多三段。 */
const arrangementSummary = (course: MockStagedCourse): string => {
  const parts = course.arrangements.map((arrangement) =>
    arrangementBrief(
      WEEKDAYS[arrangement.day - 1],
      arrangement.sections.length === 1
        ? `${arrangement.sections[0]}`
        : `${arrangement.sections[0]}-${arrangement.sections[arrangement.sections.length - 1]}`,
      arrangement.room,
    ),
  );
  return parts.slice(0, 3).join('；') + (parts.length > 3 ? '…' : '');
};

const StagedRow: React.FC<{ course: MockStagedCourse; last: boolean }> = ({ course, last }) => {
  const conflicted = isConflicted(course.code);
  const arranged = course.arrangements.length;

  return (
    <li
      className="hub-stagger"
      data-hover="已选课程"
      style={{
        position: 'relative',
        padding: '10px 12px',
        background: conflicted ? tint(HUB.error, 5) : 'transparent',
      }}
    >
      {!last && (
        <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: edge(60) }} />
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{course.name}</span>
            {conflicted && <HubBadge tone="error">时间冲突</HubBadge>}
            {statusBadge(course.status)}
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: tint(HUB.primary, 75) }}>
            {course.code}
            <span style={{ color: muted(0.5) }}> · {creditText(course.creditX10 / 10)}</span>
            {course.status === 2 && arranged > 0 && (
              <span style={{ color: muted(0.5) }}> · {classCountText(1)}</span>
            )}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: muted(0.55) }}>{course.teacher}</p>
          <p
            style={{
              margin: '2px 0 0',
              fontSize: 11,
              color: muted(0.5),
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {arrangementSummary(course)}
          </p>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 32,
            padding: '0 10px',
            borderRadius: 8,
            color: HUB.primary,
            fontSize: 14,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {course.status === 2 ? '退课' : '清除'}
        </span>
      </div>
    </li>
  );
};

/** ScheduleRoughList：搜索框 + 两个动作按钮 + 可滚动的已选课程列表。 */
const RoughList: React.FC = () => (
  <div style={{ display: 'flex', minHeight: 0, flex: 1, flexDirection: 'column', gap: 12 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <SearchIcon
          className="h-4 w-4"
          style={{ position: 'absolute', left: 12, top: '50%', translate: '0 -50%', color: muted(0.4) }}
        />
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: 40,
            paddingLeft: 36,
            paddingRight: 32,
            borderRadius: 12,
            border: `1px solid ${HUB.line}`,
            background: HUB.base100,
            fontSize: 14,
            color: muted(0.45),
          }}
        >
          搜索课程名 / 课号
        </span>
        <CloseIcon
          className="h-3.5 w-3.5"
          style={{ position: 'absolute', right: 12, top: '50%', translate: '0 -50%', color: muted(0.4) }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <HubButton
          variant="primary"
          style={{ flex: 1, height: 40, borderRadius: 12, fontSize: 14 }}
          icon={<BookIcon className="h-4 w-4" />}
        >
          选择课程
        </HubButton>
        <HubButton
          variant="secondary"
          style={{ height: 40, borderRadius: 12, fontSize: 14, padding: '0 14px', background: HUB.base100 }}
          icon={<SaveIcon className="h-4 w-4" style={{ color: muted(0.6) }} />}
        >
          保存课表
        </HubButton>
      </div>
    </div>

    <ul
      style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        minHeight: 0,
        flex: 1,
        overflow: 'hidden',
        borderRadius: 16,
        border: `1px solid ${edge(70)}`,
        background: HUB.base100,
        boxShadow: '0 2px 10px -4px rgb(0 0 0 / 0.05)',
      }}
    >
      {MOCK_STAGED.map((course, index) => (
        <StagedRow
          key={course.code}
          course={course}
          last={index === MOCK_STAGED.length - 1}
        />
      ))}
    </ul>
  </div>
);

/* ------------------------------------------------------------------- 页面 */

export const HubSchedule: React.FC = () => (
  <HubShell activePage="排课器" contentPadding="14px 18px">
    <HubPageHeader
      title="排课器"
      description="规划你的新学期课表"
      actions={
        <>
          <HubButton variant="outline" icon={<RefreshIcon className="h-4 w-4" />}>
            同步最新
          </HubButton>
          <HubButton variant="outline" icon={<DownloadIcon className="h-4 w-4" />}>
            导出
          </HubButton>
        </>
      }
    />

    {/* 桌面两栏：左栏 352px 固定（内部滚动），右栏课表占满剩余宽度。 */}
    <div style={{ marginTop: 16, display: 'flex', gap: 16, minHeight: 0, flex: 1 }}>
      <div
        style={{
          width: 352,
          flexShrink: 0,
          display: 'flex',
          minHeight: 0,
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <PlanBar />
        <MajorSelector />
        <StatsCard />
        <RoughList />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Timetable />
      </div>
    </div>
  </HubShell>
);
