import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * ScheduleWidgetsPage:
 * Pixel-perfect 1:1 replica of Android Jetpack Glance Widgets from YourTJ-Hub:
 * - NextClassWidget (android/.../widget/ScheduleWidgets.kt lines 195-448)
 * - TodayScheduleWidget (android/.../widget/ScheduleWidgets.kt lines 770-845)
 * - CourseTimelineWidget (android/.../widget/ScheduleWidgets.kt lines 498-749)
 *
 * All three widgets are placed inside a single Android phone preview page.
 */

// Brand mark component for widget header (ScheduleWidgets.kt line 1028: BrandMark())
// Strictly renders a single image based on current light/dark theme to avoid displaying both.
export const WidgetBrandMark: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { theme } = useTheme();
  return (
    <img
      src={theme === 'dark' ? '/schedule-widget-brand-dark.png' : '/schedule-widget-brand-light.png'}
      alt="YourTJ"
      style={{
        width: 16,
        height: 16,
        flexShrink: 0,
        display: 'block',
        objectFit: 'contain',
        ...style,
      }}
    />
  );
};

/**
 * Vector icons 1:1 ported from YourTJ-Hub widget drawables:
 * - course_timeline_arrow_next.xml & course_timeline_arrow_back.xml
 * - course_timeline_location.xml (Icons.place_outlined U+F2AC)
 * - course_timeline_teacher.xml (user-round.svg)
 */
const TimelineArrowIcon: React.FC<{ direction: 'next' | 'back'; size?: number }> = ({
  direction,
  size = 20,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--w-accent)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {direction === 'next' ? (
      /* course_timeline_arrow_next.xml: M12,19l7,-7 -7,-7M5,12H19 */
      <path d="M12 19l7-7-7-7M5 12h14" />
    ) : (
      /* course_timeline_arrow_back.xml: M12,19l-7,-7 7,-7M19 12H5 */
      <path d="M12 19l-7-7 7-7M19 12H5" />
    )}
  </svg>
);

const TimelineLocationIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="var(--w-muted)"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {/* Flutter Icons.place_outlined / course_timeline_location.xml */}
    <path d="M12.0 12.0C10.921875 12.0 9.984375 11.109375 9.984375 9.984375C9.984375 8.90625 10.921875 8.015625 12.0 8.015625C13.078125 8.015625 14.015625 8.90625 14.015625 9.984375C14.015625 11.109375 13.078125 12.0 12.0 12.0ZM18.0 10.21875C18.0 6.5625 15.328125 3.984375 12.0 3.984375C8.671875 3.984375 6.0 6.5625 6.0 10.21875C6.0 12.5625 7.96875 15.65625 12.0 19.359375C16.03125 15.65625 18.0 12.5625 18.0 10.21875ZM12.0 2.015625C16.21875 2.015625 20.015625 5.203125 20.015625 10.21875C20.015625 13.5 17.34375 17.4375 12.0 21.984375C6.65625 17.4375 3.984375 13.5 3.984375 10.21875C3.984375 5.203125 7.78125 2.015625 12.0 2.015625Z" />
  </svg>
);

const TimelineTeacherIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--w-muted)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {/* ui_kit user-round.svg / course_timeline_teacher.xml */}
    <path d="M17 8a5 5 0 1 1-10 0 5 5 0 1 1 10 0M20 21a8 8 0 0 0-16 0" />
  </svg>
);

/**
 * 1. NextClassWidget (下一节课小组件 - WideCompact)
 * Matches WideCompactNextClass in ScheduleWidgets.kt lines 360-447.
 */
