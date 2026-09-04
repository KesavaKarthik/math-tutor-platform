import { apiClient } from "./client";
import type { Chapter, Concept, Example } from "@/types";

export const contentApi = {
  getChapters: async (): Promise<Chapter[]> => {
    const response = await apiClient.get("/content/chapters");
    return response.data;
  },
  getChapterConcepts: async (chapterId: number): Promise<Concept[]> => {
    const response = await apiClient.get(`/content/chapters/${chapterId}/concepts`);
    return response.data;
  },
  getChapterExamples: async (chapterId: number): Promise<Example[]> => {
    const response = await apiClient.get(`/content/chapters/${chapterId}/examples`);
    return response.data;
  },
};
