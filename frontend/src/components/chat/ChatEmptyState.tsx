import { MessageSquare } from 'lucide-react';

/** Greeting shown on the full-page chat before the first message. */
export default function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full pt-32 text-center space-y-4">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
        <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">How can I help you today?</h2>
      <p className="text-gray-500 max-w-md">Ask me anything about math, your textbook, or specific concepts you're struggling with.</p>
    </div>
  );
}
