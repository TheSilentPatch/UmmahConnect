'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { COUNTRIES } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  country: z.string({ required_error: 'Please select a country.' }),
});

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      country: user?.country || ''
    },
    resetOptions: {
        keepDirtyValues: true,
    }
  });

  if (loading) {
    return (
        <div className="flex h-full flex-col items-center justify-center bg-background p-4 sm:p-8">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <Skeleton className="h-24 w-full" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!user) return null;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateUser(values);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been successfully saved.',
    });
  }
  
  const getInitials = (email: string) => email ? email.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.email}`} alt={user.email || ''} />
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-2xl">Profile Settings</CardTitle>
              <CardDescription>Manage your account information.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2 rounded-md border p-4">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                <div className="space-y-2 rounded-md border p-4">
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-muted-foreground">{user.gender}</p>
                </div>
                <div className="space-y-2 rounded-md border p-4">
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-muted-foreground">{new Date(user.dob).toLocaleDateString()}</p>
                </div>

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
