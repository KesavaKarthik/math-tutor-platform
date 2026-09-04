import { CheckCircle2, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface NextStepButtonProps {
  label: string;
  className: string;
  onClick: () => void;
}

/** Right-aligned "advance to the next step" call to action. */
export default function NextStepButton({ label, className, onClick }: NextStepButtonProps) {
  return (
    <div className="mt-8 flex justify-end">
      <Button size="lg" className={className} onClick={onClick}>
        <CheckCircle2 className="h-5 w-5" />
        {label}
        <ChevronRight className="h-4 w-4 ml-2 opacity-70" />
      </Button>
    </div>
  );
}
