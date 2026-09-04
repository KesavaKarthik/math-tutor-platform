import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ChatTheme } from '@/types';

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  isLoading: boolean;
  theme: ChatTheme;
}

/** Rounded message box with its inline send button. */
export default function ChatComposer({
  value,
  onChange,
  onSend,
  placeholder,
  isLoading,
  theme,
}: ChatComposerProps) {
  return (
    <div className={theme.composer}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        placeholder={placeholder}
        className={theme.composerInput}
      />
      <Button
        size="icon"
        disabled={!value.trim() || isLoading}
        onClick={onSend}
        className={theme.composerButton}
      >
        <Send className={theme.composerIcon} />
      </Button>
    </div>
  );
}
