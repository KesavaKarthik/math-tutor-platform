import { useCallback, useState } from 'react';

import { CHAT_ERROR_MESSAGE } from '@/constants';
import type { ChatMessage, ChatSender } from '@/types';

interface ChatSessionOptions {
  /** Endpoint wrapper used to deliver the message. */
  send: ChatSender;
  /** Fired once, when the backend opens a brand new conversation. */
  onConversationStarted?: (conversationId: number, firstMessage: string) => void;
}

/**
 * Owns one tutor conversation: the transcript, the draft input, the in-flight
 * flag and the conversation id. Shared by every chat surface in the app.
 */
export function useChatSession({ send, onConversationStarted }: ChatSessionOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>();

  /** Clears the transcript so the next message starts a new conversation. */
  const reset = useCallback(() => {
    setConversationId(undefined);
    setMessages([]);
  }, []);

  /** Replaces the transcript with a conversation loaded from history. */
  const openConversation = useCallback((id: number, history: ChatMessage[]) => {
    setConversationId(id);
    setMessages(history);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const isNewConversation = conversationId === undefined;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await send(userMessage, conversationId);

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
        if (isNewConversation) {
          onConversationStarted?.(data.conversation_id, userMessage);
        }
      }
      setMessages((prev) => [...prev, data.message as ChatMessage]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', content: CHAT_ERROR_MESSAGE }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, conversationId, send, onConversationStarted]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    conversationId,
    sendMessage,
    reset,
    openConversation,
  };
}
