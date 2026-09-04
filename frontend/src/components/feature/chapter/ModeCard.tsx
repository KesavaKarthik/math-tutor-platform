import type { LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ModeCardTheme } from '@/types';

interface ModeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  theme: ModeCardTheme;
  onClick: () => void;
}

/** Entry point for one of the study modes on the chapter screen. */
export default function ModeCard({ icon: Icon, title, description, actionLabel, theme, onClick }: ModeCardProps) {
  return (
    <Card className={theme.card} onClick={onClick}>
      <CardHeader className="text-center space-y-4 pt-8">
        <div className={theme.iconWrapper}>
          <Icon className={theme.icon} />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base px-4">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-8">
        <Button variant="secondary" className="w-full max-w-[200px]">{actionLabel}</Button>
      </CardContent>
    </Card>
  );
}
