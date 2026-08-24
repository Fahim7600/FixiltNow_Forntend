'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { CreditCard, AlertCircle, ShieldCheck } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

export interface CheckoutFormProps {
  bookingId: string;
}

export default function CheckoutForm({ bookingId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const returnUrl = `${window.location.origin}/payment/success?bookingId=${bookingId}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    // If stripe.confirmPayment returns an error, an immediate error occurred
    if (error) {
      const msg = error.message || 'An unexpected payment error occurred.';
      setErrorMessage(msg);
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element Container */}
      <div className="bg-[#12100e] border border-[#2d2722] p-4 sm:p-5 rounded-2xl">
        <PaymentElement />
      </div>

      {/* Inline Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/50 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Action */}
      <div className="space-y-3 pt-2">
        <NeonButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={!stripe || !elements || isProcessing}
          loading={isProcessing}
          icon={<CreditCard className="w-5 h-5" />}
          className="w-full justify-center"
        >
          {isProcessing ? 'Processing Payment...' : 'Confirm & Pay Now'}
        </NeonButton>

        <p className="text-[11px] text-[#a8a095] text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5eead4]" /> Encrypted 256-bit SSL Payment Processing
        </p>
      </div>
    </form>
  );
}
