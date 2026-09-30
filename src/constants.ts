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
    href: 'https://f.yourtj.de',
    available: true,
  },
];

/**
 * Slide order mirrors the storytelling flow: land, explore, plan, contribute.
 * Each id is rendered live by src/hub-mock/registry.tsx — the previews are the
 * product's own pages, not screenshots of them.
 */
export const PREVIEW_SLIDES: PreviewSlide[] = [
  {
    id: 'hub-home',
    titleKey: 'preview.slide.hub.title',
    href: 'https://f.yourtj.de/',
  },
  {
    id: 'hub-courses',
    titleKey: 'preview.slide.course.title',
    href: 'https://f.yourtj.de/courses',
  },
  {
    id: 'hub-schedule',
    titleKey: 'preview.slide.schedule.title',
    href: 'https://f.yourtj.de/schedule',
  },
  {
    id: 'hub-wiki',
    titleKey: 'preview.slide.wiki.title',
    href: 'https://f.yourtj.de/wiki',
  },
];

/**
 * Destinations for the mobile client. Both platforms point at the project's own
 * release channel rather than a store listing, because the beta is distributed
 * directly: iOS through TestFlight, Android through the release APK. Swap in
 * App Store / Play URLs once the store builds are live.
 */
export const APP_LINKS: AppLinkConfig = {
  iosTestflight: 'https://apps.apple.com/us/app/yourtj/id6809457637?platform=vision',
  iosIssues: 'https://github.com/YourTongji/YourTJ-Hub/issues',
  androidAcceleratedApk:
    'https://github.com/YourTongji/YourTJ-Hub/releases/download/mobile-latest/YourTJ-arm64-v8a.apk',
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
