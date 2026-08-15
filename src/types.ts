export type Theme = 'light' | 'dark';

export interface ProductEntry {
  id: 'course-community' | 'hub';
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

export interface AppLinkConfig {
  iosTestflight: string;
  iosIssues: string;
  androidAcceleratedApk: string;
  androidReleases: string;
  androidIssues: string;
}
