import type { ChatTheme } from '@/types';

/** Three bouncing dots shown while the tutor composes a reply. */
export default function TypingIndicator({ theme }: { theme: ChatTheme }) {
  return (
    <div className="flex justify-start">
      <div className={theme.typingBubble}>
        <span className={`w-2 h-2 ${theme.typingDot} rounded-full animate-bounce`}></span>
        <span className={`w-2 h-2 ${theme.typingDot} rounded-full animate-bounce [animation-delay:0.2s]`}></span>
        <span className={`w-2 h-2 ${theme.typingDot} rounded-full animate-bounce [animation-delay:0.4s]`}></span>
      </div>
    </div>
  );
}
