import type { ChatMessage, ChatTheme } from '@/types';
import MarkdownContent from './MarkdownContent';

interface MessageBubbleProps {
  message: ChatMessage;
  theme: ChatTheme;
}

export default function MessageBubble({ message, theme }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${theme.bubble} ${isUser ? theme.userBubble : theme.aiBubble}`}>
        {isUser ? message.content : <MarkdownContent>{message.content}</MarkdownContent>}
      </div>
    </div>
  );
}
