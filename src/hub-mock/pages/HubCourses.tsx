import React from 'react';
import {
  BookmarkIcon,
  BulbIcon,
  CompassIcon,
  EyeIcon,
  HistoryIcon,
  SearchIcon,
  ShareIcon,
  SlidersIcon,
} from '../../components/icons';
import { MOCK_COURSES, type MockCourse } from '../data';
import { HUB, muted, tint } from '../tokens';
import { edge, HubPageHeader, HubRating, HubShell } from '../primitives';

/*
 * 课程 · 课程目录
 *
 * Ported from CourseCatalogPage.vue: PageHeader, then the editorial "course
 * treasure hunt" banner (gradient wash, corner glow, dot texture, the three
 * vision items, the pill search field and the 常用筛选 row), then the catalog
 * table with the page's own nine columns and column widths.
 *
 * The preview pane on the right only mounts once a row is selected, so at rest
 * the page is a single full-width column, exactly as the product renders it.
 */

const COLUMN_WIDTHS = ['21%', '11%', '13%', '13%', '9%', '7%', '7%', '11%', '8%'];
const TABLE_COLUMNS = COLUMN_WIDTHS.join(' ');

const QUICK_FILTERS = ['高评分', '有评价', '本学期'];

const VISION_ITEMS = [
  { label: '发现好课', icon: <CompassIcon className="h-4 w-4" /> },
  { label: '探求真理', icon: <BulbIcon className="h-4 w-4" /> },
  { label: '共享信息', icon: <ShareIcon className="h-4 w-4" /> },
];

/** The banner's decorative stack of blurred mini course cards. */
const MiniCardStack: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: 64,
        padding: 8,
        borderRadius: 8,
        border: `1px solid ${edge(50)}`,
        background: `color-mix(in oklab, ${HUB.base100} 60%, transparent)`,
        opacity: 0.7,
        transform: 'rotate(-6deg)',
        filter: 'blur(1px)',
      }}
    >
      <span style={{ height: 6, width: 24, borderRadius: 6, background: tint(HUB.primary, 40) }} />
      <span style={{ height: 6, borderRadius: 6, background: HUB.base200 }} />
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: 80,
        marginLeft: -8,
        marginBottom: 12,
        padding: 10,
        borderRadius: 8,
        border: `1px solid ${edge(70)}`,
        background: `color-mix(in oklab, ${HUB.base100} 95%, transparent)`,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07)',
        transform: 'rotate(2deg)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 14, height: 14, borderRadius: 6, background: tint(HUB.info, 30) }} />
        <span style={{ height: 6, flex: 1, borderRadius: 6, background: HUB.base200 }} />
      </span>
      <span style={{ height: 6, width: '80%', borderRadius: 6, background: HUB.base200 }} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <span style={{ height: 4, width: 28, borderRadius: 6, background: tint(HUB.warning, 40) }} />
        <span style={{ height: 4, width: 16, borderRadius: 6, background: HUB.base200 }} />
      </span>
    </div>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: 64,
        marginLeft: -8,
        padding: 8,
        borderRadius: 8,
        border: `1px solid ${edge(50)}`,
        background: `color-mix(in oklab, ${HUB.base100} 60%, transparent)`,
        opacity: 0.7,
        transform: 'rotate(6deg)',
        filter: 'blur(1px)',
      }}
    >
      <span style={{ height: 6, width: 24, borderRadius: 6, background: tint(HUB.primary, 40) }} />
      <span style={{ height: 6, borderRadius: 6, background: HUB.base200 }} />
    </div>
  </div>
);

