'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, ShieldCheck, AlertTriangle, Calendar, Wrench, UserCheck } from 'lucide-react';
import StatusBadge from '@/components/booking/StatusBadge';
import NeonButton from '@/components/ui/NeonButton';
import { useBooking } from '@/hooks/useBookings';
import { formatCurrency } from '@/lib/format';

export default function StubPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: booking, isLoading, error } = useBooking(id);

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-[#221e1a] rounded" />
        <div className="h-64 bg-[#181512] rounded-2xl border border-[#2d2722]" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-white">Booking Not Found</h2>
        <p className="text-xs text-[#a8a095]">
          {error instanceof Error ? error.message : 'Unable to load payment details.'}
        </p>
        <Link href="/dashboard/customer">
          <NeonButton variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            Return to Dashboard
          </NeonButton>
        </Link>
      </div>
    );
  }

  const techName =
    booking.technician?.user?.name ||
    booking.technician?.name ||
    booking.technicianProfile?.user?.name ||
    'Assigned Technician';

  const formattedDate = new Date(booking.scheduledDate).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Back Link */}
      <Link
        href="/dashboard/customer"
        className="inline-flex items-center gap-1.5 text-xs text-[#a8a095] hover:text-[#fbbf24] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Payment Card */}
      <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7e22ce] via-[#c084fc] to-[#5eead4]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d2722] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c084fc] font-heading flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Secure Checkout
            </span>
            <h1 className="text-xl font-bold font-heading text-white">Service Payment</h1>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Booking Summary */}
        <div className="bg-[#12100e] border border-[#2d2722] p-4 rounded-xl space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#a8a095] flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#f59e0b]" /> Service:
            </span>
            <span className="font-bold text-white font-heading">
              {booking.service?.title || 'Home Repair Service'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#a8a095] flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#14b8a6]" /> Technician:
            </span>
            <span className="font-semibold text-[#f5f2eb]">{techName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#a8a095] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#38bdf8]" /> Scheduled Date:
            </span>
            <span className="text-[#d4ceb8]">{formattedDate}</span>
          </div>

          <div className="pt-2 border-t border-[#2d2722] flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[#a8a095] font-heading">
              Total Amount Due:
            </span>
            <span className="text-xl font-extrabold font-heading text-[#5eead4]">
              {formatCurrency(booking.priceAtBooking)}
            </span>
          </div>
        </div>

        {/* Placeholder CTA */}
        <div className="space-y-3 text-center">
          <button
            disabled
            className="w-full py-3.5 rounded-xl bg-[#221e1a] border border-[#2d2722] text-[#6b6359] font-bold font-heading text-sm cursor-not-allowed flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Payment integration coming soon
          </button>

          <p className="text-[11px] text-[#a8a095] flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5eead4]" /> Stripe payment processing will be enabled in the next prompt.
          </p>
        </div>
      </div>
    </div>
  );
}
