import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Locale = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'de';

export const LOCALES: Array<{
  value: Locale;
  label: string;
  shortLabel: string;
}> = [
  { value: 'zh-CN', label: '简体中文', shortLabel: '简' },
  { value: 'zh-TW', label: '繁體中文', shortLabel: '繁' },
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'ja', label: '日本語', shortLabel: '日' },
  { value: 'de', label: 'Deutsch', shortLabel: 'DE' },
];

type Dictionary = Record<string, string>;

const zhCN: Dictionary = {
  'meta.title': 'YourTJ - 同济大学学生社区',
  'meta.description': 'YourTJ 是同济大学学生社区。论坛讨论、课程课评、校园知识库，都在 YourTJHub。',
  'a11y.skip': '跳到主要内容',
  'nav.homeAria': 'YourTJ 首页',
  'nav.primary': '主导航',
  'nav.getApp': '获取 App',
  'nav.hub': 'YourTJHub',
  'nav.language': '选择语言',
  'theme.toDark': '切换到深色模式',
  'theme.toLight': '切换到浅色模式',
  'hero.headline.1': '连接校园，',
  'hero.headline.2': '也连接每一种可能',
  'app.title': 'YourTJ 社区 App',
  'app.cta': '获取 YourTJ 社区 App',
  'app.comingSoon': '敬请期待',
  'app.comingSoonNote': 'YourTJ 社区 App 仍在开发中，暂未上架应用商店。正式发布后，下载入口将在本页提供。',
  'app.desc': 'YourTJ移动端一站式App，轻松阅览你的校园生活。',
  'app.ios': 'App Store 上架后提供',
  'app.android': '与 iOS 版本同期发布',
  'app.section.title': '获取 YourTJ 社区 App',
  'app.ios.cta': 'iOS 版本',
  'app.android.cta': 'Android 版本',
  'app.more': '版本发布记录',
  'app.feedback': '问题反馈',
  'app.note': '开发进度与技术细节见项目仓库。',
  'app.openStatus': '开发中，暂未发布',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': '面向同济校园的社区平台，以论坛沉淀长期有价值的信息与讨论。',
  'product.hub.status': '测试中',
  'product.hub.merged': '选课社区已并入 YourTJHub',
  'product.hub.module.course': '课程与选课',
  'product.hub.module.review': '评课讨论',
  'product.hub.module.schedule': '课表规划',
  'product.hub.module.wiki': '校园知识库',
  'preview.section.label': 'YourTJHub 产品预览',
  'preview.slide.hub.title': '论坛社交，济海泛舟',
  'preview.slide.course.title': '发现好课，共享信息',
  'preview.slide.schedule.title': '规划课表，轻松启程',
  'preview.slide.wiki.title': '共建文档，沉淀经验',
  'preview.visit': '前往体验',
  'preview.prev': '上一张',
  'preview.next': '下一张',
  'community.title': '加入社区',
  'community.desc': '有问题、想法或想参与共建，可以从这里找到我们。',
  'community.qq.label': 'QQ 群',
  'community.qq.note.missing': '群链接待补充',
  'community.qq.note.join': '加入 QQ 群',
  'community.telegram.label': 'Telegram 频道',
  'community.telegram.note.missing': '频道链接待补充',
  'community.telegram.note.join': '订阅频道更新',
  'community.email.label': '联系邮箱',
  'community.email.note.missing': '邮箱地址待补充',
  'community.email.note.join': '发送邮件',
  'community.github.label': 'GitHub 组织',
  'community.github.note': '浏览开源项目与代码',
  'footer.copy': '© {year} YourTJ 社区',
  'footer.tagline': 'Made by students, for students.',
};

