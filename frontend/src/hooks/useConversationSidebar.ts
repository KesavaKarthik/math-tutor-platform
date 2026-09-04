import { useCallback, useState } from 'react';

/** Transient UI state of the history sidebar: inline renaming and the row menu. */
export function useConversationSidebar() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const startEditing = useCallback((id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
    setActiveMenuId(null);
  }, []);

  const stopEditing = useCallback(() => setEditingId(null), []);

  const toggleMenu = useCallback(
    (id: number) => setActiveMenuId((current) => (current === id ? null : id)),
    [],
  );

  const closeMenu = useCallback(() => setActiveMenuId(null), []);

  return {
    editingId,
    editTitle,
    setEditTitle,
    activeMenuId,
    startEditing,
    stopEditing,
    toggleMenu,
    closeMenu,
  };
}

export type ConversationSidebarState = ReturnType<typeof useConversationSidebar>;
