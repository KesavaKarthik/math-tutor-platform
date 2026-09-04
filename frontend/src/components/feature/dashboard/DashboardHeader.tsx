import { LogOut, MessageSquare, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { User } from '@/types';

interface DashboardHeaderProps {
  user: User | null;
  onOpenChat: () => void;
  onSignIn: () => void;
  onLogout: () => void;
}

/** Dashboard title block with the chat shortcut and the account controls. */
export default function DashboardHeader({ user, onOpenChat, onSignIn, onLogout }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          AI Math Tutor
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Select a chapter to begin your learning journey.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onOpenChat}
          className="gap-2 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Tutor Chat</span>
        </Button>

        {user ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-sm hidden sm:inline">{user.username}</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={onSignIn}>Sign In to Save Progress</Button>
        )}
      </div>
    </div>
  );
}