export const NextClassWidgetPreview: React.FC<{
  status?: 'upcoming' | 'inClass';
  courseName?: string;
  room?: string;
  teacher?: string;
  time?: string;
  distance?: string;
}> = ({
  status = 'upcoming',
  courseName = '计算机视觉',
  room = '瑞安楼 A216',
  teacher = '张老师',
  time = '08:00–09:35',
  distance = '距上课 25 分钟',
}) => {
  return (
    <div
      className="schedule-widget-surface"
      style={{
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 104,
      }}
    >
      {/* Top highlight subtle sheen */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 24,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header Row: Title, Date, BrandMark */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--w-accent)',
            lineHeight: 1,
          }}
        >
          {status === 'inClass' ? '正在上课' : '即将上课'}
        </span>
        <span
          style={{
            fontSize: 11,
            color: 'var(--w-muted)',
            paddingLeft: 6,
            paddingRight: 6,
            flex: 1,
            lineHeight: 1,
          }}
        >
          今天 · 5月18日 周一
        </span>
        <WidgetBrandMark />
      </div>

      {/* Body Row */}
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Color bar */}
        <div
          style={{
            width: 3,
            height: 32,
            borderRadius: 2,
            backgroundColor: 'var(--w-slot-5)',
            flexShrink: 0,
          }}
        />

        {/* Center: Course info */}
        <div style={{ flex: 1, paddingLeft: 8, paddingRight: 8, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--w-fg)',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {courseName}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 11,
              color: 'var(--w-muted)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            地点：{room} · 教师：{teacher}
          </div>
        </div>

        {/* Right: Time, distance & updated */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: 'var(--w-fg)',
              lineHeight: 1.2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {time}
          </div>
          <div
            style={{
              marginTop: 2,
              fontSize: 11.5,
              fontWeight: 600,
              color: 'var(--w-accent)',
              lineHeight: 1.2,
            }}
          >
            {distance}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. TodayScheduleWidget (今日课表大组件 - 双栏模式 LargeSchedule)
 * Matches LargeSchedule in ScheduleWidgets.kt lines 770-844.
 * Dual-column: Left column "今天", Right column "明天", separated by 1px divider, bottom "更新于 07:35".
 */
export const TodayScheduleWidgetPreview: React.FC = () => {
  const todayCourses = [
    {
      slot: 'var(--w-slot-1)',
      name: '计算机视觉',
      location: '瑞安楼 A216',
      teacher: '张老师',
      time: '08:00–09:35',
      current: true,
    },
    {
      slot: 'var(--w-slot-2)',
      name: '海洋遥感',
      location: '北303',
      teacher: 'W. Carter',
      time: '10:00–11:35',
      current: false,
    },
    {
      slot: 'var(--w-slot-6)',
      name: '海洋流体力学',
      location: '瑞安楼',
      teacher: '李老师',
      time: '13:30–15:05',
      current: false,
    },
  ];

  const tomorrowCourses = [
    {
      slot: 'var(--w-slot-3)',
      name: '大学英语四级冲刺',
      location: '一教 204',
      teacher: '陈老师',
      time: '08:00–09:35',
      current: false,
    },
    {
      slot: 'var(--w-slot-4)',
      name: '微积分下重点答疑',
      location: '经纬楼 102',
      teacher: '林老师',
      time: '13:30–15:05',
      current: false,
    },
    {
      slot: 'var(--w-slot-7)',
      name: '学术论文规范研讨',
      location: '综教 B101',
      teacher: '王老师',
      time: '15:20–16:55',
      current: false,
    },
  ];

  return (
    <div
      className="schedule-widget-surface"
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top highlight subtle sheen */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 24,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dual Columns Row (今天 & 明天) */}
      <div style={{ display: 'flex', width: '100%', alignItems: 'stretch' }}>
        {/* Left Column: 今天 */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: 'var(--w-fg)',
                lineHeight: 1.2,
              }}
            >
              今天
            </span>
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: 'var(--w-muted)',
              marginTop: 2,
              lineHeight: 1.2,
            }}
          >
            5月18日 · 第12周 · 星期一
          </div>

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {todayCourses.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                <div
                  style={{
                    width: 3.5,
                    height: 50,
                    borderRadius: 2,
                    backgroundColor: c.slot,
                    flexShrink: 0,
                  }}
                />
                <div style={{ marginLeft: 6, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: c.current ? 'var(--w-accent)' : 'var(--w-fg)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--w-muted)',
                      marginTop: 2,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.location} · {c.teacher}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--w-fg)',
                      marginTop: 2,
                      lineHeight: 1.2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {c.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider (Divider in ScheduleWidgets.kt line 847) */}
        <div
          style={{
            width: 1,
            backgroundColor: 'var(--w-divider)',
            flexShrink: 0,
          }}
        />

        {/* Right Column: 明天 */}
        <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 700,
                color: 'var(--w-fg)',
                lineHeight: 1.2,
              }}
            >
              明天
            </span>
            <WidgetBrandMark />
          </div>
          <div
            style={{
              fontSize: 9.5,
              color: 'var(--w-muted)',
              marginTop: 2,
              lineHeight: 1.2,
            }}
          >
            5月19日 · 第12周 · 星期二
          </div>

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {tomorrowCourses.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                <div
                  style={{
                    width: 3.5,
                    height: 50,
                    borderRadius: 2,
                    backgroundColor: c.slot,
                    flexShrink: 0,
                  }}
                />
                <div style={{ marginLeft: 6, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--w-fg)',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--w-muted)',
                      marginTop: 2,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.location} · {c.teacher}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--w-fg)',
                      marginTop: 2,
                      lineHeight: 1.2,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {c.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom updated timestamp (updatedText in ScheduleWidgets.kt line 795) */}
      <div
        style={{
          marginTop: 8,
          fontSize: 9.5,
          color: 'var(--w-muted)',
          lineHeight: 1.2,
        }}
      >
        更新于 07:35
      </div>
    </div>
  );
};

