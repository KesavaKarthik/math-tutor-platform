import { ArrowLeft, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ConversationSidebarState } from '@/hooks';
import type { Conversation } from '@/types';
import ConversationActionsMenu from './ConversationActionsMenu';
import ConversationRow from './ConversationRow';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId?: number;
  /** Rename/menu state, owned by the page via useConversationSidebar. */
  sidebar: ConversationSidebarState;
  onBack: () => void;
  onNewChat: () => void;
  onSelect: (id: number) => void;
  onRename: (id: number) => void;
  onDelete: (id: number) => void;
}

/** Chat history rail: new-chat action plus the list of saved conversations. */
export default function ConversationSidebar({
  conversations,
  activeConversationId,
  sidebar,
  onBack,
  onNewChat,
  onSelect,
  onRename,
  onDelete,
}: ConversationSidebarProps) {
  const { activeMenuId, closeMenu, editingId, editTitle, setEditTitle, startEditing, stopEditing, toggleMenu } = sidebar;

  const handleRenameFromMenu = () => {
    if (activeMenuId === null) return;
    const conversation = conversations.find((c) => c.id === activeMenuId);
    startEditing(activeMenuId, conversation?.title || `Chat #${activeMenuId}`);
  };

  return (
    <div
      className="w-64 bg-gray-50 dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col hidden md:flex shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 flex gap-2">
        <Button variant="outline" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button onClick={onNewChat} className="flex-1 flex gap-2">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1 overflow-x-hidden max-w-full">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center mt-4">No past chats</p>
          ) : (
            conversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversationId === conversation.id}
                isEditing={editingId === conversation.id}
                editTitle={editTitle}
                onEditTitleChange={setEditTitle}
                onConfirmRename={() => onRename(conversation.id)}
                onCancelRename={stopEditing}
                onSelect={() => onSelect(conversation.id)}
                onToggleMenu={() => toggleMenu(conversation.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Rendered outside the ScrollArea so the list cannot clip the menu. */}
      {activeMenuId !== null && (
        <ConversationActionsMenu
          conversationId={activeMenuId}
          onRename={handleRenameFromMenu}
          onDelete={() => { onDelete(activeMenuId); closeMenu(); }}
        />
      )}
    </div>
  );
}
