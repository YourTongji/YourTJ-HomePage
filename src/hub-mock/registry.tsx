import React from 'react';
import { HubCourses } from './pages/HubCourses';
import { HubHome } from './pages/HubHome';
import { HubSchedule } from './pages/HubSchedule';
import { HubWiki } from './pages/HubWiki';

/*
 * One React page per product surface, keyed by the slide id the marketing site
 * already uses (see PREVIEW_SLIDES in src/constants.ts). Keeping the mapping
 * keyed rather than positional means a slide can be reordered or removed in
 * constants.ts without silently showing the wrong page here.
 */
const HUB_PREVIEW_PAGES: Record<string, React.FC> = {
  'hub-home': HubHome,
  'hub-courses': HubCourses,
  'hub-schedule': HubSchedule,
  'hub-wiki': HubWiki,
};

export const hubPreviewPageFor = (slideId: string): React.FC => HUB_PREVIEW_PAGES[slideId] ?? HubHome;
