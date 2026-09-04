import type { ReactNode } from 'react';

import { cn } from '@/utils';

interface PageShellProps {
  /** Width constraint for the content column, e.g. `max-w-6xl`. */
  className?: string;
  children: ReactNode;
}

/** Standard padded page background with a centred content column. */
export default function PageShell({ className, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-8">
      <div className={cn('mx-auto space-y-8', className)}>{children}</div>
    </div>
  );
}
