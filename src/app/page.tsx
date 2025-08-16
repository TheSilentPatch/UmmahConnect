'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
 

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/channels/islam-chat');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-8 text-center">
      <Image 
        src="https://cdn.discordapp.com/icons/691720369715019827/8bcad886f9edf78b774ef242dd0fb23c.png?size=512&quality=lossless"
        data-ai-hint="community connection"
        alt="السلام عليكم ورحمة الله وبركاته"
        width={400}
        height={400}
        className="mb-8 max-w-sm rounded-lg"
        priority
      />
      <h2 className="font-headline text-3xl font-bold text-foreground">السلام عليكم ورحمة الله وبركاته</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        Preparing your experience...
      </p>
    </div>
  );
}
