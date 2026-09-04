import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Chapter } from '@/types';

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
}

export default function ChapterCard({ chapter, onClick }: ChapterCardProps) {
  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-primary font-bold text-xl">{chapter.id}</span>
        </div>
        <CardTitle className="text-xl">{chapter.name}</CardTitle>
        <CardDescription className="pt-2 line-clamp-2">
          Master the concepts of {chapter.name.toLowerCase()} with AI-guided tutoring and socratic problem solving.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
