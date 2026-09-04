import { useEffect, useRef, useState } from 'react';

interface AsyncDataResult<T> {
  data: T;
  loading: boolean;
}

/**
 * Fetch-on-mount helper shared by the content hooks: re-runs the fetcher
 * whenever `key` changes, logs failures and keeps the last known value.
 *
 * `fetcher` is expected to be an inline closure, so it is read through a ref
 * and only `key` drives the refetch.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  initialValue: T,
  errorMessage: string,
  key?: string | number,
): AsyncDataResult<T> {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const errorMessageRef = useRef(errorMessage);
  errorMessageRef.current = errorMessage;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const result = await fetcherRef.current();
        if (!cancelled) setData(result);
      } catch (error) {
        console.error(errorMessageRef.current, error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, loading };
}
