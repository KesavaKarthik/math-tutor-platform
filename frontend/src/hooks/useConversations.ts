import { useCallback, useEffect, useState } from 'react';

import { chatApi } from '@/api';
import type { ChatHistory, ChatMode, Conversation } from '@/types';

/** Loads and mutates the saved conversations for one chat mode. */
export function useConversations(mode: ChatMode) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await chatApi.getConversations();
        setConversations(data.filter((c) => c.mode === mode));
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };
    fetchConversations();
  }, [mode]);

  const addConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => [conversation, ...prev]);
  }, []);

  const loadConversation = useCallback(async (id: number): Promise<ChatHistory | null> => {
    try {
      return await chatApi.getConversationHistory(id);
    } catch (error) {
      console.error("Failed to load messages", error);
      return null;
    }
  }, []);

  const renameConversation = useCallback(async (id: number, title: string) => {
    try {
      await chatApi.renameConversation(id, title);
      setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  const deleteConversation = useCallback(async (id: number) => {
    try {
      await chatApi.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }, []);

  return { conversations, addConversation, loadConversation, renameConversation, deleteConversation };
}
