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
  'meta.description': 'YourTJ 是同济大学学生社区。进入选课社区，或下载 App，在手机上查看课程、评课和模拟排课。',
  'a11y.skip': '跳到主要内容',
  'nav.homeAria': 'YourTJ 首页',
  'nav.getApp': '获取 App',
  'nav.language': '选择语言',
  'theme.toDark': '切换到深色模式',
  'theme.toLight': '切换到浅色模式',
  'hero.headline.1': '连接校园，',
  'hero.headline.2': '也连接每一种可能',
  'app.title': 'YourTJ App',
  'app.testing': '移动端测试版',
  'app.desc': '在手机上查看课程、评课和模拟排课',
  'app.ios': 'iOS 公开测试',
  'app.android': 'Android 测试版',
  'app.apk': 'APK 国内加速',
  'app.section.title': '获取 YourTJ App',
  'app.ios.cta': 'iOS · TestFlight',
  'app.android.cta': 'Android · 下载 APK',
  'app.more': '更多架构',
  'app.feedback.ios': 'iOS 反馈',
  'app.feedback.android': 'Android 反馈',
  'app.note': 'Android 主按钮为国内加速下载，更多架构可前往 GitHub Release。测试版本，不代表最终品质。',
  'app.openStatus': '测试版本开放中',
  'app.feature.course': '课程查询',
  'app.feature.review': '评课参考',
  'app.feature.schedule': '模拟排课',
  'app.external': '外部下载与反馈页面',
  'product.course.title': 'YourTJ 选课社区',
  'product.course.description': '不记名，自由，简洁，高效的选课社区',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': '面向同济校园的社区平台，以论坛沉淀长期有价值的信息与讨论。',
  'product.hub.status': '敬请期待',
  'product.hub.unavailable': '，当前不可访问',
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
  'meta.description': 'YourTJ 是同濟大學學生社群。進入選課社群，或下載 App，在手機上查看課程、評課與模擬排課。',
  'a11y.skip': '跳到主要內容',
  'nav.homeAria': 'YourTJ 首頁',
  'nav.getApp': '取得 App',
  'nav.language': '選擇語言',
  'theme.toDark': '切換到深色模式',
  'theme.toLight': '切換到淺色模式',
  'hero.headline.1': '連結校園，',
  'hero.headline.2': '也連結每一種可能',
  'app.title': 'YourTJ App',
  'app.testing': '行動版測試中',
  'app.desc': '在手機上查看課程、評課與模擬排課',
  'app.ios': 'iOS 公開測試',
  'app.android': 'Android 測試版',
  'app.apk': 'APK 中國境內加速',
  'app.section.title': '取得 YourTJ App',
  'app.ios.cta': 'iOS · TestFlight',
  'app.android.cta': 'Android · 下載 APK',
  'app.more': '更多架構',
  'app.feedback.ios': 'iOS 意見回饋',
  'app.feedback.android': 'Android 意見回饋',
  'app.note': 'Android 主按鈕為中國境內加速下載，更多架構請前往 GitHub Release。測試版本，不代表最終品質。',
  'app.openStatus': '測試版本開放中',
  'app.feature.course': '課程查詢',
  'app.feature.review': '評課參考',
  'app.feature.schedule': '模擬排課',
  'app.external': '外部下載與意見回饋頁面',
  'product.course.title': 'YourTJ 選課社群',
  'product.course.description': '不記名、自由、簡潔、高效的選課社群',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': '面向同濟校園的社群平台，以論壇沉澱長期有價值的資訊與討論。',
  'product.hub.status': '敬請期待',
  'product.hub.unavailable': '，目前無法使用',
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
  'meta.description': 'YourTJ is the Tongji student community. Browse the course community, or download the app to check courses, reviews and schedule planning on your phone.',
  'a11y.skip': 'Skip to main content',
  'nav.homeAria': 'YourTJ home',
  'nav.getApp': 'Get the app',
  'nav.language': 'Choose language',
  'theme.toDark': 'Switch to dark mode',
  'theme.toLight': 'Switch to light mode',
  'hero.headline.1': 'Connecting campus,',
  'hero.headline.2': 'and every possibility.',
  'app.title': 'YourTJ App',
  'app.testing': 'Mobile beta',
  'app.desc': 'Check courses, reviews and schedule planning on your phone.',
  'app.ios': 'iOS public beta',
  'app.android': 'Android beta',
  'app.apk': 'APK with China acceleration',
  'app.section.title': 'Get the YourTJ App',
  'app.ios.cta': 'iOS · TestFlight',
  'app.android.cta': 'Android · Download APK',
  'app.more': 'More architectures',
  'app.feedback.ios': 'iOS feedback',
  'app.feedback.android': 'Android feedback',
  'app.note': 'The main Android button uses a China-accelerated download. More architectures are available on GitHub Release. Beta quality only.',
  'app.openStatus': 'Beta now open',
  'app.feature.course': 'Course search',
  'app.feature.review': 'Course reviews',
  'app.feature.schedule': 'Schedule planning',
  'app.external': 'External download and feedback',
  'product.course.title': 'YourTJ Course Community',
  'product.course.description': 'Anonymous, free, simple and efficient course selection.',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': 'A Tongji campus community platform that preserves long-term value through forum discussions.',
  'product.hub.status': 'Coming soon',
  'product.hub.unavailable': ', not available yet',
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
  'meta.description': 'YourTJは同済大学の学生コミュニティです。履修コミュニティを利用したり、アプリで授業・評価・時間割シミュレーションを確認できます。',
  'a11y.skip': 'メインコンテンツへスキップ',
  'nav.homeAria': 'YourTJ ホーム',
  'nav.getApp': 'アプリを入手',
  'nav.language': '言語を選択',
  'theme.toDark': 'ダークモードに切り替え',
  'theme.toLight': 'ライトモードに切り替え',
  'hero.headline.1': 'キャンパスをつなぎ、',
  'hero.headline.2': 'あらゆる可能性へ。',
  'app.title': 'YourTJ App',
  'app.testing': 'モバイルベータ版',
  'app.desc': 'スマホで授業、授業評価、時間割シミュレーションを確認できます。',
  'app.ios': 'iOS 公開テスト',
  'app.android': 'Android ベータ版',
  'app.apk': '中国国内向け高速 APK',
  'app.section.title': 'YourTJ App を入手',
  'app.ios.cta': 'iOS · TestFlight',
  'app.android.cta': 'Android · APK をダウンロード',
  'app.more': '他のアーキテクチャ',
  'app.feedback.ios': 'iOS フィードバック',
  'app.feedback.android': 'Android フィードバック',
  'app.note': 'Android のメインボタンは中国国内向けの高速ダウンロードです。他のアーキテクチャは GitHub Release をご覧ください。ベータ版のため最終品質ではありません。',
  'app.openStatus': 'ベータ版公開中',
  'app.feature.course': '授業検索',
  'app.feature.review': '授業評価',
  'app.feature.schedule': '時間割シミュレーション',
  'app.external': '外部ダウンロードとフィードバック',
  'product.course.title': 'YourTJ 履修コミュニティ',
  'product.course.description': '匿名で、自由で、シンプルで、効率的な履修コミュニティ。',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': '同済大学キャンパスに向けたコミュニティプラットフォームです。フォーラムで長く価値のある情報と議論を積み重ねます。',
  'product.hub.status': '近日公開',
  'product.hub.unavailable': '、現在は利用できません',
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
  'meta.description': 'YourTJ ist die Studierendencommunity der Tongji-Universität. Nutze die Kurs-Community oder lade die App herunter, um Kurse, Bewertungen und die Stundenplan-Simulation auf dem Handy zu prüfen.',
  'a11y.skip': 'Zum Hauptinhalt springen',
  'nav.homeAria': 'YourTJ Startseite',
  'nav.getApp': 'App herunterladen',
  'nav.language': 'Sprache wählen',
  'theme.toDark': 'Zum dunklen Modus wechseln',
  'theme.toLight': 'Zum hellen Modus wechseln',
  'hero.headline.1': 'Verbinde den Campus',
  'hero.headline.2': 'mit jeder Möglichkeit.',
  'app.title': 'YourTJ App',
  'app.testing': 'Mobile Beta',
  'app.desc': 'Kurse, Bewertungen und die Stundenplan-Simulation auf dem Handy prüfen.',
  'app.ios': 'Öffentliche iOS-Beta',
  'app.android': 'Android-Beta',
  'app.apk': 'APK mit China-Beschleunigung',
  'app.section.title': 'YourTJ App herunterladen',
  'app.ios.cta': 'iOS · TestFlight',
  'app.android.cta': 'Android · APK herunterladen',
  'app.more': 'Weitere Architekturen',
  'app.feedback.ios': 'iOS-Feedback',
  'app.feedback.android': 'Android-Feedback',
  'app.note': 'Der Android-Hauptbutton nutzt einen in China beschleunigten Download. Weitere Architekturen findest du auf GitHub Release. Betaqualität.',
  'app.openStatus': 'Beta jetzt verfügbar',
  'app.feature.course': 'Kurssuche',
  'app.feature.review': 'Kursbewertungen',
  'app.feature.schedule': 'Stundenplan-Simulation',
  'app.external': 'Externe Downloads und Feedback',
  'product.course.title': 'YourTJ Kurs-Community',
  'product.course.description': 'Anonym, frei, einfach und effizient Kurse wählen.',
  'product.hub.title': 'YourTJHub',
  'product.hub.description': 'Eine Campus-Plattform für Tongji, die wertvolle Informationen und Diskussionen langfristig im Forum bewahrt.',
  'product.hub.status': 'Demnächst verfügbar',
  'product.hub.unavailable': ', noch nicht verfügbar',
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
