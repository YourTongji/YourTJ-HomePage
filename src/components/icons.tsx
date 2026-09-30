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
import ReiconActivity from 'reicon-react/icons/Activity';
import ReiconAlertCircle from 'reicon-react/icons/AlertCircle';
import ReiconAlertTriangle from 'reicon-react/icons/AlertTriangle';
import ReiconArchive from 'reicon-react/icons/Archive';
import ReiconArrowDownRight from 'reicon-react/icons/ArrowDownRight';
import ReiconArrowRight from 'reicon-react/icons/ArrowRight';
import ReiconArrowUpRight from 'reicon-react/icons/ArrowUpRight';
import ReiconArrowUpRightSquare from 'reicon-react/icons/ArrowUpRightSquare';
import ReiconBell from 'reicon-react/icons/Bell';
import ReiconBookmark from 'reicon-react/icons/Bookmark';
import ReiconBookOpen from 'reicon-react/icons/BookOpen';
import ReiconCalendar from 'reicon-react/icons/Calendar';
import ReiconCalendarDays from 'reicon-react/icons/CalendarDays';
import ReiconCalendarEdit from 'reicon-react/icons/CalendarEdit';
import ReiconChatRoundDots from 'reicon-react/icons/ChatRoundDots';
import ReiconChatRoundLine from 'reicon-react/icons/ChatRoundLine';
import ReiconCheck from 'reicon-react/icons/Check';
import ReiconChevronDown from 'reicon-react/icons/ChevronDown';
import ReiconChevronLeft from 'reicon-react/icons/ChevronLeft';
import ReiconChevronRight from 'reicon-react/icons/ChevronRight';
import ReiconClock from 'reicon-react/icons/Clock';
import ReiconCommentDots from 'reicon-react/icons/CommentDots';
import ReiconCompass from 'reicon-react/icons/Compass';
import ReiconDocumentText from 'reicon-react/icons/DocumentText';
import ReiconDownload from 'reicon-react/icons/Download';
import ReiconEnvelope from 'reicon-react/icons/Envelope';
import ReiconEye from 'reicon-react/icons/Eye';
import ReiconFilter from 'reicon-react/icons/Filter';
import ReiconFlame from 'reicon-react/icons/Flame';
import ReiconFlag from 'reicon-react/icons/Flag';
import ReiconFlask from 'reicon-react/icons/Flask';
import ReiconGraduationCap from 'reicon-react/icons/GraduationCap';
import ReiconGrid from 'reicon-react/icons/Grid';
import ReiconHeart from 'reicon-react/icons/Heart';
import ReiconHelpCircle from 'reicon-react/icons/HelpCircle';
import ReiconHistory from 'reicon-react/icons/History';
import ReiconHome from 'reicon-react/icons/Home';
import ReiconHouse from 'reicon-react/icons/House';
import ReiconLanguage from 'reicon-react/icons/Language';
import ReiconLibrary from 'reicon-react/icons/Library';
import ReiconLightbulb from 'reicon-react/icons/Lightbulb';
import ReiconLink from 'reicon-react/icons/Link';
import ReiconList from 'reicon-react/icons/List';
import ReiconLocation from 'reicon-react/icons/Location';
import ReiconMessageSquare from 'reicon-react/icons/MessageSquare';
import ReiconMinus from 'reicon-react/icons/Minus';
import ReiconMobile from 'reicon-react/icons/Mobile';
import ReiconMoon from 'reicon-react/icons/Moon';
import ReiconMoreH from 'reicon-react/icons/MoreH';
import ReiconPenSquare from 'reicon-react/icons/PenSquare';
import ReiconPin from 'reicon-react/icons/Pin';
import ReiconPlus from 'reicon-react/icons/Plus';
import ReiconRefresh from 'reicon-react/icons/Refresh';
import ReiconSave from 'reicon-react/icons/Save';
import ReiconSearch from 'reicon-react/icons/Search';
import ReiconSettings from 'reicon-react/icons/Settings';
import ReiconShare from 'reicon-react/icons/Share';
import ReiconSledgehammer from 'reicon-react/icons/Sledgehammer';
import ReiconSliders from 'reicon-react/icons/Sliders';
import ReiconSparkle from 'reicon-react/icons/Sparkle';
import ReiconStar from 'reicon-react/icons/Star';
import ReiconSun from 'reicon-react/icons/Sun';
import ReiconTrash2 from 'reicon-react/icons/Trash2';
import ReiconThumbsUp from 'reicon-react/icons/ThumbsUp';
import ReiconThumbsDown from 'reicon-react/icons/ThumbsDown';
import ReiconUser from 'reicon-react/icons/User';
import ReiconUserCircle from 'reicon-react/icons/UserCircle';
import ReiconUsers from 'reicon-react/icons/Users';
import ReiconX from 'reicon-react/icons/X';

