import { BookOpen, HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { ChapterHero, ModeCard } from '@/components/feature/chapter';
import { EmptyStateScreen, LoadingScreen, PageShell } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { LEARNING_MODE_CARD_THEME, ROUTES, SOCRATIC_MODE_CARD_THEME } from '@/constants';
import { useChapter } from '@/hooks';

export default function ChapterView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { chapter, loading } = useChapter(id);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!chapter) {
    return (
      <EmptyStateScreen
        title="Chapter Not Found"
        actionLabel="Return to Dashboard"
        onAction={() => navigate(ROUTES.DASHBOARD)}
      />
    );
  }

  return (
    <PageShell className="max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(ROUTES.DASHBOARD)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <ChapterHero name={chapter.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ModeCard
          icon={BookOpen}
          title="Learning Mode"
          description="Read through the chapter sections one by one. Ask questions to the embedded AI assistant if you get stuck on any concept."
          actionLabel="Start Learning"
          theme={LEARNING_MODE_CARD_THEME}
          onClick={() => navigate(ROUTES.LEARNING_MODE(chapter.id))}
        />

        <ModeCard
          icon={HelpCircle}
          title="Socratic Mode"
          description="Work through example problems step-by-step. The AI tutor won't give you the answer, but will guide you to solve it yourself."
          actionLabel="Start Practice"
          theme={SOCRATIC_MODE_CARD_THEME}
          onClick={() => navigate(ROUTES.SOCRATIC_MODE(chapter.id))}
        />
      </div>
    </PageShell>
  );
}