/**
 * 3. CourseTimelineWidget (课程时间线小组件)
 * Matches TimelineHeader & TimelineCourseCard in ScheduleWidgets.kt lines 498-749.
 */
export const CourseTimelineWidgetPreview: React.FC = () => {
  const [showTomorrow, setShowTomorrow] = useState(false);

  const todayCourses = [
    {
      slot: 'var(--w-slot-5)',
      startSec: '1-2',
      startTime: '08:00',
      endSec: '1-4',
      endTime: '09:35',
      name: '计算机视觉',
      room: '瑞安楼 A216',
      teacher: '张老师',
    },
    {
      slot: 'var(--w-slot-2)',
      startSec: '3-4',
      startTime: '10:00',
      endSec: '5-6',
      endTime: '11:35',
      name: '海洋遥感',
      room: '北303',
      teacher: 'W. Carter',
    },
    {
      slot: 'var(--w-slot-6)',
      startSec: '7-8',
      startTime: '13:30',
      endSec: '7-8',
      endTime: '15:05',
      name: '海洋流体力学',
      room: '瑞安楼',
      teacher: '李老师',
    },
  ];

  const tomorrowCourses = [
    {
      slot: 'var(--w-slot-3)',
      startSec: '1-2',
      startTime: '08:00',
      endSec: '1-2',
      endTime: '09:35',
      name: '大学英语四级真题实战',
      room: '一教 204',
      teacher: '陈老师',
    },
    {
      slot: 'var(--w-slot-4)',
      startSec: '5-6',
      startTime: '13:30',
      endSec: '5-6',
      endTime: '15:05',
      name: '微积分下重点答疑课',
      room: '经纬楼 102',
      teacher: '林老师',
    },
  ];

  const courses = showTomorrow ? tomorrowCourses : todayCourses;

  return (
    <div
      className="schedule-widget-surface"
      style={{
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top highlight subtle sheen */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 24,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header: TimelineHeader in ScheduleWidgets.kt lines 603-647 */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15.5,
              fontWeight: 700,
              color: 'var(--w-fg)',
              lineHeight: 1.2,
            }}
          >
            {showTomorrow ? '5月19日' : '5月18日'}
          </div>
          <div
            style={{
              marginTop: 1,
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--w-muted)',
              lineHeight: 1.2,
            }}
          >
            {showTomorrow ? '明天 · 第12周 · 星期二' : '今天 · 第12周 · 星期一'}
          </div>
        </div>

        <WidgetBrandMark />

        {/* Toggle tomorrow / today button matching ToggleCourseTimelineDayAction in ScheduleWidgets.kt lines 622-646 */}
        <button
          type="button"
          onClick={() => setShowTomorrow(!showTomorrow)}
          title={showTomorrow ? '切换到今天' : '切换到明天'}
          style={{
            marginLeft: 8,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'var(--w-divider)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: 'transform 150ms ease, background-color 150ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <TimelineArrowIcon
            direction={showTomorrow ? 'back' : 'next'}
            size={20}
          />
        </button>
      </div>

      {/* Timeline Course Cards (TimelineCourseCard in lines 650-732) */}
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {courses.map((c, i) => (
          <div
            key={i}
            style={{
              backgroundColor: `color-mix(in srgb, ${c.slot} calc(var(--w-tint-alpha) * 100%), var(--w-bg))`,
              borderRadius: 14,
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            {/* Color accent bar */}
            <div
              style={{
                width: 3,
                height: 26,
                borderRadius: 2,
                backgroundColor: c.slot,
                flexShrink: 0,
              }}
            />

            {/* Rows */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Top row: startSection, startTime, courseName */}
              <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1.2 }}>
                <span
                  style={{
                    width: 26,
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--w-accent)',
                  }}
                >
                  {c.startSec}
                </span>
                <span
                  style={{
                    width: 38,
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--w-muted)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.startTime}
                </span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--w-fg)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {c.name}
                </span>
              </div>

              {/* Bottom row: endSection, endTime, room & teacher */}
              <div
                style={{
                  marginTop: 2,
                  display: 'flex',
                  alignItems: 'center',
                  lineHeight: 1.2,
                }}
              >
                <span
                  style={{
                    width: 26,
                    fontSize: 10,
                    fontWeight: 500,
                    color: 'var(--w-muted)',
                  }}
                >
                  {c.endSec}
                </span>
                <span
                  style={{
                    width: 38,
                    fontSize: 10,
                    color: 'var(--w-muted)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.endTime}
                </span>

                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    minWidth: 0,
                  }}
                >
                  {c.room && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        color: 'var(--w-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <TimelineLocationIcon size={12} />
                      {c.room}
                    </span>
                  )}
                  {c.teacher && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: 10,
                        color: 'var(--w-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <TimelineTeacherIcon size={12} />
                      {c.teacher}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Android Schedule Widgets Preview Page:
 * Displays strictly the three widgets together inside a phone frame on an Android desktop wallpaper surface.
 */
export const ScheduleWidgetsPage: React.FC = () => {
  return (
    <div
      className="android-widget-theme no-scrollbar"
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        // Desktop wallpaper aesthetic
        background: 'var(--launcher-bg, linear-gradient(160deg, #dbeafe 0%, #e0e7ff 35%, #fce7f3 70%, #fef3c7 100%))',
      }}
    >
      {/* Dynamic wallpaper overlay for dark/light */}
      <div
        className="block dark:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 80% 10%, rgba(56, 189, 248, 0.28), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(52, 211, 153, 0.2), transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="hidden dark:block"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, #090e17 0%, #0e172a 40%, #151e36 100%)',
          pointerEvents: 'none',
        }}
      />

      {/*
        Strictly The Three Android Schedule Widgets:
        1. NextClassWidget (下一节课)
        2. TodayScheduleWidget (今日课表 - 双栏大组件模式)
        3. CourseTimelineWidget (课程时间线)
      */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '68px 12px 36px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <NextClassWidgetPreview />
        <TodayScheduleWidgetPreview />
        <CourseTimelineWidgetPreview />
      </div>
    </div>
  );
};