export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  weight?: 'Outline' | 'Fill' | 'Filled';
}

/**
 * Reicon draws its outline weight at 1.5. The site renders most glyphs at 14-18px
 * on translucent glass, where 1.5 loses definition, so the weight is nudged once
 * here instead of being re-tuned at every call site. Reicon supports this through
 * its strokeWidth prop rather than by replacing the artwork.
 */
const SITE_STROKE_WIDTH = 1.6;

const siteIcon = (ReiconIcon: IconComponent, displayName: string): React.FC<IconProps> => {
  const SiteIcon: React.FC<IconProps> = ({ className, style, weight = 'Outline' }) => {
    const reiconWeight = weight === 'Fill' ? 'Filled' : weight;
    return (
      <ReiconIcon
        className={className}
        style={style}
        weight={reiconWeight}
        strokeWidth={SITE_STROKE_WIDTH}
        aria-hidden={true}
        focusable={false}
      />
    );
  };

  SiteIcon.displayName = displayName;
  return SiteIcon;
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

/*
 * Icon row for the app screen switcher. One glyph per screen, drawn from the
 * same Reicon set the rest of the page uses, so the switcher reads as part of
 * the site rather than as a second icon language imported from the app build.
 */
export const HomeScreenIcon = siteIcon(ReiconHome, 'HomeScreenIcon');
export const ComposeScreenIcon = siteIcon(ReiconPenSquare, 'ComposeScreenIcon');
export const ThreadScreenIcon = siteIcon(ReiconCommentDots, 'ThreadScreenIcon');
export const CourseScreenIcon = siteIcon(ReiconGraduationCap, 'CourseScreenIcon');
export const WikiScreenIcon = siteIcon(ReiconBookOpen, 'WikiScreenIcon');
export const CampusScreenIcon = siteIcon(ReiconCalendarDays, 'CampusScreenIcon');
export const ProfileScreenIcon = siteIcon(ReiconUserCircle, 'ProfileScreenIcon');
export const UserCircleIcon = siteIcon(ReiconUserCircle, 'UserCircleIcon');
export const ChatScreenIcon = siteIcon(ReiconChatRoundDots, 'ChatScreenIcon');
export const NotificationScreenIcon = siteIcon(ReiconBell, 'NotificationScreenIcon');
export const WidgetsScreenIcon = siteIcon(ReiconGrid, 'WidgetsScreenIcon');

const SolidStarPath = 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';
const SolidHeartPath = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
const SolidBookmarkPath = 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';

const solidOrSiteIcon = (
  ReiconIcon: IconComponent,
  solidPath: string,
  displayName: string,
): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({ className, style, weight = 'Outline' }) => {
    if (weight === 'Fill' || weight === 'Filled') {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={className}
          style={style}
          aria-hidden={true}
          focusable={false}
        >
          <path d={solidPath} />
        </svg>
      );
    }
    return (
      <ReiconIcon
        className={className}
        style={style}
        weight="Outline"
        strokeWidth={SITE_STROKE_WIDTH}
        aria-hidden={true}
        focusable={false}
      />
    );
  };
  Icon.displayName = displayName;
  return Icon;
};

/*
 * Icons for the YourTJHub previews. The product draws its own icons from
 * Lucide; these are the closest Reicon equivalents, so the mock speaks the
 * site's icon language instead of shipping a second set. Names stay semantic
 * (BookIcon, not BookOpen) for the same reason as above.
 */
