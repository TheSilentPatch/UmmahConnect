'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
    loading ? (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.5 
          }}
        >
          <Image 
            src="https://cdn.discordapp.com/icons/691720369715019827/8bcad886f9edf78b774ef242dd0fb23c.png?size=512&quality=lossless"
            data-ai-hint="community connection"
            alt="السلام عليكم ورحمة الله وبركاته"
            width={400}
            height={400}
            className="mb-8 max-w-sm rounded-lg"
            priority
          />
        </motion.div>
        <motion.h2 
          className="font-headline text-3xl font-bold text-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          السلام عليكم ورحمة الله وبركاته
        </motion.h2>
        <motion.p 
          className="mt-2 max-w-md text-muted-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Preparing your experience...
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.div
            className="h-2 w-48 rounded-full bg-muted"
            initial={{ width: 0 }}
            animate={{ width: 192 }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          <Link href="/theme-demo">
            <Button variant="outline" size="sm">
              View Theme Demo
            </Button>
          </Link>
        </motion.div>
      </div>
    ) : null
  );
}
