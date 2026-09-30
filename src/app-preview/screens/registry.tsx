import React from 'react';
import type { IconProps } from '../../components/icons';
import {
  CampusScreenIcon,
  ChatScreenIcon,
  ComposeScreenIcon,
  CourseScreenIcon,
  HomeScreenIcon,
  NotificationScreenIcon,
  ProfileScreenIcon,
  ThreadScreenIcon,
  WidgetsScreenIcon,
  WikiScreenIcon,
} from '../../components/icons';
import type { Msg } from './Chat';
import { Composer, QUESTION_BODY, QUESTION_TITLE } from './Composer';

const CampusPage = React.lazy(() => import('./Campus').then(({ CampusPage }) => ({ default: CampusPage })));
const ChatPage = React.lazy(() => import('./Chat').then(({ ChatPage }) => ({ default: ChatPage })));
const CoursePage = React.lazy(() => import('./Course').then(({ CoursePage }) => ({ default: CoursePage })));
const HomeFeed = React.lazy(() => import('./Home').then(({ HomeFeed }) => ({ default: HomeFeed })));
const MessagesPage = React.lazy(() => import('./Messages').then(({ MessagesPage }) => ({ default: MessagesPage })));
const NotificationsPage = React.lazy(() => import('./Notifications').then(({ NotificationsPage }) => ({ default: NotificationsPage })));
const ProfilePage = React.lazy(() => import('./Profile').then(({ ProfilePage }) => ({ default: ProfilePage })));
const ScheduleWidgetsPage = React.lazy(() => import('./ScheduleWidgetsPage').then(({ ScheduleWidgetsPage }) => ({ default: ScheduleWidgetsPage })));
const TopicPage = React.lazy(() => import('./Topic').then(({ TopicPage }) => ({ default: TopicPage })));
const WikiHome = React.lazy(() => import('./Wiki').then(({ WikiHome }) => ({ default: WikiHome })));

/*
 * Registry for the app preview.
 *
 * Every screen here is the real page, rebuilt in React for the promo film and
 * reused unchanged on the website. The film drove them with a video frame
 * counter (typing progress, reply arrivals, scroll offsets); the page renders
 * each one at its settled end state instead, because a visitor arriving
 * mid-animation would see a half-typed composer or a half-filled score bar.
 *
 * What is deliberately NOT settled: nothing. Screens that only make sense in
 * motion are shown at the moment they finish, which is the state a reader can
 * actually read.
 *
 * Three of these are the shell's branch roots — home, campus, messages,
 * profile — and the hero's bottom nav must point at exactly those (see
 * Hero.tsx). The app's 消息 root is `messages` (the conversation list); `chat`
 * is the thread it pushes, which is a different route and not a tab.
 */

export type AppScreenId =
  | 'home'
  | 'campus'
  | 'notifications'
  | 'messages'
  | 'composer'
  | 'topic'
  | 'course'
  | 'wiki'
  | 'profile'
  | 'chat'
  | 'widgets';

/**
 * What the host wants a screen to leave room for.
 *
 * The hero gives the phone a working app shell (see HeroDevice), which means the
 * *host* draws the bottom nav and the page must not draw a second one; screens
 * whose layout is anchored to the bottom edge (the thread composer) also need to
 * know how much room the shell takes. Every other use — the showcase, the film —
 * passes nothing and gets the page exactly as it was authored.
 */
export interface AppScreenRenderOptions {
  /** The host draws the shell nav, so the page skips its own copy. */
  shellNav?: boolean;
  /** Shell chrome the host draws at the bottom edge, in screen points. */
  shellInset?: number;
  /** Callback when user clicks the avatar to open the account drawer. */
  onOpenDrawer?: () => void;
}

export interface AppScreenEntry {
  id: AppScreenId;
  /** Switcher label, resolved through i18n. */
  labelKey: string;
  /** One-line caption describing what the screen does. */
  descKey: string;
  Icon: React.FC<IconProps>;
  /** Factory, so callers can key the tree and remount it on switch. */
  render: (options?: AppScreenRenderOptions) => React.ReactNode;
}

