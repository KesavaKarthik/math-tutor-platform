import type { FormEvent, ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  error?: string;
  onSubmit: (e: FormEvent) => void;
  /** Form fields. */
  children: ReactNode;
  /** Submit / secondary actions, usually an AuthActions element. */
  footer: ReactNode;
}

/** Centred credential card shared by the sign in and sign up screens. */
export default function AuthCard({ title, description, error, onSubmit, children, footer }: AuthCardProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
            {children}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">{footer}</CardFooter>
        </form>
      </Card>
    </div>
  );
}
