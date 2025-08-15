'use client';

import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from '@/components/ui/sidebar';
import { CHANNELS } from '@/lib/constants';
import { Logo } from '@/components/Logo';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
         <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
         </div>
      </div>
    );
  }

  if (!user) {
    return null; // or a login redirect, which useAuth handles
  }

  const getInitials = (email: string) => email.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {CHANNELS.map((channel) => {
                const isAllowed = channel.access === 'all' || channel.access === user.gender;
                const channelPath = `/channels/${channel.id}`;
                return (
                  <SidebarMenuItem key={channel.id}>
                    <Link href={isAllowed ? channelPath : '#'} tabIndex={-1}>
                      <SidebarMenuButton 
                        asChild={!isAllowed}
                        className="w-full justify-start"
                        isActive={pathname === channelPath}
                        disabled={!isAllowed}
                        aria-disabled={!isAllowed}
                        tooltip={isAllowed ? channel.name : `${channel.name} (Access Restricted)`}
                      >
                        {isAllowed ? (
                          <>
                            <channel.icon className="h-5 w-5" />
                            <span>{channel.name}</span>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <channel.icon className="h-5 w-5" />
                            <span>{channel.name}</span>
                          </span>
                        )}
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 w-full justify-start gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`} alt={user.email || ''} />
                    <AvatarFallback>{user.email ? getInitials(user.email) : '?'}</AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex min-w-0 flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden">
            <SidebarTrigger />
            <Logo />
          </header>
          <div className="flex-1 flex min-w-0 w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
