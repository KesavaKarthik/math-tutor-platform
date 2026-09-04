export type ChatRole = 'user' | 'ai';

export type ChatMode = 'global' | 'learning' | 'socratic';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatHistory {
  id: number;
  mode: string;
  context_id: number | null;
  messages: ChatMessage[];
}

/** A conversation as it appears in the chat history sidebar. */
export interface Conversation {
  id: number;
  mode: string;
  updated_at: string;
  title?: string;
}

export interface ChatResponse {
  conversation_id: number;
  message: { role: string; content: string };
}

/**
 * Transport handed to `useChatSession`, so the session hook stays agnostic of
 * which backend endpoint (global / learning / socratic) it is talking to.
 */
export type ChatSender = (message: string, conversationId?: number) => Promise<ChatResponse>;
