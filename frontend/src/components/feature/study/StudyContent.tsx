import type { ReactNode } from 'react';

import { cn } from '@/utils';

interface StudyContentProps {
  className?: string;
  children: ReactNode;
}

/** Independently scrolling upper half of the study screens. */
export default function StudyContent({ className, children }: StudyContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-12 relative border-b border-gray-200 dark:border-zinc-800">
      <div className={cn('max-w-4xl mx-auto', className)}>{children}</div>
    </div>
  );
}
