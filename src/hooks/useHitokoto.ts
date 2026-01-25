import { useEffect, useState } from 'react';

interface HitokotoData {
  id: number;
  uuid: string;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: string;
  length: number;
}

const DEFAULT_HITOKOTO = 'Connecting your campus life with simplicity and warmth.';
const CACHE_KEY = 'hitokoto_cache_v2';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12h

type HitokotoCache = {
  hitokoto: string;
  source: string;
  ts: number;
};

function buildSource(from: string, fromWho: string | null): string {
  const f = (from || '').trim();
  const w = (fromWho || '').trim();

  // Use Unicode escapes for book-title quotes to keep the source file ASCII-only.
  const l = '\u300a';
  const r = '\u300b';
  if (w && f) return `-- ${w}${l}${f}${r}`;
  if (f) return `-- ${l}${f}${r}`;
  return '';
}

function readCache(): HitokotoCache | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HitokotoCache>;
    if (typeof parsed.hitokoto !== 'string') return null;
    if (typeof parsed.source !== 'string') return null;
    if (typeof parsed.ts !== 'number') return null;
    return { hitokoto: parsed.hitokoto, source: parsed.source, ts: parsed.ts };
  } catch {
    return null;
  }
}

function writeCache(cache: HitokotoCache): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

function shouldSkipForConnection(): boolean {
  const connection = (navigator as any).connection as
    | undefined
    | { saveData?: boolean; effectiveType?: string };

  if (!connection) return false;
  if (connection.saveData) return true;
  return typeof connection.effectiveType === 'string' && connection.effectiveType.includes('2g');
}

export const useHitokoto = () => {
  const [hitokoto, setHitokoto] = useState<string>(() => readCache()?.hitokoto ?? DEFAULT_HITOKOTO);
  const [source, setSource] = useState<string>(() => readCache()?.source ?? '');

  useEffect(() => {
    const cached = readCache();
    const cacheFresh = cached && Date.now() - cached.ts < CACHE_TTL_MS;

    // Keep LCP stable: don't refetch if cache is fresh.
    // If the user is on Save-Data/2g and we already have a cached quote, prefer not fetching.
    if (cacheFresh) return;
    if (shouldSkipForConnection() && cached) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const fetchHitokoto = async () => {
      try {
        const controller = new AbortController();
        const abortId = window.setTimeout(() => controller.abort(), 3500);

        // Filter sentence types per docs:
        // a = animation, d = literature, i = poetry, k = philosophy
        // https://developer.hitokoto.cn/sentence/
        const params = new URLSearchParams();
        for (const c of ['a', 'd', 'i', 'k']) params.append('c', c);

        const response = await fetch(`https://v1.hitokoto.cn/?${params.toString()}`, {
          signal: controller.signal,
        });
        window.clearTimeout(abortId);

        if (!response.ok) throw new Error('Failed to fetch hitokoto');

        const data: HitokotoData = await response.json();
        const nextHitokoto = (data.hitokoto || '').trim();
        const nextSource = buildSource(data.from, data.from_who);

        if (cancelled) return;
        if (nextHitokoto) setHitokoto(nextHitokoto);
        setSource(nextSource);

        writeCache({ hitokoto: nextHitokoto || DEFAULT_HITOKOTO, source: nextSource, ts: Date.now() });
      } catch (err) {
        // Silently fail: keep cached/default quote to preserve UX and Lighthouse stability.
        void err;
      }
    };

    const schedule = () => {
      // Keep it snappy: fetch quickly. If we already have a cached quote, delay a bit to avoid jank.
      const delayMs = cached ? 300 : 50;
      timeoutId = window.setTimeout(() => void fetchHitokoto(), delayMs);
    };

    // Avoid relying on the window 'load' event (can be delayed/odd on some mobile browsers).
    schedule();

    return () => {
      cancelled = true;
      if (typeof timeoutId === 'number') window.clearTimeout(timeoutId);
    };
  }, []);

  return { hitokoto, source };
};
