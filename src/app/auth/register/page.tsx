'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User as UserIcon, Wrench, Mail, Lock, Phone, UserCheck, AlertCircle } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import Logo from '@/components/layout/Logo';
import { useAuth } from '@/lib/auth-context';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
  role: z.enum(['CUSTOMER', 'TECHNICIAN']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { refetch } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/register', {
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

        const msg = result.message || 'Registration failed';
        setServerError(msg);

        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('already registered')) {
          setError('email', { type: 'server', message: 'This email is already registered.' });
        }

        toast.error(msg);
        return;
      }

      toast.success('Account created successfully! Please sign in to access your dashboard.');
      router.push(`/auth/login?registered=true&email=${encodeURIComponent(data.email)}`);
    } catch {
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Logo size="lg" className="justify-center mb-2" />
          <h1 className="text-2xl font-bold font-heading text-white">Create an Account</h1>
          <p className="text-sm text-[#a8a095]">
            Join FixItNow to book trusted pros or offer home repair services.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#181512] border border-[#2d2722] p-6 sm:p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24]" />

          {serverError && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#d4ceb8] font-heading">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-center
                  ${errors.role ? 'border-red-500/50' : ''}
                  ${selectedRole === 'CUSTOMER' ? 'bg-[#221e1a] border-[#f59e0b] text-[#fbbf24] shadow-[0_0_12px_rgba(245,158,11,0.2)]' : 'bg-[#12100e] border-[#2d2722] text-[#a8a095] hover:border-[#423b34]'}
                `}>
                  <input
                    type="radio"
                    value="CUSTOMER"
                    {...register('role')}
                    className="sr-only"
                  />
                  <UserCheck className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold font-heading">Book Services</span>
                  <span className="text-[10px] opacity-75">As Customer</span>
                </label>

                <label className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-center
                  ${selectedRole === 'TECHNICIAN' ? 'bg-[#152220] border-[#14b8a6] text-[#5eead4] shadow-[0_0_12px_rgba(20,184,166,0.2)]' : 'bg-[#12100e] border-[#2d2722] text-[#a8a095] hover:border-[#423b34]'}
                `}>
                  <input
                    type="radio"
                    value="TECHNICIAN"
                    {...register('role')}
                    className="sr-only"
                  />
                  <Wrench className="w-5 h-5 mb-1" />
                  <span className="text-xs font-bold font-heading">Provide Services</span>
                  <span className="text-[10px] opacity-75">As Technician</span>
                </label>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#d4ceb8]">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a095]" />
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12100e] border text-sm text-white placeholder-[#6b6359] focus:outline-none transition-colors
                    ${errors.name ? 'border-red-500 focus:border-red-400' : 'border-[#2d2722] focus:border-[#f59e0b]'}
                  `}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 pt-0.5">{errors.name.message}</p>}
            </div>

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

            {/* Phone (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#d4ceb8]">
                Phone Number <span className="text-[#a8a095] text-[10px]">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a095]" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#12100e] border text-sm text-white placeholder-[#6b6359] focus:outline-none transition-colors
                    ${errors.phone ? 'border-red-500 focus:border-red-400' : 'border-[#2d2722] focus:border-[#f59e0b]'}
                  `}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-400 pt-0.5">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#d4ceb8]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a095]" />
                <input
                  type="password"
                  placeholder="Min. 8 characters (letters & numbers)"
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
              className="w-full mt-2"
            >
              Create Account
            </NeonButton>
          </form>

          <div className="text-center pt-2 border-t border-[#2d2722]">
            <p className="text-xs text-[#a8a095]">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#fbbf24] hover:underline font-semibold font-heading">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
