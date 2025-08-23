import type { LucideIcon } from 'lucide-react';

export interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  gender: 'Male' | 'Female';
  dob: string;
}

export interface Message {
  id: string;
  author: {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
  };
  text: string;
  timestamp: number;
  edited?: {
    at: number;
    by: string;
  };
}

export type ChannelId = 'islam-chat' | 'multilingual-mixed' | 'brothers-section' | 'sisters-section' | 'study-circles';

export interface Channel {
  id: ChannelId;
  name: string;
  access: 'all' | 'Male' | 'Female';
  icon: LucideIcon;
}