const CourseRow: React.FC<{ course: MockCourse; last: boolean }> = ({ course, last }) => (
  <div
    className="hub-stagger"
    data-hover="课程"
    style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: TABLE_COLUMNS,
      alignItems: 'center',
      padding: '0 12px',
      height: 42,
      fontSize: 14,
    }}
  >
    {!last && (
      <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, background: edge(60) }} />
    )}
    <span
      style={{
        padding: '0 12px',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 500,
      }}
    >
      {course.name}
    </span>
    <span
      style={{
        padding: '0 12px',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: muted(0.55),
      }}
    >
      {course.primaryCode}
    </span>
    <span
      style={{
        padding: '0 12px',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: muted(0.75),
      }}
    >
      {course.teacherName}
    </span>
    <span
      style={{
        padding: '0 12px',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: muted(0.55),
      }}
    >
      {course.department}
    </span>
    <span style={{ padding: '0 12px', color: muted(0.55) }}>
      {course.ratingAvg == null ? (
        course.reviewCount ? (
          <span style={{ color: muted(0.5) }}>暂无评分</span>
        ) : null
      ) : (
        <HubRating value={course.ratingAvg} />
      )}
    </span>
    <span style={{ padding: '0 12px', color: muted(0.55), fontVariantNumeric: 'tabular-nums' }}>
      ({course.reviewCount})
    </span>
    <span style={{ padding: '0 12px', color: muted(0.75), fontVariantNumeric: 'tabular-nums' }}>
      {(course.creditX10 / 10).toFixed(1).replace(/\.0$/, '')}
    </span>
    <span style={{ padding: '0 12px', color: muted(0.55), minWidth: 0 }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {course.terms[0]?.replace('2026-2027 第 1 学期', '26-27-1')}
        </span>
        {course.terms.length > 1 && (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 999,
              background: colorMixBase200(),
              fontSize: 12,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              color: muted(0.6),
              flexShrink: 0,
            }}
          >
            +{course.terms.length - 1}
          </span>
        )}
      </span>
    </span>
    <span style={{ display: 'flex', justifyContent: 'flex-end', gap: 2, color: muted(0.4) }}>
      <span style={{ display: 'inline-grid', placeItems: 'center', width: 28, height: 28, borderRadius: 6 }}>
        <EyeIcon className="h-4 w-4" />
      </span>
      <span style={{ display: 'inline-grid', placeItems: 'center', width: 28, height: 28, borderRadius: 6 }}>
        <BookmarkIcon className="h-4 w-4" />
      </span>
    </span>
  </div>
);

/** background-base-200/80, used by the term count pill. */
function colorMixBase200() {
  return `color-mix(in oklab, ${HUB.base200} 80%, transparent)`;
}

