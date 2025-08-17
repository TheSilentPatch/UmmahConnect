'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { Channel, Message, User } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
    <motion.div 
      className="flex flex-1 min-w-0 w-full h-full flex-col bg-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.header 
        className="flex h-14 shrink-0 items-center justify-between border-b p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
            <channel.icon className="h-6 w-6 text-muted-foreground" />
            <h2 className="font-headline text-xl font-bold">{channel.name}</h2>
        </motion.div>
        <div className="flex items-center gap-2">
          <motion.div 
            className="relative w-full max-w-xs"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <AnimatedInput 
              placeholder="Search messages or users..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>
          <ThemeToggle />
        </div>
      </motion.header>

      <div className="flex-1">
        <ScrollArea className="h-[86vh]" ref={scrollAreaRef}>
          <div className="flex flex-col p-4 space-y-6">
            {loading && (
              <div className="space-y-4 p-4">
                <Skeleton className="h-16 w-3/4 rounded-lg" />
                <div className="flex justify-end">
                  <Skeleton className="h-16 w-3/4 rounded-lg" />
                </div>
                <Skeleton className="h-16 w-1/2 rounded-lg" />
              </div>
            )}
            <AnimatePresence>
              {!loading && filteredMessages.map((msg, index) => {
                const isSender = msg.author.id === user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "flex items-start gap-3",
                      isSender ? "justify-end" : "justify-start"
                    )}
                  >
                    {!isSender && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                      >
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.author.name}`} />
                          <AvatarFallback>{getInitials(msg.author.name)}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                    <div className={cn("flex max-w-xs flex-col md:max-w-md", isSender && "items-end")}>
                      <motion.div
                        className={cn(
                          "rounded-lg px-4 py-2 shadow-md",
                          isSender ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                        )}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.15 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </motion.div>
                      <motion.div 
                        className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 + 0.2 }}
                      >
                        {!isSender && <span className="font-medium">{msg.author.name}</span>}
                        {msg.timestamp && (
                            <time dateTime={new Date(msg.timestamp).toISOString()}>
                                {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                            </time>
                        )}
                      </motion.div>
                    </div>
                     {isSender && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.1 }}
                      >
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${msg.author.name}`} />
                          <AvatarFallback>{getInitials(msg.author.name)}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <motion.div 
        className="sticky bottom-0 left-0 right-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <footer className="border-t bg-background/80 p-[12px] backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <AnimatedInput
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              className="flex-1"
            />
            <AnimatedButton 
              type="submit" 
              size="icon" 
              className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </AnimatedButton>
          </form>
        </footer>
      </motion.div>
    </motion.div>
  );
}
