import { Button } from '@/components/ui/button';

interface AuthActionsProps {
  loading: boolean;
  submitLabel: string;
  loadingLabel: string;
  /** Text preceding the link to the other auth screen. */
  promptText: string;
  linkLabel: string;
  onLink: () => void;
  onGuest: () => void;
}

/** Submit button, guest escape hatch and cross-link to the other auth screen. */
export default function AuthActions({
  loading,
  submitLabel,
  loadingLabel,
  promptText,
  linkLabel,
  onLink,
  onGuest,
}: AuthActionsProps) {
  return (
    <>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </Button>
      <Button type="button" variant="ghost" className="w-full" onClick={onGuest}>
        Continue as Guest
      </Button>
      <div className="text-sm text-center text-gray-500">
        {promptText}{' '}
        <button type="button" className="text-primary hover:underline" onClick={onLink}>
          {linkLabel}
        </button>
      </div>
    </>
  );
}