const zhTW: Dictionary = {
  'meta.title': 'YourTJ - 同濟大學學生社群',
  'meta.description': 'YourTJ 是同濟大學學生社群。論壇討論、課程課評、校園知識庫，都在 YourTJHub。',
  'a11y.skip': '跳到主要內容',
  'nav.homeAria': 'YourTJ 首頁',
  'nav.primary': '主導覽',
  'nav.getApp': '取得 App',
  'nav.hub': 'YourTJHub',
  'nav.language': '選擇語言',
  'theme.toDark': '切換到深色模式',
  'theme.toLight': '切換到淺色模式',
  'hero.headline.1': '連結校園，',
  'hero.headline.2': '也連結每一種可能',
  'app.title': 'YourTJ 社群 App',
  'app.cta': '取得 YourTJ 社群 App',
  'app.comingSoon': '敬請期待',
  'app.comingSoonNote': 'YourTJ 社群 App 仍在開發中，尚未上架應用商店。正式發布後，下載入口將於本頁提供。',
  'app.desc': 'YourTJ行動端一站式App，輕鬆閱覽你的校園生活。',
  'app.ios': 'App Store 上架後提供',
  'app.android': '與 iOS 版本同期發布',
  'app.section.title': '取得 YourTJ 社群 App',
  'app.ios.cta': 'iOS 版本',
  'app.android.cta': 'Android 版本',
  'app.more': '版本發布記錄',
  'app.feedback': '問題回報',
  'app.note': '開發進度與技術細節見專案倉庫。',
  'app.openStatus': '開發中，暫未發布',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': '面向同濟校園的社群平台，以論壇沉澱長期有價值的資訊與討論。',
  'product.hub.status': '測試中',
  'product.hub.merged': '選課社群已併入 YourTJHub',
  'product.hub.module.course': '課程與選課',
  'product.hub.module.review': '評課討論',
  'product.hub.module.schedule': '課表規劃',
  'product.hub.module.wiki': '校園知識庫',
  'preview.section.label': 'YourTJHub 產品預覽',
  'preview.slide.hub.title': '論壇社交，濟海泛舟',
  'preview.slide.course.title': '發現好課，共享資訊',
  'preview.slide.schedule.title': '規劃課表，輕鬆啟程',
  'preview.slide.wiki.title': '共建文件，沉澱經驗',
  'preview.visit': '前往體驗',
  'preview.prev': '上一張',
  'preview.next': '下一張',
  'community.title': '加入社群',
  'community.desc': '有問題、想法或想參與共建，都可以在這裡找到我們。',
  'community.qq.label': 'QQ 群',
  'community.qq.note.missing': '群組連結待補充',
  'community.qq.note.join': '加入 QQ 群',
  'community.telegram.label': 'Telegram 頻道',
  'community.telegram.note.missing': '頻道連結待補充',
  'community.telegram.note.join': '訂閱頻道更新',
  'community.email.label': '聯絡信箱',
  'community.email.note.missing': '信箱地址待補充',
  'community.email.note.join': '寄送郵件',
  'community.github.label': 'GitHub 組織',
  'community.github.note': '瀏覽開源專案與程式碼',
  'footer.copy': '© {year} YourTJ 社群',
  'footer.tagline': '由學生打造，為學生服務。',
};

const en: Dictionary = {
  'meta.title': 'YourTJ - Tongji University Student Community',
  'meta.description': 'YourTJ is the Tongji University student community. Forum threads, course reviews and the campus wiki all live in YourTJHub.',
  'a11y.skip': 'Skip to main content',
  'nav.homeAria': 'YourTJ home',
  'nav.primary': 'Primary navigation',
  'nav.getApp': 'Get the app',
  'nav.hub': 'YourTJHub',
  'nav.language': 'Choose language',
  'theme.toDark': 'Switch to dark mode',
  'theme.toLight': 'Switch to light mode',
  'hero.headline.1': 'Connecting campus,',
  'hero.headline.2': 'and every possibility.',
  'app.title': 'YourTJ App',
  'app.cta': 'Get the YourTJ app',
  'app.comingSoon': 'Coming soon',
  'app.comingSoonNote': 'The YourTJ app is still in development and is not available on any app store. Download links will be published on this page at release.',
  'app.desc': "YourTJ's all-in-one mobile app. Your campus life, easy to browse.",
  'app.ios': 'Available once it reaches the App Store',
  'app.android': 'Released alongside the iOS version',
  'app.section.title': 'Get the YourTJ App',
  'app.ios.cta': 'iOS',
  'app.android.cta': 'Android',
  'app.more': 'Release notes',
  'app.feedback': 'Report an issue',
  'app.note': 'Development progress and technical details are tracked in the project repository.',
  'app.openStatus': 'In development, not yet released',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': 'A Tongji campus community platform that preserves long-term value through forum discussions.',
  'product.hub.status': 'In testing',
  'product.hub.merged': 'The course community is now part of YourTJHub',
  'product.hub.module.course': 'Courses',
  'product.hub.module.review': 'Reviews',
  'product.hub.module.schedule': 'Timetable',
  'product.hub.module.wiki': 'Campus wiki',
  'preview.section.label': 'YourTJHub product preview',
  'preview.slide.hub.title': 'The campus forum for lasting conversations',
  'preview.slide.course.title': 'Discover courses, share insights',
  'preview.slide.schedule.title': 'Plan your timetable with ease',
  'preview.slide.wiki.title': 'Docs built together, knowledge that stays',
  'preview.visit': 'Visit site',
  'preview.prev': 'Previous slide',
  'preview.next': 'Next slide',
  'community.title': 'Join the community',
  'community.desc': 'Questions, ideas or contributions, find us here.',
  'community.qq.label': 'QQ group',
  'community.qq.note.missing': 'Group link coming soon',
  'community.qq.note.join': 'Join the QQ group',
  'community.telegram.label': 'Telegram channel',
  'community.telegram.note.missing': 'Channel link coming soon',
  'community.telegram.note.join': 'Subscribe to updates',
  'community.email.label': 'Contact email',
  'community.email.note.missing': 'Email address coming soon',
  'community.email.note.join': 'Send an email',
  'community.github.label': 'GitHub organization',
  'community.github.note': 'Browse open-source projects',
  'footer.copy': '© {year} YourTJ Community',
  'footer.tagline': 'Made by students, for students.',
};

