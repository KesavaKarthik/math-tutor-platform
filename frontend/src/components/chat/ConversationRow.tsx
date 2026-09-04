import { Check, MessageSquare, MoreVertical, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Conversation } from '@/types';

interface ConversationRowProps {
  conversation: Conversation;
  isActive: boolean;
  isEditing: boolean;
  editTitle: string;
  onEditTitleChange: (value: string) => void;
  onConfirmRename: () => void;
  onCancelRename: () => void;
  onSelect: () => void;
  onToggleMenu: () => void;
}

/**
 * One row of the history sidebar, in either read or inline-rename mode.
 * The data-conv-id attribute is what ConversationActionsMenu anchors to.
 */
export default function ConversationRow({
  conversation,
  isActive,
  isEditing,
  editTitle,
  onEditTitleChange,
  onConfirmRename,
  onCancelRename,
  onSelect,
  onToggleMenu,
}: ConversationRowProps) {
  return (
    <div
      data-conv-id={conversation.id}
      className={`group relative w-full flex items-center p-2 rounded-lg transition-colors min-w-0 ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100' : 'hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300'}`}
    >
      {isEditing ? (
        <div className="flex w-full items-center gap-1 min-w-0">
          <Input
            value={editTitle}
            onChange={(e) => onEditTitleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onConfirmRename()}
            className="h-7 text-xs px-2 flex-1 min-w-0"
            autoFocus
          />
          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 shrink-0" onClick={onConfirmRename}>
            <Check className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 shrink-0" onClick={onCancelRename}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <>
          <button onClick={onSelect} className="flex flex-1 items-center gap-2 truncate text-left p-1 min-w-0 pr-1">
            <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
            <span className="truncate text-sm font-medium">{conversation.title || `Chat #${conversation.id}`}</span>
          </button>
          <div className="relative shrink-0 flex items-center ml-1">
            <button
              className="h-7 w-7 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors"
              onClick={(e) => { e.stopPropagation(); onToggleMenu(); }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
