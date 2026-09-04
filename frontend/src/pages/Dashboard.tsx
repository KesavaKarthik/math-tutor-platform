import { useNavigate } from 'react-router-dom';

import { PageShell } from '@/components/layout';
import { ChapterCard, DashboardHeader } from '@/components/feature/dashboard';
import { Spinner } from '@/components/ui/spinner';
import { ROUTES } from '@/constants';
import { useChapters } from '@/hooks';
import { useAuthStore } from '@/store';

export default function Dashboard() {
  const navigate = useNavigate();
  const { chapters, loading } = useChapters();
  const { user, logout } = useAuthStore();

  return (
    <PageShell className="max-w-6xl">
      <DashboardHeader
        user={user}
        onOpenChat={() => navigate(ROUTES.CHAT)}
        onSignIn={() => navigate(ROUTES.LOGIN)}
        onLogout={logout}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onClick={() => navigate(ROUTES.CHAPTER(chapter.id))}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
