import { useCallback, useState } from 'react';

/** Walks forward through an ordered list (concepts, examples) and tracks progress. */
export function useStepper(total: number) {
  const [index, setIndex] = useState(0);

  const isLast = index >= total - 1;
  const progress = total > 0 ? (index / total) * 100 : 0;

  const next = useCallback(() => setIndex((current) => current + 1), []);

  return { index, isLast, progress, next };
}
