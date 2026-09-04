import { Edit2, Trash2 } from 'lucide-react';

const MENU_WIDTH = 144;

interface ConversationActionsMenuProps {
  conversationId: number;
  onRename: () => void;
  onDelete: () => void;
}

/**
 * Rename/delete menu for a sidebar row. It is rendered outside the scroll
 * container and positioned against the row so the list cannot clip it.
 */
export default function ConversationActionsMenu({
  conversationId,
  onRename,
  onDelete,
}: ConversationActionsMenuProps) {
  const anchor = document.querySelector(`[data-conv-id="${conversationId}"]`);
  if (!anchor) return null;

  const rect = anchor.getBoundingClientRect();

  return (
    <div
      className="fixed w-36 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg z-50"
      style={{ top: rect.bottom + 4, left: rect.right - MENU_WIDTH }}
    >
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700 text-left"
        onClick={(e) => { e.stopPropagation(); onRename(); }}
      >
        <Edit2 className="w-4 h-4" /> Rename
      </button>
      <button
        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 text-left"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}
