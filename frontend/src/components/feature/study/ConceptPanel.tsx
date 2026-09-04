import { MarkdownContent } from '@/components/chat';
import type { Concept } from '@/types';
import NextStepButton from './NextStepButton';
import StudyContent from './StudyContent';

interface ConceptPanelProps {
  concept: Concept;
  nextLabel: string;
  nextButtonClassName: string;
  onNext: () => void;
}

/** Textbook section rendered in Learning Mode. */
export default function ConceptPanel({ concept, nextLabel, nextButtonClassName, onNext }: ConceptPanelProps) {
  return (
    <StudyContent className="pb-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Section {concept.section_number}: {concept.title}
      </h1>

      <div className="prose prose-blue dark:prose-invert max-w-none prose-lg">
        <MarkdownContent>{concept.content_explaination || concept.content}</MarkdownContent>
      </div>

      <NextStepButton label={nextLabel} className={nextButtonClassName} onClick={onNext} />
    </StudyContent>
  );
}
