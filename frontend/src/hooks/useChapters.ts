import { contentApi } from '@/api';
import type { Chapter } from '@/types';
import { useAsyncData } from './useAsyncData';

const NO_CHAPTERS: Chapter[] = [];

export function useChapters() {
  const { data: chapters, loading } = useAsyncData(
    () => contentApi.getChapters(),
    NO_CHAPTERS,
    'Failed to fetch chapters',
  );

  return { chapters, loading };
}

/** Looks a single chapter up in the chapter list. */
export function useChapter(chapterId: string | undefined) {
  const { data: chapter, loading } = useAsyncData<Chapter | null>(
    async () => {
      const chapters = await contentApi.getChapters();
      return chapters.find((c) => c.id === Number(chapterId)) ?? null;
    },
    null,
    'Failed to fetch chapter',
    chapterId,
  );

  return { chapter, loading };
}
