import { useCallback, useState } from 'react';

import { getApiErrorMessage } from '@/utils';

/** Wraps a submit handler with the `loading` / `error` bookkeeping forms need. */
export function useAsyncAction(fallbackErrorMessage: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(
    async (action: () => Promise<void>) => {
      setLoading(true);
      setError('');
      try {
        await action();
      } catch (err) {
        setError(getApiErrorMessage(err, fallbackErrorMessage));
      } finally {
        setLoading(false);
      }
    },
    [fallbackErrorMessage],
  );

  return { loading, error, run };
}