const ja: Dictionary = {
  'meta.title': 'YourTJ - 同済大学学生コミュニティ',
  'meta.description': 'YourTJ は同済大学の学生コミュニティです。フォーラム、授業評価、キャンパス Wiki は YourTJHub に。',
  'a11y.skip': 'メインコンテンツへスキップ',
  'nav.homeAria': 'YourTJ ホーム',
  'nav.primary': 'メインナビゲーション',
  'nav.getApp': 'アプリを入手',
  'nav.hub': 'YourTJHub',
  'nav.language': '言語を選択',
  'theme.toDark': 'ダークモードに切り替え',
  'theme.toLight': 'ライトモードに切り替え',
  'hero.headline.1': 'キャンパスをつなぎ、',
  'hero.headline.2': 'あらゆる可能性へ。',
  'app.title': 'YourTJ App',
  'app.cta': 'YourTJ App を入手',
  'app.comingSoon': '近日公開',
  'app.comingSoonNote': 'YourTJ App は開発中で、まだ各ストアで公開されていません。公開時にダウンロード入口を本ページに掲載します。',
  'app.desc': 'YourTJ モバイル版オールインワン App で、キャンパスライフをもっと身近に。',
  'app.ios': 'App Store 公開後に提供',
  'app.android': 'iOS 版と同時期に公開',
  'app.section.title': 'YourTJ App を入手',
  'app.ios.cta': 'iOS',
  'app.android.cta': 'Android',
  'app.more': 'リリースノート',
  'app.feedback': '不具合の報告',
  'app.note': '開発の進捗と技術的な詳細はプロジェクトのリポジトリで公開しています。',
  'app.openStatus': '開発中・未公開',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': '同済大学キャンパスに向けたコミュニティプラットフォームです。フォーラムで長く価値のある情報と議論を積み重ねます。',
  'product.hub.status': 'テスト中',
  'product.hub.merged': '履修コミュニティは YourTJHub に統合されました',
  'product.hub.module.course': '授業と履修',
  'product.hub.module.review': '授業評価',
  'product.hub.module.schedule': '時間割',
  'product.hub.module.wiki': 'ナレッジベース',
  'preview.section.label': 'YourTJHub 製品プレビュー',
  'preview.slide.hub.title': 'フォーラムで語り合うキャンパス',
  'preview.slide.course.title': 'いい授業を見つけて、情報をシェア',
  'preview.slide.schedule.title': '時間割を整えて、余裕を持って',
  'preview.slide.wiki.title': 'みんなで作るナレッジベース',
  'preview.visit': '体験してみる',
  'preview.prev': '前のスライド',
  'preview.next': '次のスライド',
  'community.title': 'コミュニティに参加',
  'community.desc': '質問やアイデア、開発参加をお考えの方は、こちらからご連絡ください。',
  'community.qq.label': 'QQ グループ',
  'community.qq.note.missing': 'グループリンクは準備中',
  'community.qq.note.join': 'QQ グループに参加',
  'community.telegram.label': 'Telegram チャンネル',
  'community.telegram.note.missing': 'チャンネルリンクは準備中',
  'community.telegram.note.join': '更新情報を購読',
  'community.email.label': '連絡先メール',
  'community.email.note.missing': 'メールアドレスは準備中',
  'community.email.note.join': 'メールを送信',
  'community.github.label': 'GitHub 組織',
  'community.github.note': 'オープンソースプロジェクトを見る',
  'footer.copy': '© {year} YourTJ コミュニティ',
  'footer.tagline': '学生がつくる、学生のためのコミュニティ。',
};

