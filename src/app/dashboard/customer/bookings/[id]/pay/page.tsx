'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Elements } from '@stripe/react-stripe-js';
import { Appearance } from '@stripe/stripe-js';
import {
  ArrowLeft,
  CreditCard,
  AlertTriangle,
  Calendar,
  Wrench,
  UserCheck,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react';
import StatusBadge from '@/components/booking/StatusBadge';
import CheckoutForm from '@/components/payment/CheckoutForm';
import NeonButton from '@/components/ui/NeonButton';
import { useBooking } from '@/hooks/useBookings';
import { getStripe } from '@/lib/stripe-client';
import { formatCurrency } from '@/lib/format';

const stripePromise = getStripe();

const stripeAppearance: Appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#f59e0b',
    colorBackground: '#12100e',
    colorText: '#f5f2eb',
    colorDanger: '#ef4444',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
  },
};

export default function RealPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: booking, isLoading: loadingBooking, error: bookingError } = useBooking(id);

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [secretError, setSecretError] = useState<string | null>(null);

  // Fetch PaymentIntent clientSecret when booking is ACCEPTED
  useEffect(() => {
    if (booking && booking.status === 'ACCEPTED' && !clientSecret && !loadingSecret) {
      setLoadingSecret(true);
      setSecretError(null);

      fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: id }),
      })
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed to initialize payment');
          }
          setClientSecret(json.data.clientSecret);
        })
        .catch((err) => {
          setSecretError(err.message || 'Unable to create payment intent');
        })
        .finally(() => {
          setLoadingSecret(false);
        });
    }
  }, [booking, id, clientSecret, loadingSecret]);

  if (loadingBooking) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-[#221e1a] rounded" />
        <div className="h-64 bg-[#181512] rounded-2xl border border-[#2d2722]" />
      </div>
    );
  }

  if (bookingError || !booking) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold font-heading text-white">Booking Not Found</h2>
        <p className="text-xs text-[#a8a095]">
          {bookingError instanceof Error ? bookingError.message : 'Unable to load booking details.'}
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

  // Guard Check 1: Booking Not Ready for Payment yet (REQUESTED)
  if (booking.status === 'REQUESTED') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#221e1a] border border-[#f59e0b]/40 flex items-center justify-center text-[#fbbf24] mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-white">
              This booking isn&apos;t ready for payment yet
            </h2>
            <p className="text-xs text-[#a8a095] max-w-md mx-auto">
              Your technician has not accepted this request yet. Once accepted, you can proceed with secure payment.
            </p>
          </div>
          <Link href="/dashboard/customer">
            <NeonButton variant="primary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </NeonButton>
          </Link>
        </div>
      </div>
    );
  }

  // Guard Check 2: Already Paid or In Progress / Completed
  if (['PAID', 'IN_PROGRESS', 'COMPLETED'].includes(booking.status)) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#0f1716] border border-[#14b8a6]/40 flex items-center justify-center text-[#5eead4] mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-white">
              This booking has already been paid
            </h2>
            <p className="text-xs text-[#a8a095] max-w-md mx-auto">
              Your payment was received and confirmed. You can track service progress on your dashboard.
            </p>
          </div>
          <Link href="/dashboard/customer">
            <NeonButton variant="primary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </NeonButton>
          </Link>
        </div>
      </div>
    );
  }

  // Guard Check 3: Declined or Cancelled
  if (['DECLINED', 'CANCELLED'].includes(booking.status)) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="bg-[#181512] border border-[#2d2722] p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#1c1212] border border-[#dc2626]/40 flex items-center justify-center text-red-400 mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-heading text-white">
              Booking {booking.status.toLowerCase()}
            </h2>
            <p className="text-xs text-[#a8a095] max-w-md mx-auto">
              This service booking is no longer active for checkout.
            </p>
          </div>
          <Link href="/dashboard/customer">
            <NeonButton variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </NeonButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/customer"
          className="inline-flex items-center gap-1.5 text-xs text-[#a8a095] hover:text-[#fbbf24] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Link
          href={`/payment/cancel?bookingId=${id}`}
          className="text-xs text-[#a8a095] hover:text-red-400 transition-colors"
        >
          Cancel and go back
        </Link>
      </div>

      {/* Main Payment Card */}
      <div className="bg-[#181512] border border-[#2d2722] rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#fbbf24]" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d2722] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#fbbf24] font-heading flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-[#f59e0b]" /> Stripe Checkout
            </span>
            <h1 className="text-xl font-bold font-heading text-white">Complete Your Payment</h1>
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

        {/* Payment Form Container */}
        {loadingSecret ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#f59e0b] animate-spin mx-auto" />
            <p className="text-xs text-[#a8a095]">Initializing secure Stripe PaymentElement...</p>
          </div>
        ) : secretError ? (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs text-center space-y-2">
            <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
            <p>{secretError}</p>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
            <CheckoutForm bookingId={id} />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
