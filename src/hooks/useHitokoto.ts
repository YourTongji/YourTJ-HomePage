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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHitokoto = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://v1.hitokoto.cn/');

        if (!response.ok) {
          throw new Error('Failed to fetch hitokoto');
        }

        const data: HitokotoData = await response.json();
        setHitokoto(data.hitokoto);
        setError(null);
      } catch (err) {
        console.error('Error fetching hitokoto:', err);
        setError(err as Error);
        // Keep the default text on error
      } finally {
        setLoading(false);
      }
    };

    fetchHitokoto();
  }, []);

  return { hitokoto, loading, error };
};
