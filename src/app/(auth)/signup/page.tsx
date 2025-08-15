'use client';

import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse, isValid } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { COUNTRIES } from '@/lib/constants';
import { Logo } from '@/components/Logo';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  country: z.string({ required_error: 'Please select a country.' }),
  gender: z.enum(['Male', 'Female'], { required_error: 'Please select a gender.' }),
  dob: z.date({ required_error: 'Date of birth is required.' }).refine((date) => {
    const today = new Date();
    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return date <= thirteenYearsAgo;
  }, { message: 'You must be at least 13 years old.' }),
});

export default function SignupPage() {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [dobString, setDobString] = React.useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await signup({
        ...values,
        dob: values.dob.toISOString(),
    });

    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'An account with this email already exists or another error occurred.',
      });
    } else {
        toast({
            title: 'Signup Successful',
            description: 'Your account has been created.',
        });
    }
  }
  
  const dobValue = form.watch('dob');

  React.useEffect(() => {
    if (dobValue) {
      setDobString(format(dobValue, 'yyyy-MM-dd'));
    } else {
        setDobString('');
    }
  }, [dobValue]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="items-center text-center">
        <Logo className="mb-4" />
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>Join the community to connect and grow together</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select your country" /></SelectTrigger>
                    </FormControl>
                    <SelectContent><SelectContent>
                        {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent></SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date of birth</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            value={dobString}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setDobString(value);
                                                const date = parse(value, 'yyyy-MM-dd', new Date());
                                                if (isValid(date)) {
                                                    form.setValue('dob', date, { shouldValidate: true });
                                                } else {
                                                    form.setValue('dob', undefined as any, { shouldValidate: true });
                                                }
                                            }}
                                            placeholder="YYYY-MM-DD"
                                        />
                                        <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                                    </div>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                      if (date) {
                                        form.setValue('dob', date, { shouldValidate: true });
                                        setDobString(format(date, 'yyyy-MM-dd'));
                                      }
                                    }}
                                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex items-center space-x-4 pt-2">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Male" /></FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="Female" /></FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Sign In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