export const SearchIcon = siteIcon(ReiconSearch, 'SearchIcon');
export const StarIcon = solidOrSiteIcon(ReiconStar, SolidStarPath, 'StarIcon');
export const BookmarkIcon = solidOrSiteIcon(ReiconBookmark, SolidBookmarkPath, 'BookmarkIcon');
export const EyeIcon = siteIcon(ReiconEye, 'EyeIcon');
export const CommentIcon = siteIcon(ReiconMessageSquare, 'CommentIcon');
export const GridIcon = siteIcon(ReiconGrid, 'GridIcon');
export const ListIcon = siteIcon(ReiconList, 'ListIcon');
export const RefreshIcon = siteIcon(ReiconRefresh, 'RefreshIcon');
export const LibraryIcon = siteIcon(ReiconLibrary, 'LibraryIcon');
export const DownloadIcon = siteIcon(ReiconDownload, 'DownloadIcon');
export const AlertIcon = siteIcon(ReiconAlertCircle, 'AlertIcon');
export const HistoryIcon = siteIcon(ReiconHistory, 'HistoryIcon');
export const ShareIcon = siteIcon(ReiconShare, 'ShareIcon');
export const CompassIcon = siteIcon(ReiconCompass, 'CompassIcon');
export const BulbIcon = siteIcon(ReiconLightbulb, 'BulbIcon');
export const UsersIcon = siteIcon(ReiconUsers, 'UsersIcon');
export const PinIcon = siteIcon(ReiconPin, 'PinIcon');
export const FilterIcon = siteIcon(ReiconFilter, 'FilterIcon');
export const SlidersIcon = siteIcon(ReiconSliders, 'SlidersIcon');
export const CloseIcon = siteIcon(ReiconX, 'CloseIcon');
export const HouseIcon = siteIcon(ReiconHouse, 'HouseIcon');
export const FlameIcon = siteIcon(ReiconFlame, 'FlameIcon');
export const ActivityIcon = siteIcon(ReiconActivity, 'ActivityIcon');
export const SparklesIcon = siteIcon(ReiconSparkle, 'SparklesIcon');
export const BookIcon = siteIcon(ReiconBookOpen, 'BookIcon');
export const CalendarIcon = siteIcon(ReiconCalendar, 'CalendarIcon');
export const LinkIcon = siteIcon(ReiconLink, 'LinkIcon');
export const HeartIcon = solidOrSiteIcon(ReiconHeart, SolidHeartPath, 'HeartIcon');
export const ArrowRightIcon = siteIcon(ReiconArrowRight, 'ArrowRightIcon');
export const ChevronDownIcon = siteIcon(ReiconChevronDown, 'ChevronDownIcon');
export const FileTextIcon = siteIcon(ReiconDocumentText, 'FileTextIcon');
export const PlusIcon = siteIcon(ReiconPlus, 'PlusIcon');
export const MinusIcon = siteIcon(ReiconMinus, 'MinusIcon');
export const BellIcon = siteIcon(ReiconBell, 'BellIcon');
export const HelpIcon = siteIcon(ReiconHelpCircle, 'HelpIcon');
export const SaveIcon = siteIcon(ReiconSave, 'SaveIcon');
export const TrashIcon = siteIcon(ReiconTrash2, 'TrashIcon');
export const ArchiveIcon = siteIcon(ReiconArchive, 'ArchiveIcon');
export const SettingsIcon = siteIcon(ReiconSettings, 'SettingsIcon');
export const UserIcon = siteIcon(ReiconUser, 'UserIcon');
export const WarningIcon = siteIcon(ReiconAlertTriangle, 'WarningIcon');
export const ThumbsUpIcon = siteIcon(ReiconThumbsUp, 'ThumbsUpIcon');
export const ThumbsDownIcon = siteIcon(ReiconThumbsDown, 'ThumbsDownIcon');
export const FlagIcon = siteIcon(ReiconFlag, 'FlagIcon');

/*
 * Schedule-preview glyphs whose product (Lucide) names have no Reicon twin, so
 * the nearest equivalent stands in: Location for MapPin, MoreH for
 * MoreHorizontal, Sledgehammer for Hammer and CalendarEdit for CalendarCog.
 */
export const MapPinIcon = siteIcon(ReiconLocation, 'MapPinIcon');
export const MoreIcon = siteIcon(ReiconMoreH, 'MoreIcon');
export const HammerIcon = siteIcon(ReiconSledgehammer, 'HammerIcon');
export const CalendarCogIcon = siteIcon(ReiconCalendarEdit, 'CalendarCogIcon');

/**
 * Official QQ Brand Icon from theSVG (https://thesvg.org/icon/qq)
 * Adapts between light and dark modes:
 * - Color variant: official QQ blue (#1EBAFC) in light mode, cyber cyan (#38bdf8) in dark mode
 * - Mono variant: dark (#1b1f23) in light mode, white (#ffffff) in dark mode
 */
export const QQIcon: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  variant?: 'color' | 'mono';
  style?: React.CSSProperties;
}> = ({ className = 'h-5 w-5', theme, variant = 'color', style }) => {
  const isDark = theme === 'dark';
  const fill =
    variant === 'mono'
      ? isDark
        ? '#ffffff'
        : '#1b1f23'
      : isDark
      ? '#38bdf8'
      : '#1EBAFC';

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <title>QQ</title>
      <path
        fill={theme ? fill : 'currentColor'}
        className={!theme ? 'fill-[#1EBAFC] dark:fill-[#38bdf8]' : undefined}
        d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"
      />
    </svg>
  );
};

