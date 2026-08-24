'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useBooking } from '@/hooks/useBookings';

function SuccessContent() {
  const searchParams = useSearchParams();
  const redirectStatus = searchParams.get('redirect_status');
  const bookingId = searchParams.get('bookingId') || '';

  const [timedOut, setTimedOut] = useState(false);

  // Poll booking status every 2 seconds until status flips to PAID
  const { data: booking } = useBooking(bookingId, { refetchInterval: 2000 });

  const isPaid = booking?.status === 'PAID';

  // 20-second timeout timer
  useEffect(() => {
    if (isPaid) return;

    const timer = setTimeout(() => {
      setTimedOut(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [isPaid]);

  // Failure State
  if (redirectStatus && redirectStatus !== 'succeeded') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#181512] border border-red-900/40 rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold font-heading text-white">
            Payment Didn&apos;t Go Through
          </h1>
          <p className="text-xs text-[#a8a095] leading-relaxed">
            Your card was not charged. Please check your payment details or try another payment method.
          </p>
        </div>
        {bookingId ? (
          <Link href={`/dashboard/customer/bookings/${bookingId}/pay`}>
            <NeonButton variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Try Payment Again
            </NeonButton>
          </Link>
        ) : (
          <Link href="/dashboard/customer">
            <NeonButton variant="secondary" size="md">
              Return to Dashboard
            </NeonButton>
          </Link>
        )}
      </div>
    );
  }

  // Succeeded State — Confirmed PAID
  if (isPaid) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#181512] border border-[#14b8a6]/40 rounded-2xl text-center space-y-6 shadow-[0_0_40px_rgba(20,184,166,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0f766e] via-[#14b8a6] to-[#5eead4]" />

        <div className="w-16 h-16 rounded-full bg-[#0f1716] border border-[#14b8a6]/50 flex items-center justify-center text-[#5eead4] mx-auto shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5eead4] font-heading">
            Payment Confirmed
          </span>
          <h1 className="text-2xl font-extrabold font-heading text-white">
            Booking Paid & Active!
          </h1>
          <p className="text-xs text-[#a8a095] leading-relaxed">
            Your payment was processed successfully via Stripe. Your technician has been notified to start your service.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard/customer">
            <NeonButton variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              View My Bookings
            </NeonButton>
          </Link>
        </div>

        <p className="text-[11px] text-[#6b6359] flex items-center justify-center gap-1 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#14b8a6]" /> Receipt emailed to your registered address.
        </p>
      </div>
    );
  }

  // Succeeded State — Timed out polling soft message
  if (timedOut) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#181512] border border-[#2d2722] rounded-2xl text-center space-y-6 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-[#221e1a] border border-[#f59e0b]/30 flex items-center justify-center text-[#fbbf24] mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold font-heading text-white">
            Payment Received
          </h1>
          <p className="text-xs text-[#a8a095] leading-relaxed">
            Your payment was authorized. It can take up to a minute for the confirmation webhook to process. Please check your dashboard shortly.
          </p>
        </div>

        <Link href="/dashboard/customer">
          <NeonButton variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Go to Dashboard
          </NeonButton>
        </Link>
      </div>
    );
  }

  // Succeeded State — Polling in progress
  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-[#181512] border border-[#2d2722] rounded-2xl text-center space-y-6 shadow-2xl">
      <Loader2 className="w-12 h-12 text-[#f59e0b] animate-spin mx-auto" />
      <div className="space-y-2">
        <h1 className="text-xl font-bold font-heading text-white">
          Confirming Payment...
        </h1>
        <p className="text-xs text-[#a8a095] leading-relaxed">
          Payment received! Synchronizing status with your technician...
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-16 text-center text-[#a8a095]">
          Loading payment status...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
