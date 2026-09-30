export type Theme = 'light' | 'dark';

export interface ProductEntry {
  id: 'hub';
  titleKey: string;
  descriptionKey: string;
  statusLabelKey?: string;
  href: string;
  available: boolean;
}

export interface CommunityLink {
  id: 'qq' | 'telegram' | 'email' | 'github';
  labelKey: string;
  noteKey: string;
  icon: 'qq' | 'telegram' | 'email' | 'github';
  href: string;
}

/**
 * One surface of the product web preview. The slides are rendered live (see
 * src/hub-mock) rather than shown as screenshots, so a slide is a title, a real
 * destination and the id that selects which product page to render.
 */
export interface PreviewSlide {
  id: 'hub-home' | 'hub-courses' | 'hub-schedule' | 'hub-wiki';
  titleKey: string;
  href: string;
}

export interface AppLinkConfig {
  iosTestflight: string;
  iosIssues: string;
  androidAcceleratedApk: string;
  androidReleases: string;
  androidIssues: string;
}