/** Chat thread from the film, with the sticker revealed at a settled angle. */
const CHAT_MESSAGES: Msg[] = [
  { mine: false, text: '你好呀，看到你在论坛问四级 👋', at: 0, time: '20:14' },
  { mine: true, text: '学长好！你的回复超有用 🙏', at: 0, time: '20:14' },
  { mine: false, text: '我整理了一份真题笔记📒 要不要？', at: 0, time: '20:16' },
  { mine: true, sticker: true, at: 1.5, time: '20:16' },
  { mine: true, text: '太好了！今晚图书馆见？', at: 0, time: '20:17' },
  { mine: false, text: '没问题！四平图书馆三楼见 📚', at: 0, time: '20:17' },
  { mine: true, text: '🙌🎉', at: 0, time: '20:18' },
];

const CHAT_SETTLED_AT = 2;

export const APP_SCREENS: AppScreenEntry[] = [
  {
    id: 'home',
    labelKey: 'screen.home.label',
    descKey: 'screen.home.desc',
    Icon: HomeScreenIcon,
    render: ({ shellNav, onOpenDrawer } = {}) => <HomeFeed nav={!shellNav} onOpenDrawer={onOpenDrawer} />,
  },
  {
    id: 'course',
    labelKey: 'screen.course.label',
    descKey: 'screen.course.desc',
    Icon: CourseScreenIcon,
    render: () => <CoursePage scroll={0} fill={1} b={0} />,
  },
  {
    id: 'campus',
    labelKey: 'screen.campus.label',
    descKey: 'screen.campus.desc',
    Icon: CampusScreenIcon,
    render: ({ shellNav } = {}) => (
      <CampusPage
        connect={1}
        reveal={1}
        tab={0}
        tabSlide={1}
        prevTab={0}
        frame={0}
        scroll={0}
        nav={!shellNav}
      />
    ),
  },
  {
    id: 'topic',
    labelKey: 'screen.topic.label',
    descKey: 'screen.topic.desc',
    Icon: ThreadScreenIcon,
    render: () => (
      <TopicPage b={99} replyAt={[0, 0, 0, 0, 0, 0, 0]} scroll={0} views={1286} />
    ),
  },
  {
    id: 'wiki',
    labelKey: 'screen.wiki.label',
    descKey: 'screen.wiki.desc',
    Icon: WikiScreenIcon,
    render: () => <WikiHome press={0} />,
  },
  {
    id: 'notifications',
    labelKey: 'screen.notifications.label',
    descKey: 'screen.notifications.desc',
    Icon: NotificationScreenIcon,
    render: ({ shellNav } = {}) => <NotificationsPage nav={!shellNav} />,
  },
  {
    id: 'messages',
    labelKey: 'screen.messages.label',
    descKey: 'screen.messages.desc',
    Icon: ChatScreenIcon,
    render: ({ shellNav } = {}) => <MessagesPage nav={!shellNav} />,
  },
  {
    id: 'composer',
    labelKey: 'screen.composer.label',
    descKey: 'screen.composer.desc',
    Icon: ComposeScreenIcon,
    render: () => (
      <Composer
        frame={0}
        title={QUESTION_TITLE}
        body={QUESTION_BODY}
        focus={null}
        step2={1}
      />
    ),
  },
  {
    id: 'chat',
    labelKey: 'screen.chat.label',
    descKey: 'screen.chat.desc',
    Icon: ChatScreenIcon,
    render: ({ shellInset = 0 } = {}) => (
      <ChatPage
        b={CHAT_SETTLED_AT}
        frame={0}
        msgs={CHAT_MESSAGES}
        input=""
        focus={false}
        emojiOpen={0}
        scroll={0}
        shellInset={shellInset}
      />
    ),
  },
  {
    id: 'profile',
    labelKey: 'screen.profile.label',
    descKey: 'screen.profile.desc',
    Icon: ProfileScreenIcon,
    render: () => <ProfilePage follow={1} self />,
  },
  {
    id: 'widgets',
    labelKey: 'screen.widgets.label',
    descKey: 'screen.widgets.desc',
    Icon: WidgetsScreenIcon,
    render: () => <ScheduleWidgetsPage />,
  },
];

export const APP_SCREEN_COUNT = APP_SCREENS.length;

export const screenAt = (index: number): AppScreenEntry =>
  APP_SCREENS[((index % APP_SCREEN_COUNT) + APP_SCREEN_COUNT) % APP_SCREEN_COUNT];

export const screenById = (id: AppScreenId): AppScreenEntry =>
  APP_SCREENS.find((screen) => screen.id === id) ?? APP_SCREENS[0];
