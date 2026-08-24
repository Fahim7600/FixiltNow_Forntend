'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, AlertCircle, LogIn, CheckCircle2 } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import Logo from '@/components/layout/Logo';
import { useAuth } from '@/lib/auth-context';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const registeredParam = searchParams.get('registered');
  const emailParam = searchParams.get('email');
  const { refetch } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: emailParam || '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (emailParam) {
      setValue('email', emailParam);
    }
  }, [emailParam, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (res.status === 429) {
          toast.error('Too many attempts — please wait a moment and try again.');
          return;
        }

        const msg = result.message || 'Invalid email or password';
        setServerError(msg);
        toast.error(msg);
        return;
      }

      toast.success('Welcome back!');
      await refetch();

      const userRole = result.user?.role;

      if (redirectParam && redirectParam.startsWith('/')) {
        router.push(redirectParam);
      } else if (userRole === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (userRole === 'TECHNICIAN') {
        router.push('/dashboard/technician');
      } else {
        router.push('/dashboard/customer');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-[#181512] border border-[#2d2722] p-6 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24]" />

      {registeredParam && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-teal-950/50 border border-teal-800/60 text-[#5eead4] text-sm">
          <CheckCircle2 className="w-4 h-4 text-[#14b8a6] shrink-0 mt-0.5" />
          <span>Account created successfully! Enter your password below to sign in.</span>
        </div>
      )}

      {serverError && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#d4ceb8]">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a095]" />
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email')}
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12100e] border text-sm text-white placeholder-[#6b6359] focus:outline-none transition-colors
                ${errors.email ? 'border-red-500 focus:border-red-400' : 'border-[#2d2722] focus:border-[#f59e0b]'}
              `}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 pt-0.5">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#d4ceb8]">Password</label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a095]" />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`
                w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12100e] border text-sm text-white placeholder-[#6b6359] focus:outline-none transition-colors
                ${errors.password ? 'border-red-500 focus:border-red-400' : 'border-[#2d2722] focus:border-[#f59e0b]'}
              `}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 pt-0.5">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <NeonButton
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          icon={<LogIn className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Sign In
        </NeonButton>
      </form>

      <div className="text-center pt-2 border-t border-[#2d2722]">
        <p className="text-xs text-[#a8a095]">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-[#fbbf24] hover:underline font-semibold font-heading">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center mb-2" />
          <h1 className="text-2xl font-bold font-heading text-white">Welcome Back</h1>
          <p className="text-sm text-[#a8a095]">
            Sign in to access your FixItNow account.
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl text-center text-[#a8a095]">
            Loading login form...
          </div>
        }>
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