/**
 * Official Telegram Brand Icon from theSVG (https://thesvg.org/icon/telegram)
 * Adapts between light and dark modes:
 * - Color variant: Official Telegram circular gradient (#2AABEE to #229ED9) with white paper plane
 * - Mono variant: #229ED9 in light mode, #ffffff in dark mode
 */
export const TelegramIcon: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  variant?: 'color' | 'mono';
  style?: React.CSSProperties;
}> = ({ className = 'h-5 w-5', theme, variant = 'color', style }) => {
  const isDark = theme === 'dark';

  if (variant === 'mono') {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        aria-hidden="true"
        focusable="false"
      >
        <title>Telegram</title>
        <path
          fill={isDark ? '#ffffff' : theme === 'light' ? '#229ED9' : 'currentColor'}
          className={!theme ? 'fill-[#229ED9] dark:fill-white' : undefined}
          d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="thesvg-telegram-grad" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#38bdf8' : '#2AABEE'} />
          <stop offset="100%" stopColor={isDark ? '#0284c7' : '#229ED9'} />
        </linearGradient>
      </defs>
      <path
        fill="url(#thesvg-telegram-grad)"
        d="M128 0C94.06 0 61.48 13.494 37.5 37.49A128.038 128.038 0 0 0 0 128c0 33.934 13.5 66.514 37.5 90.51C61.48 242.506 94.06 256 128 256s66.52-13.494 90.5-37.49c24-23.996 37.5-56.576 37.5-90.51 0-33.934-13.5-66.514-37.5-90.51C194.52 13.494 161.94 0 128 0Z"
      />
      <path
        fill="#FFFFFF"
        d="M57.94 126.648c37.32-16.256 62.2-26.974 74.64-32.152 35.56-14.786 42.94-17.354 47.76-17.441 1.06-.017 3.42.245 4.96 1.49 1.28 1.05 1.64 2.47 1.82 3.467.16.996.38 3.266.2 5.038-1.92 20.24-10.26 69.356-14.5 92.026-1.78 9.592-5.32 12.808-8.74 13.122-7.44.684-13.08-4.912-20.28-9.63-11.26-7.386-17.62-11.982-28.56-19.188-12.64-8.328-4.44-12.906 2.76-20.386 1.88-1.958 34.64-31.748 35.26-34.45.08-.338.16-1.598-.6-2.262-.74-.666-1.84-.438-2.64-.258-1.14.256-19.12 12.152-54 35.686-5.1 3.508-9.72 5.218-13.88 5.128-4.56-.098-13.36-2.584-19.9-4.708-8-2.606-14.38-3.984-13.82-8.41.28-2.304 3.46-4.662 9.52-7.072Z"
      />
    </svg>
  );
};
/**
 * Official Apple Brand Icon from theSVG (https://thesvg.org/icon/apple)
 * In light mode: dark silhouette. In dark mode: white silhouette.
 */
export const AppleIcon: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  style?: React.CSSProperties;
}> = ({ className = 'h-5 w-5', theme, style }) => {
  const isDark = theme === 'dark';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 814 1000"
      className={className}
      style={style}
      fill={isDark ? '#ffffff' : theme === 'light' ? '#000000' : 'currentColor'}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  );
};

/**
 * Official Android Brand Icon from theSVG (https://thesvg.org/icon/android)
 * In light mode: official Android green with dark accents.
 * In dark mode: luminous green with dark accents.
 */
