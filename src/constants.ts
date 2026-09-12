import { AppLinkConfig, CommunityLink, PreviewSlide, ProductEntry } from './types';

/**
 * All outbound URLs and social-placeholder values live in this single file.
 * User-facing labels are i18n keys resolved by src/i18n.tsx.
 */

export const PRODUCT_ENTRIES: ProductEntry[] = [
  {
    id: 'hub',
    titleKey: 'product.hub.title',
    descriptionKey: 'product.hub.description',
    statusLabelKey: 'product.hub.status',
    href: 'https://f.yourtj.de',
    available: true,
  },
];

// Slide order mirrors the storytelling flow: land, explore, plan, contribute.
export const PREVIEW_SLIDES: PreviewSlide[] = [
  {
    id: 'hub-home',
    titleKey: 'preview.slide.hub.title',
    href: 'https://f.yourtj.de/',
    imageLight: 'preview-hub-light.webp',
    imageDark: 'preview-hub-dark.webp',
  },
  {
    id: 'hub-courses',
    titleKey: 'preview.slide.course.title',
    href: 'https://f.yourtj.de/courses',
    imageLight: 'preview-course-light.webp',
    imageDark: 'preview-course-dark.webp',
  },
  {
    id: 'hub-schedule',
    titleKey: 'preview.slide.schedule.title',
    href: 'https://f.yourtj.de/schedule',
    imageLight: 'preview-sim-light.webp',
    imageDark: 'preview-sim-dark.webp',
  },
  {
    id: 'hub-wiki',
    titleKey: 'preview.slide.wiki.title',
    href: 'https://f.yourtj.de/wiki',
    imageLight: 'preview-wiki-light.webp',
    imageDark: 'preview-wiki-dark.webp',
  },
];

/**
 * The forum app has not shipped yet. While false, every app entry point renders
 * as a non-interactive masked preview instead of a live download link.
 */
export const APP_AVAILABLE = false;

/**
 * Reserved destinations for the mobile client. It has not shipped yet, so these
 * point at the Hub repository instead of the retired YourTJCourse repos. Swap in
 * real store / release URLs when the app goes live and APP_AVAILABLE flips.
 */
export const APP_LINKS: AppLinkConfig = {
  iosTestflight: 'https://github.com/YourTongji/YourTJ-Hub/releases',
  iosIssues: 'https://github.com/YourTongji/YourTJ-Hub/issues',
  androidAcceleratedApk: 'https://github.com/YourTongji/YourTJ-Hub/releases',
  androidReleases: 'https://github.com/YourTongji/YourTJ-Hub/releases',
  androidIssues: 'https://github.com/YourTongji/YourTJ-Hub/issues',
};

export const QQ_GROUP_URL = 'https://qm.qq.com/q/8MNG0NZyj6';

export const TELEGRAM_CHANNEL_URL = 'https://t.me/yourtongji';

export const CONTACT_EMAIL = 'support@yourtj.de';

export const GITHUB_ORG_URL = 'https://github.com/YourTongji';

export const COMMUNITY_LINKS: CommunityLink[] = [
  {
    id: 'qq',
    labelKey: 'community.qq.label',
    noteKey: QQ_GROUP_URL ? 'community.qq.note.join' : 'community.qq.note.missing',
    icon: 'qq',
    href: QQ_GROUP_URL,
  },
  {
    id: 'telegram',
    labelKey: 'community.telegram.label',
    noteKey: TELEGRAM_CHANNEL_URL
      ? 'community.telegram.note.join'
      : 'community.telegram.note.missing',
    icon: 'telegram',
    href: TELEGRAM_CHANNEL_URL,
  },
  {
    id: 'email',
    labelKey: 'community.email.label',
    noteKey: CONTACT_EMAIL ? 'community.email.note.join' : 'community.email.note.missing',
    icon: 'email',
    href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : '',
  },
  {
    id: 'github',
    labelKey: 'community.github.label',
    noteKey: 'community.github.note',
    icon: 'github',
    href: GITHUB_ORG_URL,
  },
];
