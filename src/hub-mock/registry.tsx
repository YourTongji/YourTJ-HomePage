import React from 'react';

const HubHome = React.lazy(() => import('./pages/HubHome').then(({ HubHome }) => ({ default: HubHome })));
const HubCourses = React.lazy(() => import('./pages/HubCourses').then(({ HubCourses }) => ({ default: HubCourses })));
const HubSchedule = React.lazy(() => import('./pages/HubSchedule').then(({ HubSchedule }) => ({ default: HubSchedule })));
const HubWiki = React.lazy(() => import('./pages/HubWiki').then(({ HubWiki }) => ({ default: HubWiki })));

/*
 * One React page per product surface, keyed by the slide id the marketing site
 * already uses (see PREVIEW_SLIDES in src/constants.ts). Keeping the mapping
 * keyed rather than positional means a slide can be reordered or removed in
 * constants.ts without silently showing the wrong page here.
 */
const HUB_PREVIEW_PAGES: Record<string, React.LazyExoticComponent<React.FC>> = {
  'hub-home': HubHome,
  'hub-courses': HubCourses,
  'hub-schedule': HubSchedule,
  'hub-wiki': HubWiki,
};

export const hubPreviewPageFor = (slideId: string): React.FC => HUB_PREVIEW_PAGES[slideId] ?? HubHome;
