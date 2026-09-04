import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { chatApi } from '@/api';
import { EmbeddedChatPanel } from '@/components/chat';
import { ExamplePanel, StudyTopBar } from '@/components/feature/study';
import { EmptyStateScreen, LoadingScreen } from '@/components/layout';
import { ROUTES, SOCRATIC_MODE } from '@/constants';
import { useChatSession, useExamples, useStepper } from '@/hooks';

const MODE = SOCRATIC_MODE;

export default function SocraticMode() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { examples, loading } = useExamples(id);
  const { index, isLast, progress, next } = useStepper(examples.length);
  const currentExample = examples[index];

  const send = useCallback(
    (message: string, conversationId?: number) =>
      chatApi.chatSocratic(message, currentExample.id, conversationId),
    [currentExample],
  );
  const chat = useChatSession({ send });

  const handleNextExample = () => {
    if (!isLast) {
      next();
      chat.reset();
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  if (loading) {
    return <LoadingScreen spinnerClassName={MODE.spinnerClassName} />;
  }

  if (examples.length === 0) {
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
        subtitle={`Example ${currentExample.example_number}`}
        current={index + 1}
        total={examples.length}
        progress={progress}
        progressClassName={MODE.progressClassName}
        onBack={() => navigate(ROUTES.CHAPTER(id ?? ''))}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ExamplePanel
          example={currentExample}
          nextLabel={isLast ? MODE.finishLabel : MODE.nextLabel}
          nextButtonClassName={MODE.nextButtonClassName}
          onNext={handleNextExample}
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
