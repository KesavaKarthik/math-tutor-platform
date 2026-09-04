import { useEffect, useRef } from 'react';

/**
 * Returns a ref for an empty element at the end of a list; scrolls it into
 * view every time `dependency` changes so new messages stay visible.
 */
export function useScrollAnchor(dependency: unknown) {
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [dependency]);

  return anchorRef;
}
