import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface StudyTopBarProps {
  title: string;
  titleClassName: string;
  /** Position label, e.g. "Section 1.2" or "Example 3". */
  subtitle: string;
  current: number;
  total: number;
  progress: number;
  progressClassName: string;
  onBack: () => void;
}

/** Sticky header of the study screens: back action, labels and progress. */
export default function StudyTopBar({
  title,
  titleClassName,
  subtitle,
  current,
  total,
  progress,
  progressClassName,
  onBack,
}: StudyTopBarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-4 flex items-center justify-between shadow-sm z-10 shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className={titleClassName}>{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-1/3 max-w-xs hidden md:flex">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className={progressClassName} style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
          {current} / {total}
        </span>
      </div>
    </div>
  );
}