const de: Dictionary = {
  'meta.title': 'YourTJ - Studierendencommunity der Tongji-Universität',
  'meta.description': 'YourTJ ist die Studierendencommunity der Tongji-Universität. Forum, Kursbewertungen und Campus-Wiki findest du in YourTJHub.',
  'a11y.skip': 'Zum Hauptinhalt springen',
  'nav.homeAria': 'YourTJ Startseite',
  'nav.primary': 'Hauptnavigation',
  'nav.getApp': 'App herunterladen',
  'nav.hub': 'YourTJHub',
  'nav.language': 'Sprache wählen',
  'theme.toDark': 'Zum dunklen Modus wechseln',
  'theme.toLight': 'Zum hellen Modus wechseln',
  'hero.headline.1': 'Verbinde den Campus',
  'hero.headline.2': 'mit jeder Möglichkeit.',
  'app.title': 'YourTJ App',
  'app.cta': 'YourTJ App holen',
  'app.comingSoon': 'Demnächst verfügbar',
  'app.comingSoonNote': 'Die YourTJ App befindet sich in Entwicklung und ist noch in keinem Store verfügbar. Die Download-Links erscheinen zum Release auf dieser Seite.',
  'app.desc': 'YourTJ als All-in-One-App fürs Handy. Dein Campus-Alltag, mühelos im Blick.',
  'app.ios': 'Verfügbar, sobald sie im App Store ist',
  'app.android': 'Erscheint zeitgleich mit der iOS-Version',
  'app.section.title': 'YourTJ App herunterladen',
  'app.ios.cta': 'iOS',
  'app.android.cta': 'Android',
  'app.more': 'Release-Notes',
  'app.feedback': 'Problem melden',
  'app.note': 'Entwicklungsstand und technische Details stehen im Projekt-Repository.',
  'app.openStatus': 'In Entwicklung, nicht veröffentlicht',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': 'Eine Campus-Plattform für Tongji, die wertvolle Informationen und Diskussionen langfristig im Forum bewahrt.',
  'product.hub.status': 'In der Testphase',
  'product.hub.merged': 'Die Kurs-Community ist jetzt Teil von YourTJHub',
  'product.hub.module.course': 'Kurse',
  'product.hub.module.review': 'Bewertungen',
  'product.hub.module.schedule': 'Stundenplan',
  'product.hub.module.wiki': 'Campus-Wiki',
  'preview.section.label': 'YourTJHub Produktvorschau',
  'preview.slide.hub.title': 'Campus-Forum für bleibende Gespräche',
  'preview.slide.course.title': 'Gute Kurse finden, Wissen teilen',
  'preview.slide.schedule.title': 'Stundenplan entspannt planen',
  'preview.slide.wiki.title': 'Dokumente gemeinsam aufbauen',
  'preview.visit': 'Ausprobieren',
  'preview.prev': 'Zurück',
  'preview.next': 'Weiter',
  'community.title': 'Community beitreten',
  'community.desc': 'Fragen, Ideen oder Lust mitzuwirken? Hier findest du uns.',
  'community.qq.label': 'QQ-Gruppe',
  'community.qq.note.missing': 'Gruppenlink folgt',
  'community.qq.note.join': 'QQ-Gruppe beitreten',
  'community.telegram.label': 'Telegram-Kanal',
  'community.telegram.note.missing': 'Kanallink folgt',
  'community.telegram.note.join': 'Updates abonnieren',
  'community.email.label': 'Kontakt-E-Mail',
  'community.email.note.missing': 'E-Mail-Adresse folgt',
  'community.email.note.join': 'E-Mail senden',
  'community.github.label': 'GitHub-Organisation',
  'community.github.note': 'Open-Source-Projekte ansehen',
  'footer.copy': '© {year} YourTJ Community',
  'footer.tagline': 'Von Studierenden, für Studierende.',
};

const DICTIONARIES: Record<Locale, Dictionary> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  en,
  ja,
  de,
};

const STORAGE_KEY = 'locale';

const isLocale = (value: string | null): value is Locale => Boolean(value && value in DICTIONARIES);

const detectLocale = (): Locale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // Storage unavailable.
  }

  const navigatorLanguage = navigator.language || 'zh-CN';
  if (/^zh/i.test(navigatorLanguage)) {
    return /tw|hk|mo|hant/i.test(navigatorLanguage) ? 'zh-TW' : 'zh-CN';
  }
  if (/^ja/i.test(navigatorLanguage)) return 'ja';
  if (/^de/i.test(navigatorLanguage)) return 'de';
  if (/^en/i.test(navigatorLanguage)) return 'en';
  return 'zh-CN';
};

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  useEffect(() => {
    const dictionary = DICTIONARIES[locale];
    document.documentElement.lang = locale;
    document.title = dictionary['meta.title'];

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', dictionary['meta.description']);

    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Storage unavailable.
    }
  }, [locale]);

  const t = useCallback(
    (key: string) => DICTIONARIES[locale][key] ?? DICTIONARIES['zh-CN'][key] ?? key,
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nValue => {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
};