export const HubCourses: React.FC = () => (
  <HubShell activePage="课程">
    <HubPageHeader title="课程目录" description="浏览全校课程、教师与开课信息。" />

    <div style={{ marginTop: 20, minWidth: 0, flex: 1 }}>
      {/* 搜索横幅 */}
      <section
        style={{
          position: 'relative',
          marginBottom: 24,
          padding: '20px 28px 22px',
          overflow: 'hidden',
          borderRadius: 8,
          border: `1px solid ${edge(70)}`,
          background: HUB.base100,
          boxShadow: '0 2px 12px rgb(0 0 0 / 0.04)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${tint(HUB.info, 10)}, transparent 50%, ${tint(HUB.base200, 30)})`,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -64,
            top: -96,
            width: 288,
            height: 288,
            borderRadius: 999,
            background: tint(HUB.primary, 10),
            filter: 'blur(64px)',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: -56,
            bottom: -64,
            width: 240,
            height: 240,
            opacity: 0.15,
            backgroundImage: `radial-gradient(currentColor 1.5px, transparent 1.5px)`,
            backgroundSize: '15px 15px',
            color: HUB.content,
            maskImage: 'radial-gradient(circle, black 30%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 72%)',
          }}
        />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
            <div style={{ maxWidth: 672 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 38,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                探索同济大学
                <span
                  style={{
                    backgroundImage: `linear-gradient(90deg, oklch(54% 0.14 240), ${HUB.primary}, oklch(62% 0.12 200))`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  精彩课程
                </span>
              </h2>
              <p
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px 20px',
                  margin: '12px 0 0',
                  fontSize: 15,
                }}
              >
                {VISION_ITEMS.map((item) => (
                  <span
                    key={item.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 500,
                      color: muted(0.75),
                    }}
                  >
                    <span style={{ display: 'flex', color: `color-mix(in oklab, ${HUB.primary} 75%, transparent)` }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                ))}
              </p>
            </div>
            <MiniCardStack />
          </div>

          {/* 一体化圆角搜索 pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              maxWidth: 576,
              marginTop: 20,
              padding: 6,
              paddingLeft: 8,
              borderRadius: 999,
              border: `1px solid ${edge(80)}`,
              background: `color-mix(in oklab, ${HUB.base100} 90%, transparent)`,
              boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)',
            }}
          >
            <SearchIcon className="h-4 w-4" style={{ marginLeft: 12, flexShrink: 0, color: muted(0.4) }} />
            <span style={{ flex: 1, padding: '10px 0', fontSize: 14, color: muted(0.45) }}>
              搜索课程名、课号、教师...
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 36,
                padding: '0 12px',
                borderRadius: 999,
                background: HUB.primary,
                color: HUB.primaryContent,
                fontSize: 14,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              搜索
            </span>
          </div>

          {/* 常用筛选 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 18 }}>
            <span
              style={{
                marginRight: 4,
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: muted(0.5),
              }}
            >
              常用筛选
            </span>
            {QUICK_FILTERS.map((filter) => (
              <span
                key={filter}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: `1px solid ${HUB.line}`,
                  background: `color-mix(in oklab, ${HUB.base100} 70%, transparent)`,
                  fontSize: 14,
                  fontWeight: 500,
                  color: muted(0.75),
                }}
              >
                {filter}
              </span>
            ))}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                minHeight: 32,
                padding: '4px 6px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: muted(0.6),
                textDecoration: 'underline dotted',
                textUnderlineOffset: 4,
              }}
            >
              <HistoryIcon className="h-3.5 w-3.5" style={{ flexShrink: 0 }} />
              历史乌龙茶文档入口
            </span>
          </div>
        </div>
      </section>

      {/* 课程列表 */}
      <section
        style={{
          overflow: 'hidden',
          borderRadius: 8,
          border: `1px solid ${edge(70)}`,
          background: HUB.base100,
          boxShadow: '0 2px 12px rgb(0 0 0 / 0.04)',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '12px 16px',
            borderBottom: `1px solid ${edge(70)}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>课程列表</h2>
        </header>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderBottom: `1px solid ${edge(70)}`,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 6,
              background: HUB.primary,
              color: HUB.primaryContent,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            全部院系
          </span>
          <span style={{ flex: 1 }} />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 14,
              color: muted(0.6),
            }}
          >
            <SlidersIcon className="h-4 w-4" />
            更多筛选
            <span style={{ color: muted(0.5), fontSize: 12 }}>⌄</span>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: TABLE_COLUMNS,
            alignItems: 'center',
            height: 40,
            borderBottom: `1px solid ${edge(70)}`,
            background: `color-mix(in oklab, ${HUB.base200} 40%, transparent)`,
            fontSize: 12,
            color: muted(0.55),
          }}
        >
          {['课程', '课程号', '教师', '学院', '评分', '评价数', '学分', '开课学期', '操作'].map(
            (label, index) => (
              <span
                key={label}
                style={{
                  padding: '0 12px',
                  fontWeight: 500,
                  textAlign: index === 8 ? 'right' : 'left',
                }}
              >
                {label}
              </span>
            ),
          )}
        </div>

        {MOCK_COURSES.map((course, index) => (
          <CourseRow key={course.id} course={course} last={index === MOCK_COURSES.length - 1} />
        ))}
      </section>
    </div>
  </HubShell>
);
