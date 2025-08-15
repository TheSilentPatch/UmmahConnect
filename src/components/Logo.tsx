import { Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="rounded-lg bg-primary p-2 text-primary-foreground">
        <Moon className="h-6 w-6" />
      </div>
      <h1 className="font-headline text-2xl font-bold text-foreground">
        UmmahConnect
      </h1>
    </div>
  );
}
