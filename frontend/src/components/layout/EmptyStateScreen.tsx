import { Button } from '@/components/ui/button';

interface EmptyStateScreenProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
}

/** Full-viewport "nothing here" state with a single way out. */
export default function EmptyStateScreen({ title, actionLabel, onAction }: EmptyStateScreenProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <Button onClick={onAction}>{actionLabel}</Button>
    </div>
  );
}
