import React from 'react';
import type { IconComponent } from 'reicon-react';

/*
 * Icon layer for the whole site, backed by Reicon (https://reicon.dev).
 *
 * Two deliberate choices live here:
 *
 * 1. Deep imports rather than the package barrel. reicon-react ships ~2,700
 *    icon modules; importing from the root entrypoint would ask the bundler to
 *    reason about all of them, while these named paths ship exactly what the
 *    page draws and nothing else.
 *
 * 2. The exports keep the site's semantic names (ClockIcon, not Clock). Call
 *    sites read as intent, and swapping the underlying set later is a change to
 *    this one file instead of every component.
 *
 * Brand marks come from the companion reicon-brands set. Those are plain DOM
 * factories, not React components, so they get a thin wrapper rather than a
 * direct re-export.
 */
import ReiconArrowDownRight from 'reicon-react/icons/ArrowDownRight';
import ReiconArrowUpRight from 'reicon-react/icons/ArrowUpRight';
import ReiconArrowUpRightSquare from 'reicon-react/icons/ArrowUpRightSquare';
import ReiconChatRoundLine from 'reicon-react/icons/ChatRoundLine';
import ReiconCheck from 'reicon-react/icons/Check';
import ReiconChevronLeft from 'reicon-react/icons/ChevronLeft';
import ReiconChevronRight from 'reicon-react/icons/ChevronRight';
import ReiconClock from 'reicon-react/icons/Clock';
import ReiconDocumentText from 'reicon-react/icons/DocumentText';
import ReiconEnvelope from 'reicon-react/icons/Envelope';
import ReiconFlask from 'reicon-react/icons/Flask';
import ReiconLanguage from 'reicon-react/icons/Language';
import ReiconMobile from 'reicon-react/icons/Mobile';
import ReiconMoon from 'reicon-react/icons/Moon';
import ReiconSun from 'reicon-react/icons/Sun';

import AndroidBrand from 'reicon-brands/icons/Android';
import AppleBrand from 'reicon-brands/icons/Apple';
import GithubBrand from 'reicon-brands/icons/Github';
import QqBrand from 'reicon-brands/icons/Qq';
import TelegramBrand from 'reicon-brands/icons/Telegram';

export interface IconProps {
  className?: string;
}

/**
 * Reicon draws its outline weight at 1.5. The site renders most glyphs at 14-18px
 * on translucent glass, where 1.5 loses definition, so the weight is nudged once
 * here instead of being re-tuned at every call site. Reicon supports this through
 * its strokeWidth prop rather than by replacing the artwork.
 */
const SITE_STROKE_WIDTH = 1.6;

const siteIcon = (ReiconIcon: IconComponent, displayName: string): React.FC<IconProps> => {
  const SiteIcon: React.FC<IconProps> = ({ className }) => (
    <ReiconIcon
      className={className}
      weight="Outline"
      strokeWidth={SITE_STROKE_WIDTH}
      aria-hidden={true}
      focusable={false}
    />
  );

  SiteIcon.displayName = displayName;
  return SiteIcon;
};

interface BrandGlyph {
  svgContent: string;
}

/**
 * Brand marks are single-colour silhouettes. The site tints them with a text
 * colour token, so they inherit currentColor instead of the official brand hex.
 */
const brandIcon = (glyph: BrandGlyph, displayName: string): React.FC<IconProps> => {
  const BrandIcon: React.FC<IconProps> = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: glyph.svgContent }}
    />
  );

  BrandIcon.displayName = displayName;
  return BrandIcon;
};

export const SunIcon = siteIcon(ReiconSun, 'SunIcon');
export const MoonIcon = siteIcon(ReiconMoon, 'MoonIcon');

export const ArrowUpRightIcon = siteIcon(ReiconArrowUpRight, 'ArrowUpRightIcon');
export const ArrowDownRightIcon = siteIcon(ReiconArrowDownRight, 'ArrowDownRightIcon');
export const ExternalLinkIcon = siteIcon(ReiconArrowUpRightSquare, 'ExternalLinkIcon');

export const PhoneIcon = siteIcon(ReiconMobile, 'PhoneIcon');
export const MailIcon = siteIcon(ReiconEnvelope, 'MailIcon');

export const CheckIcon = siteIcon(ReiconCheck, 'CheckIcon');
export const ClockIcon = siteIcon(ReiconClock, 'ClockIcon');
export const FlaskIcon = siteIcon(ReiconFlask, 'FlaskIcon');

export const ChevronLeftIcon = siteIcon(ReiconChevronLeft, 'ChevronLeftIcon');
export const ChevronRightIcon = siteIcon(ReiconChevronRight, 'ChevronRightIcon');

export const FeedbackIcon = siteIcon(ReiconChatRoundLine, 'FeedbackIcon');
export const ReleaseIcon = siteIcon(ReiconDocumentText, 'ReleaseIcon');
export const LanguageIcon = siteIcon(ReiconLanguage, 'LanguageIcon');

export const QQIcon = brandIcon(QqBrand, 'QQIcon');
export const TelegramIcon = brandIcon(TelegramBrand, 'TelegramIcon');
export const AppleIcon = brandIcon(AppleBrand, 'AppleIcon');
export const AndroidIcon = brandIcon(AndroidBrand, 'AndroidIcon');
export const GithubIcon = brandIcon(GithubBrand, 'GithubIcon');
