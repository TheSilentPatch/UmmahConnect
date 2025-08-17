
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { AnimatedButton } from '@/components/ui/animated-button';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export default function ForgotPasswordPage() {
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await sendPasswordResetEmail(values.email);
    if (success) {
      toast({
        title: 'Password Reset Email Sent',
        description: 'Please check your email for instructions to reset your password.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not send password reset email. Please try again.',
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 10 }}
          >
            <Logo className="mb-4" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CardDescription>Enter your email to reset your password</CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <AnimatedButton 
                  type="submit" 
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Sending..." : "Send Reset Email"}
                </AnimatedButton>
              </motion.div>
            </form>
          </Form>
          <motion.div
            className="mt-4 text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Remember your password?{' '}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
