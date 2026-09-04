import type { ModeCardTheme, StudyModeConfig } from '@/types';
import { LEARNING_CHAT_THEME, SOCRATIC_CHAT_THEME } from './chatThemes';

export const LEARNING_MODE: StudyModeConfig = {
  title: 'Learning Mode',
  titleClassName: 'font-bold text-lg hidden sm:block text-blue-600 dark:text-blue-400',
  progressClassName: 'h-full bg-blue-500 transition-all duration-500 ease-out',
  spinnerClassName: 'border-primary',
  nextButtonClassName:
    'gap-2 px-8 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all hover:-translate-y-0.5',
  nextLabel: 'I Understand, Next',
  finishLabel: 'Finish Chapter',
  emptyTitle: 'No Concepts Found',
  chatPlaceholder: 'Ask about this concept...',
  chatTheme: LEARNING_CHAT_THEME,
};

export const SOCRATIC_MODE: StudyModeConfig = {
  title: 'Socratic Practice Mode',
  titleClassName: 'font-bold text-lg hidden sm:block text-purple-600 dark:text-purple-400',
  progressClassName: 'h-full bg-purple-500 transition-all duration-500 ease-out',
  spinnerClassName: 'border-purple-500',
  nextButtonClassName:
    'gap-2 px-8 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition-all hover:-translate-y-0.5',
  nextLabel: 'Next Problem',
  finishLabel: 'Finish Practice',
  emptyTitle: 'No Examples Found',
  chatPlaceholder: 'Show me your work or ask for a hint...',
  chatTheme: SOCRATIC_CHAT_THEME,
};

/** Look of the two entry cards on the chapter screen. */
export const LEARNING_MODE_CARD_THEME: ModeCardTheme = {
  card: 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50',
  iconWrapper: 'w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center',
  icon: 'h-10 w-10 text-blue-600 dark:text-blue-400',
};

export const SOCRATIC_MODE_CARD_THEME: ModeCardTheme = {
  card: 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-purple-500/50',
  iconWrapper: 'w-20 h-20 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center',
  icon: 'h-10 w-10 text-purple-600 dark:text-purple-400',
};
