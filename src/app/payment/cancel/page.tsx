'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Ban, ArrowLeft, RefreshCw } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

function CancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-[#181512] border border-[#2d2722] rounded-2xl text-center space-y-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-900 via-amber-600 to-amber-400" />

      <div className="w-16 h-16 rounded-full bg-[#1c1212] border border-[#dc2626]/40 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_20px_rgba(220,38,38,0.2)]">
        <Ban className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-red-400 font-heading">
          Transaction Cancelled
        </span>
        <h1 className="text-2xl font-extrabold font-heading text-white">
          Payment Cancelled
        </h1>
        <p className="text-xs text-[#a8a095] leading-relaxed">
          No charge was made to your card or account. You can resume payment at any time from your customer dashboard.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {bookingId && (
          <Link href={`/dashboard/customer/bookings/${bookingId}/pay`}>
            <NeonButton variant="primary" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
              Try Payment Again
            </NeonButton>
          </Link>
        )}
        <Link href="/dashboard/customer">
          <NeonButton variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </NeonButton>
        </Link>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto py-16 text-center text-[#a8a095]">
          Loading page...
        </div>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
