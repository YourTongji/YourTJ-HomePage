import { useState, useEffect } from 'react';

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

export const useHitokoto = () => {
  const [hitokoto, setHitokoto] = useState<string>('Connecting your campus life with simplicity and warmth.');
  const [source, setSource] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHitokoto = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 2500);

        // 句子类型限制：动画(a)、文学(d)、诗词(i)、哲学(k)
        // 文档：https://developer.hitokoto.cn/sentence/
        const params = new URLSearchParams();
        for (const c of ['a', 'd', 'i', 'k']) params.append('c', c);

        const response = await fetch(`https://v1.hitokoto.cn/?${params.toString()}`, {
          signal: controller.signal,
        });

        window.clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to fetch hitokoto');
        }

        const data: HitokotoData = await response.json();
        setHitokoto(data.hitokoto);
        const from = (data.from || '').trim();
        const fromWho = (data.from_who || '').trim();
        const sourceText = fromWho ? `-- ${fromWho}《${from}》` : from ? `--《${from}》` : '';
        setSource(sourceText);
        setError(null);
      } catch (err) {
        console.error('Error fetching hitokoto:', err);
        setError(err as Error);
        // Keep the default text on error
      } finally {
        setLoading(false);
      }
    };

    const requestIdleCallback: undefined | ((cb: () => void) => number) = (window as any).requestIdleCallback;
    const cancelIdleCallback: undefined | ((id: number) => void) = (window as any).cancelIdleCallback;

    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(() => fetchHitokoto());
      return () => cancelIdleCallback?.(id);
    }

    const id = window.setTimeout(() => fetchHitokoto(), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return { hitokoto, source, loading, error };
};