export const AndroidIcon: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  variant?: 'color' | 'mono';
  style?: React.CSSProperties;
}> = ({ className = 'h-5 w-5', theme, variant = 'color', style }) => {
  const isDark = theme === 'dark';
  if (variant === 'mono') {
    return (
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        fill={isDark ? '#ffffff' : theme === 'light' ? '#000000' : 'currentColor'}
        aria-hidden="true"
        focusable="false"
      >
        <path d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 150"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill={isDark ? '#3ddc84' : '#34a853'}
        d="M255.285 143.47c-.084-.524-.164-1.042-.251-1.56a128.119 128.119 0 0 0-12.794-38.288 128.778 128.778 0 0 0-23.45-31.86 129.166 129.166 0 0 0-22.713-18.005c.049-.08.09-.168.14-.25 2.582-4.461 5.172-8.917 7.755-13.38l7.576-13.068c1.818-3.126 3.632-6.26 5.438-9.386a11.776 11.776 0 0 0 .662-10.484 11.668 11.668 0 0 0-4.823-5.536 11.85 11.85 0 0 0-5.004-1.61 11.963 11.963 0 0 0-2.218.018 11.738 11.738 0 0 0-8.968 5.798c-1.814 3.127-3.628 6.26-5.438 9.386l-7.576 13.069c-2.583 4.462-5.173 8.918-7.755 13.38-.282.487-.567.973-.848 1.467-.392-.157-.78-.313-1.172-.462-14.24-5.43-29.688-8.4-45.836-8.4-.442 0-.879 0-1.324.006-14.357.143-28.152 2.64-41.022 7.12a119.434 119.434 0 0 0-4.42 1.642c-.262-.455-.532-.911-.79-1.367-2.583-4.462-5.173-8.918-7.755-13.38L65.123 15.25c-1.818-3.126-3.632-6.259-5.439-9.386A11.736 11.736 0 0 0 48.5.048 11.71 11.71 0 0 0 43.49 1.66a11.716 11.716 0 0 0-4.077 4.063c-.281.474-.532.967-.742 1.473a11.808 11.808 0 0 0-.365 8.188c.259.786.594 1.554 1.023 2.296a3973.32 3973.32 0 0 1 5.439 9.386c2.53 4.357 5.054 8.713 7.58 13.069 2.582 4.462 5.168 8.918 7.75 13.38.02.038.046.075.065.112A129.184 129.184 0 0 0 45.32 64.38a129.693 129.693 0 0 0-22.2 24.015 127.737 127.737 0 0 0-9.34 15.24 128.238 128.238 0 0 0-10.843 28.764 130.743 130.743 0 0 0-1.951 9.524c-.087.518-.167 1.042-.247 1.56A124.978 124.978 0 0 0 0 149.118h256c-.205-1.891-.449-3.77-.734-5.636l.019-.012Z"
      />
      <path
        fill={isDark ? '#18181b' : '#202124'}
        d="M194.59 113.712c5.122-3.41 5.867-11.3 1.661-17.62-4.203-6.323-11.763-8.682-16.883-5.273-5.122 3.41-5.868 11.3-1.662 17.621 4.203 6.322 11.764 8.682 16.883 5.272ZM78.518 108.462c4.206-6.321 3.46-14.21-1.662-17.62-5.123-3.41-12.68-1.05-16.886 5.27-4.203 6.323-3.458 14.212 1.662 17.622 5.122 3.41 12.683 1.05 16.886-5.272Z"
      />
    </svg>
  );
};

/**
 * Official GitHub Brand Icon from theSVG (https://thesvg.org/icon/github)
 * Adapts between light and dark modes:
 * - light: light.svg (#1b1f23)
 * - dark: dark.svg (#ffffff)
 */
export const GithubIcon: React.FC<{
  className?: string;
  theme?: 'light' | 'dark';
  style?: React.CSSProperties;
}> = ({ className = 'h-5 w-5', theme, style }) => {
  const isDark = theme === 'dark';
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <title>GitHub</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isDark ? '#ffffff' : theme === 'light' ? '#1b1f23' : 'currentColor'}
        className={!theme ? 'fill-[#1b1f23] dark:fill-white' : undefined}
        d="M512 0C229.12 0 0 229.12 0 512c0 226.56 146.56 417.92 350.08 485.76 25.6 4.48 35.2-10.88 35.2-24.32 0-12.16-.64-52.48-.64-95.36-128.64 23.68-161.92-31.36-172.16-60.16-5.76-14.72-30.72-60.16-52.48-72.32-17.92-9.6-43.52-33.28-.64-33.92 40.32-.64 69.12 37.12 78.72 52.48 46.08 77.44 119.68 55.68 149.12 42.24 4.48-33.28 17.92-55.68 32.64-68.48-113.92-12.8-232.96-56.96-232.96-252.8 0-55.68 19.84-101.76 52.48-137.6-5.12-12.8-23.04-65.28 5.12-135.68 0 0 42.88-13.44 140.8 52.48 40.96-11.52 84.48-17.28 128-17.28s87.04 5.76 128 17.28c97.92-66.56 140.8-52.48 140.8-52.48 28.16 70.4 10.24 122.88 5.12 135.68 32.64 35.84 52.48 81.28 52.48 137.6 0 196.48-119.68 240-233.6 252.8 18.56 16 34.56 46.72 34.56 94.72 0 68.48-.64 123.52-.64 140.8 0 13.44 9.6 29.44 35.2 24.32C877.44 929.92 1024 737.92 1024 512 1024 229.12 794.88 0 512 0"
      />
    </svg>
  );
};
