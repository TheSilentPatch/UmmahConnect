'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { Channel, Message, User } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export function ChatInterface({ channel }: { channel: Channel }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = collection(db, 'channels', channel.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({ 
            id: doc.id,
            text: data.text,
            timestamp: data.timestamp?.toDate().getTime(),
            author: data.author,
        });
      });
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [channel.id]);

  const filteredMessages = messages.filter(m => 
    m.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const messagesRef = collection(db, 'channels', channel.id, 'messages');
    const displayName = user.name || user.email.split('@')[0];
    await addDoc(messagesRef, {
      text: newMessage.trim(),
      author: {
        id: user.id,
        name: displayName,
        gender: user.gender,
      },
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex flex-1 min-w-0 w-full h-full flex-col bg-card">
      <header className="flex h-14 shrink-0 items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
            <channel.icon className="h-6 w-6 text-muted-foreground" />
            <h2 className="font-headline text-xl font-bold">{channel.name}</h2>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search messages or users..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
        <div className="p-4 space-y-6">
          {loading && (
            <div className="space-y-4 p-4">
              <Skeleton className="h-16 w-3/4 rounded-lg" />
              <div className="flex justify-end">
                <Skeleton className="h-16 w-3/4 rounded-lg" />
              </div>
              <Skeleton className="h-16 w-1/2 rounded-lg" />
            </div>
          )}
          {!loading && filteredMessages.map((msg) => {
            const isSender = msg.author.id === user?.id;
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500",
                  isSender ? "justify-end" : "justify-start"
                )}
              >
                {!isSender && (
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.author.name}`} />
                    <AvatarFallback>{getInitials(msg.author.name)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={cn("flex max-w-xs flex-col md:max-w-md", isSender && "items-end")}>
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 shadow-md",
                      isSender ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    {!isSender && <span className="font-medium">{msg.author.name}</span>}
                    {msg.timestamp && (
                        <time dateTime={new Date(msg.timestamp).toISOString()}>
                            {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                        </time>
                    )}
                  </div>
                </div>
                 {isSender && (
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.author.name}`} />
                    <AvatarFallback>{getInitials(msg.author.name)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <footer className="border-t bg-background/80 p-4 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
