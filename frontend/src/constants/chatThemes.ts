import type { ChatTheme } from '@/types';

export const CHAT_ERROR_MESSAGE = "Sorry, I'm having trouble connecting right now.";

/** Full-page chat (the standalone Tutor Chat screen). */
export const GLOBAL_CHAT_THEME: ChatTheme = {
  bubble: 'max-w-[85%] rounded-2xl px-6 py-4 text-sm md:text-base',
  userBubble: 'bg-blue-600 text-white rounded-tr-sm shadow-md',
  aiBubble:
    'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-tl-sm shadow-sm prose prose-blue dark:prose-invert max-w-none',
  typingBubble:
    'max-w-[85%] rounded-2xl rounded-tl-sm px-6 py-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center gap-1.5',
  typingDot: 'bg-blue-500',
  composer: 'max-w-4xl mx-auto relative flex items-center shadow-lg rounded-full',
  composerInput:
    'pr-14 py-8 rounded-full border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus-visible:ring-blue-500 shadow-inner text-base md:text-lg',
  composerButton: 'absolute right-2 rounded-full bg-blue-600 hover:bg-blue-700 h-12 w-12 shadow-md',
  composerIcon: 'w-5 h-5',
};

/** Shared by the compact tutor panel docked under the study content. */
const EMBEDDED_CHAT_BASE = {
  bubble: 'max-w-[85%] rounded-2xl px-4 py-3 text-sm md:text-base',
  aiBubble:
    'bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-tl-sm shadow-sm prose prose-sm dark:prose-invert prose-p:leading-relaxed',
  typingBubble:
    'max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-4 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm flex items-center gap-1.5',
  composer: 'relative flex items-center max-w-4xl mx-auto',
  composerIcon: 'w-4 h-4',
};

export const LEARNING_CHAT_THEME: ChatTheme = {
  ...EMBEDDED_CHAT_BASE,
  userBubble: 'bg-blue-600 text-white rounded-tr-sm shadow-md',
  typingDot: 'bg-blue-400/60',
  composerInput:
    'pr-12 py-6 rounded-full border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 focus-visible:ring-blue-500 shadow-inner',
  composerButton: 'absolute right-1.5 rounded-full bg-blue-600 hover:bg-blue-700 h-9 w-9 shadow-md',
};

export const SOCRATIC_CHAT_THEME: ChatTheme = {
  ...EMBEDDED_CHAT_BASE,
  userBubble: 'bg-purple-600 text-white rounded-tr-sm shadow-md',
  typingDot: 'bg-purple-400/60',
  composerInput:
    'pr-12 py-6 rounded-full border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 focus-visible:ring-purple-500 shadow-inner',
  composerButton: 'absolute right-1.5 rounded-full bg-purple-600 hover:bg-purple-700 h-9 w-9 shadow-md',
};

export const GLOBAL_CHAT_PLACEHOLDER = 'Ask the Tutor anything...';
