'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { CHANNELS } from '@/lib/constants';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ShieldAlert } from 'lucide-react';

export default function ChannelPage() {
  const params = useParams();
  const { channelId } = params as { channelId: string };
  const { user, loading } = useAuth();
  
  const channel = CHANNELS.find(c => c.id === channelId);

  if (loading) {
    return <div className="flex h-full items-center justify-center p-4">Loading...</div>;
  }

  if (!channel) {
    return <div className="flex h-full items-center justify-center p-4">Channel not found.</div>;
  }
  
  const isAllowed = user && (channel.access === 'all' || channel.access === user.gender);

  if (!isAllowed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <h2 className="font-headline text-2xl font-bold">Access Denied</h2>
        <p className="max-w-md text-muted-foreground">
          You do not have permission to view this channel. It is restricted to members of a different gender.
        </p>
      </div>
    );
  }

  return <ChatInterface channel={channel} />;
}
