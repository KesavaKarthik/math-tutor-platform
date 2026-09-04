import { ScrollArea } from '@/components/ui/scroll-area';
import type { ChatMessage, ChatTheme } from '@/types';
import ChatComposer from './ChatComposer';
import MessageList from './MessageList';

interface EmbeddedChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  theme: ChatTheme;
}

/**
 * Tutor panel docked under the study content. It stays collapsed to just the
 * composer until the first message arrives, then grows to half the viewport.
 */
export default function EmbeddedChatPanel({
  messages,
  isLoading,
  input,
  onInputChange,
  onSend,
  placeholder,
  theme,
}: EmbeddedChatPanelProps) {
  const hasMessages = messages.length > 0;

  return (
    <div className={`bg-white dark:bg-zinc-950 flex flex-col z-20 shrink-0 border-t border-gray-200 dark:border-zinc-800 transition-all duration-300 ${hasMessages ? 'h-1/2' : ''}`}>
      {hasMessages && (
        <ScrollArea className="flex-1 w-full p-4 bg-gray-50/30 dark:bg-zinc-900/20 max-w-4xl mx-auto">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            theme={theme}
            className="space-y-4 pb-4"
          />
        </ScrollArea>
      )}

      <div className="p-4 bg-white dark:bg-zinc-950 shrink-0">
        <ChatComposer
          value={input}
          onChange={onInputChange}
          onSend={onSend}
          placeholder={placeholder}
          isLoading={isLoading}
          theme={theme}
        />
      </div>
    </div>
  );
}
