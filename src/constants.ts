import { AppLinkConfig, CommunityLink, ProductEntry } from './types';

/**
 * All outbound URLs and social-placeholder values live in this single file.
 * User-facing labels are i18n keys resolved by src/i18n.tsx.
 */

export const PRODUCT_ENTRIES: ProductEntry[] = [
  {
    id: 'course-community',
    titleKey: 'product.course.title',
    descriptionKey: 'product.course.description',
    href: 'https://xk.yourtj.de',
    available: true,
  },
  {
    id: 'hub',
    titleKey: 'product.hub.title',
    descriptionKey: 'product.hub.description',
    statusLabelKey: 'product.hub.status',
    href: '',
    available: false,
  },
];

// Preserved from the current production page. Do not replace without a decision.
export const APP_LINKS: AppLinkConfig = {
  iosTestflight: 'https://testflight.apple.com/join/KkBg6quW',
  iosIssues: 'https://github.com/YourTongji/YourTJCourse-iOS/issues',
  androidAcceleratedApk:
    'https://gh-proxy.com/https://github.com/YourTongji/YourTJCourse-Flutter/releases/download/dev-latest/app-arm64-v8a-release.apk',
  androidReleases: 'https://github.com/YourTongji/YourTJCourse-Flutter/releases/tag/dev-latest',
  androidIssues: 'https://github.com/YourTongji/YourTJCourse-Flutter/issues',
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
