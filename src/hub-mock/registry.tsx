import React from 'react';
import { lazyWithPreload, type PreloadableComponent } from '../utils/lazyWithPreload';

const HubHome = lazyWithPreload(() => import('./pages/HubHome').then(({ HubHome }) => ({ default: HubHome })));
const HubCourses = lazyWithPreload(() => import('./pages/HubCourses').then(({ HubCourses }) => ({ default: HubCourses })));
const HubSchedule = lazyWithPreload(() => import('./pages/HubSchedule').then(({ HubSchedule }) => ({ default: HubSchedule })));
const HubWiki = lazyWithPreload(() => import('./pages/HubWiki').then(({ HubWiki }) => ({ default: HubWiki })));

/*
 * One React page per product surface, keyed by the slide id the marketing site
 * already uses (see PREVIEW_SLIDES in src/constants.ts). Keeping the mapping
 * keyed rather than positional means a slide can be reordered or removed in
 * constants.ts without silently showing the wrong page here.
 */
const HUB_PREVIEW_PAGES: Record<string, PreloadableComponent<React.FC>> = {
  'hub-home': HubHome,
  'hub-courses': HubCourses,
  'hub-schedule': HubSchedule,
  'hub-wiki': HubWiki,
};

export const hubPreviewPageFor = (slideId: string): React.FC => HUB_PREVIEW_PAGES[slideId] ?? HubHome;

/** Fetches a hub page's chunk ahead of time, so switching to it never shows an empty frame. */
export const preloadHubPreviewPage = (slideId: string) => (HUB_PREVIEW_PAGES[slideId] ?? HubHome).preload();
