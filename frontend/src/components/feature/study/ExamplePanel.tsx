import { HelpCircle } from 'lucide-react';

import { MarkdownContent } from '@/components/chat';
import type { Example } from '@/types';
import NextStepButton from './NextStepButton';
import StudyContent from './StudyContent';

interface ExamplePanelProps {
  example: Example;
  nextLabel: string;
  nextButtonClassName: string;
  onNext: () => void;
}

/** Problem statement rendered in Socratic Mode; the solution stays hidden. */
export default function ExamplePanel({ example, nextLabel, nextButtonClassName, onNext }: ExamplePanelProps) {
  return (
    <StudyContent>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {example.title}
      </h1>

      <div className="bg-purple-50/50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/50">
        <h2 className="text-xl font-bold mb-4 text-purple-900 dark:text-purple-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-500" />
          Problem Statement
        </h2>
        <div className="prose prose-purple dark:prose-invert max-w-none prose-lg">
          <MarkdownContent>{example.question_text}</MarkdownContent>
        </div>
      </div>

      <NextStepButton label={nextLabel} className={nextButtonClassName} onClick={onNext} />
    </StudyContent>
  );
}
