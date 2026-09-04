import { useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { chatApi } from '@/api';
import { ChatComposer, ChatEmptyState, ConversationSidebar, MessageList } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GLOBAL_CHAT_PLACEHOLDER, GLOBAL_CHAT_THEME, ROUTES } from '@/constants';
import { useChatSession, useConversationSidebar, useConversations } from '@/hooks';
import { buildConversationTitle } from '@/utils';

export default function GlobalChat() {
  const navigate = useNavigate();

  const { conversations, addConversation, loadConversation, renameConversation, deleteConversation } =
    useConversations('global');
  const sidebar = useConversationSidebar();

  const send = useCallback(
    (message: string, conversationId?: number) => chatApi.chatGlobal(message, conversationId, undefined),
    [],
  );

  // A brand new conversation gets an optimistic sidebar entry.
  const handleConversationStarted = useCallback(
    (conversationId: number, firstMessage: string) => {
      addConversation({
        id: conversationId,
        mode: 'global',
        updated_at: new Date().toISOString(),
        title: buildConversationTitle(firstMessage),
      });
    },
    [addConversation],
  );

  const chat = useChatSession({ send, onConversationStarted: handleConversationStarted });

  const handleNewChat = () => {
    chat.reset();
    sidebar.closeMenu();
  };

  const handleSelectConversation = async (id: number) => {
    const history = await loadConversation(id);
    if (!history) return;
    chat.openConversation(id, history.messages);
    sidebar.closeMenu();
  };

  const handleRename = async (id: number) => {
    const title = sidebar.editTitle.trim();
    if (!title) return;
    if (await renameConversation(id, title)) {
      sidebar.stopEditing();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteConversation(id);
    if (chat.conversationId === id) {
      handleNewChat();
    }
  };

  return (
    <div
      className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden"
      onClick={() => sidebar.activeMenuId !== null && sidebar.closeMenu()}
    >
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={chat.conversationId}
        sidebar={sidebar}
        onBack={() => navigate(ROUTES.DASHBOARD)}
        onNewChat={handleNewChat}
        onSelect={handleSelectConversation}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <span className="ml-2 font-semibold">Tutor Chat</span>
        </div>

        <ScrollArea className="flex-1 p-4 md:p-8">
          <MessageList
            messages={chat.messages}
            isLoading={chat.isLoading}
            theme={GLOBAL_CHAT_THEME}
            className="max-w-4xl mx-auto space-y-6 pb-24"
            emptyState={<ChatEmptyState />}
          />
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-zinc-950 dark:via-zinc-950">
          <ChatComposer
            value={chat.input}
            onChange={chat.setInput}
            onSend={chat.sendMessage}
            placeholder={GLOBAL_CHAT_PLACEHOLDER}
            isLoading={chat.isLoading}
            theme={GLOBAL_CHAT_THEME}
          />
        </div>
      </div>
    </div>
  );
}
