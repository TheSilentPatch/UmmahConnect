import { AnimationProvider } from '@/providers/animation-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <AnimationProvider>
        {children}
      </AnimationProvider>
    </main>
  );
}
