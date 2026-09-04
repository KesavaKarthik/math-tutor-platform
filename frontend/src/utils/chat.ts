const TITLE_WORD_COUNT = 3;

/** Derives the sidebar label for a brand new conversation from its first message. */
export function buildConversationTitle(message: string): string {
  const words = message.split(" ");
  return words.slice(0, TITLE_WORD_COUNT).join(" ") + (words.length > TITLE_WORD_COUNT ? "..." : "");
}
