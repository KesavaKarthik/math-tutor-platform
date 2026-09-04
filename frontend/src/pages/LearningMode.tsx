import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { chatApi } from '@/api';
import { EmbeddedChatPanel } from '@/components/chat';
import { ConceptPanel, StudyTopBar } from '@/components/feature/study';
import { EmptyStateScreen, LoadingScreen } from '@/components/layout';
import { LEARNING_MODE, ROUTES } from '@/constants';
import { useChatSession, useConcepts, useStepper } from '@/hooks';

const MODE = LEARNING_MODE;

export default function LearningMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { concepts, loading } = useConcepts(id);
  const { index, isLast, progress, next } = useStepper(concepts.length);
  const currentConcept = concepts[index];

  const send = useCallback(
    (message: string, conversationId?: number) =>
      chatApi.chatLearning(message, currentConcept.id, conversationId),
    [currentConcept],
  );
  const chat = useChatSession({ send });

  const handleNextConcept = () => {
    if (!isLast) {
      next();
      chat.reset();
    } else {
      // Finished all concepts
      navigate(ROUTES.DASHBOARD);
    }
  };

  if (loading) {
    return <LoadingScreen spinnerClassName={MODE.spinnerClassName} />;
  }

  if (concepts.length === 0) {
    return (
      <EmptyStateScreen
        title={MODE.emptyTitle}
        actionLabel="Back to Chapter"
        onAction={() => navigate(ROUTES.CHAPTER(id ?? ''))}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
      <StudyTopBar
        title={MODE.title}
        titleClassName={MODE.titleClassName}
        subtitle={`Section ${currentConcept.section_number}`}
        current={index + 1}
        total={concepts.length}
        progress={progress}
        progressClassName={MODE.progressClassName}
        onBack={() => navigate(ROUTES.CHAPTER(id ?? ''))}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ConceptPanel
          concept={currentConcept}
          nextLabel={isLast ? MODE.finishLabel : MODE.nextLabel}
          nextButtonClassName={MODE.nextButtonClassName}
          onNext={handleNextConcept}
        />

        <EmbeddedChatPanel
          messages={chat.messages}
          isLoading={chat.isLoading}
          input={chat.input}
          onInputChange={chat.setInput}
          onSend={chat.sendMessage}
          placeholder={MODE.chatPlaceholder}
          theme={MODE.chatTheme}
        />
      </div>
    </div>
  );
}
