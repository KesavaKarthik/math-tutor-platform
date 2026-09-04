import { contentApi } from '@/api';
import type { Concept, Example } from '@/types';
import { useAsyncData } from './useAsyncData';

const NO_CONCEPTS: Concept[] = [];
const NO_EXAMPLES: Example[] = [];

export function useConcepts(chapterId: string | undefined) {
  const { data: concepts, loading } = useAsyncData(
    () => contentApi.getChapterConcepts(Number(chapterId)),
    NO_CONCEPTS,
    'Failed to fetch concepts',
    chapterId,
  );

  return { concepts, loading };
}

export function useExamples(chapterId: string | undefined) {
  const { data: examples, loading } = useAsyncData(
    () => contentApi.getChapterExamples(Number(chapterId)),
    NO_EXAMPLES,
    'Failed to fetch examples',
    chapterId,
  );

  return { examples, loading };
}
