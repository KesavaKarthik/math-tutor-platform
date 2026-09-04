import { apiClient } from "./client";
import type { ChatHistory, ChatResponse, Conversation } from "@/types";

export const chatApi = {
  chatGlobal: async (message: string, conversation_id?: number, context_id?: number): Promise<ChatResponse> => {
    const response = await apiClient.post("/chat/global", { query: message, conversation_id, context_id });
    return response.data;
  },
  chatLearning: async (message: string, context_id: number, conversation_id?: number): Promise<ChatResponse> => {
    const response = await apiClient.post("/chat/learning", { query: message, conversation_id, context_id });
    return response.data;
  },
  chatSocratic: async (message: string, context_id: number, conversation_id?: number): Promise<ChatResponse> => {
    const response = await apiClient.post("/chat/socratic", { query: message, conversation_id, context_id });
    return response.data;
  },
  getConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get("/chat/conversations");
    return response.data;
  },
  getConversationHistory: async (id: number): Promise<ChatHistory> => {
    const response = await apiClient.get(`/chat/conversations/${id}`);
    return response.data;
  },
  renameConversation: async (id: number, title: string) => {
    const response = await apiClient.put(`/chat/conversations/${id}/title`, { title });
    return response.data;
  },
  deleteConversation: async (id: number) => {
    const response = await apiClient.delete(`/chat/conversations/${id}`);
    return response.data;
  }
};
