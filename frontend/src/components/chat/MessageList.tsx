import type { ReactNode } from 'react';

import { useScrollAnchor } from '@/hooks';
import type { ChatMessage, ChatTheme } from '@/types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  theme: ChatTheme;
  /** Spacing of the transcript column, which differs per chat surface. */
  className?: string;
  /** Rendered instead of the transcript while there are no messages. */
  emptyState?: ReactNode;
}

/** Renders a transcript and keeps the newest message scrolled into view. */
export default function MessageList({
  messages,
  isLoading,
  theme,
  className,
  emptyState,
}: MessageListProps) {
  const anchorRef = useScrollAnchor(messages);

  return (
    <div className={className}>
      {messages.length === 0 && emptyState}
      {messages.map((message, i) => (
        <MessageBubble key={i} message={message} theme={theme} />
      ))}
      {isLoading && <TypingIndicator theme={theme} />}
      <div ref={anchorRef} />
    </div>
  );
}
