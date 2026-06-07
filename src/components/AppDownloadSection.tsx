import React from 'react';

const IOS_TESTFLIGHT_URL = 'https://testflight.apple.com/join/KkBg6quW';
const IOS_ISSUES_URL = 'https://github.com/YourTongji/YourTJCourse-iOS/issues';
const ANDROID_RELEASE_URL = 'https://github.com/YourTongji/YourTJCourse-Flutter/releases/tag/dev-latest';
const ANDROID_ACCELERATED_APK_URL =
  'https://gh-proxy.com/https://github.com/YourTongji/YourTJCourse-Flutter/releases/download/dev-latest/app-arm64-v8a-release.apk';
const ANDROID_ISSUES_URL = 'https://github.com/YourTongji/YourTJCourse-Flutter/issues';

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M16.7 13.1c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.2-2.5 1.2-2.6 0 0-2.7-1-2.7-3.9Zm-2.2-6.6c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.7 1.3-.6.7-1.1 1.8-1 2.8 1 .1 2-.5 2.8-1.2Z" />
  </svg>
);

const AndroidIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7.5 9.5h9v7.25a2.25 2.25 0 0 1-2.25 2.25h-4.5a2.25 2.25 0 0 1-2.25-2.25V9.5Z"
      fill="currentColor"
    />
    <path
      d="M8 8.5c.45-2 2-3.5 4-3.5s3.55 1.5 4 3.5H8Z"
      fill="currentColor"
    />
    <path d="M8.5 4 7 2.5M15.5 4 17 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M5.5 10.5v5M18.5 10.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 7h.01M14 7h.01" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 4v10m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const FeedbackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M6 17.5 4 21l4-1.4c1.1.5 2.4.9 3.8.9 4.4 0 8-3 8-6.8s-3.6-6.8-8-6.8-8 3-8 6.8c0 1.5.6 2.9 1.7 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8.5 13h7M8.5 10.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ReleaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7 7.5h10M7 12h10M7 16.5h6"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M5.5 3.5h13A1.5 1.5 0 0 1 20 5v14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5a1.5 1.5 0 0 1 1.5-1.5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

interface AppCardProps {
  platform: string;
  title: string;
  downloadLabel: string;
  downloadUrl: string;
  issuesUrl: string;
  icon: React.ReactNode;
  badge?: string;
  secondaryDownloadLabel?: string;
  secondaryDownloadUrl?: string;
  accentClass: string;
}

const AppCard: React.FC<AppCardProps> = ({
  platform,
  title,
  downloadLabel,
  downloadUrl,
  issuesUrl,
  icon,
  badge,
  secondaryDownloadLabel,
  secondaryDownloadUrl,
  accentClass,
}) => (
  <article className="relative h-full rounded-sm border border-stone-100 dark:border-wabi-dark-stone bg-white/92 dark:bg-wabi-dark-subtle/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-goose-blue-950/30">
    <div className={`absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-2 ${accentClass} opacity-80 shadow-sm`} />
    <div className="relative flex h-full flex-col items-center p-5 text-center md:p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-wabi-subtle dark:bg-wabi-dark-stone text-wabi-text dark:text-wabi-dark-text shadow-inner ring-4 ring-white/75 dark:ring-wabi-dark-paper/50">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-goose-blue-700 dark:text-goose-blue-300">
            {platform}
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-wabi-text dark:text-wabi-dark-text">
            {title}
          </h2>
          {badge && (
            <span className="mt-2 inline-flex rounded-full border border-amber-300/70 bg-amber-100/80 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-200">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div
        className={`mt-6 grid w-full grid-cols-1 gap-3 ${
          secondaryDownloadUrl ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
        }`}
      >
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-goose-blue-600 px-4 py-2 text-sm font-extrabold text-white shadow-sm transition-all duration-200 hover:bg-goose-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-goose-blue-400/40"
        >
          <DownloadIcon className="h-4 w-4" />
          {downloadLabel}
        </a>
        {secondaryDownloadUrl && (
          <a
            href={secondaryDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-extrabold text-wabi-text shadow-sm transition-all duration-200 hover:border-goose-blue-300 hover:text-goose-blue-700 dark:border-wabi-dark-stone dark:bg-wabi-dark-paper/40 dark:text-wabi-dark-text dark:hover:border-goose-blue-500 dark:hover:text-goose-blue-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-goose-blue-400/40"
          >
            <ReleaseIcon className="h-4 w-4" />
            {secondaryDownloadLabel}
          </a>
        )}
        <a
          href={issuesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-extrabold text-wabi-text shadow-sm transition-all duration-200 hover:border-goose-blue-300 hover:text-goose-blue-700 dark:border-wabi-dark-stone dark:bg-wabi-dark-paper/40 dark:text-wabi-dark-text dark:hover:border-goose-blue-500 dark:hover:text-goose-blue-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-goose-blue-400/40"
        >
          <FeedbackIcon className="h-4 w-4" />
          反馈问题
        </a>
      </div>
    </div>
  </article>
);

export const AppDownloadSection: React.FC = () => (
  <section id="app-download" className="w-full max-w-6xl scroll-mt-10 px-4 mt-16 md:mt-20 animate-fade-in-up">
    <div className="mb-6 flex flex-col gap-2 text-center">
      <p className="font-hand text-lg font-bold tracking-wide text-goose-blue-700 dark:text-goose-blue-300">
        Mobile Apps
      </p>
      <h2 className="text-3xl font-extrabold tracking-tight text-wabi-text dark:text-wabi-dark-text">
        YourTJ 选课社区移动端
      </h2>
      <p className="mx-auto max-w-2xl text-sm leading-7 text-wabi-muted dark:text-wabi-dark-muted">
        在手机上查看课程、评课和模拟排课。测试阶段欢迎直接反馈到对应项目。
      </p>
    </div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <AppCard
        platform="iOS"
        title="TestFlight 测试版"
        downloadLabel="前往 TestFlight"
        downloadUrl={IOS_TESTFLIGHT_URL}
        issuesUrl={IOS_ISSUES_URL}
        icon={<AppleIcon className="h-8 w-8" />}
        accentClass="bg-blue-100 dark:bg-blue-200"
      />
      <AppCard
        platform="Android"
        title="Flutter 安卓测试版"
        downloadLabel="国内加速下载"
        downloadUrl={ANDROID_ACCELERATED_APK_URL}
        secondaryDownloadLabel="更多架构"
        secondaryDownloadUrl={ANDROID_RELEASE_URL}
        issuesUrl={ANDROID_ISSUES_URL}
        icon={<AndroidIcon className="h-9 w-9 text-[#3DDC84]" />}
        badge="测试版本，不代表最终品质"
        accentClass="bg-green-100 dark:bg-green-200"
      />
    </div>
  </section>
);
