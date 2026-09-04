import { Spinner } from '@/components/ui/spinner';

interface LoadingScreenProps {
  spinnerClassName?: string;
}

/** Full-viewport loading state used while a route fetches its data. */
export default function LoadingScreen({ spinnerClassName }: LoadingScreenProps) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Spinner className={spinnerClassName} />
    </div>
  );
}
